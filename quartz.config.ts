import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "DSA Documentation",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Quicksand",
        body: "Nunito",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#fdfdfa", // soft soothing cream
          lightgray: "#f0f0e8", // soft clay gray
          gray: "#a3a397", // stone gray
          darkgray: "#4a4a40", // warm charcoal
          dark: "#1c1c14", // dark wood
          secondary: "#3b593f", // organic forest green
          tertiary: "#8c6239", // terracotta clay
          highlight: "rgba(59, 89, 63, 0.07)", // soft green highlights
          textHighlight: "rgba(230, 185, 128, 0.4)", // soft warm amber
        },
        darkMode: {
          light: "#121813", // deep dark forest night
          lightgray: "#202a21", // slate pine forest
          gray: "#667a68", // moss gray
          darkgray: "#cbd3cb", // mist green gray
          dark: "#f3f6f3", // mist white
          secondary: "#6eb079", // soft sage green
          tertiary: "#e6b980", // wheat gold
          highlight: "rgba(110, 176, 121, 0.12)", // moss highlighted glow
          textHighlight: "rgba(230, 185, 128, 0.25)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
