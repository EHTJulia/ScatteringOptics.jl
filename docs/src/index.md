```@meta
CurrentModule = ScatteringOptics
```
# ScatteringOptics.jl
[`ScatteringOptics.jl`](https://github.com/EHTJulia/ScatteringOptics.jl) is an astronomy software package developed in the Julia programming language for interstellar scintillation observed at radio wavelengths. It implements physical models for the anisotropic scattering of radio waves, which arise from turbulence in the ionized interstellar medium. 

This toolkit is aiming to provide capabilities of simulating and modeling the temporal, spatial, and spectral effects of interstellar scintillation primarily in the strong scattering regime, taking advantage of Julia's speed and composability. 
The package is designed to work with sky models and interferometric data types from the advanced Bayesian radio interferometric modeling package [`Comrade.jl`](https://github.com/ptiede/Comrade.jl).

The package provides essential functionalities for modeling, analyzing, and interpreting the images of the Galactic Center's supermassive black hole, Sagittarius A*, especially with the Event Horizon Telescope, and also the images of extremely high brightness temperature emissions in active galactic nuclei using space very long baseline interferometry.

## Installation
The package is registered in the Julia standard repository, and installable through the standard ways by
```julia
using Pkg
Pkg.add("ScatteringOptics")
```
or
```julia
]add ScatteringOptics
```