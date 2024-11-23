#!/bin/env bash

# This script sets up the Python environment for the benchmarks.
#   We used mamba and miniforge to avoid potential license issues with Anaconda
condacommand="mamba"

# Setup new enviroment
$condacommand create -n py311_sobenchmark python=3.11 -y
$condacommand install -n py311_sobenchmark astropy skyfield future h5py ipython matplotlib networkx numpy "pandas < 2" requests scipy scikit-image "numpy < 2" tqdm

# Activate the enviroment
$condacommand activate py311_sobenchmark
pip install ehtim

# Save the enviroment to the text file
#   you can replicate the enviroment by running `conda create --name py311_sobenchmark --file conda_explicit_env.txt`
$condacommand list --explicit --md5 > conda_explicit_env.txt
$condacommand list > conda_list.txt