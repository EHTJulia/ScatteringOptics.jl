module ScatteringOptics

# Import Modules
import ComradeBase:
    AbstractModel, IsPrimitive, IsAnalytic, NotAnalytic,
    IsPolarized, NotPolarized,
    visanalytic, imanalytic, isprimitive, ispolarized,
    visibility_point, flux, radialextent
using DocStringExtensions
using EHTUtils: mas2rad
using HypergeometricFunctions
using NonlinearSolve
using QuadGK
using SpecialFunctions

# kζ finders
include("./kzetafinders/abstractkzetafinder.jl")
include("./kzetafinders/dipole.jl")
include("./kzetafinders/periodicboxcar.jl")
include("./kzetafinders/vonmises.jl")

# scattering models: general defenitions
include("./scatteringmodels/commonfunctions.jl")
include("./scatteringmodels/abstractscatteringmodel.jl")

# scattering kernels
include("./scatteringmodels/kernels/abstract.jl")
include("./scatteringmodels/kernels/approx.jl")
include("./scatteringmodels/kernels/exact.jl")
include("./scatteringmodels/kernels/kernelmodel.jl")

# implementation of specific models
include("./scatteringmodels/models/dipole.jl")
include("./scatteringmodels/models/periodicboxcar.jl")
include("./scatteringmodels/models/vonmises.jl")

end
