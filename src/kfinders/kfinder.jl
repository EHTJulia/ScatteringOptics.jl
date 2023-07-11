"""
    $(TYPEDEF)

Data type for a Kfinder object that holds parameters α and A
"""

struct KFinder{T <: Number, Y <: Number} <: AbstractKFinder
    α::T
    A::Y
end
