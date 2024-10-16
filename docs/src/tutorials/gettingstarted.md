```@meta
CurrentModule = ScatteringOptics
```

# Getting Started
`ScatteringOptics.jl` is designed as a package inside the ecosystem of [`Comrade.jl`](https://github.com/ptiede/Comrade.jl). The scattering model in the package can scatter any sky model types from `Comrade.jl`.

## Loading your image
Here, we use an example image in [`eht-imaging`](https://github.com/achael/eht-imaging). Data can be downloaded from [here](data/jason_mad_eofn.fits). This is a general relativistic magnetohydrodynamic (GRMHD) model of the magnetic arrestic disk originally from [Dexter et al. 2020](https://ui.adsabs.harvard.edu/abs/2020MNRAS.494.4168D/abstract).

```@example 1
using CairoMakie
# This is the base package for the Skymodel of the Comrade.jl ecosystem
using VLBISkyModels
# Alternatively, you can import Comrade.jl instead. Either works.
# using Comrade

# Load a model image FITS file
im = load_fits("data/jason_mad_eofn.fits", IntensityMap)

# Plot source image
imageviz(im, size=(600, 500), colormap=:afmhot)
```

You can instantiate your scattering model with `ScatteringModel()`. If nothing is specified, the model will use the best-fit parameter set for Sgr A* in [Johnson et al. 2018](https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J/abstract). 
```@example 1
using ScatteringOptics

# initialize the scattering model
sm = ScatteringModel()
```
You can change the parameters if you want to simulate a different scattering screen. See [ScatteringOptics.DipoleScatteringModel](@ref) for arguments. 

## Simulate diffractive scattering 
As explained in [Brief Introduction to Interstellar Scattering](@ref), diffractive scattering will cause angular broaderning of the resultant image, which is described by the convolution of the source image with a scattering kernel. `ScatteringOptics.jl` implements a `Comrade.jl`'s skymodel of the scattering kernel. You can generate it by 

```@example 1
# Frequency of the image
νref = metadata(im).frequency
print("Frequency of the image: ", νref/1e9," GHz")

# Create kernel from scattering model
skm = kernelmodel(sm, νref=νref)
```

`skm` will be a subtype of `ComradeBase.AbstractModel`, and you can use any methods defined for sky models in `Comrade.jl''s ecosystem. For instance, you can compute the ensemble-average (or diffractively scattered) image using the `convolve` method,

```@example 1
# scatter the image
im_ea = convolve(im, skm)

# Plot source image
imageviz(im_ea, size=(600, 500), colormap=:afmhot)
```

You can also plot the scattering kernel. For instance in the image domain,

```@example 1
# make an image model of the scattering kernel
im_skm = intensitymap(skm, imagepixels(μas2rad(50.0), μas2rad(50.0), 256, 256))

# Plot source image
imageviz(im_skm, size=(600, 500), colormap=:afmhot)
```

You can compute the kernel visibility using `visibility_point` method. For instance,

```@example 1
# computing kernels from 0 to 10 Glambda along RA
u = LinRange(0,10e9,1000)
vis = [visibility_point(skm, (U=u, V=0, Fr=νref)) for u=u]

# Plot source image
f = Figure() 
ax = Axis(f[1, 1],
    xlabel="Baseline Length (Gλ)",
    ylabel="Kernel Amplitudes",
)
plot!(ax, u/1e9, abs.(vis))
f
```

## Simulating Refractive Scattering
Otherwise, the scattering kernel `skm` is not required to obtain a fully scattered image. A `RefractivePhaseScreen` type object may be initialized from the `ScatteringModel` and image dimensions. 

```@example 1
# Create a refractive phase screen model from scattering model and image
rps = refractivephasescreen(sm, im) 

# Alternatively, you may make the screen model for arbitral grid
# rps = RefractivePhaseScreen(sm, Nx, Ny, dx_rad, dy_rad) 

# Generate a phase screen. For this particular tutorial we will use StableRNG for the reproducibility.
using StableRNGs 
rng = StableRNG(123)
noise_screen = generate_gaussian_noise(rps; rng=rng)

# Produce scattered image with observing wavelength .13 cm
im_a = image_scatter(rps, im, 0.13, νref=230e9; noise_screen=noise_screen)

# Plot source image
imageviz(im_a, size=(600, 500), colormap=:afmhot)
```
If you completely randomize the process, you can skip `noise_screen`. The screen will be automatically generated inside `image_scatter` method.