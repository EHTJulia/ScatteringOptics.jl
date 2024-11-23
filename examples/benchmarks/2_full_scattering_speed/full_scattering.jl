using Pkg
Pkg.activate(dirname(@__DIR__))
Pkg.instantiate()

using BenchmarkTools
using CSV
using DataFrames
using ProgressBars
using ScatteringOptics
using VLBISkyModels

# create a scattering model
const sm = ScatteringModel()

# set the field of view
const dx = μas2rad(1)
const nx_list = [32, 64, 128, 256, 512, 1024, 2048]

# frequency
const νref = 230e9

# make a Gaussian Model
g = stretched(Gaussian(), dx*20, dx*20)

etime = []
atime = []
for nx in ProgressBar(nx_list)
    # get the model image
    fov = dx * nx
    grid = imagepixels(fov, fov, nx, nx)
    im = intensitymap(g, grid)

    # ensemble average
    out = @benchmark ensembleaverage($sm, $im; νref=νref)
    push!(etime, median(out).time/1e9)

    # full scattering
    out = @benchmark scatter_image($sm, $im; νref=νref)
    push!(atime, median(out).time/1e9)
end

df = DataFrame(
    nx = nx_list,
    ensembleaverage = etime,
    average = atime,
)
CSV.write("so_full_scattering.csv", df)
