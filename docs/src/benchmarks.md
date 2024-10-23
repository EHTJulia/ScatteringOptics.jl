```@meta
CurrentModule = ScatteringOptics
```
# Benchmarks
The Julia implementation of the EHT scattering framework takes advantage of Julia's fast Auto-Differentiation (AD) capabilities, which accelerate the simulation of interstellar scattering. As the overall imaging process can consist of thousands to tens of thousands of iterations in order to optimize scattering parameters and the final output image, even a small imprdovements in simulation speed can result in significant cuts in runtime. It is then crucial that our implementation performs faster than the existing python framework, `eht-imaging`, and produces consistent results. Here, we present benchmarks between the two implementations.

## Speed

With Julia's speed improvements, the `ScatteringOptics.jl` scattering kernel loads 100 times faster than the `eht-imaging` kernel. The scattering kernel may be called upon to compute visibilities for a given sample of Fourier space points. In these computations, `ScatteringOptics.jl` also exhibits speed improvements up to 100 times over the three included models (Dipole, Boxcar, and Von Mises; see [Use Non-default Models](@ref) for more info) and varying observing wavelengths. These computation runtimes are compared over a range of sample in the plots below. 

![fig](images/speed_dipole.png) ![fig](images/speed_boxcar.png) ![fig](images/speed_vonmises.png)

With this significant speed up, the Julia implementation allows for the joint modeling of scattering parameters and reconstructed images in self-consistent way. 

## Consistency

Our scattering kernel produces visibilities that are consistent with those computed by `eht-imaging` across all 3 kernel models as well as the range of standard observing wavelengths in radio astronomy. Below, we demonstrate this by plotting the Dipole kernel over the Fourier space major and minor axis for both the Julia and Python implementations in one plot per observing wavelength. The lines completely overlap, indicating complete consistency in results. All fractional errors between the two implementations range on the order of $10^{-6}$ and $10^{-7}$ (Figure \ref{kernelerrors}), which is well under scattering kernel uncertainty limits.

![fig](images/kernel87.png) ![fig](images/kernel36.png) 

