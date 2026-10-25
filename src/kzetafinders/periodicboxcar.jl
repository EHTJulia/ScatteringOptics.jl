"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,3 for the Periodic Box Car anistropic scattering model.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,3 is
given by the equation 47 of Psaltis et al. 2018.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct PeriodicBoxCar_KzetaFinder{T <: Number} <: AbstractKzetaFinder
    ζ0::T
end

function findkzeta_differentiable(finder::PeriodicBoxCar_KzetaFinder; niter = 5)
    ζ0 = finder.ζ0
    kζ = initialize(finder)
    for _ in 1:niter
        x = 1 / (1 + kζ)
        sinπx = sinpi(x)
        cosπx = cospi(x)
        f = sinπx / (π * x) - ζ0
        dfdx = (π * x * cosπx - sinπx) / (π * x^2)
        dfdζ = -dfdx / (1 + kζ)^2
        kζ -= f / dfdζ
    end
    return kζ
end

# Equation 47 of Psaltis et al. 2018.
#    Note: Eq 47 has a typo and it has an extra kzeta. We use the correct one following
#          Psaltis+2018's reference implementation in the eht-imaging library.
@inline function kzetafinder_equation(kzeta, finder::PeriodicBoxCar_KzetaFinder)
    #x = π ./ (1 .+ kzeta)
    #return sin.(x) ./ x .- finder.ζ0
    x = 1 ./ (1 .+ kzeta)
    return sinc.(x) .- finder.ζ0
end

@inline initialize(::PeriodicBoxCar_KzetaFinder) = 0.859
