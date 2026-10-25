using JLD2
using ScatteringOptics
using StableRNGs
using Statistics
using Test
using VLBISkyModels

@testset "ScatteringOptics.jl" begin
    include("internalconsistency.jl")
    include("kzetafinders.jl")
    include("simtest.jl")
end
