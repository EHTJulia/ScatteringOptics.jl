using Pkg
Pkg.activate(dirname(@__DIR__))
Pkg.instantiate()

using CairoMakie
using CSV
using DataFrames
using LaTeXStrings

@info "Loading results form eht-imaging and ScatteringOptics.jl"
ehdf = DataFrame(CSV.File("./eh_compute_kernel.csv"))
sodf = DataFrame(CSV.File("./so_compute_kernel.csv"))

@info "Plotting Results"
# plotting
modelnames = ["Dipole", "von Mises", "Periodic Boxcar"]
dfcols = [:dipole, :vonmises, :boxcar]
lablenames = ["dp", "vm", "bc"]

fig = Figure(; size=(1500, 500), fontsize=12)
for i in 1:3
    modelname = modelnames[i]
    labelname = lablenames[i]

    ax = Axis(
        fig[1, i];
        title=string(
            "Computation time of the kernel visibility amplitudes ($(modelname) Model)"
        ),
        xlabel="Data Size in the Visibility Domain",
        ylabel="Computation Time (s)",
        xscale=log10,
        yscale=log10,
        xticks=(10.0 .^ collect(1:6), [latexstring("10^{$(i)}") for i in 1:6]),
        xminorticks=IntervalsBetween(9),
        xminorticksvisible=true,
        xminorgridvisible=true,
        yticks=(10.0 .^ collect(-6:-1), [latexstring("10^{$(i)}") for i in -6:-1]),
        yminorticks=IntervalsBetween(9),
        yminorticksvisible=true,
        yminorgridvisible=true,
        aspect=1,
    )

    lines!(
        ax,
        sodf[!, :samples],
        sodf[!, dfcols[i]];
        linewidth=2,
        color="purple",
        label="ScatteringOptics.jl",
    )
    scatter!(ax, sodf[!, :samples], sodf[!, dfcols[i]]; color="purple")

    lines!(
        ax,
        ehdf[!, :samples],
        ehdf[!, dfcols[i]];
        linewidth=2,
        color="orange",
        label="eht-imaging (Python)",
    )
    scatter!(ax, ehdf[!, :samples], ehdf[!, dfcols[i]]; color="orange")

    axislegend(ax; position=:rb)
end
save(string("bench_kernel_speed.png"), fig)