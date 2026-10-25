using Runic

const write_mode = "--write" in ARGS
const root = normpath(joinpath(@__DIR__, ".."))
const files = readchomp(`git -C $root ls-files -z -- '*.jl'`) |> x -> split(x, '\0'; keepempty = false)
append!(files, ["tools/format.jl", "test/kzetafinders.jl"])

for file in files
    path = joinpath(root, file)
    if write_mode
        Runic.format_file(path; inplace = true)
    else
        formatted_path, io = mktemp()
        close(io)
        try
            Runic.format_file(path, formatted_path)
            if read(path, String) != read(formatted_path, String)
                error("Runic formatting differs for $file")
            end
        finally
            rm(formatted_path; force = true)
        end
    end
end
