```@meta
CurrentModule = ScatteringOptics
```
# Background

## Mathematics
`ScatteringOptics.jl` implements a single thin-screen scattering model (described in  [1] and [2]) that simulates both diffractive and refractive scattering. In many instances, the properties of the interstellar scattering can be well described by a single, thin phase-changing screen $\phi(\vec{r})$, where $\vec{r}$ is a transverse coordinate on the screen. 

#### Spatial Structure Function
The statistical characteristics of scattering can be described by those of the phase screen through its spatial structure function $D_\phi(\vec{r})$. This function measures the second-order changes in the phase, $\phi(\vec{r})$ of two radio waves separated by a transverse distance $\vec{r}$ when they pass through the screen [2]:

$$D_\phi(r) = \langle [\phi(\vec{r}_0+\vec{r})-\phi(\vec{r}_0)]^2 \rangle$$

#### Diffractive Scattering Kernel

Diffractive scattering causes the angular broadening of the source image. 
The diffractively scattered image ${I_{ea}}(\vec{r})$ is mathematically given by the convolution of the source image ${I_{src}}(r)$ with a blurring scattering kernel, ${G}(\vec{r})$, 

$${I_{ea}}(\vec{r}) = {I_{src}}(\vec{r}) * {G}(\vec{r}),$$

where $r$ refers to the two-dimensional phase screen coordinate vector. While the above equation is defined in image space, ScatteringOptics.jl performs scattering in Fourier space, where the kernel can be described analytically. In radio interferometry, each set of measurements, so-called visibilities, obtained with a pair of antennas at different time and frequency segments, samples a Fourier component of the sky image. The source visibilities, $V_{src}(\vec{b})$, are related to the diffractively scattered visibilities, $V_{ea}(\vec{b})$, by

$$V_{ea}(\vec{b}) = V_{src}(\vec{b})\*\text{exp}\left[-\frac{1}{2} D_\phi\left(\frac{\vec{b}}{1+M}\right)\right],$$

in which $\vec{b}$ is the baseline vector between observing stations. The magnification $M=D/R$ is the ratio of earth-screen distance $D$ to screen-source distance $R$. 

#### Refractive Scattering Screen

Refractive scattering further introduces compact substructures on the diffractively-scattered, angular-broadened images. 
The compact substructures arise from phase gradients on the scattering screen $\nabla \phi(\vec{r})$.
The refractively scattered image ${I_{a}}(\vec{r})$ is given by

$${I_{a}}(\vec{r}) \approx {I_{ea}}(\vec{r} + r_F^2 \nabla \phi(\vec{r})),$$

in which the Fresnel scale, $r_F = \sqrt{\frac{DR}{D+R}\frac{\lambda}{2\pi}}$ is dependent on the observing wavelength $\lambda$ [3]. 

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi(\vec{r})$, named Dipole, Periodic Boxcar, and Von Mises models in Psaltis et al. (2018) [2], providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(\vec{r})$. The default model is the Dipole model, known to be consistent with multi-frequency measurements of Sgr A* [1].


## References

[1] M. D. Johnson. Stochastic optics: A scattering mitigation framework for radio interferometric
imaging. The Astrophysical Journal, 833(1):74, dec 2016. DOI: [10.3847/1538-4357/833/1/74](https://iopscience.iop.org/article/10.3847/1538-4357/aadcff).

[2] D. Psaltis, M. Johnson, R. Narayan, L. Medeiros, L. Blackburn, and G. Bower. A model for
anisotropic interstellar scattering and its application to sgr a*, 2018.

[3] Johnson, M. D., & Narayan, R. (2016). The Optics of Refractive Substructure. 826(2), 170. DOI:[10.3847/0004-637X/826/2/170](https://iopscience.iop.org/article/10.3847/0004-637X/826/2/170)
