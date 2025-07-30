```@meta
CurrentModule = ScatteringOptics
```
# Brief Introduction to Interstellar Scattering

`ScatteringOptics.jl` implements a single thin-screen interstellar scattering model based on a fast yet accurate semi-analytic framework developed by [JohnsonNarayanOptics2016](@citet), and further extended in subsequent works [JohnsonStochastic2016, PsaltisEtalModel2018, JohnsonEtalScattering2018](@cite).


## Scattering Regimes in Scope

The model implemented in `ScatteringOptics.jl` simulates both *diffractive* and *refractive* scattering in the *average* and *ensemble-average* regimes. Below is a brief introduction to each scattering regime and their corresponding averaging regimes.

Interstellar scattering observed in radio wavelengths occurs in the *strong scattering limit*, where scattering effects are dominated by phase fluctuations on two distinct scales: **diffractive** and **refractive** [RickettRadio1990, NarayanPhysics1992](@cite).
- **Diffractive scattering** arises from small-scale fluctuations, typically on scales smaller than microarcseconds. Diffractive effects are quenched for the vast majority of known sources in the sky and are typically only observed in extremely compact objects, such as pulsars and fast radio bursts (FRBs). Diffractive scintillation has a coherence timescale of seconds to minutes, and is often time-averaged during most astronomical observations (except for pulsars and FRBs). As a result, diffractive scattering typically manifests as angular broadening of the source image.
- **Refractive scattering** arises from larger-scale fluctuations, typically on scales of micro to milliarcseconds, depending on the sky location and observing frequency. Refractive scintillation has a coherence timescale ranging from days to months. Refractive effects are quenched for sources with angular sizes larger than these scales. Consequently, refractive scattering is present in many compact objects, such as active galactic nuclei (AGNs). Refractive scattering introduces *refractive substructures* into the observed angular-broadened image.

In the late 1980s, Ramesh Narayan and Jeremy J. Goodman [NarayanGoodmanShape1989, GoodmanNaryanShape1989](@cite) identified three distinct averaging regimes for images in the strong-scattering limit:
- **The snapshot regime** occurs when the measurement timescale is shorter than the coherence time of the diffractive scattering. In this regime, measurements exhibit both diffractive and refractive scintillation. This regime is ***not*** handled by the package.
- **The average regime** occurs when the measurement timescale is much longer than the coherence time of the diffractive scattering but shorter than the refractive scintillation (typically days to months). In this regime, diffractive scintillation is well-averaged over time and quenched, leaving only refractive scintillation in the measurements. Most radio astronomical observations of scattered objects occur in this regime.
- **The ensemble-average regime** occurs when the measurement timescale exceeds the refractive scintillation timescale. In this regime, the measurements reflect a complete average over the scattering ensemble, and the scattering effects become deterministic. For example, the scattered image is well described by blurring (or angular broadening) through the convolution of the unscattered image with a scattering kernel.


## Scattering Model
In many cases, the properties of interstellar scattering can be effectively described by a single, thin phase-changing screen, denoted as $\phi(\vec{r})$, where $\vec{r}$ represents the two-dimensional coordinate vector on the phase screen [RickettRadio1990, NarayanPhysics1992](@cite). The statistical characteristics of the scattering are captured by the spatial structure function $D_\phi(\vec{r})$, which describes the second-order changes in phase, $\phi(\vec{r})$, between two radio waves separated by a transverse distance $\vec{r}$ as they pass through the screen [e.g., 1].

```math
D_\phi(r) = \langle [\phi(\vec{r}_0+\vec{r})-\phi(\vec{r}_0)]^2 \rangle
```

In the average or ensemble-average regimes, diffractive scattering leads to the angular broadening of the source image, referred to as the "ensemble-average" image.
The diffractively scattered (i.e., ensemble-average) image, $I_{ea}(\vec{r})$, is mathematically expressed as the convolution of the source image $I_\text{src}(\vec{r})$ with a blurring scattering kernel, $G(\vec{r})$.

```math
I_{ea}(\vec{r}) = I_\text{src}(\vec{r}) * G(\vec{r}).
```

While the previous equation is defined in image space, `ScatteringOptics.jl` performs scattering in Fourier space, where the kernel can be described analytically. In radio interferometry, each set of measurements—called visibilities ($V_\text{obs}(\vec{b})$) obtained by a pair of antennas at different times and frequency segments, samples a Fourier component of the sky image $I_\text{sky}(\vec{r})$:

```math
V_\text{obs}(\vec{b}) = \iint I_\text{sky}(\vec{r}) \exp\left(2\pi \frac{\vec{r}\cdot\vec{b}}{D\lambda}\right) \, d\vec{r},
```

where $D$ is the Earth-screen distance and $\lambda$ is the observing wavelength.

Using this measurement equation, the source visibilities, $V_{src}(\vec{b})$, are related to the diffractively scattered (i.e., ensemble-average) visibilities, $V_{ea}(\vec{b})$, by the following relation:

```math
V_{ea}(\vec{b}) = V_{src}(\vec{b}) \exp \left[ -\frac{1}{2} D_\phi \left( \frac{\vec{b}}{1+M} \right) \right],
```

in which $\vec{b}$ represents the baseline vector between observing stations. The magnification, $M = D / R$, is the ratio of the Earth-screen distance, $D$, to the screen-source distance, $R$. Since the Fourier transform of $I\text_{src}(\vec{r}) * G(\vec{r})$ is given by $V_\text{src}(\vec{r}) F[G(\vec{r})]$, you can see that the second exponential term corresponds to the Fourier coefficient of the convolving scattering kernel $G(\vec{r})$.

The convolving kernel responsible for the angular broadening is described by the spatial structure function of the phase screen, $D_\phi(\vec{r})$, which is based on a probabilistic model of the phase screen, $\phi(\vec{r})$. In general, $D_\phi(\vec{r})$ is chromatic, meaning it depends on the observing frequency (or wavelength)—the kernel size in the image domain is typically proportional to the square of the observing wavelength, $\lambda^2$.

In the average regime, refractive scattering introduces compact substructures into the diffractively scattered images. These compact substructures arise from phase gradients on the scattering screen, $\nabla \phi(\vec{r})$. The refractively scattered image, $I_{a}(\vec{r})$, is then given by:


```math
I_{a}(\vec{r}) \approx I_{ea}(\vec{r} + r_F^2 \nabla \phi(\vec{r})),
```

in which the Fresnel scale, $r_F = \sqrt{ \frac{DR}{D+R} \frac{\lambda}{2\pi} }$ is dependent on the observing wavelength $\lambda$ [JohnsonNarayanOptics2016, JohnsonStochastic2016](@cite). The refractive substructures on the image have zero means --- the ensamble average of $I_{a}$ will be the angular-broadened (or diffractively-scattered) image $I_{ea}$.

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi(\vec{r})$, named *Dipole*, *Periodic* *Boxcar*, and *Von Mises* models in [PsaltisEtalModel2018](@citet), providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(\vec{r})$. From $D_\phi(\vec{r})$, the package computes the scattering kernel and resultant ensemble-average image. The fully scattered image with refractive substractures will further use a generative model to produce a random realization of $\phi(\vec{r})$, which is based on a stationary Gaussian random field following the power spectrum of the probabilistic model in Fourier domain.

The package uses the Dipole model as default, which was originally proposed by [JohnsonNarayanOptics2016](@citet). The Dipole model is known to be consistent with multi-frequency measurements of Sgr A* [JohnsonEtalScattering2018](@cite).
