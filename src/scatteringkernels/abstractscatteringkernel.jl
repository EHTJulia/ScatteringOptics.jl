export AbstractScatteringKernel
export calc_dmaj
export calc_dmin
export phase_structure_point
export visibility_point

"""
    AbstractScatteringKernel

This is an abstract data type for a scattering screen phase structure function.

**Mandatory fields**
- `α::Number`: spectrum index
- `inscale::Number` inner scale r_in
- `θmaj::Number` reference major axis size
- `θmin::Number` reference minor axis size
- `ϕpt::Number`: position angle of major axis
- `λ0::Number`: reference wavelength
- `M::Number`: magnification D/R
"""

abstract type AbstractScatteringKernel end

"""
    dmaj(r, ps::AbstractScatteringKernel)

Maps D_maj(r) for given r
Equation 33 of Psaltis et al. 2018
"""
@inline function calc_dmaj(ps::AbstractScatteringKernel, λ::Number, r::Number)
    Bmaj = ps.Bmaj
    C = ps.C
    α = ps.α
    ζ = ps.ζ
    rin = ps.inscale

    d1 = C*(1. +ζ)/2. * Bmaj*(2. /(α*Bmaj))^(-α/(2. -α))
    d2 = (2. /(α*Bmaj))^(2. /(2. -α))
    return d1*((1+d2*(r/rin)^2.)^(α/2.)-1) * (λ/ps.λ0)^2.
end

"""
    dmin(r, ps::AbstractScatteringKernel)

Maps D_min(r) for given r
Equation 34 of Psaltis et al. 2018
"""
@inline function calc_dmin(ps::AbstractScatteringKernel, λ::Number, r::Number)
    Bmin = ps.Bmin
    C = ps.C
    α = ps.α
    ζ = ps.ζ
    rin = ps.inscale

    d1 = C*(1. -ζ)/2. * Bmin*(2. /(α*Bmin))^(-α/(2. -α))
    d2 = (2. /(α*Bmin))^(2. /(2. -α))
    return d1*((1+d2*(r/rin)^2.)^(α/2.)-1) * (λ/ps.λ0)^2.
end

"""
    Dϕ_approx(ps::AbstractScatteringKernel, λ::Number, x::Number, y::Number)

Maps approximate phase structure function D_ϕ(r, ϕ) at observing wavelength λ, first converting 
x and y into polar coordinates
Equation 35 of Psaltis et al. 2018
"""
function Dϕ_approx(ps::AbstractScatteringKernel, λ::Number, x::Number, y::Number)
    ϕ0 = deg2rad(90 - ps.ϕpt)
    r = √(x^2. + y^2.)
    ϕ = atan(y,x)
    dmaj = calc_dmaj(ps, λ, r)
    dmin = calc_dmin(ps, λ, r)
    add = (dmaj + dmin)/2.
    sub = (dmaj - dmin)/2.
    return add + sub * cos(2. *(ϕ-ϕ0))
end

P_ϕ(ps::AbstractScatteringKernel, ϕ) = ps.P_ϕ0*(1. +ps.k*sin(ϕ-deg2rad(90-ps.ϕpt))^2.)^(-(ps.α+2.)/2.)

function dDϕ_dz(ps::AbstractScatteringKernel, λ::Number, r::Number, ϕ::Number, ϕ_q)
"""differential contribution to the phase structure function
"""
    return 4.0 * (λ/ps.λ0)^2. * ps.C/ps.α * (_₁F₁(-ps.α/2.0, 0.5, -r^2. /(4. *ps.inscale^2.)*cos(ϕ - ϕ_q)^2) - 1.)
end

"""
    Dϕ_exact(ps::AbstractScatteringKernel, λ::Number, x::Number, y::Number)

Maps exact phase structure function D_ϕ(r, ϕ)at observing wavelength λ, first converting 
x and y into polar coordinates
"""
function Dϕ_exact(ps::AbstractScatteringKernel, λ::Number, x::Number, y::Number)
    r = (x^2 + y^2)^0.5
    ϕ = atan(y, x)
    f(ϕ_q) = dDϕ_dz(ps, λ, r, ϕ, ϕ_q)*P_ϕ(ps, ϕ_q)
    return quadgk(f, 0, 2.0*π)[1]     
end

"""
    visibility_point(ps::AbstractScatteringKernel, λ::Number, u::Number, v::Number) 

Maps visibility kernel for a given observing wavelength λ and fourier space coordinates u, v
"""
function visibility_point(ps::AbstractScatteringKernel, λ::Number, u::Number, v::Number, use_approximate_form=true)
    b = (u, v).* (λ/(1+ps.M))
    if use_approximate_form == true
        return exp(-.5 * Dϕ_approx(ps, λ, b...))
    else
        return exp(-.5 * Dϕ_exact(ps, λ, b...))
    end
end