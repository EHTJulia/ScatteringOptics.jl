```@meta
CurrentModule = ScatteringOptics
```

# Differentiable refractive scattering

This tutorial demonstrates an inverse-modeling path with a FITS image, a
latent Gaussian phase-screen realization, and a mean-squared-error objective.
The example keeps the image small enough for a CPU differentiation smoke test;
the same code path accepts the FITS image directly.

## Load a known image and make an observation

```@example differentiable_refractive
using ScatteringOptics
using VLBISkyModels
using StableRNGs

im = load_fits(joinpath(@__DIR__, "data", "jason_mad_eofn.fits"), IntensityMap)
sm = ScatteringModel()
rps = refractivephasescreen(sm, im)

rng = StableRNG(123)
z_groundtruth = generate_gaussian_noise(rps; rng=rng)
yobs = scatter_image(rps, im; noise_screen=z_groundtruth)
```

Here `z_groundtruth` is the latent white-noise realization before the phase
screen transform. It is an explicit array input to `phase_screen` and
`scatter_image`, so it is the natural variable for an inverse problem.

## A small CPU objective

For fast differentiation checks, use a small image and screen. This avoids
making compilation and interpolation dominate the demonstration.

```@example differentiable_refractive
im_small = intensitymap(Gaussian(), imagepixels(1.0e-6, 1.0e-6, 8, 8))
rps_small = refractivephasescreen(sm, im_small)
z_true = generate_gaussian_noise(rps_small; rng=StableRNG(7))
yobs_small = scatter_image(rps_small, im_small; noise_screen=z_true)

function mse_from_latent(z, rps, image, target)
    ymodel = scatter_image(rps, image; noise_screen=z)
    residual = parent(ymodel) .- parent(target)
    return sum(abs2, residual) / length(residual)
end

z = generate_gaussian_noise(rps_small; rng=StableRNG(8))
loss_z(z) = mse_from_latent(z, rps_small, im_small, yobs_small)
loss_z(z)
```

The objective is differentiable with respect to `z` at the Julia level. With
Enzyme, request an active scalar return and a duplicated array input:

```julia
using Enzyme
dz = zeros(size(z))
gradient_z = autodiff(Reverse, loss_z, Active, Duplicated(z, dz))
```

This is the supported calling convention for a mutable array input. The
phase-screen-only path produces a finite CPU gradient. The complete image path
currently reaches third-party convolution/interpolation code; on some
Julia/Enzyme combinations it can fail during LLVM lowering rather than return
a gradient. The tutorial intentionally leaves that result visible instead of
silently claiming full backend coverage.

## Differentiating scattering parameters

The differentiable `findkzeta_exact` path is now the default, while the
original solver remains available with `method = :original`. This makes the
implicit angular concentration calculation differentiable in isolation:

```julia
α = 1.7
f(α) = findkzeta_exact(Dipole_KzetaFinder(α, 1.5))
gradient_α = autodiff(Reverse, f, Active(α))
```

For a full scattering-parameter fit, construct a new model from a parameter
vector and evaluate the MSE. The model constructor now uses fixed angular
quadrature, which removes the `QuadGK` closure failure. ForwardDiff agrees
with finite differences for the resulting Fourier-kernel objective, but the
current Enzyme result is still inconsistent with finite differences. Enzyme
and Reactant support for this constructor path therefore remains a validation
boundary:

```julia
function loss_p(p)
    sm_p = DipoleScatteringModel(α=p[1], ϕ0=p[2], r_in=p[3], r_out=p[4])
    rps_p = refractivephasescreen(sm_p, im_small)
    ymodel = scatter_image(rps_p, im_small; noise_screen=z)
    return sum(abs2, parent(ymodel) .- parent(yobs_small)) / length(ymodel)
end
```

Thus the current guarantees are: latent-screen differentiation is exposed and
the kζ solver has a CPU Enzyme check; full-image latent differentiation and
gradients through every scattering-model constructor parameter still require
backend-specific validation of convolution, interpolation, quadrature, and
model reconstruction. No reference-data regeneration is needed for this
tutorial.
