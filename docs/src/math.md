# Mathematics

`ScatteringOptics.jl` implements a single thin-screen scattering model (described in  [1] and [2]) that simulates both diffractive and refractive scattering. In many instances, the properties of the interstellar scattering can be well described by a single, thin phase-changing screen $\phi_r(r)$, where $r$ is a transverse coordinate on the screen. The statistical characteristics of scattering can be described by those of the phase screen through its spatial structure function $D_\phi(r)$.

Diffractive scattering causes the angular broadening of the source image. 
The diffractively scattered image ${I_{ea}}(r)$ is mathematically given by the convolution of the source image ${I_{src}}(r)$ with a blurring scattering kernel, ${G}(r)$, 

$${I_{ea}}(r) = {I_{src}}(r) * {G}(r),$$

where $r$ refers to the two-dimensional phase screen coordinate vector. In radio interferometry, each set of measurements, so-called visibilities, obtained with a pair of antennas at different time and frequency segments, samples a Fourier component of the sky image. The source visibilities, $V_{src}(b)$, are related to the diffractively scattered visibilities, $V_{ea}(b)$, by,

$$V_{ea}(b) = V_{src}(b)\,\text{exp}\left[-\frac{1}{2} D_\phi\left(\frac{b}{1+M}\right)\right],$$

in which $b$ is the baseline vector between observing stations. The magnification $M=D/R$ is the ratio of earth-screen distance $D$ to screen-source distance $R$. 

Refractive scattering further introduces compact substructures on the diffractively-scattered, angular-broadened images. 
The compact substructures arise from phase gradients on the scattering screen $\nabla \phi_r(r)$.
The refractively scattered image ${I_{a}}(r)$ is given by

$${I_{a}}(r) \approx {I_{ea}}(r) (r + r_F^2 \nabla \phi_r(r)),$$

in which the Fresnel scale, $r_F = \sqrt{\frac{DR}{D+R}\frac{\lambda}{2\pi}}$ is dependent on the observing wavelength $\lambda$ [@Johnson_Narayan_2016]. 

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi_r(r)$, named Dipole, Periodic Boxcar, and Von Mises models in @Psaltis_2018, providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(r)$. The default model is the Dipole model, known to be consistent with multi-frequency measurements of Sgr A* [1].


## References

[1] M. D. Johnson. Stochastic optics: A scattering mitigation framework for radio interferometric
imaging. The Astrophysical Journal, 833(1):74, dec 2016. DOI: [10.3847/1538-4357/833/1/74](https://iopscience.iop.org/article/10.3847/1538-4357/aadcff).

[2] D. Psaltis, M. Johnson, R. Narayan, L. Medeiros, L. Blackburn, and G. Bower. A model for
anisotropic interstellar scattering and its application to sgr a*, 2018.

[3] Johnson, M. D., & Narayan, R. (2016). The Optics of Refractive Substructure. 826(2), 170. DOI:[10.3847/0004-637X/826/2/170](https://iopscience.iop.org/article/10.3847/0004-637X/826/2/170)