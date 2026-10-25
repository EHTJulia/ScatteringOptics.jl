"""
    AbstractKzetaFinder

This is an abstract data type to set up equations and provide a solver for the concentration parameter k_ζ
for an anistropic interstellar scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details.

**Mandatory methods**
- `kzetafinder_equation(kzeta, finder::AbstractKzetaFinder)`: should privide a equation where k will be derived.

**Methods provided**
- `findkzeta_exact(finder::AbstractKzetaFinder)`: solves the equation for k_ζ,2 given the set of parameters in the finder.
"""
abstract type AbstractKzetaFinder end

"""
    findkzeta_exact(finder::AbstractKzetaFinder; kwargs...)

Solves the equation for the concentration parameter k_ζ given the set of parameters in the finder.

The default is a fixed-iteration differentiable approximation. Use `method=:original`
to select the original `NonlinearSolve.jl` implementation.
"""
@inline function findkzeta_exact(
        finder::AbstractKzetaFinder;
        method = :differentiable,
        solver = NewtonRaphson(),
        kwargs...,
    )
    if method === :differentiable
        return findkzeta_differentiable(finder; kwargs...)
    elseif method === :original
        return _findkzeta_original(finder; solver)
    else
        throw(ArgumentError("method must be :differentiable or :original"))
    end
end

@inline function _findkzeta_original(finder::AbstractKzetaFinder; solver = NewtonRaphson())
    kζ0 = initialize(finder)
    probN = NonlinearProblem(kzetafinder_equation, [kζ0, kζ0], finder)
    return solve(probN, solver)[1]
end

function findkzeta_differentiable end

"""
    kzetafinder_equation(kzeta, finder::AbstractKzetaFinder)

This equation privide a root-finding function `f(kzeta, finder)` to find kzeta from the equation `f(kzeta, finder)=0`.
"""
function kzetafinder_equation(kzeta, ::AbstractKzetaFinder) end

@inline initialize(::AbstractKzetaFinder) = 1.0
