module ScatteringOptics

# Import Modules
using DocStringExtensions
using HypergeometricFunctions
using SpecialFunctions
using NonlinearSolve
using AstroAngles

#k finders
include("./kfinders/abstractkfinder.jl")
include("./kfinders/kfinder.jl")

#scattering kernels
include("./scatteringkernels/abstractscatteringkernel.jl")
include("./scatteringkernels/phasestructure.jl")

end
