export PhaseScreenPowerLaw
@doc raw"""
    $(TYPEDEF)

Power spectrum model of ISM fluctuations, for use in generating a RefractivePhaseScreen object. 
Requires an AbstractScatteringModel for scattering parameters as well as image x and y pixel sizes. Optional 
input of velocity in x and y direction for moving phase screen.

# Fields
$(FIELDS)
"""
struct PhaseScreenPowerLaw{N,S<:AbstractScatteringModel,T<:Number} <:
       AbstractPowerSpectrumModel{2}
    sm::S
    dx::T
    dy::T
    Vx_km_per_s::T
    Vy_km_per_s::T

    function PhaseScreenPowerLaw(
        sm::S, dx::T, dy::T, Vx_km_per_s=0.0::T, Vy_km_per_s=0.0::T
    ) where {S,T}
        return new{2,typeof(sm),typeof(dx)}(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
    end
end

@inline StationaryRandomFields.fourieranalytic(::PhaseScreenPowerLaw) = IsAnalytic()

@inline function StationaryRandomFields.power_point(model::PhaseScreenPowerLaw, q...)
    @assert length(q) == 2

    q_r = √sum(abs2, q) + 1e-12 / model.sm.rin
    q_ϕ = atan(q[2], q[1])
    return model.sm.Qbar *
           (q_r * model.sm.rin)^(-(model.sm.α + 2.0)) *
           exp(-(q_r * model.sm.rin)^2) *
           Pϕ(model.sm, q_ϕ)
end

@inline function StationaryRandomFields.amplitude_point(
    model::PhaseScreenPowerLaw, t_hr, FOV, dq, q...
)
    x_offset_pixels = (model.Vx_km_per_s * 1.e5) * (t_hr * 3600.0) / (FOV[1])
    y_offset_pixels = (model.Vy_km_per_s * 1.e5) * (t_hr * 3600.0) / (FOV[2])

    return √(power_point(model, dq .* q...)) *
           exp(2.0 * π * 1im * (q[1] * x_offset_pixels + q[2] * y_offset_pixels))
end

@inline function StationaryRandomFields.amplitude_map(
    model::PhaseScreenPowerLaw,
    noisesignal::Union{AbstractNoiseSignal,AbstractContinuousNoiseSignal},
    t_hr=0.0,
)
    Nx, Ny = noisesignal.dims
    FOV = (Nx * model.dx, Ny * model.dy)
    dq = (2 * π) ./ FOV
    gridofq = rfftfreq(noisesignal) .* (Nx, Ny)

    prod = collect(Iterators.product(gridofq...))
    amp = zeros(size(prod)...)
    for i in eachindex(prod)[2:end]
        amp[i] = amplitude_point(model, t_hr, FOV, dq, prod[i]...)
    end
    return amp
end