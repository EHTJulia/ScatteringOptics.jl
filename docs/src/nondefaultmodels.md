```@meta
CurrentModule = ScatteringOptics
```

# Use Non-default Models

As noted in [Brief Introduction to Interstellar Scattering](@ref), the default scattering model is the *dipole* model proposed in [JohnsonNarayanOptics2016](@citet). This is well consistent with actual interstellar scattering effects observed for the Galactic Center Sgr A* and other compact sources [JohnsonEtalScattering2018](@cite). Indeed you can confirm by

```@example 1
using ScatteringOptics

ScatteringModel == DipoleScatteringModel
```
**We strongly recommend using the default `ScatteringModel` unless users need to use or try different field wander models.**

Nevertheless, the package implements two other scattering models --- *von Mises* and *periodic Boxcar* models in [PsaltisEtalModel2018](@citet). You can use then by

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
