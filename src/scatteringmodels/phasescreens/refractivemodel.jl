export AbstractPhaseScreen
export RefractivePhaseScreen
export phase_screen
export wrapped_grad
export image_scatter

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

abstract type AbstractPhaseScreen end

struct RefractivePhaseScreen{S, T <: Number, N<:AbstractNoiseSignal, P <: AbstractPowerSpectrumModel} <: AbstractPhaseScreen
    sm::S
    dx::T 
    dy::T 
    signal::N  
    Q::P
    function RefractivePhaseScreen(sm::S, Nx::Number, Ny::Number, dx::T, dy::T, Vx_km_per_s=0.0::T, Vy_km_per_s=0.0::T) where {S, T}
        # radians to cm
        dx = dx*sm.D
        dy = dy*sm.D

        Q = PhaseScreenPowerLaw(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
        signal = NoiseSignal((Nx, Ny))
        return new{S, T, NoiseSignal, typeof(Q)}(sm, dx, dy, signal, Q)
    end
end

StationaryRandomFields.generate_gaussian_noise(psm::AbstractPhaseScreen; rng = Random.default_rng()) = generate_gaussian_noise(psm.signal; rng = rng)

"""
    phase_screen(psm::AbstractPhaseScreen, λ_cm, noise_screen=nothing)

Generates a refractive phase screen, `ϕ`, using StationaryRandomFields.jl the power law noise procedure. 
The fourier space 2D noise_screen (defaults to gaussian noise screen if not given) is scaled by the power law,
`Q`, defined in input AbstractPhaseScreen `psm`. The observing wavelength, `λ_cm`, must be given.
"""
@inline function phase_screen(psm::AbstractPhaseScreen, λ_cm::Number, noise_screen=nothing)
    # generate noise screen if not provided
    if isnothing(noise_screen)
        noise_screen = generate_gaussian_noise(psm)
    end
    # generate phase screen from power law and noise screen
    cns = ContinuousNoiseSignal(psm.signal)
    screengen = PSNoiseGenerator(psm.Q, cns)

    λ_bar = λ_cm/2pi
    nx, ny = size(psm.signal)
    FOVx = psm.dx * nx
    FOVy = psm.dy * ny

    return generate_signal_noise(screengen) .* λ_bar ./ sqrt(FOVx) ./ sqrt(FOVy)  .* nx .* ny
end

"""
    wrapped_grad(ϕ, dx, dy)

Returns the wrapped gradient of a given 2D phase screen. The x and y pixel sizes (`dx` and `dy`) must be given.
"""
@inline function wrapped_grad(ϕ, dx, dy)
    nx, ny = size(ϕ)
    gradϕ_x = Array{Float64}(undef, (nx, ny))
    gradϕ_y = Array{Float64}(undef, (nx, ny))
    for i=1:nx, j=1:ny
        i0 = i == 1 ? nx : i - 1
        j0 = j == 1 ? ny : j - 1
        i1 = i == nx ? 1 : i + 1
        j1 = j == ny ? 1 : j + 1
        
        @inbounds gradϕ_x[i, j] = 0.5 * (ϕ[i1, j] - ϕ[i0, j]) / dx
        @inbounds gradϕ_y[i, j] = 0.5 * (ϕ[i, j1] - ϕ[i, j0]) / dy
    end
    return (gradϕ_x, gradϕ_y)
end

"""
    get_rF(psm::AbstractPhaseScreen, λ_cm)

Returns Fresnel scale corresponding to the given AvstractPhaseScreen object and observing wavelength, `λ_cm`
"""
@inline function get_rF(psm::AbstractPhaseScreen, λ_cm::Number)
    D, R = (psm.sm.D, psm.sm.R) 
    return √(D*R/(D+R) * λ_cm/(2.0*π))
end

"""
    image_scatter(psm::RefractivePhaseScreen, imap, λ_cm::Number; νref::Number = c_cgs)

Implements full ISM scattering on an unscattered Comrade skymodel intensity map (`imap`). Diffrective blurring and 
refractive phase screen generation are specific to the scattering parameters defined in the AbstractPhaseScreen
model `psm`. The observing wavelength `λ_cm` is required.
"""
@inline function image_scatter(psm::AbstractPhaseScreen, imap, λ_cm::Number; νref::Number = c_cgs)

    ϕ = phase_screen(psm, λ_cm)

    gradϕ_x, gradϕ_y = wrapped_grad(ϕ, psm.dx, psm.dy) 
    
    sm = psm.sm
    rF = get_rF(psm, λ_cm)
    skm = kernelmodel(sm, νref=νref)
    # convolve to get the ensemble averaged image
    imap_ea = convolve(imap, skm)
    rxgrid, rygrid = (imap_ea.X, imap_ea.Y) .* sm.D

    interp_Iea = extrapolate(scale(interpolate(imap_ea.data.data, BSpline(Linear())), (rxgrid, rygrid)), 0.)
    interp_gradϕx = extrapolate(scale(interpolate(gradϕ_x, BSpline(Linear())), (rxgrid, rygrid)), Periodic())
    interp_gradϕy = extrapolate(scale(interpolate(gradϕ_y, BSpline(Linear())), (rxgrid, rygrid)), Periodic())

    imap_sc = copy(imap_ea)
    nx, ny = size(imap_sc)
    for ix=1:nx, iy=1:ny
        @inbounds rx = rxgrid[ix] 
        @inbounds ry = rygrid[iy] 

        rx_sft = rx .+ rF^2. * interp_gradϕx(rx, ry) 
        ry_sft = ry .+ rF^2. * interp_gradϕy(rx, ry) 

        @inbounds imap_sc[ix, iy] = interp_Iea(rx_sft, ry_sft)

    end 
    return(imap_sc)
end