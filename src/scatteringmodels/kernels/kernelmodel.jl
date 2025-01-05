export kernelmodel

"""
    kernelmodel(sm::AbstractScatteringModel; νref::Number=c_cgs, use_approx::Bool == true)

Return a Comrade Sky Model for the diffractive scattering kernel of the input scattering model.

** Keyword Argurments **
- `νref::Number`:
    the reference frequency in Hz to give a radial extent of the kernel,
    which is ideally the lowest frequency of your data sets as the kenerl size is roughly scale with λ^2.
    `νref` defaults to the light speed in cgs unit, providing the wavelength of 1 cm.
- `use_approx::Bool==true`:
    if `true`, returns a model using the approximated fourmula to compute visibiltiies (`ScatteringKernel`).
    Otherwise, return a model instead using the exact formula (`ExactScatteringKernel`).
"""
@inline function kernelmodel(
    sm::AbstractScatteringModel; νref::Number=c_cgs, use_approx::Bool=true
)
    if use_approx
        return ScatteringKernel(sm, νref)
    else
        return ExactScatteringKernel(sm, νref)
    end
end
