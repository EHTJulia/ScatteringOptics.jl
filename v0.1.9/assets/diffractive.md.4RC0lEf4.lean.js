import{_ as i,c as a,a5 as n,o as t}from"./chunks/framework.B7MgUy6J.js";const e="/ScatteringOptics.jl/v0.1.9/assets/ivitlac.DmSBQTOR.png",l="/ScatteringOptics.jl/v0.1.9/assets/ppfilcj.BUKCrLeq.png",h="/ScatteringOptics.jl/v0.1.9/assets/imrcfmh.QKuvC9IZ.png",p="/ScatteringOptics.jl/v0.1.9/assets/akhneac.DnumBZOB.png",k="/ScatteringOptics.jl/v0.1.9/assets/vwohkxr.B_32tWiw.png",r="/ScatteringOptics.jl/v0.1.9/assets/yvhvqrz.DnNIoQj5.png",d="/ScatteringOptics.jl/v0.1.9/assets/ppfilcj.BUKCrLeq.png",C=JSON.parse('{"title":"Simulate Diffractive Scattering","description":"","frontmatter":{},"headers":[],"relativePath":"diffractive.md","filePath":"diffractive.md","lastUpdated":null}'),g={name:"diffractive.md"};function E(o,s,c,y,m,F){return t(),a("div",null,s[0]||(s[0]=[n(`<h1 id="Simulate-Diffractive-Scattering" tabindex="-1">Simulate Diffractive Scattering <a class="header-anchor" href="#Simulate-Diffractive-Scattering" aria-label="Permalink to &quot;Simulate Diffractive Scattering {#Simulate-Diffractive-Scattering}&quot;">​</a></h1><p><code>ScatteringOptics.jl</code> is designed as a package inside the ecosystem of <a href="https://github.com/ptiede/Comrade.jl" target="_blank" rel="noreferrer"><code>Comrade.jl</code></a>. The scattering model in the package can scatter any sky model types from <code>Comrade.jl</code>. This page describes how to simulate diffractive scattering.</p><h2 id="Loading-your-image" tabindex="-1">Loading your image <a class="header-anchor" href="#Loading-your-image" aria-label="Permalink to &quot;Loading your image {#Loading-your-image}&quot;">​</a></h2><p>Here, we use an example image in <a href="https://github.com/achael/eht-imaging" target="_blank" rel="noreferrer"><code>eht-imaging</code></a>. Data can be downloaded from <a href="./data/jason_mad_eofn.fits">here</a> (please open in a new window. otherwise you will get 404 error). This is a general relativistic magnetohydrodynamic (GRMHD) model of the magnetic arrestic disk originally from <a href="https://ui.adsabs.harvard.edu/abs/2014IAUS..303..298D" target="_blank" rel="noreferrer">Dexter et al. 2014</a>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CairoMakie</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This is the base package for the Skymodel of the Comrade.jl ecosystem</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> VLBISkyModels</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Alternatively, you can import Comrade.jl instead. Either works.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># using Comrade</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Load a image model from an image FITS file</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> load_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/jason_mad_eofn.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, IntensityMap)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+e+`" alt=""></p><p>You can instantiate your scattering model with <code>ScatteringModel()</code>. If nothing is specified, the model will use the best-fit parameter set for Sgr A* in <a href="https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J/abstract" target="_blank" rel="noreferrer">Johnson et al. 2018</a>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ScatteringOptics</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># initialize the scattering model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ScatteringModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DipoleScatteringModel{Float64}(1.38, 8.0e7, 1.38, 0.703, 81.9, 1.0, 8.701673999999999e21, 1.7063921e22, 0.5099457504520795, 0.5879203321591805, 1.9630156472261735, 3.8933699749663195, 10.476370590888147, 3.5025254191248507, 4.04238102210397e19, 5.8567426819253905, 4.650020392426908, 1.2067222894984828, 0.14137166941154058, 27.969627943900058, 0.24094564298608265, 16.43371800974761, 0.10641979388314901, 0.5127694683107693)</span></span></code></pre></div><p>You can change the parameters if you want to simulate a different scattering screen. See <a href="/ScatteringOptics.jl/v0.1.9/api#ScatteringOptics.DipoleScatteringModel">ScatteringOptics.DipoleScatteringModel</a> for arguments.</p><h2 id="Simulate-diffractive-scattering" tabindex="-1">Simulate diffractive scattering <a class="header-anchor" href="#Simulate-diffractive-scattering" aria-label="Permalink to &quot;Simulate diffractive scattering {#Simulate-diffractive-scattering}&quot;">​</a></h2><p>As explained in <a href="/ScatteringOptics.jl/v0.1.9/math#Brief-Introduction-to-Interstellar-Scattering">Brief Introduction to Interstellar Scattering</a>, diffractive scattering will cause angular broaderning of the resultant image, which is described by the convolution of the source image with a scattering kernel. <code>ScatteringOptics.jl</code> implements a <code>Comrade.jl</code>&#39;s skymodel of the scattering kernel. You can generate it by</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Frequency of the image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">νref </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> metadata</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">frequency</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Frequency of the image: &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, νref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1e9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; GHz&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Create kernel from scattering model</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">skm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> kernelmodel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm, νref</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">νref)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ApproximatedScatteringKernel{Float64, DipoleScatteringModel{Float64}, Float64}(DipoleScatteringModel{Float64}(1.38, 8.0e7, 1.38, 0.703, 81.9, 1.0, 8.701673999999999e21, 1.7063921e22, 0.5099457504520795, 0.5879203321591805, 1.9630156472261735, 3.8933699749663195, 10.476370590888147, 3.5025254191248507, 4.04238102210397e19, 5.8567426819253905, 4.650020392426908, 1.2067222894984828, 0.14137166941154058, 27.969627943900058, 0.24094564298608265, 16.43371800974761, 0.10641979388314901, 0.5127694683107693), 2.29345e11)</span></span></code></pre></div><p><code>skm</code> is a subtype of <code>ComradeBase.AbstractModel</code>, and you can use any methods defined for sky models in <code>Comrade.jl</code>&#39;s ecosystem. For instance, you can compute the ensemble-average (or diffractively scattered) image using the <code>convolve</code> method from <code>VLBISkyModels.jl</code>,</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># scatter the image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_ea </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> convolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im, skm)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_ea, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+l+`" alt=""></p><p>You can also directly convolve a skymodel from <code>ComradeBase.AbstractModel</code> and implemented in <code>VLBISkyModels.jl</code>.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Gaussian model from VLBISkyModels.jl</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">g </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> stretched</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Gaussian</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_g </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> intensitymap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(g, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imagepixels</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_g, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+h+`" alt=""></p><p>Scattered model and image can be generated by,</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">g_ea </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> convolved</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(g, skm)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_gea </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> intensitymap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(g_ea, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imagepixels</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_gea, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+p+`" alt=""></p><p>You can also plot the scattering kernel. For instance in the image domain,</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># make an image model of the scattering kernel</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_skm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> intensitymap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(skm, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imagepixels</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">μas2rad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">256</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_skm, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+k+`" alt=""></p><p>You can compute the kernel visibility using <code>visibility_point</code> method from <code>VLBISkyModels.jl</code>. For instance,</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># computing kernels from 0 to 10 Glambda along RA</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">u </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> LinRange</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10e9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vis </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">visibility_point</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(skm, (U</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">u, V</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Fr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">νref)) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> u</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">u]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">f </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Figure</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ax </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Axis</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(f[</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    xlabel</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Baseline Length (Gλ)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ylabel</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Kernel Amplitudes&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">plot!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ax, u</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1e9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">abs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.(vis))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">f</span></span></code></pre></div><p><img src="`+r+`" alt=""></p><h2 id="A-quick-shortcut" tabindex="-1">A quick shortcut <a class="header-anchor" href="#A-quick-shortcut" aria-label="Permalink to &quot;A quick shortcut {#A-quick-shortcut}&quot;">​</a></h2><p>The above tutorial is intentionally written in a low level. There is <a href="/ScatteringOptics.jl/v0.1.9/api#ScatteringOptics.ensembleaverage-Tuple{AbstractScatteringModel, ComradeBase.AbstractModel, Any}">ensembleaverage</a> method to do a quick shortcut by bypassing the kernel generation.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># scatter the image</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im_ea_2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ensembleaverage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm, im)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Plot source image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">imageviz</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(im_ea_2, size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), colormap</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">:afmhot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><img src="`+d+`" alt=""></p><p>Although this is handy, it may have an extra overhead to initialize <code>skm</code> which may slow down highly iterative processes. <a href="/ScatteringOptics.jl/v0.1.9/api#ScatteringOptics.ensembleaverage-Tuple{AbstractScatteringModel, ComradeBase.AbstractModel, Any}">ensembleaverage</a> method also supports more general skymodels in <code>ComradeBase.AbstractModel</code> as an input instead of the image model.</p><h2 id="Save-the-tutorial-data" tabindex="-1">Save the tutorial data <a class="header-anchor" href="#Save-the-tutorial-data" aria-label="Permalink to &quot;Save the tutorial data {#Save-the-tutorial-data}&quot;">​</a></h2><p>The output images may be saved to fits files. Here, we save the images generated in the tutorial above.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Ensemble average image of provided EHT fits file</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_ea.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_ea)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Gaussian model and its scattered ensemble average image</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_g.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_g)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_gea.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_gea)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Scattering kernel</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save_fits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/im_skm.fits&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, im_skm)</span></span></code></pre></div><p>You can download generated files from here (<a href="./data/im_ea.fits">im_ea.fits</a>, <a href="./data/im_ea.fits">im_g.fits</a>, <a href="./data/im_gea.fits">im_gea.fits</a>, <a href="./data/im_skm.fits">im_skm.fits</a>; please open in a new window. otherwise you will get 404 error).</p><p>We also save the kernel visibilities calculated in the tutorial.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HDF5</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Save the computed kernel data</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">h5open</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data/kernel.h5&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;w&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">do</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> file</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    file[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;u&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(u)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    file[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;vis&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> vis</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1000-element Vector{ComplexF64}:</span></span>
<span class="line"><span>                 1.0 + 0.0im</span></span>
<span class="line"><span>  0.9999954071523528 + 0.0im</span></span>
<span class="line"><span>  0.9999816289767681 + 0.0im</span></span>
<span class="line"><span>  0.9999586665751884 + 0.0im</span></span>
<span class="line"><span>  0.9999265217837584 + 0.0im</span></span>
<span class="line"><span>  0.9998851971721843 + 0.0im</span></span>
<span class="line"><span>  0.9998346960428404 + 0.0im</span></span>
<span class="line"><span>  0.9997750224296191 + 0.0im</span></span>
<span class="line"><span>  0.9997061810965293 + 0.0im</span></span>
<span class="line"><span>  0.9996281775360422 + 0.0im</span></span>
<span class="line"><span>                     ⋮</span></span>
<span class="line"><span> 0.11559473637711046 + 0.0im</span></span>
<span class="line"><span> 0.11522330025187441 + 0.0im</span></span>
<span class="line"><span> 0.11485290794090472 + 0.0im</span></span>
<span class="line"><span> 0.11448355715840004 + 0.0im</span></span>
<span class="line"><span> 0.11411524562062209 + 0.0im</span></span>
<span class="line"><span> 0.11374797104590981 + 0.0im</span></span>
<span class="line"><span> 0.11338173115469348 + 0.0im</span></span>
<span class="line"><span> 0.11301652366950847 + 0.0im</span></span>
<span class="line"><span> 0.11265234631500975 + 0.0im</span></span></code></pre></div><p>You can find the generated file from <a href="./data/kernel.h5">here</a> (please open in a new window. otherwise you will get 404 error). Additionally, for accuracy and speed evaluations of the scattering kernel, see <a href="/ScatteringOptics.jl/v0.1.9/benchmarks#Benchmarks">Benchmarks</a>.</p><h2 id="Unit-Tests" tabindex="-1">Unit Tests <a class="header-anchor" href="#Unit-Tests" aria-label="Permalink to &quot;Unit Tests {#Unit-Tests}&quot;">​</a></h2><p>You can do your own unit tests by comparing your own outputs with those created in the website. Please see at the end of <a href="/ScatteringOptics.jl/v0.1.9/refractive#Simulate-Refractive-Scattering">Simulate Refractive Scattering</a> for a quick example.</p>`,44)]))}const v=i(g,[["render",E]]);export{C as __pageData,v as default};