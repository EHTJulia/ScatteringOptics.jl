```@meta
CurrentModule = ScatteringOptics
```

# ScatteringOptics

[ScatteringOptics](https://github.com/EHTJulia/ScatteringOptics.jl) implements the 'Stochastic Optics' scattering mitigation framework [1] to produce realistic scattering on an input EHT model. The module addressed two distinctive forms of scattering--diffractive blurring and refractive scintillation--independently and then integrates them to output a fully scattered model via the `scatter()` function.

## Diffractive Kernel
Users can instantiate a diffractive scattering kernel model and convolve input images to generate diffractive blurring effects. The module provides three different diffractive scattering kernel models: Dipole, Boxcar, and Von Mises. Users construct a model of choice which can generate a scattering kernel for convolution of the model image.

## Refractive Phase Screen
A `RefractivePhaseScreen` object automatically generates a refractive power law function from the scattering model parameters, to be used in generating a phase screen. The model implements power law noise generation provided by the package [StationaryRandomFields](https://github.com/EHTJulia/StationaryRandomFields.jl).

## References
[1] M. D. Johnson. Stochastic optics: A scattering mitigation framework for radio interferometric
imaging. The Astrophysical Journal, 833(1):74, dec 2016. doi: [10.3847/1538-4357/833/1/74](https://iopscience.iop.org/article/10.3847/1538-4357/aadcff).

```@index
```

```@autodocs
Modules = [ScatteringOptics]
```
