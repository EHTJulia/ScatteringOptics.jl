using Pkg
Pkg.activate(dirname(@__DIR__))
Pkg.instantiate()

using CairoMakie
using CSV
using DataFrames
using LaTeXStrings

@info "Loading results form eht-imaging and ScatteringOptics.jl"
ehdf = DataFrame(CSV.File("./eh_full_scattering.csv"))
sodf = DataFrame(CSV.File("./so_full_scattering.csv"))

@info "Plotting Results"
fig = Figure(size=(500,500), fontsize=12)

ax = Axis(
    fig[1, 1],
    title = string("Computation time for scattering an image"),
    xlabel = "Number of Image Pixels",
    ylabel = "Computation Time (s)",
    xscale = log10,
    yscale = log10,
    xticks = (10. .^ collect(3:7), [latexstring("10^{$(i)}") for i in 3:7]),
    xminorticks = IntervalsBetween(9),
    xminorticksvisible = true,
    xminorgridvisible = true,
    yticks = (10. .^ collect(-4:2), [latexstring("10^{$(i)}") for i in -4:2]),
    yminorticks = IntervalsBetween(9),
    yminorticksvisible = true,
    yminorgridvisible = true,
    aspect = 1,
)
lines!(ax, sodf[!, :nx] .^ 2, sodf[!, :average], linewidth = 2, color = "purple", label="Full Scattering")
lines!(ax, sodf[!, :nx] .^ 2, sodf[!, :ensembleaverage], linewidth = 2, linestyle = :dash, color = "purple", label="Diffractive Scattering Only")
lines!(ax, ehdf[!, :nx] .^ 2, ehdf[!, :average], linewidth = 2, color = "orange")
lines!(ax, ehdf[!, :nx] .^ 2, ehdf[!, :ensembleaverage], linewidth = 2, linestyle = :dash, color = "orange")

scatter!(ax, sodf[!, :nx] .^ 2, sodf[!, :average], color = "purple", label = "ScatteringOptics.jl")
scatter!(ax, ehdf[!, :nx] .^ 2, ehdf[!, :average], color = "orange", label = "eht-imaging (Python)")
scatter!(ax, sodf[!, :nx] .^ 2, sodf[!, :ensembleaverage], color = "purple")
scatter!(ax, ehdf[!, :nx] .^ 2, ehdf[!, :ensembleaverage], color = "orange")

axislegend(ax, position = :rb)

save(string("bench_full_scattering.png"), fig)
