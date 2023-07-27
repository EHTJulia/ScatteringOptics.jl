export AbstractScatteringKernel

"""
    $(TYPEDEF)

An abstract Comrade Sky Model for the diffractive scattering kernel. These are usually
primitive models, and are usually analytic in Fourier but not analytic in the image domain.
As a result a user only needs to implement the following methods.

- `visibility_point`
- `radialextent`
"""
abstract type AbstractScatteringKernel{T} <: AbstractModel end
@inline flux(::AbstractScatteringKernel{T}) where {T} = one(T)
@inline isprimitive(::Type{<:AbstractScatteringKernel}) = IsPrimitive()
@inline visanalytic(::Type{<:AbstractScatteringKernel}) = IsAnalytic()
@inline imanalytic(::Type{<:AbstractScatteringKernel}) = NotAnalytic()
