#This particular test script conduct basic tests for internal consistency of functions, 
#which does not rely on a secific input source model.

# Check initialization of the scatteiring models
sm_def = ScatteringModel()
sm_d = DipoleScatteringModel()
sm_v = vonMisesScatteringModel()
sm_b = PeriodicBoxCarScatteringModel()

@test sm_def == sm_d
@test sm_def != sm_v
@test sm_def != sm_b

# Sanity Check for the visibility point functions
@info "Testing visibility point functions"
#   Test 1: the zero baseline amplitude should be 1 at whatever point
stablerng = StableRNG(1)
λ_list = rand(stablerng, 100)
for sm in [sm_d, sm_v, sm_b]
    zerouvamps = map(λ -> visibility_point_approx(sm, λ, 0.0, 0.0), λ_list)
    @test all(zerouvamps .≈ 1)

    zerouvamps = map(λ -> visibility_point_exact(sm, λ, 0.0, 0.0), λ_list)
    @test all(zerouvamps .≈ 1)
end

#   Test 2: the approximate (analytic) and exact (semi-analytic) visibility point functions should be close
stablerng = StableRNG(12)
λcm = 0.13
u_list = rand(stablerng, 100) .* 1e10
v_list = rand(stablerng, 100) .* 1e10
for sm in [sm_d, sm_v, sm_b]
    amps_approx = map(uv -> visibility_point_approx(sm, λcm, uv...), zip(u_list, v_list))
    amps_exact = map(uv -> visibility_point_exact(sm, λcm, uv...), zip(u_list, v_list))
    @test median(abs.(amps_exact .- amps_approx) .^ 2 ./ amps_exact .^ 2) < 1e-2
end

# Sanity Check for scattering kernel functions
@info "Testing scattering kernel functions"
stablerng = StableRNG(123)
νref = 230e9
λcm = ScatteringOptics.ν2λcm(230e9)
u_list = rand(stablerng, 100) .* 1e10
v_list = rand(stablerng, 100) .* 1e10
for sm in [sm_d, sm_v, sm_b]
    kernel_approx = kernelmodel(sm; νref=νref, use_approx=true)
    kernel_exact = kernelmodel(sm; νref=νref, use_approx=false)

    amps_d_approx = map(uv -> visibility_point_approx(sm, λcm, uv...), zip(u_list, v_list))
    amps_d_exact = map(uv -> visibility_point_exact(sm, λcm, uv...), zip(u_list, v_list))

    amps_k_approx = map(
        uv -> visibility_point(kernel_approx, (U=uv[1], V=uv[2])), zip(u_list, v_list)
    )
    amps_k_exact = map(
        uv -> visibility_point(kernel_exact, (U=uv[1], V=uv[2])), zip(u_list, v_list)
    )

    @test all(amps_d_approx .≈ amps_k_approx)
    @test all(amps_d_exact .≈ amps_k_exact)
end

# Sanity Check for refractive scattering effects
@info "Testing refractive scattering functions"
im = load_fits("data/jason_mad_eofn.fits", IntensityMap)
νref = metadata(im).frequency
for sm in [sm_d, sm_v, sm_b]
    rps = refractivephasescreen(sm, im)

    # Manually generate the phase screen for refractive scattering
    stablerng = StableRNG(1234)
    noise_screen = generate_gaussian_noise(rps; rng=stablerng)
    im_a = scatter_image(rps, im; noise_screen=noise_screen)

    # Automatically generate the phase screen for refractive scattering
    stablerng = StableRNG(1234)
    im_a2 = scatter_image(sm, im; rng=stablerng)

    # These should be identical
    @test im_a == im_a2
end