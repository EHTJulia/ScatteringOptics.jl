```@meta
CurrentModule = ScatteringOptics
```
# Brief Introduction to interstellar scattering
`ScatteringOptics.jl` implements a single thin-screen intersteller scattering model based on a fast but accurate semi-analytic framework developed in Johnson \& Narayan 2016 [1] and further extended in later work [2-4]. 

## What is the interstellar scattering? Why is it important?
Scintillation is a well-known phenomenon in astronomy. In radio wavelengths, electron density fluctuations in the ionized interstellar plasma cause scattering of radio waves, resulting in the scintillation of compact radio sources in the sky [5, 6]. The interstellar scintillation produces temporal and spectral modulations (i.e., twinkling) in the brightness of objects, as well as distortion of the source images. 

Scattering has become increasingly important in high-angular-resolution studies of compact radio sources at micro-arcsecond scales using very long baseline interferometry (VLBI). 
Notable examples include black hole imaging of the Milky Way's supermassive black hole, Sagittarius A* (Sgr A*), with the Event Horizon Telescope, and studies of extremely high brightness temperature emissions in active galactic nuclei (AGNs) using space VLBI, exemplified by projects like RadioAstron. 
In both scenarios, the observed interferometric data is influenced by both diffractive and refractive scattering effects. 

## Scattering regimes in the scope
The model implemented in `ScatteringOptics.jl` will simulate both *diffractive* and *refractive* scattering in the *average* and *ensemble-average* regimes. Here let us briefly introduce each of scattering regimes and also their averaging regimes. 

The interstellar scattering seen in radio wavelengths is in the *strong scattering limit*, where scattering effects are dominated by phase fluctuations on two widely separated scales: **diffractvive** and **refractive** [5, 6]. 
- **Diffractive scattering** arises from small-scale fluctuations, typically on scales smaller than microarcseconds. Consequently, diffractive effects are quenched for the vast majority of known sources on the sky, and they are typically only seen in extremely compact objects, such as pulsars and fast radio bursts (FRBs). The diffractive scintillation has a coherence timescale of typically only seconds to minutes, and often well time-averaged during the time scales of a majority of astronomical measurements (except for observations of pulsars and FRBs). As a result, typically the effects of the diffractive scattering appear as a angular broadening of the source image.
- **Refractive scattering** arises from large-scale fluctuations, typically on scales of micro to milli-arcseconds depending on the location of the sky and observing frequency. typically days to months. Refractive effects are only quenched for a source that has an angular size larger than those scales. Consequently, they are present in many compact objects such as active galactic nuclei (AGNs). Refractive scintillation is more persistent and has a coherence timescale of days to months. Refractive scattering introduces *refractive substructures* into the observed angular-broadened image.

The late 80's work by Ramesh Narayan and Jeremy J. Goodman [7, 8] showed that there are three distinct averaging regimes for images in the strong-scattering limit.
 - **The snapshot regime** occurs when the timescale of measurements is shorter than the coherence time of the diffractive scattering. The measurements therefore will exhibit both diffractive and refractive scintillation. This regime is not handled by our package.
- **The average regime** occurs when the timescale of measurements is much longer than the coherence time of the diffractive scattering but shorter than the refractive scintillation (often from days to months). In this regime, the diffractive scintillation in measurements is well averaged in time and therefore quentched. Consequently, the measurements in this regime will exhibit only refractive scintillation. A majority of radio astronomy observations of scattered objects is in this regime.
- **The ensemble-average regime** occurs when the timescale of measurments is even longer than the refractive scintillation. At this regime, the measurements will reflect a complete average over a scattering ensemble. Consequently, the scattering effects are deterministic. For instance the scattered image is well described through blurring (or angular broadening) via convolution of the unscattered image with a scattering kernel.

## Scattering Model
In many instances, the properties of the interstellar scattering can be well described by a single, thin phase-changing screen $\phi(\vec{r})$, where $\vec{r}$ refers to the two-dimensional phase screen coordinate vector. The statistical characteristics of scattering can be described by those of the phase screen through its spatial structure function $D_\phi(\vec{r})$. This function measures the second-order changes in the phase, $\phi(\vec{r})$ of two radio waves separated by a transverse distance $\vec{r}$ when they pass through the screen [e.g., 1]:

$$D_\phi(r) = \langle [\phi(\vec{r}_0+\vec{r})-\phi(\vec{r}_0)]^2 \rangle$$

In the average or ensemble-average regimes, diffractive scattering causes the angular broadening of the source image, which is called the "ensamble-average" image. The diffractively scattered (i.e., ensemble-average) image $I_{ea}(\vec{r})$ is mathematically given by the convolution of the source image $I_{src}(r)$ with a blurring scattering kernel, $G(\vec{r})$, 

$$I_{ea}(\vec{r}) = I_{src}(\vec{r}) * G(\vec{r}).$$

While the above equation is defined in image space, ScatteringOptics.jl performs scattering in Fourier space, where the kernel can be described analytically. In radio interferometry, each set of measurements, so-called visibilities, obtained with a pair of antennas at different time and frequency segments, samples a Fourier component of the sky image. The source visibilities, $V_{src}(\vec{b})$, are related to the diffractively scattered (i.e., ensemble-average) visibilities, $V_{ea}(\vec{b})$, by

$$V_{ea}(\vec{b}) = V_{src}(\vec{b}) \exp \left[ -\frac{1}{2} D_\phi \left( \frac{\vec{b}}{1+M} \right) \right],$$

in which $\vec{b}$ is the baseline vector between observing stations. The magnification $M=D/R$ is the ratio of earth-screen distance $D$ to screen-source distance $R$. Here you can see that the convolving kernel of the angular broadening is described by the spatial structure function of the screen phase $D_\phi(\vec{r})$, attributed to a probabilistic model of the phase screen $\phi(\vec{r})$. In general, $D_\phi(\vec{r})$ is chromatic and therefore depends on the observing frequency (or wavelength) --- the kernel size in the image domain is often propotional to the squared observing wavelength $\lambda ^2$.

In the average regime, refractive scattering, on the other hand, further introduces compact substructures on the diffractively-scattered images. The compact substructures arise from phase gradients on the scattering screen $\nabla \phi(\vec{r})$. The refractively scattered image $I_{a}(\vec{r})$ is given by

$$I_{a}(\vec{r}) \approx I_{ea}(\vec{r} + r_F^2 \nabla \phi(\vec{r})),$$

in which the Fresnel scale, $r_F = \sqrt{ \frac{DR}{D+R} \frac{\lambda}{2\pi} }$ is dependent on the observing wavelength $\lambda$ [1, 2]. 

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi(\vec{r})$, named *Dipole*, *Periodic* *Boxcar*, and *Von Mises* models in Psaltis et al. [3], providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(\vec{r})$. The default model is the Dipole model, known to be consistent with multi-frequency measurements of Sgr A* [4].


## References
[1] Johnson, M. D., Narayan, R., 2016, The Astrophysical Journal, 826, 170, DOI: [10.3847/0004-637X/826/2/170](https://doi.org/10.3847/0004-637X/826/2/170) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...826..170J))

[2] Johnson, M. D., 2016, The Astrophysical Journal, 833, 74, DOI: [10.3847/1538-4357/833/1/74](https://doi.org/10.3847/1538-4357/833/1/74) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...833...74J))

[3] Psaltis, D., et al., 2018, arXiv e-prints, arXiv:1805.01242, DOI: [10.48550/arXiv.1805.01242](https://doi.org/10.48550/arXiv.1805.01242) ([ADS](https://ui.adsabs.harvard.edu/abs/2018arXiv180501242P))

[4] Johnson, M. D., et al., 2018, The Astrophysical Journal, 865, 104, DOI: [10.3847/1538-4357/aadcff](https://doi.org/10.3847/1538-4357/aadcff) ([ADS](https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J))

[5] Rickett, B. J., 1990, Annual Review of Astronomy and Astrophysics, 28, 561, DOI: [10.1146/annurev.aa.28.090190.003021](https://doi.org/10.1146/annurev.aa.28.090190.003021) ([ADS)](https://ui.adsabs.harvard.edu/abs/1990ARA&A..28..561R))

[6] Narayan, R., 1992, Philosophical Transactions of the Royal Society of London Series A, 341, 151, DOI: [10.1098/rsta.1992.0090](https://doi.org/10.1098/rsta.1992.0090) ([ADS](https://ui.adsabs.harvard.edu/abs/1992RSPTA.341..151N))

[7] Narayan, R., Goodman, J., 1989, Monthly Notices of the Royal Astronomical Society, 238, 963, DOI: [10.1093/mnras/238.3.963](https://doi.org/10.1093/mnras/238.3.963) ([ADS](https://ui.adsabs.harvard.edu/abs/1989MNRAS.238..963N))

[8] Goodman, J., Narayan, R., 1989, Monthly Notices of the Royal Astronomical Society, 238, 995, DOI: [10.1093/mnras/238.3.995](https://doi.org/10.1093/mnras/238.3.995) ([ADS](https://ui.adsabs.harvard.edu/abs/1989MNRAS.238..995G))
