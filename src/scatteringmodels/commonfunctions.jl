# constants
const FWHMfac = √(2 * log(2)) / π
const c_cgs = 29979245800.0
const kpc_tp_cm = 3.0857e21
const mas2rad = π / (180 * 60 * 60 * 1000)

# Lanczos coefficients for a differentiable approximation to gamma on x > 0.
const _GAMMA_LANCZOS_COEFFS = (
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
)

@inline function _gamma_differentiable(x)
    z = x - one(x)
    a = _GAMMA_LANCZOS_COEFFS[1]
    for i in 2:length(_GAMMA_LANCZOS_COEFFS)
        a += _GAMMA_LANCZOS_COEFFS[i] / (z + i - 1)
    end
    t = z + 7.5
    return √(2π) * t^(z + 0.5) * exp(-t) * a
end

"""
Best-fit parameters of the dipole scattering model derived in Johnson et al. 2018
"""
const Params_Johnson2018 = (
    α = 1.38,
    rin_cm = 800.0e5,
    θmaj_mas = 1.38,
    θmin_mas = 0.703,
    ϕpa_deg = 81.9,
    λ0_cm = 1.0,
    D_kpc = 2.82,
    R_kpc = 5.53,
)

# common functions to precomute key constants
@inline calc_A(θmaj, θmin) = θmaj / θmin
@inline calc_ζ0(A) = (A^2 - 1) / (A^2 + 1)
@inline calc_M(D, R) = D / R

@inline calc_θrad(θmas) = θmas * mas2rad # milliarcseconds to radians
@inline calc_Amaj(rin_cm, λ0_cm, M, θrad) = (rin_cm * (1 + M) * θrad / (FWHMfac * λ0_cm))^2
@inline calc_Amin = calc_Amaj

@inline calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad) =
    2 / _gamma_differentiable((2 - α) / 2) *
    (rin_cm^2 * (1 + M) / (FWHMfac * (λ0_cm / 2π)^2))^2 *
    (θmaj_rad^2 + θmin_rad^2)
@inline calc_C(α, rin_cm, λ0_cm, Qbar) =
    (λ0_cm / 2π)^2 * Qbar * _gamma_differentiable(1 - α / 2) / (8π^2 * rin_cm^2)

@inline calc_ϕ0(ϕpa_deg) = deg2rad(90 - ϕpa_deg)

@inline calc_B_prefac(α, C) =
    C * 2^(2 - α) * √π / (α * _gamma_differentiable((α + 1) / 2))
@inline function _gauss_legendre_integral(f, a, b, n = 128)
    # Fixed quadrature keeps model construction differentiable through Enzyme.
    m = (n + 1) ÷ 2
    midpoint = (a + b) / 2
    halfwidth = (b - a) / 2
    total = zero(midpoint)
    for i in 1:m
        z = cos(π * (i - 0.25) / (n + 0.5))
        for _ in 1:8
            p₀ = one(z)
            p₁ = z
            for j in 2:n
                p₂ = ((2j - 1) * z * p₁ - (j - 1) * p₀) / j
                p₀, p₁ = p₁, p₂
            end
            dp = n * (p₀ - z * p₁) / (1 - z^2)
            z -= p₁ / dp
        end
        p₀ = one(z)
        p₁ = z
        for j in 2:n
            p₂ = ((2j - 1) * z * p₁ - (j - 1) * p₀) / j
            p₀, p₁ = p₁, p₂
        end
        dp = n * (p₀ - z * p₁) / (1 - z^2)
        weight = 2 / ((1 - z^2) * dp^2)
        x₊ = midpoint + halfwidth * z
        x₋ = midpoint - halfwidth * z
        total += weight * (f(x₊) + f(x₋))
    end
    return halfwidth * total
end

@inline calc_Bmaj(α, ϕ0, Pϕ, B_prefac) =
    B_prefac * _gauss_legendre_integral(ϕ -> abs(cos(ϕ0 - ϕ))^α * Pϕ(ϕ), 0, 2π)
@inline calc_Bmin(α, ϕ0, Pϕ, B_prefac) =
    B_prefac * _gauss_legendre_integral(ϕ -> abs(sin(ϕ0 - ϕ))^α * Pϕ(ϕ), 0, 2π)

@inline calc_D1(α, A, B) = B * (2 * A / (α * B))^(-α / (2 - α))
@inline calc_D2(α, A, B) = (2 * A / (α * B))^(2 / (2 - α))

@inline λcm2ν(λcm) = c_cgs / λcm
@inline ν2λcm(ν) = c_cgs / ν
