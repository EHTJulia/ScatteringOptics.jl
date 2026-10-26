export AbstractPhaseScreen
export RefractivePhaseScreen
export refractivephasescreen
export phase_screen
export wrapped_grad
export refractive_remap
export refractive_remap_squared_error
export scatter_image
export generate_gaussian_noise

abstract type AbstractPhaseScreen end

"""
    RefractivePhaseScreen(sm, Nx, Ny, dx, dy, Vx_km_per_s=0.0, Vy_km_per_s=0.0)

An abstract type for generating a refractive phase screen model corresponding to an image and computing the scattered
average image.

- `sm <: AbstractScatteringModel`
- `Nx`: image size in x axis
- `Ny`: image size in y axis
- `dx`: pixel size in x direction (in radians)
- `dy`: pixel size in y direction (in radians)

`Vx_km_per_s` and `Vy_km_per_s` are optional for moving phase screen. 
"""
struct RefractivePhaseScreen{
        S, T <: Number, L <: AbstractStationaryRandomField, P <: AbstractPowerSpectrumModel, X,
    } <: AbstractPhaseScreen
    sm::S
    dx::T
    dy::T
    latent::L
    Q::P
    transform::X
    function RefractivePhaseScreen(
            sm::S, Nx::Number, Ny::Number, dx::T, dy::T, Vx_km_per_s::T = 0.0, Vy_km_per_s::T = 0.0
        ) where {S, T}
        # radians to cm
        dx = dx * sm.D
        dy = dy * sm.D

        Q = PhaseScreenPowerLaw(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
        latent = UnivariateGaussianRandomField(T, (Nx, Ny))
        grid = FieldGrid((Nx, Ny); spacing = (dx, dy))
        transform = prepare(
            TransformChain(SpectralScaling(Q), HartleyTransform()), latent; grid
        )
        return new{S, T, typeof(latent), typeof(Q), typeof(transform)}(
            sm, dx, dy, latent, Q, transform
        )
    end
end

"""
    refractivephasescreen(sm, im, Vx_km_per_s=0.0, Vy_km_per_s=0.0)

An abstract type for generating a refractive phase screen model corresponding to an image and computing the scattered
average image.

- `sm <: AbstractScatteringModel`
- `im <: IntensityMap`
- `Vx_km_per_s` and `Vy_km_per_s` are optional for moving phase screen, which is not yet implemented. 
"""
function refractivephasescreen(
        sm::S, imap::IntensityMap, Vx_km_per_s::T = 0.0, Vy_km_per_s::T = 0.0
    ) where {S, T}
    nx, ny = size(imap)[1:2]
    dx = imap.X[2] - imap.X[1]  # pixel size in radians
    dy = imap.Y[2] - imap.Y[1]

    U = typeof(imap[1])
    UeqT = U == T
    Vx_km = UeqT ? Vx_km_per_s : U(Vx_km_per_s)
    Vy_km = UeqT ? Vy_km_per_s : U(Vy_km_per_s)
    return RefractivePhaseScreen(sm, nx, ny, dx, dy, Vx_km, Vy_km)
end

function generate_gaussian_noise(
        psm::AbstractPhaseScreen; rng = Random.default_rng()
    )
    return rand(rng, psm.latent)
end

"""
    phase_screen(psm::AbstractPhaseScreen, λ_cm, noise_screen=nothing)

Generates a refractive phase screen, `ϕ`, using StationaryRandomFields.jl the power law noise procedure. 
The fourier space 2D noise_screen (defaults to gaussian noise screen if not given) is scaled by the power law,
`Q`, defined in input AbstractPhaseScreen `psm`. The observing wavelength, `λ_cm`, must be given.
"""
@inline function phase_screen(
        psm::AbstractPhaseScreen, λ_cm::Number; noise_screen = nothing, rng = Random.default_rng()
    )
    # generate noise screen if not provided
    if isnothing(noise_screen)
        noise_screen = generate_gaussian_noise(psm; rng = rng)
    end
    size(noise_screen) == size(psm.latent) ||
        throw(DimensionMismatch("The latent screen has the wrong shape."))

    λ_bar = λ_cm / 2pi
    nx, ny = size(psm.latent)
    FOVx = psm.dx * nx
    FOVy = psm.dy * ny

    # A transform prepared from the CPU latent field captures CPU coordinate
    # storage. Re-prepare it when the caller supplies a different array backend.
    # This preserves the cached CPU path while allowing an explicitly supplied
    # GPU latent screen to remain GPU resident.
    transform = if typeof(noise_screen) === typeof(psm.latent)
        psm.transform
    else
        grid = FieldGrid((nx, ny); spacing = (psm.dx, psm.dy))
        prepare(TransformChain(SpectralScaling(psm.Q), HartleyTransform()), noise_screen; grid)
    end

    return apply(transform, noise_screen) .* λ_bar ./ sqrt(FOVx) ./ sqrt(FOVy) .* nx .* ny
end

"""
    wrapped_grad(ϕ, dx, dy)

Returns the wrapped gradient of a given 2D phase screen. The x and y pixel sizes (`dx` and `dy`) must be given.
"""
@inline function wrapped_grad(ϕ, dx, dy)
    nx, ny = size(ϕ)
    return (
        map(CartesianIndices(ϕ)) do index
            i, j = Tuple(index)
            i0, i1 = i == 1 ? nx : i - 1, i == nx ? 1 : i + 1
            (ϕ[i1, j] - ϕ[i0, j]) / (2 * dx)
        end,
        map(CartesianIndices(ϕ)) do index
            i, j = Tuple(index)
            j0, j1 = j == 1 ? ny : j - 1, j == ny ? 1 : j + 1
            (ϕ[i, j1] - ϕ[i, j0]) / (2 * dy)
        end,
    )
end

@inline function _zero_boundary_bilinear(image, x, y)
    nx, ny = size(image)
    i0, j0 = floor(Int, x), floor(Int, y)
    tx, ty = x - i0, y - j0
    value(i, j) = 1 <= i <= nx && 1 <= j <= ny ? image[i, j] : zero(eltype(image))
    return (
        (1 - tx) * (1 - ty) * value(i0, j0) +
            tx * (1 - ty) * value(i0 + 1, j0) +
            (1 - tx) * ty * value(i0, j0 + 1) +
            tx * ty * value(i0 + 1, j0 + 1)
    )
end

"""
    refractive_remap(image, δx, δy, Δx, Δy)

Evaluate the Johnson--Narayan Eq. (9) pullback remapping of an
ensemble-average image on its original grid. `δx` and `δy` are physical
displacements; `Δx` and `Δy` are pixel spacings in the same units. Sampling
uses bilinear interpolation with zero extrapolation. A positive displacement
samples `image(r + δ)`.
"""
function refractive_remap(image, δx, δy, Δx, Δy)
    size(image) == size(δx) == size(δy) ||
        throw(DimensionMismatch("Image and displacement arrays must have equal sizes."))
    return map(CartesianIndices(image)) do index
        i, j = Tuple(index)
        _zero_boundary_bilinear(image, i + δx[index] / Δx, j + δy[index] / Δy)
    end
end

"""
    refractive_remap_squared_error(image, δx, δy, Δx, Δy, target)

Return the squared pixel residual of [`refractive_remap`](@ref) without
materializing the remapped image. This scalar form is useful for reverse-mode
automatic differentiation of a fixed-grid Eq. (9) imaging loss.
"""
function refractive_remap_squared_error(image, δx, δy, Δx, Δy, target)
    size(image) == size(δx) == size(δy) == size(target) ||
        throw(DimensionMismatch("Image, displacement, and target arrays must have equal sizes."))
    total = zero(promote_type(eltype(image), eltype(δx), eltype(δy), eltype(target)))
    for index in CartesianIndices(image)
        i, j = Tuple(index)
        residual = _zero_boundary_bilinear(image, i + δx[index] / Δx, j + δy[index] / Δy) - target[index]
        total += abs2(residual)
    end
    return total
end

"""
    get_rF(psm::AbstractPhaseScreen, λ_cm)

Returns Fresnel scale corresponding to the given AvstractPhaseScreen object and observing wavelength, `λ_cm`
"""
@inline function get_rF(psm::AbstractPhaseScreen, λ_cm::Number)
    D, R = (psm.sm.D, psm.sm.R)
    return √(D * R / (D + R) * λ_cm / (2.0 * π))
end

"""
    scatter_image(psm::AbstractPhaseScreen, imap::IntensityMap; νref::Number = c_cgs, noise_screen=nothing, rng = Random.default_rng(), use_approx::Bool=true)

# Arguments
- `psm::AbstractPhaseScreen`: An instance of the phase screen.
- `imap::IntensityMap`: An instance of the intensity map.

# Parameters
- `νref::Number=c_cgs`: The frequency in Hz to be used to simulate scattering effects. If the frequency of the image is not provided, this value is used.
- `noise_screen=nothing`: The noise screen to be used to generate the phase screen. If not provided, a gaussian noise screen is generated.
- `rng = Random.default_rng()`: The random number generator.
- `use_approx::Bool=true`: If true, the approximate analytic formula is used to compute the scattering kernel. Otherwise semi-analytic formula is used.
"""
@inline function scatter_image(
        psm::AbstractPhaseScreen,
        imap::IntensityMap;
        νref::Number = c_cgs,
        noise_screen = nothing,
        rng = Random.default_rng(),
        use_approx::Bool = true,
    )
    # generate noise screen if not provided
    if isnothing(noise_screen)
        noise_screen = generate_gaussian_noise(psm; rng = rng)
    end

    # check if imap has a frequncy or time dimension
    if ndims(imap) > 2
        throw("The funciton doesn't support multi-dimensional images")
    end

    # get the frequency and wavelength information
    meta_imap = metadata(imap)
    is_freq = hasproperty(meta_imap, :frequency)
    if (is_freq == false) & (νref == c_cgs)
        @warn "the input image doesn't have a frequency information. νref=c_cgs will be assumed."
    end
    ν_imap = is_freq ? meta_imap.frequency : νref
    λ_cm = ν2λcm(ν_imap)

    # compute the ensemble-average image
    sm = psm.sm
    skm = kernelmodel(sm; νref = ν_imap, use_approx = use_approx)
    imap_ea = convolve(imap, skm)

    # generate phase screen
    ϕ = phase_screen(psm, λ_cm; noise_screen = noise_screen)

    # derive the gradient of the phase screen
    gradϕ_x, gradϕ_y = wrapped_grad(ϕ, psm.dx, psm.dy)

    # get the frenels scale
    rF = get_rF(psm, λ_cm)

    # convolve to get the ensemble averaged image
    rxgrid, rygrid = (imap_ea.X, imap_ea.Y) .* sm.D

    # initialize the interpolators
    interp_Iea = extrapolate(
        scale(interpolate(imap_ea, BSpline(Linear())), (rxgrid, rygrid)), 0.0
    )
    interp_gradϕx = extrapolate(
        scale(interpolate(gradϕ_x, BSpline(Linear())), (rxgrid, rygrid)), Periodic()
    )
    interp_gradϕy = extrapolate(
        scale(interpolate(gradϕ_y, BSpline(Linear())), (rxgrid, rygrid)), Periodic()
    )

    # compute the ensemble average image
    imap_sc = copy(imap_ea)
    nx, ny = size(imap_sc)
    for ix in 1:nx, iy in 1:ny
        @inbounds rx = rxgrid[ix]
        @inbounds ry = rygrid[iy]
        rx_sft = rx .+ rF^2.0 * interp_gradϕx(rx, ry)
        ry_sft = ry .+ rF^2.0 * interp_gradϕy(rx, ry)
        @inbounds imap_sc[ix, iy] = interp_Iea(rx_sft, ry_sft)
    end
    return (imap_sc)
end

"""
    scatter_image(sm, imap::IntensityMap; νref::Number = c_cgs, Vx_km_per_s=0.0, Vy_km_per_s=0.0, rng = Random.default_rng(), use_approx::Bool=true)

Simulates the full interstellar scattering on an unscattered Comrade skymodel intensity map (`imap`).
The frequency of the image, if exists in its metadata, is used to simulate the scattering effects. Otherwise `νref` is used.

# Arguments
- `sm::AbstractScatteringModel`: An instance of the scattering model.
- `imap::IntensityMap`: An instance of the intensity map.

# Parameters
- `νref::Number=c_cgs`: The frequency in Hz to be used to simulate scattering effects. If the frequency of the image is not provided, this value is used.
- `Vx_km_per_s=0.0`: The velocity of the observer in the x direction in km/s. (just placeholder for future implementation)
- `Vy_km_per_s=0.0`: The velocity of the observer in the y direction in km/s. (just placeholder for future implementation)
- `rng = Random.default_rng()`: The random number generator.
- `use_approx::Bool=true`: If true, the approximate analytic formula is used to compute the scattering kernel. Otherwise semi-analytic formula is used.
"""
@inline function scatter_image(
        sm::AbstractScatteringModel,
        imap::IntensityMap;
        νref::Number = c_cgs,
        Vx_km_per_s = 0.0,
        Vy_km_per_s = 0.0,
        rng = Random.default_rng(),
        use_approx::Bool = true,
    )
    rps = refractivephasescreen(sm, imap, Vx_km_per_s, Vy_km_per_s)
    return scatter_image(rps, imap; νref = νref, rng = rng, use_approx = use_approx)
end
