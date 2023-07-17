export PhaseStructure
"""
    $(TYPEDEF)
"""

struct PhaseStructure <: AbstractScatteringKernel
    α::Number    
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
    C::Number
    P_ϕ0::Number
    function PhaseStructure(α=1.38, inscale=800e5, θmaj=1.380, θmin=.703, ϕpt=81.9, λ0=1, M=.53)
        # solve for k from dipole model in Psaltis 2018
        A = θmaj/θmin
        ζ = (A^2. - 1)/(A^2. +1)
        k = findk(KFinder(α, A))

        #milliarcseconds to radians
        θmaj_rad = dms2rad((0,0,θmaj*10^-3))
        θmin_rad = dms2rad((0,0,θmin*10^-3))

        # B parameters
        hyp1 = _₂F₁(1/2., (2+α)/2., 1., -k)
        hyp2 = _₂F₁(1/2., -α/2., 1., -k)
        num = 2^(4. - α)/(α^2.)/gamma(α/2.)
        Bmaj = num / hyp1 / √(1+k) / (1+ζ)
        Bmin = num / hyp2/(1-ζ)
        
        # C parameter
        Qbar = 2.0/gamma((2-α)/2.) * (inscale^2*(1.0 + M)/((2.0 * log(2.0))^0.5/π*(λ0/(2.0*π))^2) )^2 * ( (θmaj_rad^2 + θmin_rad^2))
        C = (λ0/(2.0*π))^2 * Qbar*gamma(1.0 - α/2.0)/(8.0*π^2*inscale^2)

        P_ϕ0 = 1.0/(2.0*π* _₂F₁((α + 2.0)/2.0, 0.5, 1.0, -k))
        return new(α, inscale, θmaj, θmin, ϕpt, λ0, M, ζ, A, k, Bmaj, Bmin, C, P_ϕ0) 
    end
end