import ehtim as eh
import numpy as np
import pandas as pd
import timeit
import tqdm
import random

print("This script will benchmark eht-imaging's computation of scattering kernel.")

# number of uvsamples
ndata = 1000

# maximum uvd
uvdmax1 = 15e9  # 15 Gλ
uvdmax2 = 30e6  # 30 Mλ

# uv
uvd1 = np.linspace(0, uvdmax1, ndata)
uvd2 = np.linspace(0, uvdmax2, ndata)

# reference frequency
λcm1 = 0.087
λcm2 = 3.6

# scattering model
sm = eh.scattering.ScatteringModel(POS_ANG=0.0)

df = pd.DataFrame()
df["uvd1"] = uvd1
df["vismaj1"] = sm.Ensemble_Average_Kernel_Visibility(
    u=np.zeros(ndata), v=uvd1, wavelength_cm=λcm1
)
df["vismin1"] = sm.Ensemble_Average_Kernel_Visibility(
    u=uvd1, v=np.zeros(ndata), wavelength_cm=λcm1
)
df["uvd2"] = uvd2
df["vismaj2"] = sm.Ensemble_Average_Kernel_Visibility(
    u=np.zeros(ndata), v=uvd2, wavelength_cm=λcm2
)
df["vismin2"] = sm.Ensemble_Average_Kernel_Visibility(
    u=uvd2, v=np.zeros(ndata), wavelength_cm=λcm2
)
df.to_csv("eh_compute_kernel.csv")
