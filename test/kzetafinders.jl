@testset "kζ finders" begin
    finders = [
        ScatteringOptics.Dipole_KzetaFinder(1.38, 1.38 / 0.703),
        ScatteringOptics.vonMises_KzetaFinder(1.38 / 0.703),
        ScatteringOptics.PeriodicBoxCar_KzetaFinder((1.38 / 0.703)^(-1)),
    ]

    for finder in finders
        kζ = ScatteringOptics.findkzeta_exact(finder)
        kζ_original = ScatteringOptics.findkzeta_exact(finder; method = :original)
        @test isfinite(kζ)
        @test isfinite(kζ_original)
        @test abs(ScatteringOptics.kzetafinder_equation(kζ, finder)) < 1.0e-4
        @test abs(kζ - kζ_original) < 5.0e-3
    end

    @test_throws ArgumentError ScatteringOptics.findkzeta_exact(finders[1]; method = :unknown)
end
