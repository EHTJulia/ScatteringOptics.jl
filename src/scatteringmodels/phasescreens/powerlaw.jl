export PhaseScreenPowerLaw
@doc raw"""
    $(TYPEDEF)


# Fields
$(FIELDS)
"""
struct PhaseScreenPowerLaw{N,S<:AbstractScatteringModel, T<:Number} <: AbstractPowerSpectrumModel{2}
    sm::S
    dx::T
    dy::T
    Vx_km_per_s::T
    Vy_km_per_s::T

    function PhaseScreenPowerLaw(sm::S, dx, dy, Vx_km_per_s=0.0::T, Vy_km_per_s=0.0::T) where {S, T}
        new{2,typeof(sm), typeof(dx)}(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
    end
end

@inline fourieranalytic(::PhaseScreenPowerLaw) = IsAnalytic()

function StationaryRandomFields.power_point(model::PhaseScreenPowerLaw, q...)
    @assert length(q) == 2

    q_r = √sum(abs2, q) + 1e-12/model.sm.rin 
    q_ϕ = atan(q[2], q[1])
    return model.sm.Qbar * (q_r*model.sm.rin)^(-(model.sm.α + 2.0)) * exp(-(q_r * model.sm.rin)^2) * Pϕ(model.sm, q_ϕ)
end

function StationaryRandomFields.amplitude_point(model::PhaseScreenPowerLaw, t_hr, N, FOV, dq, q...)
    x_offset_pixels = (model.Vx_km_per_s * 1.e5) * (t_hr*3600.) / (FOV/float(N))
    y_offset_pixels = (model.Vy_km_per_s * 1.e5) * (t_hr*3600.) / (FOV/float(N))
    q = (q[1]/model.dx, q[2]/model.dy)
    
    return √(power_point(model, dq.*q...)) * exp(2.0*π*1im*(q[1]*x_offset_pixels + q[2]*y_offset_pixels)/float(N))
end

function StationaryRandomFields.amplitude_map(model::PhaseScreenPowerLaw, noisesignal::Union{AbstractNoiseSignal,AbstractContinuousNoiseSignal}, t_hr = 0.) 
    N = noisesignal.dims[1]
    FOV = N * model.sm.D
    dq = 2*π/FOV
    gridofq = rfftfreq(noisesignal)

    prod = collect(Iterators.product(gridofq...))
    amp = zeros(size(prod)...)
    for i in eachindex(prod)[2:end]
        amp[i] = amplitude_point(model, t_hr, N, FOV, dq, prod[i]...)
    end
    return amp
end