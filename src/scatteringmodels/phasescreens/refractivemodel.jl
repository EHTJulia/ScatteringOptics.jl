export AbstractPhaseScreen
export RefractivePhaseScreen
export phase_screen
export wrapped_grad

abstract type AbstractPhaseScreen end

struct RefractivePhaseScreen{S, T <: Number, N<:AbstractNoiseSignal, P <: AbstractPowerSpectrumModel} <: AbstractPhaseScreen
    sm::S
    dx::T 
    dy::T 
    signal::N  
    Q::P
    function RefractivePhaseScreen(sm::S, Nx::Number, Ny::Number, dx::T, dy::T, Vx_km_per_s=0.0::T, Vy_km_per_s=0.0::T) where {S, T}
        dx = dx*sm.D
        dy = dy*sm.D
        Q = PhaseScreenPowerLaw(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
        signal = NoiseSignal((Nx, Ny))
        return new{S, T, NoiseSignal, typeof(Q)}(sm, dx, dy, signal, Q)
    end
end

StationaryRandomFields.generate_gaussian_noise(psm::AbstractPhaseScreen; rng = Random.default_rng()) = generate_gaussian_noise(psm.signal; rng = rng)

function phase_screen(psm::AbstractPhaseScreen, noise_screen=nothing)
    if isnothing(noise_screen)
        noise_screen = generate_gaussian_noise(psm)
    end
    cns = ContinuousNoiseSignal(psm.signal)
    screengen = PSNoiseGenerator(psm.Q, cns)
    return generate_signal_noise(screengen)
end

function wrapped_grad(ϕ)
    nx, ny = size(ϕ)
    gradϕ_x = zeros(Float64, nx, ny)
    gradϕ_y = zeros(Float64, nx, ny)
    for i=1:nx, j=1:ny
        i0 = i == 1 ? nx : i - 1
        j0 = j == 1 ? ny : j - 1
        i1 = i == nx ? 1 : i + 1
        j1 = j == ny ? 1 : j + 1
        
        @inbounds gradϕ_x[i, j] = 0.5 * (ϕ[i1, j] - ϕ[i0, j])
        @inbounds gradϕ_y[i, j] = 0.5 * (ϕ[i, j1] - ϕ[i, j0])
    end
    return (gradϕ_x, gradϕ_y)
end

function get_rF(psm::AbstractPhaseScreen, λ_cm)
    D, R = (psn.sm.D, psm.sm.R) .* 3.086e21
    return √(D*R/(D+R) * λ_cm/(2.0*π))
end