import ehtim as eh
import numpy as np
import pandas as pd
import timeit
import tqdm
import random

print("This script will benchmark eht-imaging's computation of scattering kernel.")

# numbe of samples
nsamples = np.int64(np.floor(np.logspace(1, 6, 20)))

# scattering models
sm_dp = eh.scattering.ScatteringModel(model="dipole")
sm_vm = eh.scattering.ScatteringModel(model="von_Mises")
sm_bc = eh.scattering.ScatteringModel(model="boxcar")

dpset = []
vmset = []
bcset = []
for nsample in tqdm.tqdm(nsamples):
    # fix the seed for the reproducibility
    np.random.seed(nsample)

    # sample uv points
    u = np.random.uniform(-1e10, 1e10, nsample)
    v = np.random.uniform(-1e10, 1e10, nsample)

    def compute_dp():
        return sm_dp.Ensemble_Average_Kernel_Visibility(u=u, v=v, wavelength_cm=0.13)

    def compute_vm():
        return sm_vm.Ensemble_Average_Kernel_Visibility(u=u, v=v, wavelength_cm=0.13)

    def compute_bc():
        return sm_bc.Ensemble_Average_Kernel_Visibility(u=u, v=v, wavelength_cm=0.13)

    dpt = np.median(timeit.repeat(compute_dp, repeat=100, number=1))
    vmt = np.median(timeit.repeat(compute_vm, repeat=100, number=1))
    bct = np.median(timeit.repeat(compute_bc, repeat=100, number=1))
    dpset.append(dpt)
    vmset.append(vmt)
    bcset.append(bct)

df = pd.DataFrame()
df["samples"] = nsamples
df["dipole"] = dpset
df["vonmises"] = vmset
df["boxcar"] = bcset
df.to_csv("eh_compute_kernel.csv")
