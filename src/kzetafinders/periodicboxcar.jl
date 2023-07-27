"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,3 for the Periodic Box Car anistropic scattering model.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,3 is
given by the equation 47 of Psaltis et al. 2018.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct PeriodicBoxCar_KzetaFinder{T<:Number} <: AbstractKzetaFinder
    ζ0::T
end


# Equation 47 of Psaltis et al. 2018.
@inline function kzetafinder_equation(kzeta, finder::PeriodicBoxCar_KzetaFinder)
    k̃zeta .= π ./ (1 .+ kzeta)
    return sin(k̃zeta) ./ k̃zeta .- finder.ζ0
end
