```@meta
CurrentModule = ScatteringOptics
```
# Brief Introduction to Interstellar Scattering

`ScatteringOptics.jl` implements a single thin-screen interstellar scattering model based on a fast yet accurate semi-analytic framework developed by Johnson & Narayan (2016) [1], and further extended in subsequent works [2-4].


## Scattering Regimes in Scope

The model implemented in `ScatteringOptics.jl` simulates both *diffractive* and *refractive* scattering in the *average* and *ensemble-average* regimes. Below is a brief introduction to each scattering regime and their corresponding averaging regimes.

Interstellar scattering observed in radio wavelengths occurs in the *strong scattering limit*, where scattering effects are dominated by phase fluctuations on two distinct scales: **diffractive** and **refractive** [5, 6].
- **Diffractive scattering** arises from small-scale fluctuations, typically on scales smaller than microarcseconds. Diffractive effects are quenched for the vast majority of known sources in the sky and are typically only observed in extremely compact objects, such as pulsars and fast radio bursts (FRBs). Diffractive scintillation has a coherence timescale of seconds to minutes, and is often time-averaged during most astronomical observations (except for pulsars and FRBs). As a result, diffractive scattering typically manifests as angular broadening of the source image.
- **Refractive scattering** arises from larger-scale fluctuations, typically on scales of micro to milliarcseconds, depending on the sky location and observing frequency. Refractive scintillation has a coherence timescale ranging from days to months. Refractive effects are quenched for sources with angular sizes larger than these scales. Consequently, refractive scattering is present in many compact objects, such as active galactic nuclei (AGNs). Refractive scattering introduces *refractive substructures* into the observed angular-broadened image.

In the late 1980s, Ramesh Narayan and Jeremy J. Goodman [7, 8] identified three distinct averaging regimes for images in the strong-scattering limit:
- **The snapshot regime** occurs when the measurement timescale is shorter than the coherence time of the diffractive scattering. In this regime, measurements exhibit both diffractive and refractive scintillation. This regime is ***not*** handled by the package.
- **The average regime** occurs when the measurement timescale is much longer than the coherence time of the diffractive scattering but shorter than the refractive scintillation (typically days to months). In this regime, diffractive scintillation is well-averaged over time and quenched, leaving only refractive scintillation in the measurements. Most radio astronomical observations of scattered objects occur in this regime.
- **The ensemble-average regime** occurs when the measurement timescale exceeds the refractive scintillation timescale. In this regime, the measurements reflect a complete average over the scattering ensemble, and the scattering effects become deterministic. For example, the scattered image is well described by blurring (or angular broadening) through the convolution of the unscattered image with a scattering kernel.


## Scattering Model
In many cases, the properties of interstellar scattering can be effectively described by a single, thin phase-changing screen, denoted as $\phi(\vec{r})$, where $\vec{r}$ represents the two-dimensional coordinate vector on the phase screen [5, 6]. The statistical characteristics of the scattering are captured by the spatial structure function $D_\phi(\vec{r})$, which describes the second-order changes in phase, $\phi(\vec{r})$, between two radio waves separated by a transverse distance $\vec{r}$ as they pass through the screen [e.g., 1].

```math
D_\phi(r) = \langle [\phi(\vec{r}_0+\vec{r})-\phi(\vec{r}_0)]^2 \rangle
```

In the average or ensemble-average regimes, diffractive scattering leads to the angular broadening of the source image, referred to as the "ensemble-average" image. 
The diffractively scattered (i.e., ensemble-average) image, $I_{ea}(\vec{r})$, is mathematically expressed as the convolution of the source image $I_{src}(\vec{r})$ with a blurring scattering kernel, $G(\vec{r})$.

```math
I_{ea}(\vec{r}) = I_{src}(\vec{r}) * G(\vec{r}).
```

While the previous equation is defined in image space, `ScatteringOptics.jl` performs scattering in Fourier space, where the kernel can be described analytically. In radio interferometry, each set of measurements—called visibilities ($V_{obs}(\vec{b})$) obtained by a pair of antennas at different times and frequency segments, samples a Fourier component of the sky image $I_{sky}(\vec{r})$: 

```math
V_{obs}(\vec{b}) = \int \int I_{sky}(\vec{r}) \exp(2\pi \frac{\vec{r}\cdot\vec{b}}{D\lambda}) \, d\vec{r},
```

where $D$ is the Earth-screen distance and $\lambda$ is the observing wavelength.

Using this measurement equation, the source visibilities, $V_{src}(\vec{b})$, are related to the diffractively scattered (i.e., ensemble-average) visibilities, $V_{ea}(\vec{b})$, by the following relation:

```math
V_{ea}(\vec{b}) = V_{src}(\vec{b}) \exp \left[ -\frac{1}{2} D_\phi \left( \frac{\vec{b}}{1+M} \right) \right],
```

in which $\vec{b}$ represents the baseline vector between observing stations. The magnification, $M = D / R$, is the ratio of the Earth-screen distance, $D$, to the screen-source distance, $R$. Since the Fourier transform of $I_{src}(\vec{r}) * G(\vec{r})$ is given by $V_{src}(\vec{r}) F[G(\vec{r})]$, you can see that the second exponential term corresponds to the Fourier coefficient of the convolving scattering kernel $G(\vec{r})$. 

The convolving kernel responsible for the angular broadening is described by the spatial structure function of the phase screen, $D_\phi(\vec{r})$, which is based on a probabilistic model of the phase screen, $\phi(\vec{r})$. In general, $D_\phi(\vec{r})$ is chromatic, meaning it depends on the observing frequency (or wavelength)—the kernel size in the image domain is typically proportional to the square of the observing wavelength, $\lambda^2$.

In the average regime, refractive scattering introduces compact substructures into the diffractively scattered images. These compact substructures arise from phase gradients on the scattering screen, $\nabla \phi(\vec{r})$. The refractively scattered image, $I_{a}(\vec{r})$, is then given by:


```math
I_{a}(\vec{r}) \approx I_{ea}(\vec{r} + r_F^2 \nabla \phi(\vec{r})),
```

in which the Fresnel scale, $r_F = \sqrt{ \frac{DR}{D+R} \frac{\lambda}{2\pi} }$ is dependent on the observing wavelength $\lambda$ [1, 2]. The refractive substructures on the image have zero means --- the ensamble average of $I_{a}$ will be the angular-broadened (or diffractively-scattered) image $I_{ea}$.

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi(\vec{r})$, named *Dipole*, *Periodic* *Boxcar*, and *Von Mises* models in Psaltis et al. [3], providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(\vec{r})$. From $D_\phi(\vec{r})$, the package computes the scattering kernel and resultant ensemble-average image. The fully scattered image with refractive substractures will further use a generative model to produce a random realization of $\phi(\vec{r})$, which is based on a stationary Gaussian random field following the power spectrum of the probabilistic model in Fourier domain. 

The package uses the Dipole model as default, which was originally proposed by Johnson & Narayan et al. [1]. The Dipole model is known to be consistent with multi-frequency measurements of Sgr A* [4].


## References
[1] Johnson, M. D., Narayan, R., 2016, The Astrophysical Journal, 826, 170, DOI: [10.3847/0004-637X/826/2/170](https://doi.org/10.3847/0004-637X/826/2/170) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...826..170J))

[2] Johnson, M. D., 2016, The Astrophysical Journal, 833, 74, DOI: [10.3847/1538-4357/833/1/74](https://doi.org/10.3847/1538-4357/833/1/74) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...833...74J))

[3] Psaltis, D., et al., 2018, arXiv e-prints, arXiv:1805.01242, DOI: [10.48550/arXiv.1805.01242](https://doi.org/10.48550/arXiv.1805.01242) ([ADS](https://ui.adsabs.harvard.edu/abs/2018arXiv180501242P))

[4] Johnson, M. D., et al., 2018, The Astrophysical Journal, 865, 104, DOI: [10.3847/1538-4357/aadcff](https://doi.org/10.3847/1538-4357/aadcff) ([ADS](https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J))

[5] Rickett, B. J., 1990, Annual Review of Astronomy and Astrophysics, 28, 561, DOI: [10.1146/annurev.aa.28.090190.003021](https://doi.org/10.1146/annurev.aa.28.090190.003021) ([ADS)](https://ui.adsabs.harvard.edu/abs/1990ARA&A..28..561R))

[6] Narayan, R., 1992, Philosophical Transactions of the Royal Society of London Series A, 341, 151, DOI: [10.1098/rsta.1992.0090](https://doi.org/10.1098/rsta.1992.0090) ([ADS](https://ui.adsabs.harvard.edu/abs/1992RSPTA.341..151N))

[7] Narayan, R., Goodman, J., 1989, Monthly Notices of the Royal Astronomical Society, 238, 963, DOI: [10.1093/mnras/238.3.963](https://doi.org/10.1093/mnras/238.3.963) ([ADS](https://ui.adsabs.harvard.edu/abs/1989MNRAS.238..963N))

[8] Goodman, J., Narayan, R., 1989, Monthly Notices of the Royal Astronomical Society, 238, 995, DOI: [10.1093/mnras/238.3.995](https://doi.org/10.1093/mnras/238.3.995) ([ADS](https://ui.adsabs.harvard.edu/abs/1989MNRAS.238..995G))
