var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = ScatteringOptics","category":"page"},{"location":"#ScatteringOptics","page":"Home","title":"ScatteringOptics","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for ScatteringOptics.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [ScatteringOptics]","category":"page"},{"location":"#ScatteringOptics.Params_Johnson2018","page":"Home","title":"ScatteringOptics.Params_Johnson2018","text":"Best-fit parameters of the dipole scattering model derived in Johnson et al. 2018\n\n\n\n\n\n","category":"constant"},{"location":"#ScatteringOptics.AbstractKzetaFinder","page":"Home","title":"ScatteringOptics.AbstractKzetaFinder","text":"AbstractKzetaFinder\n\nThis is an abstract data type to set up equations and provide a solver for the concentration parameter k_ζ for an anistropic interstellar scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details.\n\nMandatory methods\n\nkzetafinder_equation(kzeta, finder::AbstractKzetaFinder): should privide a equation where k will be derived.\n\nMethods provided\n\nfindkzeta_exact(finder::AbstractKzetaFinder): solves the equation for k_ζ,2 given the set of parameters in the finder.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.AbstractScatteringKernel","page":"Home","title":"ScatteringOptics.AbstractScatteringKernel","text":"abstract type AbstractScatteringKernel{T} <: ComradeBase.AbstractModel\n\nAn abstract Comrade Sky Model for the diffractive scattering kernel. These are usually primitive models, and are usually analytic in Fourier but not analytic in the image domain. As a result a user only needs to implement the following methods.\n\nvisibility_point\nradialextent\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.AbstractScatteringModel","page":"Home","title":"ScatteringOptics.AbstractScatteringModel","text":"abstract type AbstractScatteringModel\n\nAn abstract anistropic scattering model based on a thin-screen approximation. In this package, we provide a reference implementation of the dipole (DipoleScatteringModel), von Mises (vonMisesScatteringModel) and periodic Box Car models (PeriodicBoxCarScatteringModel) all introduced in Psaltis et al. 2018.\n\nMandatory fields The scattering model will be fundamentally governed by the following parameters. Ideally, a subtype of this abstract model should have a constructor only with these arguments.\n\nα::Number: The power-law index of the phase fluctuations (Kolmogorov is 5/3).\nrin::Number: The inner scale of the scattering screen in cm.\nθmaj::Number: FWHM in mas of the major axis angular broadening at the specified reference wavelength.\nθmin::Number: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.\nϕ::Number: The position angle of the major axis of the scattering in degree.\nλ0::Number: The reference wavelength for the scattering model in cm.\nD::Number: The distance from the observer to the scattering screen in pc.\nR::Number: The distance from the source to the scattering screen in pc.\n\nFurthermore the following parameters need to be precomputed.\n\nM::Number:\nζ0::Number:\nA::Number:\nkζ::Number\nBmaj::Number:\nBmin::Number:\nQbar::Number:\nC::Number:\nAmaj::Number:\nAmin::Number:\nϕ0::Number:\n\n** Methods need to be defined **\n\nPϕ(::AbstractScatteringModel, ϕ::Number) and Pϕ(::Type{<:AbstractScatteringModel}, ϕ::Number, args...):   Normalized probability distribution describing the distribution of the field wonder.   The function should depend on the field wonder model.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.ApproximatedScatteringKernel","page":"Home","title":"ScatteringOptics.ApproximatedScatteringKernel","text":"struct ApproximatedScatteringKernel{T, S, N} <: AbstractScatteringKernel{T}\n\nA Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model sm <: AbstractScatteringModel using the fast approximation formula in Psaltis et al. (2018).\n\nBy default if T isn't given, T defaults to Float64\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.DipoleScatteringModel","page":"Home","title":"ScatteringOptics.DipoleScatteringModel","text":"struct DipoleScatteringModel{T<:Number} <: AbstractScatteringModel\n\nAn anistropic scattering model based on a thin-screen approximation. This scattering model adopts the dipole field wonder described in Psaltis et al. 2018.\n\n** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.\n\nα::Number: The power-law index of the phase fluctuations (Kolmogorov is 5/3).\nrin_cm::Number: The inner scale of the scattering screen in cm.\nθmaj_mas::Number: FWHM in mas of the major axis angular broadening at the specified reference wavelength.\nθmin_nas::Number: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.\nϕ_deg::Number: The position angle of the major axis of the scattering in degree.\nλ0_cm::Number: The reference wavelength for the scattering model in cm.\nD_pc::Number: The distance from the observer to the scattering screen in pc.\nR_pc::Number: The distance from the source to the scattering screen in pc.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.Dipole_KzetaFinder","page":"Home","title":"ScatteringOptics.Dipole_KzetaFinder","text":"struct Dipole_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder\n\nThe finder of the concentration parameter kζ,2 for dipole anistropic scattering models. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for kζ,2 is given by the equation 43 of Psaltis et al. 2018.\n\nMandatory fields\n\nα::Number: The power-law index of the phase fluctuations (Kolmogorov is 5/3).\nA::Number: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.ExactScatteringKernel","page":"Home","title":"ScatteringOptics.ExactScatteringKernel","text":"struct ExactScatteringKernel{T, S, N} <: AbstractScatteringKernel{T}\n\nA Comrade VLBI Sky Model for the scattering kernel based on a Scattering Model sm <: AbstractScatteringModel using the exact formula in Psaltis et al. (2018).\n\nBy default if T isn't given, T defaults to Float64\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.PeriodicBoxCarScatteringModel","page":"Home","title":"ScatteringOptics.PeriodicBoxCarScatteringModel","text":"struct PeriodicBoxCarScatteringModel{T<:Number} <: AbstractScatteringModel\n\nAn anistropic scattering model based on a thin-screen approximation. This scattering adopts the periodic boxcar field wonder described in Psaltis et al. 2018.\n\n** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.\n\nα::Number: The power-law index of the phase fluctuations (Kolmogorov is 5/3).\nrin_cm::Number: The inner scale of the scattering screen in cm.\nθmaj_mas::Number: FWHM in mas of the major axis angular broadening at the specified reference wavelength.\nθmin_nas::Number: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.\nϕ_deg::Number: The position angle of the major axis of the scattering in degree.\nλ0_cm::Number: The reference wavelength for the scattering model in cm.\nD_pc::Number: The distance from the observer to the scattering screen in pc.\nR_pc::Number: The distance from the source to the scattering screen in pc.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.PeriodicBoxCar_KzetaFinder","page":"Home","title":"ScatteringOptics.PeriodicBoxCar_KzetaFinder","text":"struct PeriodicBoxCar_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder\n\nThe finder of the concentration parameter kζ,3 for the Periodic Box Car anistropic scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for kζ,3 is given by the equation 47 of Psaltis et al. 2018.\n\nMandatory fields\n\nA::Number: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.vonMisesScatteringModel","page":"Home","title":"ScatteringOptics.vonMisesScatteringModel","text":"struct vonMisesScatteringModel{T<:Number} <: AbstractScatteringModel\n\nAn anistropic scattering model based on a thin-screen approximation. This scattering adopts the von Mises field wonder described in Psaltis et al. 2018.\n\n** Keywords for the constructor ** The default numbers are based on the best-fit parameters presented in Johnson et al. 2018.\n\nα::Number: The power-law index of the phase fluctuations (Kolmogorov is 5/3).\nrin_cm::Number: The inner scale of the scattering screen in cm.\nθmaj_mas::Number: FWHM in mas of the major axis angular broadening at the specified reference wavelength.\nθmin_nas::Number: FWHM in mas of the minor axis angular broadening at the specified reference wavelength.\nϕ_deg::Number: The position angle of the major axis of the scattering in degree.\nλ0_cm::Number: The reference wavelength for the scattering model in cm.\nD_pc::Number: The distance from the observer to the scattering screen in pc.\nR_pc::Number: The distance from the source to the scattering screen in pc.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.vonMises_KzetaFinder","page":"Home","title":"ScatteringOptics.vonMises_KzetaFinder","text":"struct vonMises_KzetaFinder{T<:Number} <: ScatteringOptics.AbstractKzetaFinder\n\nThe finder of the concentration parameter kζ,1 for the von Mises anistropic scattering model. See Psaltis et al. 2018, arxiv::1805.01242v1 for details. The equation for kζ,1 is originally given by the equation 37 of Psaltis et al. 2018, but this is different in the implementation of Johnson et al. 2018 in eht-imaging library. We follow eht-imaging's implementation.\n\nMandatory fields\n\nA::Number: The anisotropy parameter of the angular broaderning defined by θmaj/θmin.\n\n\n\n\n\n","category":"type"},{"location":"#ScatteringOptics.Dϕ_approx-Tuple{AbstractScatteringModel, Number, Number, Number}","page":"Home","title":"ScatteringOptics.Dϕ_approx","text":"Dϕ_approx(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)\n\nMasm approximate phase structure function Dϕ(r, ϕ) at observing wavelength λ, first converting x and y into polar coordinates. Based on Equation 35 of Psaltis et al. 2018.\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.Dϕ_exact-Tuple{AbstractScatteringModel, Number, Number, Number}","page":"Home","title":"ScatteringOptics.Dϕ_exact","text":"Dϕ_exact(sm::AbstractScatteringModel, λ::Number, x::Number, y::Number)\n\nMasm exact phase structure function Dϕ(r, ϕ) at observing wavelength λ, first converting x and y into the polar coordinates\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.calc_Dmaj-Tuple{AbstractScatteringModel, Number, Number}","page":"Home","title":"ScatteringOptics.calc_Dmaj","text":"Dmaj(r, sm::AbstractScatteringModel)\n\nMasm D_maj(r) for given r. Based on Equation 33 of Psaltis et al. 2018\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.calc_Dmin-Tuple{AbstractScatteringModel, Number, Number}","page":"Home","title":"ScatteringOptics.calc_Dmin","text":"calc_Dmin(r, sm::AbstractScatteringModel)\n\nMasm D_min(r) for given r. Based on Equation 34 of Psaltis et al. 2018\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.dDϕ_dz-Tuple{AbstractScatteringModel, Number, Number, Number, Any}","page":"Home","title":"ScatteringOptics.dDϕ_dz","text":"dDϕ_dz(sm::AbstractScatteringModel, λ::Number, r::Number, ϕ::Number, ϕq)\n\nDifferential contribution to the phase structure function.\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.findkzeta_exact-Tuple{ScatteringOptics.AbstractKzetaFinder}","page":"Home","title":"ScatteringOptics.findkzeta_exact","text":"findkzeta_exact(finder::AbstractKzetaFinder; kwargs...)\n\nSolves the equation for the concentration parameter k_ζ,2 given the set of parameters in the finder. It uses NonlinearSolve.jl.\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.kernelmodel-Tuple{AbstractScatteringModel}","page":"Home","title":"ScatteringOptics.kernelmodel","text":"kernelmodel(sm::AbstractScatteringModel; νref::Number=c_cgs, use_approx::Bool == true)\n\nReturn a Comrade Sky Model for the diffractive scattering kernel of the input scattering model.\n\n** Keyword Argurments **\n\nνref::Number:   the reference frequency in Hz to give a radial extent of the kernel,   which is ideally the lowest frequency of your data sets as the kenerl size is roughly scale with λ^2.   νref defaults to the light speed in cgs unit, providing the wavelength of 1 cm.\nuse_approx::Bool==true:   if true, returns a model using the approximated fourmula to compute visibiltiies (ScatteringKernel).   Otherwise, return a model instead using the exact formula (ExactScatteringKernel).\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.kzetafinder_equation-Tuple{Any, ScatteringOptics.AbstractKzetaFinder}","page":"Home","title":"ScatteringOptics.kzetafinder_equation","text":"kzetafinder_equation(kzeta, finder::AbstractKzetaFinder)\n\nThis equation privide a root-finding function f(kzeta, finder) to find kzeta from the equation f(kzeta, finder)=0.\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.visibility_point_approx-Tuple{AbstractScatteringModel, Number, Number, Number}","page":"Home","title":"ScatteringOptics.visibility_point_approx","text":"visibility_point_approx(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)\n\nCompute the diffractive kernel for a given observing wavelength λ and fourier space coordinates u, v using the approximated formula of the phase structure function.\n\n\n\n\n\n","category":"method"},{"location":"#ScatteringOptics.visibility_point_exact-Tuple{AbstractScatteringModel, Number, Number, Number}","page":"Home","title":"ScatteringOptics.visibility_point_exact","text":"visibility_point_exact(sm::AbstractScatteringModel, λ::Number, u::Number, v::Number)\n\nCompute the diffractive kernel for a given observing wavelength λ and fourier space coordinates u, v using the exact formula of the phase structure function.\n\n\n\n\n\n","category":"method"}]
}
