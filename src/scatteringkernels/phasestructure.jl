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
        Bmaj = num / hyp1 / √(1+k) / (1+ζ)
        Bmin = num / hyp2/(1-ζ)

        C = ((1+M)*ps.inscale / (2*π*ps.λ0 ))^2. * (ps.θmaj^2 + ps.θmin^2)/(8 * log(2.))
        return new(α, inscale, θmaj, θmin, ϕpt, λ0, M, ζ, A, k, Bmaj, Bmin, C) 
    end
end
