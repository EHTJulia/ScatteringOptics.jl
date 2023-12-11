`ScatteringOptics.jl` implements a single thin-screen scattering model described in @Johnson_2018 and @Psaltis_2018 that simulates both diffractive and refractive scattering. In many instances, the properties of the interstellar scattering can be well described by a single, thin phase-changing screen $\phi_r(r)$, where $r$ is a transverse coordinate on the screen. The statistical characteristics of scattering can be described by those of the phase screen through its spatial structure function $D_\phi(r)$.

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

`ScatteringOptics.jl` implements three analytic probabilistic models for the phase screen $\phi_r(r)$, named Dipole, Periodic Boxcar, and Von Mises models in @Psaltis_2018, providing the corresponding semi-analytic descriptions of the phase structure function $D_\phi(r)$. The default model is the Dipole model, known to be consistent with multi-frequency measurements of Sgr A* [@Johnson_2018] and being used as the standard model in the Event Horizon Telescope Collaboration [@EHTSgrAPaper2; @EHTSgrAPaper3; @EHTSgrAPaper4].

