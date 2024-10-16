```@meta
CurrentModule = ScatteringOptics
```
# Introduction
[`ScatteringOptics.jl`](https://github.com/EHTJulia/ScatteringOptics.jl) is an astronomy software package developed in the Julia programming language for interstellar scintillation observed at radio wavelengths. It implements physical models for the anisotropic scattering of radio waves, which arise from turbulence in the ionized interstellar medium. 

This toolkit is aiming to provide capabilities of simulating and modeling the temporal, spatial, and spectral effects of interstellar scintillation primarily in the strong scattering regime, taking advantage of Julia's speed and composability. 
The package is designed to work with sky models and interferometric data types from the advanced Bayesian radio interferometric modeling package [`Comrade.jl`](https://github.com/ptiede/Comrade.jl).

The package provides essential functionalities for modeling, analyzing, and interpreting the images of the Galactic Center's supermassive black hole, Sagittarius A*, especially with the Event Horizon Telescope, and also the images of extremely high brightness temperature emissions in active galactic nuclei using space very long baseline interferometry.

## What are interstellar scattering and scintillation? Why are they important?
Scintillation is a well-known phenomenon in astronomy. Stars appear to twinkle in visible light due to the scattering of their light by the Earth's atmosphere. In radio wavelengths, fluctuations in the electron density of the ionized interstellar plasma cause scattering of radio waves, resulting in the scintillation of compact radio sources in the sky. These phenomena are referred to as *interstellar scattering* and *scintillation*, respectively. Interstellar scintillation produces temporal and spectral modulations (i.e., twinkling) in the brightness of objects, as well as distortion of their images.

Scattering has become increasingly important in high-angular-resolution studies of compact radio sources at micro-arcsecond scales using very long baseline interferometry (VLBI). Notable examples include the black hole imaging of the supermassive black hole, Sagittarius A* (Sgr A*), at the center of the Milky Way with the Event Horizon Telescope, and studies of extremely high brightness temperature emissions in active galactic nuclei (AGNs) using space VLBI, exemplified by projects like RadioAstron. 
In both scenarios, the observed interferometric data are influenced by both diffractive and refractive scattering effects.

For a more detailed description of the scattering models implemented in this package, see [Brief Introduction to Interstellar Scattering](@ref).

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