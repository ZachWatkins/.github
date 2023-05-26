import fs from 'fs'
import { marked } from 'marked'
import { gfmHeadingId } from "marked-gfm-heading-id"

marked.use(gfmHeadingId())

const preHtml = `<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="styles/github-markdown-css/github-markdown.css">
        <title>README</title>
    </head>
    <body>`
const postHtml = `</body></html>`

async function copyFile(src, dest) {
    const destDirectory = dest.substring(0, dest.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.copyFileSync(src, dest)
}

async function buildMarkdown(path) {
    const content = fs.readFileSync(path, 'utf8')
    const html = marked.parse(content, { mangle: false })
    const destination = 'build/' + path.replace('.md', '.html')
    const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.writeFileSync('build/' + path.replace('.md', '.html'), preHtml + html + postHtml)
}

Promise.all([
    copyFile('node_modules/github-markdown-css/github-markdown.css', 'build/styles/github-markdown-css/github-markdown.css'),
    copyFile('node_modules/github-markdown-css/license', 'build/styles/github-markdown-css/license'),
    buildMarkdown('contributing/development.md'),
    buildMarkdown('contributing/self-review.md'),
    buildMarkdown('contributing/types-of-contributions.md'),
    buildMarkdown('CHANGELOG.md'),
    buildMarkdown('CODE_OF_CONDUCT.md'),
    buildMarkdown('CONTRIBUTING.md'),
    buildMarkdown('LICENSE'),
    buildMarkdown('README.md'),
    buildMarkdown('SECURITY.md'),
])
