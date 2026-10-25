export PhaseScreenPowerLaw
@doc raw"""
    $(TYPEDEF)

Power spectrum model of ISM fluctuations, for use in generating a RefractivePhaseScreen object. 
Requires an AbstractScatteringModel for scattering parameters as well as image x and y pixel sizes. Optional 
input of velocity in x and y direction for moving phase screen.

# Fields
$(FIELDS)
"""
struct PhaseScreenPowerLaw{N, S <: AbstractScatteringModel, T <: Number} <:
    AbstractPowerSpectrumModel{2}
    sm::S
    dx::T
    dy::T
    Vx_km_per_s::T
    Vy_km_per_s::T

    function PhaseScreenPowerLaw(
            sm::S, dx::T, dy::T, Vx_km_per_s = 0.0::T, Vy_km_per_s = 0.0::T
        ) where {S, T}
        return new{2, typeof(sm), typeof(dx)}(sm, dx, dy, Vx_km_per_s, Vy_km_per_s)
    end
end

@inline function StationaryRandomFields.power_point(model::PhaseScreenPowerLaw, q...)
    @assert length(q) == 2

    # SRF coordinates are cycles per coordinate unit; the physical spectrum
    # is defined in angular spatial frequency.
    q_r = 2π * √sum(abs2, q) + 1.0e-12 / model.sm.rin
    q_ϕ = atan(q[2], q[1])
    return model.sm.Qbar *
        (q_r * model.sm.rin)^(-(model.sm.α + 2.0)) *
        exp(-(q_r * model.sm.rin)^2) *
        Pϕ(model.sm, q_ϕ)
end
