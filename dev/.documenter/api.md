


# ScateringOptics.jl API {#ScateringOptics.jl-API}

## Index
- [`ScatteringOptics.Params_Johnson2018`](#ScatteringOptics.Params_Johnson2018)
- [`ScatteringOptics.AbstractKzetaFinder`](#ScatteringOptics.AbstractKzetaFinder)
- [`ScatteringOptics.AbstractScatteringKernel`](#ScatteringOptics.AbstractScatteringKernel)
- [`ScatteringOptics.AbstractScatteringModel`](#ScatteringOptics.AbstractScatteringModel)
- [`ScatteringOptics.ApproximatedScatteringKernel`](#ScatteringOptics.ApproximatedScatteringKernel)
- [`ScatteringOptics.DipoleScatteringModel`](#ScatteringOptics.DipoleScatteringModel)
- [`ScatteringOptics.Dipole_KzetaFinder`](#ScatteringOptics.Dipole_KzetaFinder)
- [`ScatteringOptics.ExactScatteringKernel`](#ScatteringOptics.ExactScatteringKernel)
- [`ScatteringOptics.PeriodicBoxCarScatteringModel`](#ScatteringOptics.PeriodicBoxCarScatteringModel)
- [`ScatteringOptics.PeriodicBoxCar_KzetaFinder`](#ScatteringOptics.PeriodicBoxCar_KzetaFinder)
- [`ScatteringOptics.PhaseScreenPowerLaw`](#ScatteringOptics.PhaseScreenPowerLaw)
- [`ScatteringOptics.RefractivePhaseScreen`](#ScatteringOptics.RefractivePhaseScreen)
- [`ScatteringOptics.vonMisesScatteringModel`](#ScatteringOptics.vonMisesScatteringModel)
- [`ScatteringOptics.vonMises_KzetaFinder`](#ScatteringOptics.vonMises_KzetaFinder)
- [`ScatteringOptics.Dϕ_approx`](#ScatteringOptics.Dϕ_approx-Tuple{AbstractScatteringModel,%20Number,%20Number,%20Number})
- [`ScatteringOptics.Dϕ_exact`](#ScatteringOptics.Dϕ_exact-Tuple{AbstractScatteringModel,%20Number,%20Number,%20Number})
- [`ScatteringOptics.calc_Dmaj`](#ScatteringOptics.calc_Dmaj-Tuple{AbstractScatteringModel,%20Number,%20Number})
- [`ScatteringOptics.calc_Dmin`](#ScatteringOptics.calc_Dmin-Tuple{AbstractScatteringModel,%20Number,%20Number})
- [`ScatteringOptics.dDϕ_dz`](#ScatteringOptics.dDϕ_dz-Tuple{AbstractScatteringModel,%20Number,%20Number,%20Number,%20Any})
- [`ScatteringOptics.ensembleaverage`](#ScatteringOptics.ensembleaverage)
- [`ScatteringOptics.ensembleaverage`](#ScatteringOptics.ensembleaverage-Tuple{AbstractScatteringModel,%20ComradeBase.IntensityMap})
- [`ScatteringOptics.findkzeta_exact`](#ScatteringOptics.findkzeta_exact-Tuple{ScatteringOptics.AbstractKzetaFinder})
- [`ScatteringOptics.get_rF`](#ScatteringOptics.get_rF-Tuple{AbstractPhaseScreen,%20Number})
- [`ScatteringOptics.kernelmodel`](#ScatteringOptics.kernelmodel-Tuple{AbstractScatteringModel})
- [`ScatteringOptics.kzetafinder_equation`](#ScatteringOptics.kzetafinder_equation-Tuple{Any,%20ScatteringOptics.AbstractKzetaFinder})
- [`ScatteringOptics.phase_screen`](#ScatteringOptics.phase_screen-Tuple{AbstractPhaseScreen,%20Number})
- [`ScatteringOptics.refractivephasescreen`](#ScatteringOptics.refractivephasescreen-Union{Tuple{T},%20Tuple{S},%20Tuple{S,%20ComradeBase.IntensityMap},%20Tuple{S,%20ComradeBase.IntensityMap,%20T},%20Tuple{S,%20ComradeBase.IntensityMap,%20T,%20T}}%20where%20{S,%20T})
- [`ScatteringOptics.scatter_image`](#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen,%20ComradeBase.IntensityMap})
- [`ScatteringOptics.scatter_image`](#ScatteringOptics.scatter_image-Tuple{AbstractScatteringModel,%20ComradeBase.IntensityMap})
- [`ScatteringOptics.visibility_point_approx`](#ScatteringOptics.visibility_point_approx-Tuple{AbstractScatteringModel,%20Number,%20Number,%20Number})
- [`ScatteringOptics.visibility_point_exact`](#ScatteringOptics.visibility_point_exact-Tuple{AbstractScatteringModel,%20Number,%20Number,%20Number})
- [`ScatteringOptics.wrapped_grad`](#ScatteringOptics.wrapped_grad-Tuple{Any,%20Any,%20Any})


## Docstrings
<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.Params_Johnson2018' href='#ScatteringOptics.Params_Johnson2018'><span class="jlbinding">ScatteringOptics.Params_Johnson2018</span></a> <Badge type="info" class="jlObjectType jlConstant" text="Constant" /></summary>



Best-fit parameters of the dipole scattering model derived in Johnson et al. 2018


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/commonfunctions.jl#L6-L8)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.AbstractKzetaFinder' href='#ScatteringOptics.AbstractKzetaFinder'><span class="jlbinding">ScatteringOptics.AbstractKzetaFinder</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
AbstractKzetaFinder
```


This is an abstract data type to set up equations and provide a solver for the concentration parameter k_ζ for an anistropic interstellar scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details.

**Mandatory methods**
- `kzetafinder_equation(kzeta, finder::AbstractKzetaFinder)`: should privide a equation where k will be derived.
  

**Methods provided**
- `findkzeta_exact(finder::AbstractKzetaFinder)`: solves the equation for k_ζ,2 given the set of parameters in the finder.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/abstractkzetafinder.jl#L1-L12)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.AbstractScatteringKernel' href='#ScatteringOptics.AbstractScatteringKernel'><span class="jlbinding">ScatteringOptics.AbstractScatteringKernel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
abstract type AbstractScatteringKernel{T} <: ComradeBase.AbstractModel
```


An abstract Comrade Sky Model for the diffractive scattering kernel. These are usually primitive models, and are usually analytic in Fourier but not analytic in the image domain. As a result a user only needs to implement the following methods.
- `visibility_point`
  
- `radialextent`
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/kernels/abstract.jl#L6-L15)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.AbstractScatteringModel' href='#ScatteringOptics.AbstractScatteringModel'><span class="jlbinding">ScatteringOptics.AbstractScatteringModel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
abstract type AbstractScatteringModel
```


An abstract anistropic scattering model based on a thin-screen approximation. In this package, we provide a reference implementation of the dipole (`DipoleScatteringModel`), von Mises (`vonMisesScatteringModel`) and periodic Box Car models (`PeriodicBoxCarScatteringModel`) all introduced in Psaltis et al. 2018.

**Mandatory fields** The scattering model will be fundamentally governed by the following parameters. Ideally, a subtype of this abstract model should have a constructor only with these arguments.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
  
- `rin::Number`: The inner scale of the scattering screen in cm.
  
- `θmaj::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
  
- `θmin::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
  
- `ϕ::Number`: The position angle of the major axis of the scattering in degree.
  
- `λ0::Number`: The reference wavelength for the scattering model in cm.
  
- `D::Number`: The distance from the observer to the scattering screen in cm.
  
- `R::Number`: The distance from the source to the scattering screen in cm.
  

Furthermore the following parameters need to be precomputed.
- `M::Number`: Magnification parameter, defined as D/R
  
- `Qbar::Number`: The amplitudes of fluctuations. Given by `calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad)`
  
- `C::Number`: The scaling factor of the power spectrum. Given by `calc_C(α, rin_cm, λ0_cm, Qbar)`
  
- `D1maj::Number`: given by `calc_D1(α, Amaj, Bmaj)`
  
- `D2maj::Number`: given by `calc_D2(α, Amaj, Bmaj)`
  
- `D1min::Number`: given by `calc_D1(α, Amin, Bmin)`
  
- `D2min::Number`: given by `calc_D2(α, Amin, Bmin)`
  

**Optional Fields** Followings are currently not used by methods but may be useful to have. 
- `A::Number`: Asymmetry parameter θmaj_mas/θmin_mas
  
- `ζ0::Number`: Another asymmetry parameter. Given by calc_ζ0(A)
  
- `ϕ0`:: position angle (measured from Dec axis in CCW) converted to a more traditional angle in radians measured from RA axis in CW
  
- `Amaj::Number`: related to the asymmetric scaling of the kernel. given by `calc_Amaj(rin_cm, λ0_cm, M, θmaj_rad)`
  
- `Amin::Number`: related to the asymmetric scaling of the kernel. given by `calc_Amin(rin_cm, λ0_cm, M, θmin_rad)`
  
- `Bmaj::Number`: calc_Bmaj(α, ϕ0, Pϕfunc, B_prefac)
  
- `Bmin::Number`: calc_Bmin(α, ϕ0, Pϕfunc, B_prefac)
  

**Mandatory Method**
- `Pϕ(sm::ScatteringModel, ϕ)`: Probability Distribution for the wondering of the direction of the magnetic field centered at orientation ϕ0.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L13-L54)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.ApproximatedScatteringKernel' href='#ScatteringOptics.ApproximatedScatteringKernel'><span class="jlbinding">ScatteringOptics.ApproximatedScatteringKernel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct ApproximatedScatteringKernel{T, S, N} <: AbstractScatteringKernel{T}
```


A Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model `sm <: AbstractScatteringModel` using the fast approximation formula in Psaltis et al. (2018).

If `T` isn&#39;t given, `T` defaults to `Float64`


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/kernels/approx.jl#L4-L11)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.DipoleScatteringModel' href='#ScatteringOptics.DipoleScatteringModel'><span class="jlbinding">ScatteringOptics.DipoleScatteringModel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct DipoleScatteringModel{T<:Number} <: AbstractScatteringModel
```


An anistropic scattering model based on a thin-screen approximation. This scattering model adopts the dipole field wonder described in Psaltis et al. 2018.

** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
  
- `rin_cm::Number`: The inner scale of the scattering screen in cm.
  
- `θmaj_mas::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
  
- `θmin_nas::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
  
- `ϕ_deg::Number`: The position angle of the major axis of the scattering in degree.
  
- `λ0_cm::Number`: The reference wavelength for the scattering model in cm.
  
- `D_kpc::Number`: The distance from the observer to the scattering screen in kpc.
  
- `R_kpc::Number`: The distance from the source to the scattering screen in kpc.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/models/dipole.jl#L4-L20)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.Dipole_KzetaFinder' href='#ScatteringOptics.Dipole_KzetaFinder'><span class="jlbinding">ScatteringOptics.Dipole_KzetaFinder</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct Dipole_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder
```


The finder of the concentration parameter k_ζ,2 for dipole anistropic scattering models. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,2 is given by the equation 43 of Psaltis et al. 2018.

**Mandatory fields**
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
  
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/dipole.jl#L1-L11)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.ExactScatteringKernel' href='#ScatteringOptics.ExactScatteringKernel'><span class="jlbinding">ScatteringOptics.ExactScatteringKernel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct ExactScatteringKernel{T, S, N} <: AbstractScatteringKernel{T}
```


A Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model `sm <: AbstractScatteringModel` using the exact formula in Psaltis et al. (2018).

By default if `T` isn&#39;t given, `T` defaults to `Float64`


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/kernels/exact.jl#L3-L10)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.PeriodicBoxCarScatteringModel' href='#ScatteringOptics.PeriodicBoxCarScatteringModel'><span class="jlbinding">ScatteringOptics.PeriodicBoxCarScatteringModel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct PeriodicBoxCarScatteringModel{T<:Number} <: AbstractScatteringModel
```


An anistropic scattering model based on a thin-screen approximation. This scattering adopts the periodic boxcar field wonder described in Psaltis et al. 2018.

** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
  
- `rin_cm::Number`: The inner scale of the scattering screen in cm.
  
- `θmaj_mas::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
  
- `θmin_nas::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
  
- `ϕ_deg::Number`: The position angle of the major axis of the scattering in degree.
  
- `λ0_cm::Number`: The reference wavelength for the scattering model in cm.
  
- `D_kpc::Number`: The distance from the observer to the scattering screen in pc.
  
- `R_kpc::Number`: The distance from the source to the scattering screen in pc.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/models/periodicboxcar.jl#L3-L19)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.PeriodicBoxCar_KzetaFinder' href='#ScatteringOptics.PeriodicBoxCar_KzetaFinder'><span class="jlbinding">ScatteringOptics.PeriodicBoxCar_KzetaFinder</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct PeriodicBoxCar_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder
```


The finder of the concentration parameter k_ζ,3 for the Periodic Box Car anistropic scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,3 is given by the equation 47 of Psaltis et al. 2018.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/periodicboxcar.jl#L1-L10)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.PhaseScreenPowerLaw' href='#ScatteringOptics.PhaseScreenPowerLaw'><span class="jlbinding">ScatteringOptics.PhaseScreenPowerLaw</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
$(TYPEDEF)
```


Power spectrum model of ISM fluctuations, for use in generating a RefractivePhaseScreen object.  Requires an AbstractScatteringModel for scattering parameters as well as image x and y pixel sizes. Optional  input of velocity in x and y direction for moving phase screen.

**Fields**

FIELDS


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/powerlaw.jl#L2-L11)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.RefractivePhaseScreen' href='#ScatteringOptics.RefractivePhaseScreen'><span class="jlbinding">ScatteringOptics.RefractivePhaseScreen</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
RefractivePhaseScreen(sm, Nx, Ny, dx, dy, Vx_km_per_s=0.0, Vy_km_per_s=0.0)
```


An abstract type for generating a refractive phase screen model corresponding to an image and computing the scattered average image.
- `sm <: AbstractScatteringModel`
  
- `Nx`: image size in x axis
  
- `Ny`: image size in y axis
  
- `dx`: pixel size in x direction (in radians)
  
- `dy`: pixel size in y direction (in radians)
  

`Vx_km_per_s` and `Vy_km_per_s` are optional for moving phase screen. 


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L12-L25)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.vonMisesScatteringModel' href='#ScatteringOptics.vonMisesScatteringModel'><span class="jlbinding">ScatteringOptics.vonMisesScatteringModel</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct vonMisesScatteringModel{T<:Number} <: AbstractScatteringModel
```


An anistropic scattering model based on a thin-screen approximation. This scattering adopts the von Mises field wonder described in Psaltis et al. 2018.

** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.
- `α::Number`: The power-law index of the phase fluctuations (Kolmogorov is 5/3).
  
- `rin_cm::Number`: The inner scale of the scattering screen in cm.
  
- `θmaj_mas::Number`: FWHM in mas of the major axis angular broadening at the specified reference wavelength.
  
- `θmin_nas::Number`: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.
  
- `ϕ_deg::Number`: The position angle of the major axis of the scattering in degree.
  
- `λ0_cm::Number`: The reference wavelength for the scattering model in cm.
  
- `D_kpc::Number`: The distance from the observer to the scattering screen in pc.
  
- `R_kpc::Number`: The distance from the source to the scattering screen in pc.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/models/vonmises.jl#L3-L19)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.vonMises_KzetaFinder' href='#ScatteringOptics.vonMises_KzetaFinder'><span class="jlbinding">ScatteringOptics.vonMises_KzetaFinder</span></a> <Badge type="info" class="jlObjectType jlType" text="Type" /></summary>



```julia
struct vonMises_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder
```


The finder of the concentration parameter k_ζ,1 for the von Mises anistropic scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for k_ζ,1 is originally given by the equation 37 of Psaltis et al. 2018, but this is different in the implementation of Johnson et al. 2018 in eht-imaging library. We follow eht-imaging&#39;s implementation.

**Mandatory fields**
- `A::Number`: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/vonmises.jl#L1-L11)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.Dϕ_approx-Tuple{AbstractScatteringModel, Number, Number, Number}' href='#ScatteringOptics.Dϕ_approx-Tuple{AbstractScatteringModel, Number, Number, Number}'><span class="jlbinding">ScatteringOptics.Dϕ_approx</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
Dϕ_approx(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)
```


Masm approximate phase structure function Dϕ(r, ϕ) at observing wavelength λ, first converting x and y into polar coordinates. Based on Equation 35 of Psaltis et al. 2018.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L95-L100)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.Dϕ_exact-Tuple{AbstractScatteringModel, Number, Number, Number}' href='#ScatteringOptics.Dϕ_exact-Tuple{AbstractScatteringModel, Number, Number, Number}'><span class="jlbinding">ScatteringOptics.Dϕ_exact</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
Dϕ_exact(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)
```


Masm exact phase structure function Dϕ(r, ϕ) at observing wavelength `λ`, first converting `x` and `y` into the polar coordinates


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L122-L127)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.calc_Dmaj-Tuple{AbstractScatteringModel, Number, Number}' href='#ScatteringOptics.calc_Dmaj-Tuple{AbstractScatteringModel, Number, Number}'><span class="jlbinding">ScatteringOptics.calc_Dmaj</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
Dmaj(r, sm::AbstractScatteringModel)
```


Masm D_maj(r) for given r. Based on Equation 33 of Psaltis et al. 2018


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L65-L69)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.calc_Dmin-Tuple{AbstractScatteringModel, Number, Number}' href='#ScatteringOptics.calc_Dmin-Tuple{AbstractScatteringModel, Number, Number}'><span class="jlbinding">ScatteringOptics.calc_Dmin</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
calc_Dmin(r, sm::AbstractScatteringModel)
```


Masm D_min(r) for given r. Based on Equation 34 of Psaltis et al. 2018


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L80-L84)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.dDϕ_dz-Tuple{AbstractScatteringModel, Number, Number, Number, Any}' href='#ScatteringOptics.dDϕ_dz-Tuple{AbstractScatteringModel, Number, Number, Number, Any}'><span class="jlbinding">ScatteringOptics.dDϕ_dz</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
dDϕ_dz(sm::AbstractScatteringModel, λ::Number, r::Number, ϕ::Number, ϕq)
```


Differential contribution to the phase structure function.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L111-L115)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.ensembleaverage' href='#ScatteringOptics.ensembleaverage'><span class="jlbinding">ScatteringOptics.ensembleaverage</span></a> <Badge type="info" class="jlObjectType jlFunction" text="Function" /></summary>



```julia
ensembleaverage(sm::AbstractScatteringModel, skymodel::AbstractModel, νmodel)
```



[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L158-L160)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.ensembleaverage-Tuple{AbstractScatteringModel, ComradeBase.IntensityMap}' href='#ScatteringOptics.ensembleaverage-Tuple{AbstractScatteringModel, ComradeBase.IntensityMap}'><span class="jlbinding">ScatteringOptics.ensembleaverage</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
ensembleaverage(sm::AbstractScatteringModel, imap::IntensityMap; νref=c_cgs)
```



[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L165-L167)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.findkzeta_exact-Tuple{ScatteringOptics.AbstractKzetaFinder}' href='#ScatteringOptics.findkzeta_exact-Tuple{ScatteringOptics.AbstractKzetaFinder}'><span class="jlbinding">ScatteringOptics.findkzeta_exact</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
findkzeta_exact(finder::AbstractKzetaFinder; kwargs...)
```


Solves the equation for the concentration parameter k_ζ,2 given the set of parameters in the finder. It uses NonlinearSolve.jl.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/abstractkzetafinder.jl#L16-L21)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.get_rF-Tuple{AbstractPhaseScreen, Number}' href='#ScatteringOptics.get_rF-Tuple{AbstractPhaseScreen, Number}'><span class="jlbinding">ScatteringOptics.get_rF</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
get_rF(psm::AbstractPhaseScreen, λ_cm)
```


Returns Fresnel scale corresponding to the given AvstractPhaseScreen object and observing wavelength, `λ_cm`


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L113-L117)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.kernelmodel-Tuple{AbstractScatteringModel}' href='#ScatteringOptics.kernelmodel-Tuple{AbstractScatteringModel}'><span class="jlbinding">ScatteringOptics.kernelmodel</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
kernelmodel(sm::AbstractScatteringModel; νref::Number=c_cgs, use_approx::Bool == true)
```


Return a Comrade Sky Model for the diffractive scattering kernel of the input scattering model.

** Keyword Argurments **
- `νref::Number`:   the reference frequency in Hz to give a radial extent of the kernel,   which is ideally the lowest frequency of your data sets as the kenerl size is roughly scale with λ^2.   `νref` defaults to the light speed in cgs unit, providing the wavelength of 1 cm.
  
- `use_approx::Bool==true`:   if `true`, returns a model using the approximated fourmula to compute visibiltiies (`ScatteringKernel`).   Otherwise, return a model instead using the exact formula (`ExactScatteringKernel`).
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/kernels/kernelmodel.jl#L3-L16)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.kzetafinder_equation-Tuple{Any, ScatteringOptics.AbstractKzetaFinder}' href='#ScatteringOptics.kzetafinder_equation-Tuple{Any, ScatteringOptics.AbstractKzetaFinder}'><span class="jlbinding">ScatteringOptics.kzetafinder_equation</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
kzetafinder_equation(kzeta, finder::AbstractKzetaFinder)
```


This equation privide a root-finding function `f(kzeta, finder)` to find kzeta from the equation `f(kzeta, finder)=0`.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/kzetafinders/abstractkzetafinder.jl#L29-L33)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.phase_screen-Tuple{AbstractPhaseScreen, Number}' href='#ScatteringOptics.phase_screen-Tuple{AbstractPhaseScreen, Number}'><span class="jlbinding">ScatteringOptics.phase_screen</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
phase_screen(psm::AbstractPhaseScreen, λ_cm, noise_screen=nothing)
```


Generates a refractive phase screen, `ϕ`, using StationaryRandomFields.jl the power law noise procedure.  The fourier space 2D noise_screen (defaults to gaussian noise screen if not given) is scaled by the power law, `Q`, defined in input AbstractPhaseScreen `psm`. The observing wavelength, `λ_cm`, must be given.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L67-L73)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.refractivephasescreen-Union{Tuple{T}, Tuple{S}, Tuple{S, ComradeBase.IntensityMap}, Tuple{S, ComradeBase.IntensityMap, T}, Tuple{S, ComradeBase.IntensityMap, T, T}} where {S, T}' href='#ScatteringOptics.refractivephasescreen-Union{Tuple{T}, Tuple{S}, Tuple{S, ComradeBase.IntensityMap}, Tuple{S, ComradeBase.IntensityMap, T}, Tuple{S, ComradeBase.IntensityMap, T, T}} where {S, T}'><span class="jlbinding">ScatteringOptics.refractivephasescreen</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
refractivephasescreen(sm, im, Vx_km_per_s=0.0, Vy_km_per_s=0.0)
```


An abstract type for generating a refractive phase screen model corresponding to an image and computing the scattered average image.
- `sm <: AbstractScatteringModel`
  
- `im <: IntensityMap`
  
- `Vx_km_per_s` and `Vy_km_per_s` are optional for moving phase screen. 
  


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L43-L52)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}' href='#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}'><span class="jlbinding">ScatteringOptics.scatter_image</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
scatter_image(psm::RefractivePhaseScreen, imap::IntensityMap; νref::Number = c_cgs, noise_screen=nothing)
```


Implements full ISM scattering on an unscattered Comrade skymodel intensity map (`imap`). Diffrective blurring and  refractive phase screen generation are specific to the scattering parameters defined in the AbstractPhaseScreen model `psm`.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L123-L129)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.scatter_image-Tuple{AbstractScatteringModel, ComradeBase.IntensityMap}' href='#ScatteringOptics.scatter_image-Tuple{AbstractScatteringModel, ComradeBase.IntensityMap}'><span class="jlbinding">ScatteringOptics.scatter_image</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
scatter_image(sm::AbstractScatteringModel, imap::IntensityMap, λ_cm::Number; νref::Number = c_cgs, rng = Random.default_rng())
```



[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L191-L193)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.visibility_point_approx-Tuple{AbstractScatteringModel, Number, Number, Number}' href='#ScatteringOptics.visibility_point_approx-Tuple{AbstractScatteringModel, Number, Number, Number}'><span class="jlbinding">ScatteringOptics.visibility_point_approx</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
visibility_point_approx(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)
```


Compute the diffractive kernel for a given observing wavelength `λ` and fourier space coordinates `u`, `v` using the approximated formula of the phase structure function.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L135-L140)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.visibility_point_exact-Tuple{AbstractScatteringModel, Number, Number, Number}' href='#ScatteringOptics.visibility_point_exact-Tuple{AbstractScatteringModel, Number, Number, Number}'><span class="jlbinding">ScatteringOptics.visibility_point_exact</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
visibility_point_exact(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)
```


Compute the diffractive kernel for a given observing wavelength λ and fourier space coordinates `u`, `v` using the exact formula of the phase structure function.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/abstractscatteringmodel.jl#L147-L152)

</details>

<details class='jldocstring custom-block' open>
<summary><a id='ScatteringOptics.wrapped_grad-Tuple{Any, Any, Any}' href='#ScatteringOptics.wrapped_grad-Tuple{Any, Any, Any}'><span class="jlbinding">ScatteringOptics.wrapped_grad</span></a> <Badge type="info" class="jlObjectType jlMethod" text="Method" /></summary>



```julia
wrapped_grad(ϕ, dx, dy)
```


Returns the wrapped gradient of a given 2D phase screen. The x and y pixel sizes (`dx` and `dy`) must be given.


[source](github.com/EHTJulia/ScatteringOptics.jl/blob/2be36e7e6c96489e32567b628c03a8391bcff790/src/scatteringmodels/phasescreens/refractivemodel.jl#L92-L96)

</details>

