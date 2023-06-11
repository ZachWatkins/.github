/**
 * Markdown to HTML build script.
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */
import build from './gh-pages/gh-pages.mjs'

const directory = process.env.npm_package_config_ghPages_directory || 'gh-pages'
const assets = process.env.npm_package_config_ghPages_assets
    ? process.env.npm_package_config_ghPages_assets
        .split("\n")
        .filter(value => value)
        .map(value => value.split(':'))
    : [
        ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
        ['node_modules/github-markdown-css/license', 'styles/github-markdown-css/license'],
    ]
const markdown = process.env.npm_package_config_ghPages_markdown
    ? process.env.npm_package_config_ghPages_markdown
        .split("\n")
        .filter(value => value)
    : ['README.md']

build({ markdown, assets, directory })
