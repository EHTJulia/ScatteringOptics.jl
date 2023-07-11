export AbstractKFinder
export Psaltis18Eq43
export findk

"""
    AbstractKFinder

This is an abstract data type for the hypergeometic computation of the concentration parameter k_ζ,2 for
use in the phase structure function

**Mandatory fields**
- `α::Number`: spectrum index
- `A::Number`: defined as θmax/θmin (major over minor axis)
"""
abstract type AbstractKFinder end


"""
    Psaltis18Eq43(k, constants::KFinder)
Equation 43 of Psaltis et al. 2018
"""
function Psaltis18Eq43(k, constants::AbstractKFinder)
    α = constants.α
    A = constants.A
    ᾱ = (α+2.)/2
    return _₂F₁.(ᾱ, 1/2., 2, .-k) ./ _₂F₁.(ᾱ, 3/2., 2, .-k) .- A^2.
end

"""
    findk(finder::KFinder)

Solves Psaltis18Eq43 for k given A and α parameters in finder
"""
function findk(finder::AbstractKFinder)
    probN = NonlinearProblem(Psaltis18Eq43, [0., 0.], finder)
    return solve(probN, NewtonRaphson())[1] # 13 micro s, 10 
end

