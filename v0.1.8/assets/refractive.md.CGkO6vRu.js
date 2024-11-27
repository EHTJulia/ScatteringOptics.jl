import{_ as l,c as a,a5 as e,j as s,a as t,o as n}from"./chunks/framework.ClVBwEoY.js";const p="/ScatteringOptics.jl/v0.1.8/assets/gptcoaw.CBf3Exb6.png",h="/ScatteringOptics.jl/v0.1.8/assets/qfvbeiy.9QsyFGId.png",r="/ScatteringOptics.jl/v0.1.8/assets/gkekvof.BXZtWIg7.png",k="/ScatteringOptics.jl/v0.1.8/assets/otmrmrv.D1qHV6Xh.png",d="/ScatteringOptics.jl/v0.1.8/assets/sekhdfa.Cm55C9do.png",b=JSON.parse('{"title":"Simulate Refractive Scattering","description":"","frontmatter":{},"headers":[],"relativePath":"refractive.md","filePath":"refractive.md","lastUpdated":null}'),o={name:"refractive.md"},g={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},c={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.05ex"},xmlns:"http://www.w3.org/2000/svg",width:"6.883ex",height:"2.005ex",role:"img",focusable:"false",viewBox:"0 -864 3042.5 886","aria-hidden":"true"},m={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},E={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.05ex"},xmlns:"http://www.w3.org/2000/svg",width:"7.683ex",height:"2.005ex",role:"img",focusable:"false",viewBox:"0 -864 3396 886","aria-hidden":"true"};function y(u,i,f,F,v,T){return n(),a("div",null,[i[7]||(i[7]=e(`<h1 id="Simulate-Refractive-Scattering" tabindex="-1">Simulate Refractive Scattering <a class="header-anchor" href="#Simulate-Refractive-Scattering" aria-label="Permalink to &quot;Simulate Refractive Scattering {#Simulate-Refractive-Scattering}&quot;">​</a></h1><p>Another feature of <code>ScatteringOptics.jl</code> is simulating refractive scattering. This page gives a tutorial to simulate refractive scattering effects.</p><h2 id="Loading-your-image" tabindex="-1">Loading your image <a class="header-anchor" href="#Loading-your-image" aria-label="Permalink to &quot;Loading your image {#Loading-your-image}&quot;">​</a></h2><p>Again, we use an example image in <a href="https://github.com/achael/eht-imaging" target="_blank" rel="noreferrer"><code>eht-imaging</code></a>. Data can be downloaded from <a href="./data/jason_mad_eofn.fits">here</a> (please open in a new window. otherwise you will get 404 error). This is a general relativistic magnetohydrodynamic (GRMHD) model of the magnetic arrestic disk originally from <a href="https://ui.adsabs.harvard.edu/abs/2014IAUS..303..298D" target="_blank" rel="noreferrer">Dexter et al. 2014</a>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CairoMakie</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is the base package for the Skymodel of the Comrade.jl ecosystem</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> VLBISkyModels</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Alternatively, you can import Comrade.jl instead. Either works.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># using Comrade</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Load a image model from an image FITS file</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> load_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/jason_mad_eofn.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, IntensityMap)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Frequency of the image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">νref </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> metadata</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">frequency</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Frequency of the image: &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, νref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1e9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; GHz&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+p+`" alt=""></p><h2 id="Simulating-Refractive-Scattering" tabindex="-1">Simulating Refractive Scattering <a class="header-anchor" href="#Simulating-Refractive-Scattering" aria-label="Permalink to &quot;Simulating Refractive Scattering {#Simulating-Refractive-Scattering}&quot;">​</a></h2><p>And, then again initialize a scattering model.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ScatteringOptics</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># initialize the scattering model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ScatteringModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DipoleScatteringModel{Float64}(1.38, 8.0e7, 1.38, 0.703, 81.9, 1.0, 8.701673999999999e21, 1.7063921e22, 0.5099457504520795, 0.5879203321591805, 1.9630156472261735, 3.8933699749663195, 10.476370590888147, 3.5025254191248507, 4.04238102210397e19, 5.8567426819253905, 4.650020392426908, 1.2067222894984828, 0.14137166941154058, 27.969627943900058, 0.24094564298608265, 16.43371800974761, 0.10641979388314901, 0.5127694683107693)</span></span></code></pre></div><p>Refractive scattering will distort the diffractively-scattered (i.e. emsemble-average) image and add compact substrucures so-called <em>refractive substructures</em>. These effects will be simulated with a phase screen generated from the probabilistic magnetic field wander model of the intersteller medium implemented in the scattering model.</p><p>First, let&#39;s initialize a phase screen model (<a href="/ScatteringOptics.jl/v0.1.8/api#ScatteringOptics.RefractivePhaseScreen">RefractivePhaseScreen</a>) from the scattering model and the model image.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Initialize a refractive phase screen model from scattering and image models</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rps </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> refractivephasescreen</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm, im)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Alternatively, you may make the screen model for arbitral grid</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   ScatteringOptics is design to work even if ScatteringScreen&#39;s grid is not consistent</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   with the image you want to scatter, thanks to a powerful interpolation scheme available.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># rps = RefractivePhaseScreen(sm, Nx, Ny, dx_rad, dy_rad)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RefractivePhaseScreen{DipoleScatteringModel{Float64}, Float64, StationaryRandomFields.NoiseSignal, PhaseScreenPowerLaw{2, DipoleScatteringModel{Float64}, Float64}}(DipoleScatteringModel{Float64}(1.38, 8.0e7, 1.38, 0.703, 81.9, 1.0, 8.701673999999999e21, 1.7063921e22, 0.5099457504520795, 0.5879203321591805, 1.9630156472261735, 3.8933699749663195, 10.476370590888147, 3.5025254191248507, 4.04238102210397e19, 5.8567426819253905, 4.650020392426908, 1.2067222894984828, 0.14137166941154058, 27.969627943900058, 0.24094564298608265, 16.43371800974761, 0.10641979388314901, 0.5127694683107693), 4.218690603755095e10, 4.218690603755095e10, StationaryRandomFields.NoiseSignal{Tuple{Int64, Int64}}((256, 256)), PhaseScreenPowerLaw{2, DipoleScatteringModel{Float64}, Float64}(DipoleScatteringModel{Float64}(1.38, 8.0e7, 1.38, 0.703, 81.9, 1.0, 8.701673999999999e21, 1.7063921e22, 0.5099457504520795, 0.5879203321591805, 1.9630156472261735, 3.8933699749663195, 10.476370590888147, 3.5025254191248507, 4.04238102210397e19, 5.8567426819253905, 4.650020392426908, 1.2067222894984828, 0.14137166941154058, 27.969627943900058, 0.24094564298608265, 16.43371800974761, 0.10641979388314901, 0.5127694683107693), 4.218690603755095e10, 4.218690603755095e10, 0.0, 0.0))</span></span></code></pre></div><p>You can sample a Gaussian noise in the Fourier domain.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Generate a phase screen. For this particular tutorial we will use StableRNG for the reproducibility.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> StableRNGs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rng </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> StableRNG</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">123</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">noise_screen </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> generate_gaussian_noise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rps; rng</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rng)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>129×256 Matrix{ComplexF64}:</span></span>
<span class="line"><span>        0.0+0.0im        -1.42237+0.211806im     …    -0.14404-1.46535im</span></span>
<span class="line"><span>   0.471559+1.23739im    0.660122+0.0873872im         -0.54038-0.185399im</span></span>
<span class="line"><span>  -0.888559-0.219822im  -0.476492+0.793291im         -0.614426-1.14927im</span></span>
<span class="line"><span>  -0.060101+0.194956im   0.185724+0.00740253im       0.0029722+0.315275im</span></span>
<span class="line"><span> -0.0666618-0.12437im   -0.313947-0.317471im         -0.659719+0.615051im</span></span>
<span class="line"><span>   0.691469-0.418463im  -0.229056+0.436795im     …  -0.0913364-1.38856im</span></span>
<span class="line"><span>   -0.47423-1.34245im     1.15835-1.36531im          -0.487128-0.136273im</span></span>
<span class="line"><span>  -0.505398-0.145882im   0.472817-0.502366im         -0.768268-0.5478im</span></span>
<span class="line"><span>  -0.683912+0.158674im   -1.26309+0.77461im           0.677391-0.3282im</span></span>
<span class="line"><span>  -0.964627-0.33336im     0.53031-1.0641im          -0.0528775-0.864448im</span></span>
<span class="line"><span>           ⋮                                     ⋱            ⋮</span></span>
<span class="line"><span>   -1.21983+0.583945im  -0.683662+0.615531im     …    0.513594+0.723873im</span></span>
<span class="line"><span>   0.094109+0.206076im  0.0302826+0.15087im            -1.0777+0.49935im</span></span>
<span class="line"><span>   0.549581+0.862441im  -0.288871+0.719656im          0.717905-0.790146im</span></span>
<span class="line"><span>  -0.283655+0.505174im  -0.451472+0.0615803im         0.645413-0.971754im</span></span>
<span class="line"><span> -0.0350022-1.03477im    -1.21324-0.15738im          -0.142354-0.245928im</span></span>
<span class="line"><span>   0.470806+0.257644im  -0.713483+0.000997682im  …   0.0947333+1.46063im</span></span>
<span class="line"><span>    0.34574-1.17356im     0.33842+0.00476794im       0.0671579-0.676809im</span></span>
<span class="line"><span>  -0.625574-0.668117im  -0.784044+0.289585im          0.440891-0.59245im</span></span>
<span class="line"><span>   -1.18389+0.0im       -0.771524+1.35287im            0.50275-0.443054im</span></span></code></pre></div><p>This Gaussian noise will be scaled with the powerspectrum of the phase screen, and then transformed into the actual phase screen. The fully scattered image can be generated by <a href="/ScatteringOptics.jl/v0.1.8/api#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}">scatter_image</a> method.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Produce the scattered image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scatter_image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rps, im; noise_screen</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">noise_screen)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_a, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+h+`" alt=""></p><p>If you completely randomize the process, you can skip the step to generate <code>noise_screen</code> and specify it in the argument of <a href="/ScatteringOptics.jl/v0.1.8/api#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}">scatter_image</a> method. In this case, the screen will be automatically generated inside <a href="/ScatteringOptics.jl/v0.1.8/api#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}">scatter_image</a> method.</p><p>There is a quick shortcut bypassing the noise screen generation, which has a less flexibility and a larger overhead for iterative processes.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Produce scattered image with observing wavelength .13 cm</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_a2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scatter_image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm, im; rng</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rng)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_a2, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+r+`" alt=""></p><p>Just because the refractive scattering effects cannot be described analytically in Fourier domain, <a href="/ScatteringOptics.jl/v0.1.8/api#ScatteringOptics.scatter_image-Tuple{AbstractPhaseScreen, ComradeBase.IntensityMap}">scatter_image</a> method only works for the image models (<code>::IntensityMap</code>). For sky models in <code>VLBISkyModels.jl</code>, you need to first instantiate an image model of your sky model.</p><p>Here we show an example using a simple Gaussian model. You need to create an image model with <code>intensitymap</code> method from <code>VLBISkyModels.jl</code>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Gaussian model from VLBISkyModels.jl</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">g </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> stretched</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Gaussian</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Create an image model from the Gaussian model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_g </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> intensitymap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(g, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imagepixels</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_g, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+k+`" alt=""></p><p>Then you can make a scattered image. Don&#39;t forget to add the observing frequency as im_g doesn&#39;t have a frequency information.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Produce scattered image. Don&#39;t forget to add the observing frequency as im_g doesn&#39;t have a frequency information.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_ga </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scatter_image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm, im_g; rng</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rng, νref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">νref)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_ga, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+d+`" alt=""></p><h2 id="Save-the-tutorial-data-and-do-some-unit-tests" tabindex="-1">Save the tutorial data and do some unit tests <a class="header-anchor" href="#Save-the-tutorial-data-and-do-some-unit-tests" aria-label="Permalink to &quot;Save the tutorial data and do some unit tests {#Save-the-tutorial-data-and-do-some-unit-tests}&quot;">​</a></h2><p>The output images may be saved to fits files. Here, we save the images generated in the tutorial above.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Average image of provided EHT fits file</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_a.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_a)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Scattered average image of Gaussian model</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_ga.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_ga)</span></span></code></pre></div><p>The saved files are available here (<a href="./data/im_a.fits">im_a.fits</a>, <a href="./data/im_a.fits">im_ga.fits</a>; please open in a new window. otherwise you will get 404 error).</p><h2 id="Unit-Tests" tabindex="-1">Unit Tests <a class="header-anchor" href="#Unit-Tests" aria-label="Permalink to &quot;Unit Tests {#Unit-Tests}&quot;">​</a></h2><p>Julia codes in our tutorial are automatically run at the compilation of the documentation at GitHub Workflow, and therefore those files are kept produced with the corresponding version of the package. For your own unit tests, you can compare fits files created in your local enviroment with these reference data. For instance, for the images,</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_a_ref </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> load_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;downloaded im_a.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, IntensityMap)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># take differences</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Δim_a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> im_a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> im_a_ref</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># compute a fractional error map</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">fim_a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Δim_a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">./</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (im_a_ref </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1e-10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># plot the error map</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">abs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.(fim_a))</span></span></code></pre></div>`,38)),s("p",null,[i[4]||(i[4]=t("In our tests, which compare images produced at GitHub (using ubuntu and x86 architecture) and a computer of the developer members (macOS with Apple Silicon M3 architecture), the maximum and mean fractional errors were ")),s("mjx-container",g,[(n(),a("svg",c,i[0]||(i[0]=[e('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="223C" d="M55 166Q55 241 101 304T222 367Q260 367 296 349T362 304T421 252T484 208T554 189Q616 189 655 236T694 338Q694 350 698 358T708 367Q722 367 722 334Q722 260 677 197T562 134H554Q517 134 481 152T414 196T355 248T292 293T223 311Q179 311 145 286Q109 257 96 218T80 156T69 133Q55 133 55 166Z" style="stroke-width:3;"></path></g><g data-mml-node="msup" transform="translate(1055.8,0)"><g data-mml-node="mn"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z" style="stroke-width:3;"></path><path data-c="30" d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z" transform="translate(500,0)" style="stroke-width:3;"></path></g><g data-mml-node="TeXAtom" transform="translate(1033,393.1) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="2212" d="M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z" style="stroke-width:3;"></path></g><g data-mml-node="mn" transform="translate(778,0)"><path data-c="38" d="M70 417T70 494T124 618T248 666Q319 666 374 624T429 515Q429 485 418 459T392 417T361 389T335 371T324 363L338 354Q352 344 366 334T382 323Q457 264 457 174Q457 95 399 37T249 -22Q159 -22 101 29T43 155Q43 263 172 335L154 348Q133 361 127 368Q70 417 70 494ZM286 386L292 390Q298 394 301 396T311 403T323 413T334 425T345 438T355 454T364 471T369 491T371 513Q371 556 342 586T275 624Q268 625 242 625Q201 625 165 599T128 534Q128 511 141 492T167 463T217 431Q224 426 228 424L286 386ZM250 21Q308 21 350 55T392 137Q392 154 387 169T375 194T353 216T330 234T301 253T274 270Q260 279 244 289T218 306L210 311Q204 311 181 294T133 239T107 157Q107 98 150 60T250 21Z" style="stroke-width:3;"></path></g></g></g></g></g>',1)]))),i[1]||(i[1]=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mo",null,"∼"),s("msup",null,[s("mn",null,"10"),s("mrow",{"data-mjx-texclass":"ORD"},[s("mo",null,"−"),s("mn",null,"8")])])])],-1))]),i[5]||(i[5]=t(" (found at the edge of images where the intensity is almost 0) and ")),s("mjx-container",m,[(n(),a("svg",E,i[2]||(i[2]=[e('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="223C" d="M55 166Q55 241 101 304T222 367Q260 367 296 349T362 304T421 252T484 208T554 189Q616 189 655 236T694 338Q694 350 698 358T708 367Q722 367 722 334Q722 260 677 197T562 134H554Q517 134 481 152T414 196T355 248T292 293T223 311Q179 311 145 286Q109 257 96 218T80 156T69 133Q55 133 55 166Z" style="stroke-width:3;"></path></g><g data-mml-node="msup" transform="translate(1055.8,0)"><g data-mml-node="mn"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z" style="stroke-width:3;"></path><path data-c="30" d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z" transform="translate(500,0)" style="stroke-width:3;"></path></g><g data-mml-node="TeXAtom" transform="translate(1033,393.1) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="2212" d="M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z" style="stroke-width:3;"></path></g><g data-mml-node="mn" transform="translate(778,0)"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z" style="stroke-width:3;"></path><path data-c="33" d="M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z" transform="translate(500,0)" style="stroke-width:3;"></path></g></g></g></g></g>',1)]))),i[3]||(i[3]=s("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("mo",null,"∼"),s("msup",null,[s("mn",null,"10"),s("mrow",{"data-mjx-texclass":"ORD"},[s("mo",null,"−"),s("mn",null,"13")])])])],-1))]),i[6]||(i[6]=t(", respectively. This is a sufficient accuracy for the vast majority (if not all!) of the analysis done in the EHT and broader radio astronomy communities."))])])}const Q=l(o,[["render",y]]);export{b as __pageData,Q as default};
