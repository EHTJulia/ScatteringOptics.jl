```@meta
CurrentModule = ScatteringOptics
```

# Use Non-default Models

As noted in [Brief Introduction to Interstellar Scattering](@ref), the default scattering model is the *dipole* model proposed in Johnson & Narayan 2016 ([1]). This is well consistent with actual interstellar scattering effects observed for the Galactic Center Sgr A* and other compact sources ([2]). Indeed you can confirm by

```@example 1
using ScatteringOptics

ScatteringModel == DipoleScatteringModel
```
**We strongly recommend using the default `ScatteringModel` unless users need to use or try different field wander models.**

Nevertheless, the package implements two other scattering models --- *von Mises* and *periodic Boxcar* models in Psaltis et al. [3]. You can use then by

:::tabs

== Dipole Model (Default)

```@example 1
sm = DipoleScatteringModel()
```

== von Mises Model

```@example 1
vmsm = vonMisesScatteringModel()
```

== Periodic Boxcar Model

```@example 1
pbsm = PeriodicBoxCarScatteringModel()
```

:::

Users also can define a custom scattering model. Please see [Define Your Own Scattering Model](@ref).

## References
[1] Johnson, M. D., Narayan, R., 2016, The Astrophysical Journal, 826, 170, DOI: [10.3847/0004-637X/826/2/170](https://doi.org/10.3847/0004-637X/826/2/170) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...826..170J))

[2] Johnson, M. D., et al., 2018, The Astrophysical Journal, 865, 104, DOI: [10.3847/1538-4357/aadcff](https://doi.org/10.3847/1538-4357/aadcff) ([ADS](https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J))

[3] Psaltis, D., et al., 2018, arXiv e-prints, arXiv:1805.01242, DOI: [10.48550/arXiv.1805.01242](https://doi.org/10.48550/arXiv.1805.01242) ([ADS](https://ui.adsabs.harvard.edu/abs/2018arXiv180501242P))
