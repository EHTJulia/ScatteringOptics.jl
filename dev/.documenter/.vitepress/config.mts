import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import mathjax3 from "markdown-it-mathjax3";
import footnote from "markdown-it-footnote";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ScatteringOptics.jl/dev/',// TODO: replace this in makedocs!
  title: 'ScatteringOptics.jl',
  description: 'Documentation for ScatteringOptics.jl',
  lastUpdated: true,
  cleanUrls: true,
  outDir: '../final_site', // This is required for MarkdownVitepress to work correctly...
  
  ignoreDeadLinks: true,

  markdown: {
    math: true,
    config(md) {
      md.use(tabsMarkdownPlugin),
      md.use(mathjax3),
      md.use(footnote)
    },
    theme: {
      light: "github-light",
      dark: "github-dark"}
  },
  themeConfig: {
    outline: 'deep',
    
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },
    nav: [
{ text: 'Home', link: '/index' },
{ text: 'Introduction', link: '/introduction' },
{ text: 'Brief Introduction to interstellar scattering', link: '/math' },
{ text: 'Benchmarks', link: '/benchmarks' },
{ text: 'Tutorials', collapsed: false, items: [
{ text: 'Getting Started', collapsed: false, items: [
{ text: 'Simulate Diffractive Scattering', link: '/diffractive' },
{ text: 'Simulate Refractive Scattering', link: '/refractive' }]
 },
{ text: 'Advanced', collapsed: false, items: [
{ text: 'Use Non-default Models', link: '/nondefaultmodels' },
{ text: 'Define Your Own Scattering Model', link: '/custommodels' }]
 }]
 },
{ text: 'ScateringOptics.jl API', link: '/api' }
]
,
    sidebar: [
{ text: 'Home', link: '/index' },
{ text: 'Introduction', link: '/introduction' },
{ text: 'Brief Introduction to interstellar scattering', link: '/math' },
{ text: 'Benchmarks', link: '/benchmarks' },
{ text: 'Tutorials', collapsed: false, items: [
{ text: 'Getting Started', collapsed: false, items: [
{ text: 'Simulate Diffractive Scattering', link: '/diffractive' },
{ text: 'Simulate Refractive Scattering', link: '/refractive' }]
 },
{ text: 'Advanced', collapsed: false, items: [
{ text: 'Use Non-default Models', link: '/nondefaultmodels' },
{ text: 'Define Your Own Scattering Model', link: '/custommodels' }]
 }]
 },
{ text: 'ScateringOptics.jl API', link: '/api' }
]
,
    editLink: { pattern: "https://github.com/EHTJulia/ScatteringOptics.jl/edit/main/docs/src/:path" },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/EHTJulia/ScatteringOptics.jl' }
    ],
    footer: {
      message: 'Made with <a href="https://luxdl.github.io/DocumenterVitepress.jl/dev/" target="_blank"><strong>DocumenterVitepress.jl</strong></a><br>',
      copyright: `© Copyright ${new Date().getUTCFullYear()}.`
    }
  }
})
