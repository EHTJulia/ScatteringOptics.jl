using Pkg

Pkg.activate(temp = true)
Pkg.develop(path = joinpath(@__DIR__, ".."))
Pkg.add(["Enzyme", "ForwardDiff"])

using Enzyme
using ForwardDiff
using ScatteringOptics

image = [exp(-((i - 3.2)^2 + (j - 2.7)^2) / 2) for i in 1:6, j in 1:5]
displacement_x = fill(0.25, size(image))
displacement_y = zeros(size(image))
target = zeros(size(image))

loss(image, displacement_x) = refractive_remap_squared_error(
    image, displacement_x, displacement_y, 1.0, 1.0, target
)

function directional_loss(displacement)
    return loss(image, fill(displacement, size(image)))
end

h = 1.0e-6
finite_difference = (directional_loss(0.25 + h) - directional_loss(0.25 - h)) / (2h)
forward = ForwardDiff.derivative(directional_loss, 0.25)

displacement_gradient = zeros(size(image))
autodiff(Reverse, loss, Active, Const(image), Duplicated(displacement_x, displacement_gradient))

image_gradient = zeros(size(image))
autodiff(Reverse, loss, Active, Duplicated(image, image_gradient), Const(displacement_x))

pixel = CartesianIndex(3, 3)
plus = copy(image)
minus = copy(image)
plus[pixel] += h
minus[pixel] -= h
pixel_difference = (loss(plus, displacement_x) - loss(minus, displacement_x)) / (2h)

println(
    (
        displacement_finite_difference = finite_difference,
        displacement_forward = forward,
        displacement_reverse = sum(displacement_gradient),
        image_finite_difference = pixel_difference,
        image_reverse = image_gradient[pixel],
    ),
)
