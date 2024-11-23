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
fig = Figure(size=(800,600), fontsize=12)

ax1 = Axis(
    fig[1, 1],
    title = L"Sgr A* Dipole Scattering Kernel $\lambda$=0.87 mm",
    xlabel = L"Baseline Length (G$\lambda$)",
    ylabel = "Kernel Amplitude",
    limits = ((-1,16), (9e-2, 1.2)),
#    xscale = log10,
    xticks = LinRange(0, 15, 4),
    xminorticks = IntervalsBetween(5),
    xminorticksvisible = true,
    xminorgridvisible = true,
    yscale = log10,
    yticks = (10. .^ collect(-2:0), [latexstring("10^{$(i)}") for i in -2:0]),
    yminorticks = IntervalsBetween(9),
    yminorticksvisible = true,
    yminorgridvisible = true,
)

lines!(ax1, sodf[!, :uvd1]/1e9, sodf[!, :vismin1], linewidth = 2, color = "red", label = "ScatteringOptics.jl (Minor Axis)")
lines!(ax1, sodf[!, :uvd1]/1e9, sodf[!, :vismaj1], linewidth = 2, color = "blue", label = "ScatteringOptics.jl (Major Axis)")

lines!(ax1, ehdf[!, :uvd1]/1e9, ehdf[!, :vismin1], linewidth = 2, color = "green", linestyle=:dash, label = "eht-imaging (Minor Axis)")
lines!(ax1, ehdf[!, :uvd1]/1e9, ehdf[!, :vismaj1], linewidth = 2, color = "orange", linestyle=:dash, label = "eht-imaging (Major Axis)")
axislegend(ax1, position = :lb)

ax2 = Axis(
    fig[2, 1],
    xlabel = L"Baseline Length (G$\lambda$)",
    ylabel = "Absolute Fractional Error",
    limits = ((-1,16), nothing),
#    xscale = log10,
    xticks = LinRange(0, 15, 4),
    xminorticks = IntervalsBetween(5),
    xminorticksvisible = true,
    xminorgridvisible = true,
#    yscale = log10,
#    yticks = (10. .^ collect(-2:0), [latexstring("10^{$(i)}") for i in -2:0]),
#    yminorticks = IntervalsBetween(9),
    yminorticksvisible = true,
    yminorgridvisible = true,
)

ferr(x, y) = abs.(x.-y)./y

lines!(ax2, sodf[!, :uvd1]/1e9, ferr(sodf[!, :vismin1], ehdf[!, :vismin1]), linewidth = 2, color = "red", label = "Minor Axis")
lines!(ax2, sodf[!, :uvd1]/1e9, ferr(sodf[!, :vismaj1], ehdf[!, :vismaj1]), linewidth = 2, color = "blue", label = "Major Axis")
axislegend(ax2, position = :lt)

ax3 = Axis(
    fig[1, 2],
    title = L"Sgr A* Dipole Scattering Kernel $\lambda$=3.6 cm",
    xlabel = L"Baseline Length (M$\lambda$)",
    ylabel = "Kernel Amplitude",
#    limits = ((-1,16), (9e-2, 1.2)),
    xticks = LinRange(0, 30, 4),
    xminorticks = IntervalsBetween(10),
    xminorticksvisible = true,
    xminorgridvisible = true,
    yscale = log10,
    yticks = (10. .^ collect(-12:0), [latexstring("10^{$(i)}") for i in -12:0]),
    yminorticks = IntervalsBetween(9),
    yminorticksvisible = true,
    yminorgridvisible = true,
)

lines!(ax3, sodf[!, :uvd2]/1e6, sodf[!, :vismin2], linewidth = 2, color = "red", label = "ScatteringOptics.jl (Minor Axis)")
lines!(ax3, sodf[!, :uvd2]/1e6, sodf[!, :vismaj2], linewidth = 2, color = "blue", label = "ScatteringOptics.jl (Major Axis)")

lines!(ax3, ehdf[!, :uvd2]/1e6, ehdf[!, :vismin2], linewidth = 2, color = "green", linestyle=:dash, label = "eht-imaging (Minor Axis)")
lines!(ax3, ehdf[!, :uvd2]/1e6, ehdf[!, :vismaj2], linewidth = 2, color = "orange", linestyle=:dash, label = "eht-imaging (Major Axis)")
axislegend(ax3, position = :lb)

ax4 = Axis(
    fig[2, 2],
    xlabel = L"Baseline Length (M$\lambda$)",
    ylabel = "Absolute Fractional Error",
#    limits = ((-1,16), nothing),
    xticks = LinRange(0, 30, 4),
    xminorticks = IntervalsBetween(10),
    xminorticksvisible = true,
    xminorgridvisible = true,
#    yscale = log10,
#    yticks = (10. .^ collect(-2:0), [latexstring("10^{$(i)}") for i in -2:0]),
#    yminorticks = IntervalsBetween(9),
    yminorticksvisible = true,
    yminorgridvisible = true,
)

ferr(x, y) = abs.(x.-y)./y

lines!(ax4, sodf[!, :uvd2]/1e6, ferr(sodf[!, :vismin2], ehdf[!, :vismin2]), linewidth = 2, color = "red", label = "Minor Axis")
lines!(ax4, sodf[!, :uvd2]/1e6, ferr(sodf[!, :vismaj2], ehdf[!, :vismaj2]), linewidth = 2, color = "blue", label = "Major Axis")
axislegend(ax4, position = :lt)


save(string("bench_kernel_accuracy.png"), fig)