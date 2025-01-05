export ScatteringKernel
export ApproximatedScatteringKernel

"""
    $(TYPEDEF)

A Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model
`sm <: AbstractScatteringModel` using the fast approximation formula in Psaltis et al. (2018).

If `T` isn't given, `T` defaults to `Float64`
"""
struct ApproximatedScatteringKernel{T,S,N} <: AbstractScatteringKernel{T}
    """Scattering Model"""
    sm::S
    """Reference Frequency for radial extent. Pick the lowest frequency of your skymodel"""
    νref::N
    function ApproximatedScatteringKernel{T}(sm::S, νref::N) where {T,S,N}
        return new{T,S,N}(sm, νref)
    end
end

function ApproximatedScatteringKernel(sm::S, νref::N) where {S,N}
    return ApproximatedScatteringKernel{Float64}(sm, νref)
end

function radialextent(skm::ApproximatedScatteringKernel{T,S,N}) where {T,S,N}
    return convert(T, 5) * calc_θrad(skm.sm.θmaj) * (ν2λcm(νref) / skm.sm.λ0)^2
end

@inline function visibility_point(skm::ApproximatedScatteringKernel{T,S,N}, p) where {T,S,N}
    U = p.U
    V = p.V
    ν = :Fr in keys(p) ? p.Fr : skm.νref
    return visibility_point_approx(skm.sm, ν2λcm(ν), U, V) + zero(T)im
end

# use the approximated kernel as the default
const ScatteringKernel = ApproximatedScatteringKernel
