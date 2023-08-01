# constants
const FWHMfac = √(2 * log(2)) / π
const c_cgs = 29979245800.0

"""
Best-fit parameters of the dipole scattering model derived in Johnson et al. 2018
"""
const Params_Johnson2018 = (α=1.38, rin_cm=800e5, θmaj_mas=1.380, θmin_mas=0.703, ϕpa_deg=81.9, λ0_cm=1.0, D_pc=2.82, R_pc=5.53)

# common functions to precomute key constants
@inline calc_A(θmaj, θmin) = θmaj / θmin
@inline calc_ζ0(A) = (A^2 - 1) / (A^2 + 1)
@inline calc_M(D, R) = D / R

@inline calc_θrad(θmas) = θmas * mas2rad # milliarcseconds to radians
@inline calc_Amaj(rin_cm, λ0_cm, M, θrad) = (rin_cm * (1 + M) * θrad / (FWHMfac * λ0_cm))^2
@inline calc_Amin = calc_Amaj

@inline calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad) = 2 / gamma((2 - α) / 2) * (rin_cm^2 * (1 + M) / (FWHMfac * (λ0_cm / 2π)^2))^2 * (θmaj_rad^2 + θmin_rad^2)
@inline calc_C(α, rin_cm, λ0_cm, Qbar) = (λ0_cm / 2π)^2 * Qbar * gamma(1 - α / 2) / (8π^2 * rin_cm^2)

@inline calc_ϕ0(ϕpa_deg) = deg2rad(90 - ϕpa_deg)

@inline calc_B_prefac(α, C) = C * 2^(2 - α) * √π / (α * gamma((α + 1) / 2))
@inline calc_Bmaj(α, ϕ0, Pϕ, B_prefac) = B_prefac * quadgk(ϕ -> abs(cos(ϕ0 - ϕ))^α * Pϕ(ϕ), 0, 2π)[1]
@inline calc_Bmin(α, ϕ0, Pϕ, B_prefac) = B_prefac * quadgk(ϕ -> abs(sin(ϕ0 - ϕ))^α * Pϕ(ϕ), 0, 2π)[1]

@inline calc_D1(α, A, B) = B * (2 * A / (α * B))^(-α / (2 - α))
@inline calc_D2(α, A, B) = (2 * A / (α * B))^(2 / (2 - α))

@inline λcm2ν(λcm) = c_cgs / λcm
@inline ν2λcm(ν) = c_cgs / ν
