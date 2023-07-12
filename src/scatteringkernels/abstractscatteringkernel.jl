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
    phase_structure_point(ps::AbstractScatteringKernel, x::Number, y::Number)

Maps phase structure function D_ϕ(r, ϕ), first converting x, y into polar coordinates
Equation 35 of Psaltis et al. 2018
"""
function phase_structure_point(ps::AbstractScatteringKernel, λ::Number, x::Number, y::Number)
    ϕ0 = 0 
    r = √(x^2. + y^2.)
    ϕ = atan(y,x)
    dmaj = calc_dmaj(ps, λ, r)
    dmin = calc_dmin(ps, λ, r)
    add = (dmaj + dmin)/2.
    sub = (dmaj - dmin)/2.
    return add + sub * cos(2. *(ϕ-ϕ0))
end


"""
    visibility_point(ps::AbstractScatteringKernel, λ::Number, u::Number, v::Number) 

Maps visibility kernel for a given observing wavelength λ and fourier space coordinates u, v
"""
function visibility_point(ps::AbstractScatteringKernel, λ::Number, u::Number, v::Number)
    b = (u*λ, v*λ)./(1+ps.M)
    return exp(-.5 * phase_structure_point(ps, λ, b...))
end