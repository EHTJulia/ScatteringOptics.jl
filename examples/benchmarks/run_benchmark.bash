#!/bin/env bash

# We use mamba and miniforge to avoid the potential license issues with Anaconda
condacommand="mamba"

# load the python enviroment: see setup_python.bash for the setup
$condacommand activate py311_sobenchmark

# Run the benchmarks
cd 0_model_initialization
bash run.bash
cd ..

cd 1_scattering_kernel_speed
bash run.bash
cd ..

cd 2_scattering_kernel_speed
bash run.bash
cd ..