@info "Loading results form eht-imaging"
ehdf = DataFrame(CSV.File("./eh_compute_kernel.csv"))
sodf = DataFrame(CSV.File("./so_compute_kernel.csv"))

@info "Plotting Results"
# plotting
modelnames = ["Dipole", "Von Mises", "Periodic Boxcar"]
dfcols = [:dipole, :vonMises, :boxcar]
lablenames = ["dp", "vm", "bc"]
for i=1:3
    modelname=modelnames[i]
    labelname=lablenames[i]

    fig = Figure()
    
    ax = Axis(
        fig[1, 1],
        title = string("Visibility computation time for varying data-set size ($(modelname) Model)"),
        xlabel = "Sample size",
        ylabel = "Computation Time (s)",
        xscale = log10,
        yscale = log10
    )
    
    lines!(ax, ehdf[!, :samples], ehdf[!, ehdfcols[i]], linewidth = 2, color = "purple", label = "ScatteringOptics.jl")
    scatter!(ax, ehdf[!, :samples], ehdf[!, ehdfcols[i]], color = "purple")

    lines!(ax, ehdf[!, :samples], ehdf[!, ehdfcols[i]], linewidth = 2, color = "orange", label = "eht-imaging (Python)")
    scatter!(ax, ehdf[!, :samples], ehdf[!, ehdfcols[i]], color = "orange")
    
    axislegend(ax, position = :rb)

    save(string("kernel_", labelname, ".png"), fig)
end