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
    function PhaseStructure(α, inscale, θmaj, θmin, ϕpt, λ0, M)
        A = θmaj/θmin
        ζ = (A^2. - 1)/(A^2. +1)
        k = findk(KFinder(α, A))

        hyp1 = _₂F₁(1/2., (2+α)/2., 1., -k)
        hyp2 = _₂F₁(1/2., -α/2., 1., -k)
        num = 2^(4. - α)/(α^2.)/gamma(α/2.)
        Bmaj = num * hyp1 / √(1+k) / (1+ζ)
        Bmin = num * hyp2/(1-ζ)

        bm = √(8*log(2)/2*π) * λ0/θmaj
        l1 = (1. +M)*inscale*(2. /(α * Bmaj))^(1/(α-2.))
        l2 = 4. ^(1/(2. -α))*Bmaj^(2/(α-2.))*α^(α/(α-2.))/(1+ζ)
        C = l2/(((bm/l1)^2. +1)^(α/2.) - 1)
        return new(α, inscale, θmaj, θmin, ϕpt, λ0, M, A, ζ, k, Bmaj, Bmin, C) 
    end
end
