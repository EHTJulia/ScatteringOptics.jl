using Pkg
Pkg.activate(dirname(@__DIR__))
Pkg.instantiate()

using CSV
using BenchmarkTools
using DataFrames
using ScatteringOptics
using VLBISkyModels

@info "Computing scattering kernels with ScatteringOptics.jl"
# number of uvsamples
const ndata = 1000

# maximum uvd
const uvdmax1 = 15e9 # 15 Gλ
const uvdmax2 = 30e6 # 30 Mλ

# uv
const uvec1 = LinRange(0, uvdmax1, ndata)
const uvec2 = LinRange(0, uvdmax2, ndata)

# reference frequency
const λcm1 = 0.087
const λcm2 = 3.6

# creating the scattering models
const sm = ScatteringModel(; ϕpa_deg=0.0)

# a function to compute visibility
@inline visibilitymap_approx_min(sm, λcm, uvec) =
    map(u -> visibility_point_approx(sm, λcm, u, 0.0), uvec)
@inline visibilitymap_approx_maj(sm, λcm, vvec) =
    map(v -> visibility_point_approx(sm, λcm, 0.0, v), vvec)

# Benchmarking
vismaj1 = visibilitymap_approx_maj(sm, λcm1, uvec1)
vismin1 = visibilitymap_approx_min(sm, λcm1, uvec1)
vismaj2 = visibilitymap_approx_maj(sm, λcm2, uvec2)
vismin2 = visibilitymap_approx_min(sm, λcm2, uvec2)

df = DataFrame(;
    uvd1=uvec1,
    vismaj1=vismaj1,
    vismin1=vismin1,
    uvd2=uvec2,
    vismaj2=vismaj2,
    vismin2=vismin2,
)
CSV.write("so_compute_kernel.csv", df)