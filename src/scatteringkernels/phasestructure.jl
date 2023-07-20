export PhaseStructure
"""
    $(TYPEDEF)
"""

struct PhaseStructure{T<:Number, F<:Function} <: AbstractScatteringKernel
    α::T    
    inscale::Number
    θmaj::Number
    θmin::Number
    ϕpt::Number
    λ0::Number
    M::Number
    ζ::Number
    A::Number
    k::Number
    Bmaj::Number
    Bmin::Number
    Qbar::Number
    C::Number
    Amaj::Number
    Amin::Number
    ϕ0::Number
    P_ϕ::F
    function PhaseStructure(α=1.38, inscale=800e5, θmaj=1.380, θmin=.703, ϕpt=81.9, λ0=1., M=.53)
        # solve for k from dipole model in Psaltis 2018
        A = θmaj/θmin
        ζ = (A^2. - 1)/(A^2. +1)
        k = findk(KFinder(α, A))

        #milliarcseconds to radians
        θmaj_rad = dms2rad((0,0,θmaj*10^-3))
        θmin_rad = dms2rad((0,0,θmin*10^-3))

        ϕ0 = deg2rad(90-ϕpt)
        P_ϕ0 = 1.0/(2.0*π* _₂F₁((α + 2.0)/2.0, 0.5, 1.0, -k))
        P_ϕ(ϕ) = P_ϕ0*(1. +k*sin(ϕ-ϕ0)^2.)^(-(α+2.)/2.)

        # B parameters
        fmaj(ϕ) = abs(cos(ϕ0-ϕ))^α*P_ϕ(ϕ)
        fmin(ϕ) = abs(sin(ϕ0-ϕ))^α*P_ϕ(ϕ)
        B_prefac = C*2.0^(2.0-α)*π^0.5/(α*gamma((α+1.0)/2.0))
        Bmaj = B_prefac*quadgk(fmaj, 0, 2*π)[1]
        Bmin = B_prefac*quadgk(fmin, 0, 2*π)[1]
        
        # C parameter
        FWHM = (2.0 * log(2.0))^0.5/π
        Qbar = 2.0/gamma((2-α)/2.) * (inscale^2*(1.0 + M)/(FWHM*(λ0/(2.0*π))^2) )^2 * ( (θmaj_rad^2 + θmin_rad^2))
        C = (λ0/(2.0*π))^2 * Qbar*gamma(1.0 - α/2.0)/(8.0*π^2*inscale^2)

        Amaj = (inscale*(1.0 + M) * θmaj_rad/(FWHM * (λ0/(2.0*π)) * 2.0*π ))^2
        Amin = (inscale*(1.0 + M) * θmin_rad/(FWHM * (λ0/(2.0*π)) * 2.0*π ))^2


        return new(α, inscale, θmaj, θmin, ϕpt, λ0, M, ζ, A, k, Bmaj, Bmin, Qbar, C, Amaj, Amin, ϕ0, P_ϕ) 
    end
end
