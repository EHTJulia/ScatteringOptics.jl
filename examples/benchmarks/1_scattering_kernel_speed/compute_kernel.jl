using Pkg
Pkg.activate(dirname(@__DIR__))
Pkg.instantiate()

using CSV
using BenchmarkTools
using DataFrames
using ProgressBars
using ScatteringOptics
using StableRNGs
using VLBISkyModels

@info "This benchmark script will compare the time taken to compute the visibility function of the scatteirng kernel between eht-imaging and ScatteringOptics.jl"

# number of uvsamples
const nsamples = Int64.(floor.(exp10.(range(1, 6, length=20))))

# maximum uvd
const uvdmax = Float64(10^10)

# reference frequency
const λcm = 0.13
const νref = ScatteringOptics.λcm2ν(λcm)

@info "Benchmarking ScatteringOptics.jl"

# creating the scattering models
const sms = [DipoleScatteringModel(), vonMisesScatteringModel(), PeriodicBoxCarScatteringModel()]
const kernels = map(sm -> kernelmodel(sm; νref=νref), sms)

# a function to compute visibility
@inline function so_compute!(vis, sm, λcm, uvec, vvec)
    for i in 1:length(uvec)
        @inbounds vis[i] = visibility_point_approx(sm, λcm, uvec[i], vvec[i])
    end
    return nothing
end

# Benchmarking
so_results=Array{Float64,2}(undef, 3, length(nsamples))
for i in ProgressBar(1:length(nsamples))
    local nsample = nsamples[i]
    local stablerng = StableRNG(nsample)
    local uvec = rand(stablerng, nsample) .* 1e10
    local vvec = rand(stablerng, nsample) .* 1e10
    #local p = UnstructuredDomain((U=uvec, V=vvec))
    local vis = Vector{Float64}(undef, nsample)
    for j in 1:3
        local sm = sms[j]
        local kernel = kernels[j]
        #local out = @benchmark visibilitymap!($vis, $kernel, $p) samples=100
        local out = @benchmark so_compute!($vis, $sm, $λcm, $uvec, $vvec) samples=100
        @inbounds so_results[j, i] = minimum(out).time/1e9
    end
end

df = DataFrame(
    samples = nsamples,
    dipole = so_results[1, :],
    vonmises = so_results[2, :],
    boxcar = so_results[3, :]
)
CSV.write("so_compute_kernel.csv", df)