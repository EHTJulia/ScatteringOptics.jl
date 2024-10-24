using ScatteringOptics
using Documenter
using DocumenterVitepress

DocMeta.setdocmeta!(ScatteringOptics, :DocTestSetup, :(using ScatteringOptics); recursive=true)

TUTORIALS = [
    "Getting Started" => [
        "diffractive.md",
        "refractive.md",
    ],
    "Advanced" =>[
        "nondefaultmodels.md",
        "custommodels.md",
    ],
]

makedocs(;
    modules=[ScatteringOptics],
    authors="Anna Tartaglia, Kazunori Akiyama",
    repo="https://github.com/EHTJulia/ScatteringOptics.jl/blob/{commit}{path}#{line}",
    sitename="ScatteringOptics.jl",
    format = MarkdownVitepress(
        repo = "https://github.com/EHTJulia/ScatteringOptics.jl",
    ),
    pages=[
        "Home" => "index.md",
        "Introduction" => "introduction.md",
        "Brief Introduction to interstellar scattering" => "math.md",
        "Benchmarks" => "benchmarks.md",
        "Tutorials" => TUTORIALS,
        "ScateringOptics.jl API" => "api.md",
    ],
)

deploydocs(;
    repo="github.com/EHTJulia/ScatteringOptics.jl",
    target = "build",
    devbranch="main",
    branch = "gh-pages",
    push_preview=true,
)
