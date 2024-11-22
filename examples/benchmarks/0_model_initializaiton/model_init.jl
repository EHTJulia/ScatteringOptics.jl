using Pkg
Pkg.activate(dirname(@__DIR__))

using BenchmarkTools
using CSV
using DataFrames
using Printf
using ScatteringOptics

# the directory above the script directory
model_names = ["Dipole", "Von Mises", "Periodic Boxcar"]
model_names_ehtim = ["dipole", "von_Mises", "boxcar"]
model_names_so = [DipoleScatteringModel, vonMisesScatteringModel, PeriodicBoxCarScatteringModel]

@info "This script will benchmark the initialization time of the scattering models, critical for the scattering parameter inference"

@info "Step 1: Benchmarking ScatteringOptics.jl"
so_mean_time = []
so_std_time = []
so_label = []
for i in 1:3
    @info "  $(i)/3: $(model_names[i]) Model"
    local model = model_names_so[i]
    local out = @benchmark $model()
    push!(so_mean_time, mean(out).time/1e6)
    push!(so_std_time, std(out).time/1e6)
    local label = @sprintf("%.2f +/- %.2f ms",mean(out).time/1e6, std(out).time/1e6)
    push!(so_label, label)
end

@info "Step 2: Loading results from eht-imaging library"
ehdf = DataFrame(CSV.File("./ehtim_model_init.csv"))
eh_label = []
for i in 1:3
    @info "  $(i)/3: $(model_names[i]) Model"
    local meanval = ehdf[i, :mean_ms]
    local stdval = ehdf[i, :std_ms]
    local label = @sprintf("%.2f +/- %.2f ms", meanval, stdval)
    push!(eh_label, label)
end

@info "Here is the results of the benchmarking"
df = DataFrame(
    [(Name="ScatteringOptics.jl", Dipole=so_label[1], vonMises=so_label[2], PeriodicBoxCar=so_label[3]),
    (Name="eht-imaging (Python)", Dipole=eh_label[1], vonMises=eh_label[2], PeriodicBoxCar=eh_label[3])]
)
print(df)
open("results.txt","w") do io
    println(io, df)
end