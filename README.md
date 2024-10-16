# ScatteringOptics
[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://EHTJulia.github.io/ScatteringOptics.jl/stable/)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://EHTJulia.github.io/ScatteringOptics.jl/dev/)
[![Build Status](https://github.com/EHTJulia/ScatteringOptics.jl/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/EHTJulia/ScatteringOptics.jl/actions/workflows/CI.yml?query=branch%3Amain)
[![Code Style: Blue](https://img.shields.io/badge/code%20style-blue-4495d1.svg)](https://github.com/invenia/BlueStyle)
[![ColPrac: Contributor's Guide on Collaborative Practices for Community Packages](https://img.shields.io/badge/ColPrac-Contributor's%20Guide-blueviolet)](https://github.com/SciML/ColPrac)

`ScatteringOptics.jl` is an astronomy software package developed in the Julia programming language for interstellar scintillation observed at radio wavelengths. It implements physical models for the anisotropic scattering of radio waves, which arise from turbulence in the ionized interstellar medium. 

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

## Documentation
The documentation is available [here](https://ehtjulia.github.io/ScatteringOptics.jl).
