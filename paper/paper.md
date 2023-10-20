

# Summary 

ScatteringOptics implements the Stochastic Optics [@Johnson_2016] framework for generating realistic Interstellar Medium (ISM) scattering effects on very-long-baseline interferometry (VLBI) models. The package is written in the Julia programming language and is intended for use in Event Horizon Telescope (EHT) imaging of the black hole at our galactic center, Sagitarrius A*.

# Statement of Need

The Interstellar Medium causes distortion and scattering effects in Radio Astronomy VLBI imaging. Wave propagation of radio emission through the ISM's turbulent ionized plasma results in scintillation and long time-scale variability of the source image. A mitigation framework which addresses these effects is required for Event Horizon Telescope (EHT) VLBI imaging of Sagittarius A*, the supermassive black hole located at the center of the Milky Way [@ehtsaga]. The galactic ISM between earth and the black hole acts as a 2-dimensional inhomogeneous scattering screen, producing diffractive and refractive scattering effects in interferometric data. The EHT addresses these scattering effects by employing Stochastic Optics ()



