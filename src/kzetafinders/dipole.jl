"""
    $(TYPEDEF)

The finder of the concentration parameter k_ζ,2 for dipole anistropic scattering models.
See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,2 is
given by the equation 43 of Psaltis et al. 2018.

**Mandatory fields**
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
"""
struct Dipole_KzetaFinder{Tα <: Number, TA <: Number} <: AbstractKzetaFinder
    α::Tα
    A::TA
end

@inline function _dipole_quadrature(kzeta, α, nquad; derivative = false)
    a = (α + 2) / 2 + (derivative ? 1 : 0)
    numerator = zero(kzeta)
    denominator = zero(kzeta)
    for i in 1:nquad
        z = cos(π * (i - 0.25) / (nquad + 0.5))
        for _ in 1:8
            p₀ = one(z)
            p₁ = z
            for j in 2:nquad
                p₂ = ((2j - 1) * z * p₁ - (j - 1) * p₀) / j
                p₀, p₁ = p₁, p₂
            end
            dp = nquad * (p₀ - z * p₁) / (1 - z^2)
            z -= p₁ / dp
        end
        p₀ = one(z)
        p₁ = z
        for j in 2:nquad
            p₂ = ((2j - 1) * z * p₁ - (j - 1) * p₀) / j
            p₀, p₁ = p₁, p₂
        end
        dp = nquad * (p₀ - z * p₁) / (1 - z^2)
        θ = (z + 1) * π / 4
        s² = sin(θ)^2
        value = (1 + kzeta * s²)^(-a)
        weight = (π / 4) * 2 / ((1 - z^2) * dp^2)
        factor = derivative ? s² : one(s²)
        numerator += weight * (1 - s²) * value * factor
        denominator += weight * s² * value * factor
    end
    return numerator, denominator
end

function findkzeta_differentiable(finder::Dipole_KzetaFinder; nquad = 32, niter = 5)
    α, A = finder.α, finder.A
    kζ = initialize(finder)
    a = (α + 2) / 2
    for _ in 1:niter
        numerator, denominator = _dipole_quadrature(kζ, α, nquad)
        dnumerator, ddenominator = _dipole_quadrature(kζ, α, nquad; derivative = true)
        dnumerator *= -a
        ddenominator *= -a
        f = numerator / denominator - A^2
        df = (dnumerator * denominator - numerator * ddenominator) / denominator^2
        kζ -= f / df
    end
    return kζ
end

# Equation 43 of Psaltis et al. 2018.
@inline function kzetafinder_equation(kzeta, finder::Dipole_KzetaFinder)
    α = finder.α
    A = finder.A
    ᾱ = (α + 2) / 2
    return _₂F₁.(ᾱ, 0.5, 2, .-kzeta) ./ _₂F₁.(ᾱ, 1.5, 2, .-kzeta) .- A^2
end

@inline initialize(::Dipole_KzetaFinder) = 3.89
