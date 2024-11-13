using Pkg
Pkg.activate(@__DIR__)
Pkg.instantiate()
Pkg.update()

using ScatteringOptics
using StableRNGs
using VLBISkyModels
using JLD2

# scattering kernel model labels
sm_labels = ["DP", "VM", "BC"]
kernel_labels = ["Apprx", "Exact"]

# generate scattering models
sm_def = ScatteringModel()
sm_d = DipoleScatteringModel()
sm_v = vonMisesScatteringModel()
sm_b = PeriodicBoxCarScatteringModel()
@assert sm_def == sm_d
sm_list = [sm_d, sm_v, sm_b]

# load scatter_image
im = load_fits("./jason_mad_eofn.fits", IntensityMap)

# Frequency of the image
νref = metadata(im).frequency
@info "Frequency of the image: ", νref/1e9, " GHz"

# Geometric models
g = stretched(Gaussian(), μas2rad(5.0), μas2rad(5.0))
img = intensitymap(g, imagepixels(μas2rad(200.0), μas2rad(200.0), 256, 256))

# generate uv points
stablerng = StableRNG(123)
u_list = rand(stablerng, 100) .* 1e10
v_list = rand(stablerng, 100) .* 1e10

for i_sm=1:3
    sm = sm_list[i_sm]
    smlabe = sm_labels[i_sm]
    
    for i_kernel=1:2
        use_approx = i_kernel == 1
        kernellabel = kernel_labels[i_kernel]

        @info "Scattering model: $(smlabe), Kernel: $(kernellabel)"
        
        # create scattering kernel model
        kernel = kernelmodel(sm; νref=νref, use_approx=use_approx)
        
        # compute kernel amps
        kernelamps = map(uv -> visibility_point(kernel, (U=uv[1], V=uv[2])), zip(u_list, v_list))

        # generate emnsemble average image
        im_ea = ensembleaverage(sm, im; use_approx=use_approx)
        g_ea = ensembleaverage(sm, g, νref; use_approx=use_approx)
        img_ea = intensitymap(g_ea, imagepixels(μas2rad(200.0), μas2rad(200.0), 256, 256))

        # generate average image
        stablerng = StableRNG(1234)
        im_a = scatter_image(sm, im; rng=stablerng, use_approx=use_approx)
        stablerng = StableRNG(1234)
        img_a = scatter_image(sm, img; νref=νref, rng=stablerng, use_approx=use_approx)

        # save the results
        filename = "$(smlabe)_$(kernellabel).jld2"
        save(filename, Dict(
            "kernelamps" => kernelamps,
            "im_ea" => im_ea,
            "g_ea" => g_ea,
            "img_ea" => img_ea,
            "im_a" => im_a,
            "img_a" => img_a
        ))
    end
end