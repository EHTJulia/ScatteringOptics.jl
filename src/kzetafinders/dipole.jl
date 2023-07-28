"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,2 for dipole anistropic scattering models.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,2 is
given by the equation 43 of Psaltis et al. 2018.

**Mandatory fields**
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct Dipole_KzetaFinder{T<:Number} <: AbstractKzetaFinder
    α::T
    A::T
end


# Equation 43 of Psaltis et al. 2018.
@inline function kzetafinder_equation(kzeta, finder::Dipole_KzetaFinder)
    α = finder.α
    A = finder.A
    ᾱ = (α + 2) / 2
    return _₂F₁.(ᾱ, 0.5, 2, .-kzeta) ./ _₂F₁.(ᾱ, 1.5, 2, .-kzeta) .- A^2
end

@inline initialize(::Dipole_KzetaFinder) = 3.89