using Pkg

Pkg.activate(temp = true)
Pkg.develop(path = dirname(Base.current_project()))
Pkg.add(["Enzyme", "ForwardDiff"])

using Enzyme
using ForwardDiff
using ScatteringOptics

const PARAMETER_NAMES = (:α, :rin_cm, :θmaj_mas, :θmin_mas, :ϕpa_deg, :λ0_cm, :D_kpc, :R_kpc)
const PARAMETER_VALUES = (1.38, 800.0e5, 1.38, 0.703, 81.9, 1.0, 2.82, 5.53)

function kernel_loss(p)
    sm = ScatteringModel(
        α = p[1],
        rin_cm = p[2],
        θmaj_mas = p[3],
        θmin_mas = p[4],
        ϕpa_deg = p[5],
        λ0_cm = p[6],
        D_kpc = p[7],
        R_kpc = p[8],
    )
    kernel = visibility_point_approx(sm, 0.13, 1.0e8, 2.0e8)
    return (kernel - 0.5)^2
end

function scalar_loss(i, x)
    p = ntuple(j -> j == i ? x : PARAMETER_VALUES[j], length(PARAMETER_VALUES))
    return kernel_loss(p)
end

println("loss = ", kernel_loss(collect(PARAMETER_VALUES)))
for i in eachindex(PARAMETER_NAMES)
    f(x) = scalar_loss(i, x)
    x = PARAMETER_VALUES[i]
    fd = ForwardDiff.derivative(f, x)
    h = sqrt(eps(Float64)) * max(abs(x), 1.0)
    finite_difference = (f(x + h) - f(x - h)) / (2h)
    forward = autodiff(Forward, f, Duplicated(x, 1.0))
    reverse = autodiff(Reverse, f, Active(x))
    println((name = PARAMETER_NAMES[i], forwarddiff = fd, finite_difference, forward, reverse))
end
