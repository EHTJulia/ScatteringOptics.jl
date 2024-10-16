export AbstractScatteringModel
#export calc_Dmaj
#export calc_Dmin
#export Dϕ_approx
#export Pϕ
#export dDϕ_dz
#export Dϕ_exact
export visibility_point_approx
export visibility_point_exact
export ensembleaverage


"""
    $(TYPEDEF)

An abstract anistropic scattering model based on a thin-screen approximation.
In this package, we provide a reference implementation of
the dipole (`DipoleScatteringModel`), von Mises (`vonMisesScatteringModel`) and
periodic Box Car models (`PeriodicBoxCarScatteringModel`) all introduced in Psaltis et al. 2018.

**Mandatory fields**
The scattering model will be fundamentally governed by the following parameters.
Ideally, a subtype of this abstract model should have a constructor only with these arguments.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
- `rin::Number`: The inner scale of the scattering screen in cm.
- `θmaj::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
- `θmin::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
- `ϕ::Number`: The position angle of the major axis of the scattering in degree.
- `λ0::Number`: The reference wavelength for the scattering model in cm.
- `D::Number`: The distance from the observer to the scattering screen in cm.
- `R::Number`: The distance from the source to the scattering screen in cm.

Furthermore the following parameters need to be precomputed.
- `M::Number`: Magnification parameter, defined as D/R
- `Qbar::Number`: The amplitudes of fluctuations. Given by `calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad)`
- `C::Number`: The scaling factor of the power spectrum. Given by `calc_C(α, rin_cm, λ0_cm, Qbar)`
- `D1maj::Number`: given by `calc_D1(α, Amaj, Bmaj)`
- `D2maj::Number`: given by `calc_D2(α, Amaj, Bmaj)`
- `D1min::Number`: given by `calc_D1(α, Amin, Bmin)`
- `D2min::Number`: given by `calc_D2(α, Amin, Bmin)`

**Optional Fields**
Followings are currently not used by methods but may be useful to have. 
- `A::Number`: Asymmetry parameter θmaj_mas/θmin_mas
- `ζ0::Number`: Another asymmetry parameter. Given by calc_ζ0(A)
- `ϕ0`:: position angle (measured from Dec axis in CCW) converted to a more traditional angle in radians measured from RA axis in CW
- `Amaj::Number`: related to the asymmetric scaling of the kernel. given by `calc_Amaj(rin_cm, λ0_cm, M, θmaj_rad)`
- `Amin::Number`: related to the asymmetric scaling of the kernel. given by `calc_Amin(rin_cm, λ0_cm, M, θmin_rad)`
- `Bmaj::Number`: calc_Bmaj(α, ϕ0, Pϕfunc, B_prefac)
- `Bmin::Number`: calc_Bmin(α, ϕ0, Pϕfunc, B_prefac)

**Mandatory Method**
- `Pϕ(sm::ScatteringModel, ϕ)`: Probability Distribution for the wondering of the direction of the magnetic field centered at orientation ϕ0.
"""
abstract type AbstractScatteringModel end

"""
    Pϕ(::AbstractScatteringModel, ϕ::Number)
    
Normalized probability distribution describing the distribution of the field wander.
The function should depend on the field wander model.
"""
#function Pϕ(::AbstractScatteringModel, ϕ::Number) end

"""
    Dmaj(r, sm::AbstractScatteringModel)

Masm D_maj(r) for given r. Based on Equation 33 of Psaltis et al. 2018
"""
@inline function calc_Dmaj(sm::AbstractScatteringModel, λ::Number, r::Number)
    d1 = sm.D1maj
    d2 = sm.D2maj
    α = sm.α
    rin = sm.rin
    λ0 = sm.λ0
    return d1 * ((1 + d2 * (r / rin)^2)^(α / 2) - 1) * (λ / λ0)^2
end


"""
    calc_Dmin(r, sm::AbstractScatteringModel)

Masm D_min(r) for given r. Based on Equation 34 of Psaltis et al. 2018
"""
@inline function calc_Dmin(sm::AbstractScatteringModel, λ::Number, r::Number)
    d1 = sm.D1min
    d2 = sm.D2min 
    α = sm.α
    rin = sm.rin
    λ0 = sm.λ0
    return d1 * ((1 + d2 * (r / rin)^2)^(α / 2) - 1) * (λ / λ0)^2
end


"""
    Dϕ_approx(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)

Masm approximate phase structure function Dϕ(r, ϕ) at observing wavelength λ, first converting
x and y into polar coordinates. Based on Equation 35 of Psaltis et al. 2018.
"""
@inline function Dϕ_approx(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)
    r = √(x^2 + y^2)
    ϕ = atan(y, x)
    Dmaj = calc_Dmaj(sm, λ, r)
    Dmin = calc_Dmin(sm, λ, r)
    add = (Dmaj + Dmin) / 2
    sub = (Dmaj - Dmin) / 2
    return add + sub * cos(2 * (ϕ - sm.ϕ0))
end

"""
    dDϕ_dz(sm::AbstractScatteringModel, λ::Number, r::Number, ϕ::Number, ϕq)

Differential contribution to the phase structure function.
"""
@inline function dDϕ_dz(sm::AbstractScatteringModel, λ::Number, r::Number, ϕ::Number, ϕq)

    return 4 * (λ / sm.λ0)^2 * sm.C / sm.α * (_₁F₁(-sm.α / 2, 0.5, -r^2 / (4 * sm.rin^2) * cos(ϕ - ϕq)^2) - 1)
end


"""
    Dϕ_exact(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)

Masm exact phase structure function Dϕ(r, ϕ) at observing wavelength `λ`, first converting
`x` and `y` into the polar coordinates
"""
@inline function Dϕ_exact(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)
    r = √(x^2 + y^2)
    ϕ = atan(y, x)
    return quadgk(ϕq -> dDϕ_dz(sm, λ, r, ϕ, ϕq) * Pϕ(sm, ϕq), 0, 2π)[1]
end


"""
    visibility_point_approx(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)

Compute the diffractive kernel for a given observing wavelength `λ` and fourier space coordinates `u`, `v`
using the approximated formula of the phase structure function.
"""
@inline function visibility_point_approx(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)
    b = (u, v) .* (λ / (1 + sm.M))
    return exp(-0.5 * Dϕ_approx(sm, λ, b...))
end


"""
    visibility_point_exact(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)

Compute the diffractive kernel for a given observing wavelength λ and fourier space coordinates `u`, `v`
using the exact formula of the phase structure function.
"""
@inline function visibility_point_exact(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)
    b = (u, v) .* (λ / (1 + sm.M))
    return exp(-0.5 * Dϕ_exact(sm, λ, b...))
end

"""
    ensembleaverage(sm::AbstractScatteringModel, skymodel::AbstractModel, νmodel)
"""
@inline function ensembleaverage(sm::AbstractScatteringModel, skymodel::AbstractModel, νmodel=c_cgs)
    return convolved(skymodel, kernelmodel(sm, νref=νmodel))
end

"""
    ensembleaverage(sm::AbstractScatteringModel, imap::IntensityMap; νref=c_cgs)
"""
@inline function ensembleaverage(sm::AbstractScatteringModel, imap::IntensityMap; νref=c_cgs)
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
    
    # compute the ensemble-average image
    return convolve(imap, kernelmodel(sm, νref=ν_imap))
end