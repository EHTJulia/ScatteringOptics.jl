"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,1 for the von Mises anistropic scattering model.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,1 is originally
given by the equation 37 of Psaltis et al. 2018, but this is different in the implementation of
Johnson et al. 2018 in eht-imaging library. We follow eht-imaging's implementation.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct vonMises_KzetaFinder{T <: Number} <: AbstractKzetaFinder
    A::T
end

@inline function _vonmises_series(kζ, nterms)
    i0 = one(kζ)
    i1 = kζ / 2
    i2 = kζ^2 / 8
    term0 = i0
    term1 = i1
    term2 = i2
    for m in 1:nterms
        term0 *= kζ^2 / (4m^2)
        term1 *= kζ^2 / (4m * (m + 1))
        term2 *= kζ^2 / (4m * (m + 2))
        i0 += term0
        i1 += term1
        i2 += term2
    end
    return i0, i1, i2
end

function findkzeta_differentiable(finder::vonMises_KzetaFinder; nterms = 8, niter = 4)
    A = finder.A
    kζ = initialize(finder)
    for _ in 1:niter
        i0, i1, i2 = _vonmises_series(kζ, nterms)
        f = i0 / i1 - A^2
        di1 = (i0 + i2) / 2
        df = (i1^2 - i0 * di1) / i1^2
        kζ -= f / df
    end
    return kζ
end

# Originally Equation 37 of Psaltis et al. 2018, but apparely different equation is used in eht-imaging library.
# We here use the version used in eht-imaging library.
@inline function kzetafinder_equation(kzeta, finder::vonMises_KzetaFinder)
    return besseli.(0, kzeta) ./ besseli.(1, kzeta) .- finder.A^2
end

@inline initialize(::vonMises_KzetaFinder) = 0.538
