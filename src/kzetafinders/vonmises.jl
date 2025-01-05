"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,1 for the von Mises anistropic scattering model.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,1 is originally
given by the equation 37 of Psaltis et al. 2018, but this is different in the implementation of
Johnson et al. 2018 in eht-imaging library. We follow eht-imaging's implementation.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct vonMises_KzetaFinder{T<:Number} <: AbstractKzetaFinder
    A::T
end

# Originally Equation 37 of Psaltis et al. 2018, but apparely different equation is used in eht-imaging library.
# We here use the version used in eht-imaging library.
@inline function kzetafinder_equation(kzeta, finder::vonMises_KzetaFinder)
    return besseli.(0, kzeta) ./ besseli.(1, kzeta) .- finder.A^2
end

@inline initialize(::vonMises_KzetaFinder) = 0.538
