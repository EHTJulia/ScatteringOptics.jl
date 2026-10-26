@testset "Eq. (9) refractive remapping" begin
    image = [exp(-((i - 3.2)^2 + (j - 2.7)^2) / 2) for i in 1:6, j in 1:5]
    zero_displacement = zeros(size(image))

    @test refractive_remap(image, zero_displacement, zero_displacement, 1.0, 1.0) == image

    displacement_x = fill(0.25, size(image))
    translated = refractive_remap(image, displacement_x, zero_displacement, 1.0, 1.0)
    @test translated[3, 3] ≈ 0.75 * image[3, 3] + 0.25 * image[4, 3]
    @test all(isfinite, translated)
    @test minimum(translated) ≥ -eps(eltype(translated))

    outside = refractive_remap(image, fill(10.0, size(image)), zero_displacement, 1.0, 1.0)
    @test outside == zero.(image)
    @test translated == refractive_remap(image, displacement_x, zero_displacement, 1.0, 1.0)

    function loss(displacement)
        return sum(abs2, refractive_remap(image, fill(displacement, size(image)), zero_displacement, 1.0, 1.0))
    end
    h = 1.0e-6
    finite_difference = (loss(0.25 + h) - loss(0.25 - h)) / (2h)
    @test isfinite(finite_difference)
    @test abs(finite_difference) > 1.0e-8
end
