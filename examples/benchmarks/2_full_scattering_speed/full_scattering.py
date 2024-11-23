import ehtim as eh
import numpy as np
import pandas as pd
import timeit
import tqdm
import random

print("This script will benchmark eht-imaging's computation of scattering kernel.")

# numbe of samples
nx_list = [32, 64, 128, 256, 512, 1024, 2048]

# scattering models
sm = eh.scattering.ScatteringModel()

# dx
dx = 1 * eh.RADPERUAS

eatime = []
atime = []
for nx in tqdm.tqdm(nx_list):
    # set up an image
    fov = dx * nx
    im = eh.image.make_empty(nx, fov, 0.0, 0.0)
    im = im.add_gauss(1, [20 * dx, 20 * dx, 0.0, 0.0, 0.0])
    im.rf = 230e9

    def compute_ea():
        return sm.Ensemble_Average_Blur(im)

    def compute_a():
        return sm.Scatter(im)

    eatime.append(np.median(timeit.repeat(compute_ea, repeat=1, number=1)))
    atime.append(np.median(timeit.repeat(compute_a, repeat=1, number=1)))

df = pd.DataFrame()
df["nx"] = nx_list
df["ensembleaverage"] = eatime
df["average"] = atime
df.to_csv("eh_full_scattering.csv")
