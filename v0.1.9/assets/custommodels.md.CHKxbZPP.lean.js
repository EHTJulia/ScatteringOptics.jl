import{_ as e,c as t,a5 as n,j as i,a,o as l}from"./chunks/framework.B7MgUy6J.js";const D=JSON.parse('{"title":"Define Your Own Scattering Model","description":"","frontmatter":{},"headers":[],"relativePath":"custommodels.md","filePath":"custommodels.md","lastUpdated":null}'),h={name:"custommodels.md"},p={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},k={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.666ex"},xmlns:"http://www.w3.org/2000/svg",width:"2.12ex",height:"2.236ex",role:"img",focusable:"false",viewBox:"0 -694 937 988.2","aria-hidden":"true"},r={class:"MathJax",jax:"SVG",style:{direction:"ltr",position:"relative"}},d={style:{overflow:"visible","min-height":"1px","min-width":"1px","vertical-align":"-0.666ex"},xmlns:"http://www.w3.org/2000/svg",width:"2.12ex",height:"2.236ex",role:"img",focusable:"false",viewBox:"0 -694 937 988.2","aria-hidden":"true"};function E(g,s,o,c,y,m){return l(),t("div",null,[s[11]||(s[11]=n(`<h1 id="Define-Your-Own-Scattering-Model" tabindex="-1">Define Your Own Scattering Model <a class="header-anchor" href="#Define-Your-Own-Scattering-Model" aria-label="Permalink to &quot;Define Your Own Scattering Model {#Define-Your-Own-Scattering-Model}&quot;">​</a></h1><p>While this package covers all three probabilistic models published in literature as of 2024 (see <a href="/ScatteringOptics.jl/v0.1.9/math#Brief-Introduction-to-Interstellar-Scattering">Brief Introduction to Interstellar Scattering</a>), users may define a custom probabilistic model leveledging a high level abstraction of data types implemented in this package.</p><p>To make your own custom model, you only need to define a custom type of <a href="/ScatteringOptics.jl/v0.1.9/api#ScatteringOptics.AbstractScatteringModel">ScatteringOptics.AbstractScatteringModel</a>. You need to define the constructor of the type with the standardized parameters set in the literature. Here is a quick example. As long as your model is compatible with the framework of the semianalytic models in Psaltis et al. [1], you need to change only few lines.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ScatteringOptics</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">struct</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> YourScatteringModel{T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> AbstractScatteringModel</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Mandatory fields for AbstractScatteringModel</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    #   fundamental parameters</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    α</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    rin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    θmaj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    θmin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ϕpa</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    λ0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    R</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    #   precomputed mandatory constants</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    M</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Qbar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    C</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D1maj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D2maj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D1min</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D2min</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    #   optional constants</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    A</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ζ0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ϕ0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Amaj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Amin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    kζ</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Bmaj</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Bmin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">T</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    ....</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # Constructor. Here the default parameters are for Sgr A* (Johnson et al. 2018, [4])</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> YourScatteringModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(; α</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.38</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, rin_cm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">800e5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, θmaj_mas</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.380</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, θmin_mas</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.703</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ϕpa_deg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">81.9</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, λ0_cm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, D_kpc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2.82</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, R_kpc</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5.53</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # compute asymmetry parameters and magnification parameter</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        A </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_A</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(θmaj_mas, θmin_mas)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ζ0 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_ζ0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(A)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        M </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_M</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(D_kpc, R_kpc)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # convert D and R to cm</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        D_cm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kpc_tp_cm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">D_kpc</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        R_cm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> kpc_tp_cm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">R_kpc</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # position angle (measured from Dec axis in CCW)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # to a more tranditional angle measured from RA axis in CW</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ϕ0 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_ϕ0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ϕpa_deg)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Parameters for the approximate phase structure function</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        θmaj_rad </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_θrad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(θmaj_mas) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># milliarcseconds to radians</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        θmin_rad </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_θrad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(θmin_mas) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># milliarcseconds to radians</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Amaj </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_Amaj</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rin_cm, λ0_cm, M, θmaj_rad)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Amin </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_Amin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rin_cm, λ0_cm, M, θmin_rad)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # C parameters that scale the powerspectrum of the phase screen</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Qbar </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_Qbar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, rin_cm, λ0_cm, M, θmaj_rad, θmin_rad)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        C </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_C</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, rin_cm, λ0_cm, Qbar)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # find the concentration parameter often included in the field model</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #   THIS DEPENDS ON YOUR FIELD WANDER MODEL</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        kζ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ....</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # Set Pϕ</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #   THIS DEPENDS ON YOUR FIELD WANDER MODEL</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        Pϕfunc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ϕ) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Pϕ</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(YourScatteringModel, ϕ, α, ϕ0, kζ, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # B parameters</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        B_prefac </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_B_prefac</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, C)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Bmaj </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_Bmaj</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, ϕ0, Pϕfunc, B_prefac)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Bmin </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_Bmin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, ϕ0, Pϕfunc, B_prefac)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # D parameters</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        D1maj </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_D1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, Amaj, Bmaj)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        D2maj </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_D2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, Amaj, Bmaj)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        D1min </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_D1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, Amin, Bmin)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        D2min </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> calc_D2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(α, Amin, Bmin)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> new{typeof(α)}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            α, rin_cm, θmaj_mas, θmin_mas, ϕpa_deg, λ0_cm, D_cm, R_cm,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            M, Qbar, C, D1maj, D2maj, D1min, D2min,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            A, ζ0, ϕ0, Amaj, Amin, kζ, Bmaj, Bmin, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        )</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    end</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Define the probability density function for the field wander</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   THIS DEPENDS ON YOUR FIELD WANDER MODEL</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Pϕ</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Type{&lt;:YourScatteringModel}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ϕ, α, ϕ0, kζ, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Simplified version using precomputed values.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   THIS DEPENDS ON YOUR FIELD WANDER MODEL</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Pϕ</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">YourScatteringModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ϕ)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Pϕ</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(YourScatteringModel, ϕ, sm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">α, sm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ϕ0, sm</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kζ, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>For the actual examples, please have a look at the source codes of the three models, which are currently in <code>src/scatteringmodels/models</code>. <code>calc_xxxx</code> functions are all defined in <code>src/scatteringmodels/commonfunctions.jl</code>. Most of the parameters are denoted following Psaltis et al. [1]. This package implements equations connecting the standardized parameters to various precomputed parameters using equations in the eht-imaging library based on [2-4].</p><p>Once you define your scattering model, you can simply use your model by</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> YourScatteringModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div>`,7)),i("p",null,[s[4]||(s[4]=a("The field wander model often involves a concentration parameter (denoted as ")),i("mjx-container",p,[(l(),t("svg",k,s[0]||(s[0]=[n('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msub"><g data-mml-node="mi"><path data-c="1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z" style="stroke-width:3;"></path></g><g data-mml-node="mi" transform="translate(554,-150) scale(0.707)"><path data-c="1D701" d="M296 643Q298 704 324 704Q342 704 342 687Q342 682 339 664T336 633Q336 623 337 618T338 611Q339 612 341 612Q343 614 354 616T374 618L384 619H394Q471 619 471 586Q467 548 386 546H372Q338 546 320 564L311 558Q235 506 175 398T114 190Q114 171 116 155T125 127T137 104T153 86T171 72T192 61T213 53T235 46T256 39L322 16Q389 -10 389 -80Q389 -119 364 -154T300 -202Q292 -204 274 -204Q247 -204 225 -196Q210 -192 193 -182T172 -167Q167 -159 173 -148Q180 -139 191 -139Q195 -139 221 -153T283 -168Q298 -166 310 -152T322 -117Q322 -91 302 -75T250 -51T183 -29T116 4T65 62T44 160Q44 287 121 410T293 590L302 595Q296 613 296 643Z" style="stroke-width:3;"></path></g></g></g></g>',1)]))),s[1]||(s[1]=i("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[i("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[i("msub",null,[i("mi",null,"k"),i("mi",null,"ζ")])])],-1))]),s[5]||(s[5]=a(" in Psaltis et al. [1]). This package offers an abstract type ")),s[6]||(s[6]=i("a",{href:"/ScatteringOptics.jl/v0.1.9/api#ScatteringOptics.AbstractKzetaFinder"},"AbstractKzetaFinder",-1)),s[7]||(s[7]=a(" to numerically solve ")),i("mjx-container",r,[(l(),t("svg",d,s[2]||(s[2]=[n('<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msub"><g data-mml-node="mi"><path data-c="1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z" style="stroke-width:3;"></path></g><g data-mml-node="mi" transform="translate(554,-150) scale(0.707)"><path data-c="1D701" d="M296 643Q298 704 324 704Q342 704 342 687Q342 682 339 664T336 633Q336 623 337 618T338 611Q339 612 341 612Q343 614 354 616T374 618L384 619H394Q471 619 471 586Q467 548 386 546H372Q338 546 320 564L311 558Q235 506 175 398T114 190Q114 171 116 155T125 127T137 104T153 86T171 72T192 61T213 53T235 46T256 39L322 16Q389 -10 389 -80Q389 -119 364 -154T300 -202Q292 -204 274 -204Q247 -204 225 -196Q210 -192 193 -182T172 -167Q167 -159 173 -148Q180 -139 191 -139Q195 -139 221 -153T283 -168Q298 -166 310 -152T322 -117Q322 -91 302 -75T250 -51T183 -29T116 4T65 62T44 160Q44 287 121 410T293 590L302 595Q296 613 296 643Z" style="stroke-width:3;"></path></g></g></g></g>',1)]))),s[3]||(s[3]=i("mjx-assistive-mml",{unselectable:"on",display:"inline",style:{top:"0px",left:"0px",clip:"rect(1px, 1px, 1px, 1px)","-webkit-touch-callout":"none","-webkit-user-select":"none","-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none",position:"absolute",padding:"1px 0px 0px 0px",border:"0px",display:"block",width:"auto",overflow:"hidden"}},[i("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[i("msub",null,[i("mi",null,"k"),i("mi",null,"ζ")])])],-1))]),s[8]||(s[8]=a(" from the given scattering parameters. You can see actual examples for three models in ")),s[9]||(s[9]=i("code",null,"src/kzetafinders",-1)),s[10]||(s[10]=a(" along with the definition of the abstract type."))]),s[12]||(s[12]=n('<p>You should be able to use all of functions in tutorials with your own model. Enjoy!</p><h2 id="references" tabindex="-1">References <a class="header-anchor" href="#references" aria-label="Permalink to &quot;References&quot;">​</a></h2><p>[1] Psaltis, D., et al., 2018, arXiv e-prints, arXiv:1805.01242, DOI: <a href="https://doi.org/10.48550/arXiv.1805.01242" target="_blank" rel="noreferrer">10.48550/arXiv.1805.01242</a> (<a href="https://ui.adsabs.harvard.edu/abs/2018arXiv180501242P" target="_blank" rel="noreferrer">ADS</a>)</p><p>[2] Johnson, M. D., Narayan, R., 2016, The Astrophysical Journal, 826, 170, DOI: <a href="https://doi.org/10.3847/0004-637X/826/2/170" target="_blank" rel="noreferrer">10.3847/0004-637X/826/2/170</a> (<a href="https://ui.adsabs.harvard.edu/abs/2016ApJ...826..170J" target="_blank" rel="noreferrer">ADS</a>)</p><p>[3] Johnson, M. D., 2016, The Astrophysical Journal, 833, 74, DOI: <a href="https://doi.org/10.3847/1538-4357/833/1/74" target="_blank" rel="noreferrer">10.3847/1538-4357/833/1/74</a> (<a href="https://ui.adsabs.harvard.edu/abs/2016ApJ...833...74J" target="_blank" rel="noreferrer">ADS</a>)</p><p>[4] Johnson, M. D., et al., 2018, The Astrophysical Journal, 865, 104, DOI: <a href="https://doi.org/10.3847/1538-4357/aadcff" target="_blank" rel="noreferrer">10.3847/1538-4357/aadcff</a> (<a href="https://ui.adsabs.harvard.edu/abs/2018ApJ...865..104J" target="_blank" rel="noreferrer">ADS</a>)</p>',6))])}const A=e(h,[["render",E]]);export{D as __pageData,A as default};
