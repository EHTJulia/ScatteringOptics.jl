using ScatteringOptics
using Documenter

DocMeta.setdocmeta!(ScatteringOptics, :DocTestSetup, :(using ScatteringOptics); recursive=true)

makedocs(;
    modules=[ScatteringOptics],
    authors="Anna Tartaglia, Kazunori Akiyama",
    repo="https://github.com/EHTJulia/ScatteringOptics.jl/blob/{commit}{path}#{line}",
    sitename="ScatteringOptics.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://EHTJulia.github.io/ScatteringOptics.jl",
        edit_link="main",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
        "Background" => "math.md",
        "Tutorial" => "tutorial.md",
        "ScateringOptics.jl API" => "autodocs.md",
    ],
)

deploydocs(;
    repo="github.com/EHTJulia/ScatteringOptics.jl",
    devbranch="main",
)
