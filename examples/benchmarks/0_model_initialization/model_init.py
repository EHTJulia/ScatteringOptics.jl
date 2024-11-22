#!/usr/bin/env python
import timeit
import numpy as np
import pandas as pd

print("This script will benchmark eht-imaging's initialization of scattering models.")

# Scattering Model Name
model_labels = ["Dipole", "Von Mises", "Periodic Boxcar"]
model_names = ["dipole", "von_Mises", "boxcar"]

# Number of trials for timeit
ntrial = 1000  # this is a default number for @benchmark macro in Julia

# Common setup for timeit
setup = "import ehtim as eh"

# Looping for each scattering model
meanarr = []
stdarr = []
for i in range(3):
    print("  %d/3: %s Model" % (i + 1, model_labels[i]))
    model = model_names[i]

    # statement to be measured by timeit
    stmt = "eh.scattering.stochastic_optics.ScatteringModel(model='%s')" % (model)

    # measure time
    durations = timeit.Timer(stmt=stmt, setup=setup).repeat(repeat=ntrial, number=1)

    # printout the mean and standard deviation
    print("%.2f +/- %.2f ms" % (np.mean(durations) * 1e3, np.std(durations) * 1e3))

    meanarr.append(np.mean(durations) * 1e3)
    stdarr.append(np.std(durations) * 1e3)

df = pd.DataFrame(dict(model=model_names, mean_ms=meanarr, std_ms=stdarr))
df.to_csv("ehtim_model_init.csv")
