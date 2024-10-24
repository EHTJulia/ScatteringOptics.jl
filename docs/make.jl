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

# Formatter
format = MarkdownVitepress(
    repo = "github.com/EHTJulia/ScatteringOptics.jl",
    clean_md_output = false,
)

# Check Deploy Decision
if format.deploy_decision === nothing
    deploy_config = Documenter.auto_detect_deploy_system()
    deploy_decision = Documenter.deploy_folder(
        deploy_config;
        repo = format.repo, # this must be the full URL!
        devbranch = format.devbranch,
        devurl = format.devurl,
        push_preview=true,
    )
else
    deploy_decision = format.deploy_decision
end

makedocs_kwargs = (
    modules=[ScatteringOptics],
    authors="Anna Tartaglia, Kazunori Akiyama",
    repo="github.com/EHTJulia/ScatteringOptics.jl/blob/{commit}{path}#{line}",
    sitename="ScatteringOptics.jl",
    format = format,
    pages=[
        "Home" => "index.md",
        "Introduction" => "introduction.md",
        "Brief Introduction to interstellar scattering" => "math.md",
        "Benchmarks" => "benchmarks.md",
        "Tutorials" => TUTORIALS,
        "ScateringOptics.jl API" => "api.md",
    ],
)

# build documentation
makedocs(; makedocs_kwargs...)

# shortcut to some directories
doc = Documenter.Document(; makedocs_kwargs...)
builddir = isabspath(doc.user.build) ? doc.user.build : joinpath(doc.user.root, doc.user.build)
mddir = joinpath(builddir, format.md_output_path)
fsdir = joinpath(builddir, "final_site")

# manually copy data files into final_site as DocumenterVitepress will ignore files in src/data.
@info "make.jl: manually copy files in src/data"
mkpath(joinpath(fsdir,"data"))
contents = readdir(joinpath(mddir, "data"))
for item in contents
    src = joinpath(mddir, "data", item)
    dst = joinpath(fsdir, "data", item)
    cp(src, dst)
end

# manually clean up build 
clean_md_output = isnothing(format.clean_md_output) ? deploy_decision.all_ok : format.clean_md_output
if clean_md_output
    @info "make.jl: manually cleaning up Markdown output."
    rm(mddir; recursive = true)
    
    contents = readdir(fsdir)
    for item in contents
        src = joinpath(fsdir, item)
        dst = joinpath(builddir, item)
        cp(src, dst)
    end
    rm(fsdir; recursive = true)
    @info "make.jl: Markdown output cleaned up.  Folder looks like:  $(readdir(builddir))"
end

deploydocs(;
    repo="github.com/EHTJulia/ScatteringOptics.jl",
    target = "build",
    devbranch="main",
    branch = "gh-pages",
    push_preview=true,
)
