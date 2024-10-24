


# Define Your Own Scattering Model {#Define-Your-Own-Scattering-Model}

While this package covers all three probabilistic models published in literature as of 2024 (see [Brief Introduction to Interstellar Scattering](/math#Brief-Introduction-to-Interstellar-Scattering)), users may define a custom probabilistic model leveledging a high level abstraction of data types implemented in this package.

To make your own custom model, you only need to define a custom type of [ScatteringOptics.AbstractScatteringModel](/api#ScatteringOptics.AbstractScatteringModel). You need to define the constructor of the type with the standardized parameters set in the literature. Here is a quick example. As long as your model is compatible with the framework of the semianalytic models in Psaltis et al. [1], you need to change only few lines. 

```julia
using ScatteringOptics

struct YourScatteringModel{T<:Number} <: AbstractScatteringModel
    # Mandatory fields for AbstractScatteringModel
    #   fundamental parameters
    α::T
    rin::T
    θmaj::T
    θmin::T
    ϕpa::T
    λ0::T
    D::T
    R::T

    #   precomputed mandatory constants
    M::T
    Qbar::T
    C::T
    D1maj::T
    D2maj::T
    D1min::T
    D2min::T

    #   optional constants
    A::T
    ζ0::T
    ϕ0::T
    Amaj::T
    Amin::T
    kζ::T
    Bmaj::T
    Bmin::T
    .... 

    # Constructor. Here the default parameters are for Sgr A* (Johnson et al. 2018, [4])
    function YourScatteringModel(; α=1.38, rin_cm=800e5, θmaj_mas=1.380, θmin_mas=0.703, ϕpa_deg=81.9, λ0_cm=1.0, D_kpc=2.82, R_kpc=5.53)

        # compute asymmetry parameters and magnification parameter
        A = calc_A(θmaj_mas, θmin_mas)
        ζ0 = calc_ζ0(A)
        M = calc_M(D_kpc, R_kpc)

        # convert D and R to cm
        D_cm = kpc_tp_cm*D_kpc
        R_cm = kpc_tp_cm*R_kpc

        # position angle (measured from Dec axis in CCW)
        # to a more tranditional angle measured from RA axis in CW
        ϕ0 = calc_ϕ0(ϕpa_deg)

        # Parameters for the approximate phase structure function
        θmaj_rad = calc_θrad(θmaj_mas) # milliarcseconds to radians
        θmin_rad = calc_θrad(θmin_mas) # milliarcseconds to radians
        Amaj = calc_Amaj(rin_cm, λ0_cm, M, θmaj_rad)
        Amin = calc_Amin(rin_cm, λ0_cm, M, θmin_rad)

        # C parameters that scale the powerspectrum of the phase screen
        Qbar = calc_Qbar(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad)
        C = calc_C(α, rin_cm, λ0_cm, Qbar)

        # find the concentration parameter often included in the field model
        #   THIS DEPENDS ON YOUR FIELD WANDER MODEL
        kζ = ....

        # Set Pϕ
        #   THIS DEPENDS ON YOUR FIELD WANDER MODEL
        Pϕfunc(ϕ) = Pϕ(YourScatteringModel, ϕ, α, ϕ0, kζ, ...)

        # B parameters
        B_prefac = calc_B_prefac(α, C)
        Bmaj = calc_Bmaj(α, ϕ0, Pϕfunc, B_prefac)
        Bmin = calc_Bmin(α, ϕ0, Pϕfunc, B_prefac)

        # D parameters
        D1maj = calc_D1(α, Amaj, Bmaj)
        D2maj = calc_D2(α, Amaj, Bmaj)
        D1min = calc_D1(α, Amin, Bmin)
        D2min = calc_D2(α, Amin, Bmin)

        return new{typeof(α)}(
            α, rin_cm, θmaj_mas, θmin_mas, ϕpa_deg, λ0_cm, D_cm, R_cm,
            M, Qbar, C, D1maj, D2maj, D1min, D2min,
            A, ζ0, ϕ0, Amaj, Amin, kζ, Bmaj, Bmin, ...
        )
    end
end

# Define the probability density function for the field wander
#   THIS DEPENDS ON YOUR FIELD WANDER MODEL
function Pϕ(::Type{<:YourScatteringModel}, ϕ, α, ϕ0, kζ, ...) end

# Simplified version using precomputed values.
#   THIS DEPENDS ON YOUR FIELD WANDER MODEL
Pϕ(sm::YourScatteringModel, ϕ)=Pϕ(YourScatteringModel, ϕ, sm.α, sm.ϕ0, sm.kζ, ...)
```


For the actual examples, please have a look at the source codes of the three models, which are currently in `src/scatteringmodels/models`. `calc_xxxx` functions are all defined in `src/scatteringmodels/commonfunctions.jl`. Most of the parameters are denoted following Psaltis et al. [1]. This package implements equations connecting the standardized parameters to various precomputed parameters using equations in the eht-imaging library based on [2-4].

Once you define your scattering model, you can simply use your model by

```julia
sm = YourScatteringModel()
```


The field wander model often involves a concentration parameter (denoted as $k_\zeta$ in Psaltis et al. [1]). This package offers an abstract type [AbstractKzetaFinder](/api#ScatteringOptics.AbstractKzetaFinder) to numerically solve $k_\zeta$ from the given scattering parameters. You can see actual examples for three models in `src/kzetafinders` along with the definition of the abstract type. 

You should be able to use all of functions in tutorials with your own model. Enjoy!

## References

[1] Psaltis, D., et al., 2018, arXiv e-prints, arXiv:1805.01242, DOI: [10.48550/arXiv.1805.01242](https://doi.org/10.48550/arXiv.1805.01242) ([ADS](https://ui.adsabs.harvard.edu/abs/2018arXiv180501242P))

[2] Johnson, M. D., Narayan, R., 2016, The Astrophysical Journal, 826, 170, DOI: [10.3847/0004-637X/826/2/170](https://doi.org/10.3847/0004-637X/826/2/170) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...826..170J))

[3] Johnson, M. D., 2016, The Astrophysical Journal, 833, 74, DOI: [10.3847/1538-4357/833/1/74](https://doi.org/10.3847/1538-4357/833/1/74) ([ADS](https://ui.adsabs.harvard.edu/abs/2016ApJ...833...74J))

[4] Johnson, M. D., et al., 2018, The Astrophysical Journal, 865, 104, DOI: [10.3847/1538-4357/aadcff](https://doi.org/10.3847/1538-4357/aadcff) ([ADS](https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J))
