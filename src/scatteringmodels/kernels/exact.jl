export ExactScatteringKernel

"""
    $(TYPEDEF)

A Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model
`sm <: AbstractScatteringModel` using the exact formula in Psaltis et al. (2018).

By default if `T` isn't given, `T` defaults to `Float64`
"""
struct ExactScatteringKernel{T,S,N} <: AbstractScatteringKernel{T}
    """Scattering Model"""
    sm::S
    """Reference frequency in Hz for radial extent. Pick the lowest frequency of your skymodel."""
    νref::N
    function ExactScatteringKernel{T}(sm::S, νref::N) where {T,S,N}
        return new{T,S,N}(sm, νref)
    end
end

ExactScatteringKernel(sm::S, νref::N) where {S,N} = ExactScatteringKernel{Float64}(sm, νref)

function radialextent(skm::ExactScatteringKernel{T,S,N}) where {T,S,N}
    return convert(T, 5) * calc_θrad(skm.sm.θmaj) * (ν2λcm(νref) / skm.sm.λ0)^2
end

@inline function visibility_point(skm::ExactScatteringKernel{T,S,N}, u, v, time, freq) where {T,S,N}
    return visibility_point_exact(skm.sm, ν2λcm(freq), u, v) + zero(T)im
end
