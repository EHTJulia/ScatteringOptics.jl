export vonMisesScatteringModel

"""
    $(TYPEDEF)

An anistropic scattering model based on a thin-screen approximation.
This scattering adopts the von Mises field wonder described in Psaltis et al. 2018.

** Keywords for the constructor **
The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
- `rin_cm::Number`: The inner scale of the scattering screen in cm.
- `θmaj_mas::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
- `θmin_nas::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
- `ϕ_deg::Number`: The position angle of the major axis of the scattering in degree.
- `λ0_cm::Number`: The reference wavelength for the scattering model in cm.
- `D_pc::Number`: The distance from the observer to the scattering screen in pc.
- `R_pc::Number`: The distance from the source to the scattering screen in pc.
"""
struct vonMisesScatteringModel{T<:Number} <: AbstractScatteringModel
    # Mandatory fields for AbstractScatteringModel
    #   fundamental parameters
    α::T
    rin::T
    θmaj::T
    θmin::T
    ϕpa::T
    λ0::T
    D::T
    R::T

    #   precomputed constants
    M::T
    ζ0::T
    A::T
    kζ::T
    Bmaj::T
    Bmin::T
    Qbar::T
    C::T
    Amaj::T
    Amin::T
    ϕ0::T

    function vonMisesScatteringModel(; α=1.38, rin_cm=800e5, θmaj_mas=1.380, θmin_mas=0.703, ϕpa_deg=81.9, λ0_cm=1.0, R_pc=5.53, D_pc=2.82)
        # compute asymmetry parameters and magnification parameter
        A = calc_A(θmaj_mas, θmin_mas)
        ζ0 = calc_ζ0(A)
        M = calc_M(D_pc, R_pc)

        # Parameters for the approximate phase structure function
        θmaj_rad = calc_θrad(θmaj_mas) # milliarcseconds to radians
        θmin_rad = calc_θrad(θmin_mas) # milliarcseconds to radians
        Amaj = calc_Amaj(rin_cm, λ0_cm, M, θmaj_rad)
        Amin = calc_Amin(rin_cm, λ0_cm, M, θmin_rad)

        # C parameters that scale the powerspectrum of the phase screen
        Qbar = calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad)
        C = calc_C(α, rin_cm, λ0_cm, Qbar)

        # position angle (measured from Dec axis in CCW) to a more tranditional angle measured from RA axis in CW
        ϕ0 = calc_ϕ0(ϕpa_deg)

        # find kζ
        #   note: this is depending on the type of the scattering model
        kζ = findkzeta_exact(vonMises_KzetaFinder(A))

        # precomputing factor for Pϕ
        #   note: both lines are depending on the type of the scattering model
        Pϕ0 = 1 / (2π * besseli(0, kζ))
        Pϕfunc(ϕ) = Pϕ(vonMisesScatteringModel, ϕ, ϕ0, kζ, Pϕ0)

        # B parameters
        B_prefac = calc_B_prefac(α, C)
        Bmaj = calc_Bmaj(α, ϕ0, Pϕfunc, B_prefac)
        Bmin = calc_Bmin(α, ϕ0, Pϕfunc, B_prefac)

        return new{typeof(α)}(α, rin_cm, θmaj_mas, θmin_mas, ϕpa_deg, λ0_cm, D_pc, R_pc, M, ζ0, A, kζ, Bmaj, Bmin, Qbar, C, Amaj, Amin, ϕ0)
    end
end

@inline function Pϕ(::Type{<:vonMisesScatteringModel}, ϕ, ϕ0, kζ, Pϕ0)
    return Pϕ0 * cosh(kζ * cos(ϕ - ϕ0))
end

@inline Pϕ(sm::vonMisesScatteringModel, ϕ) = Pϕ(vonMisesScatteringModel, ϕ, sm.ϕ0, sm.kζ, sm.Pϕ0)
