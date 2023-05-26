import fs from 'fs'
import { marked } from 'marked'
import { gfmHeadingId } from "marked-gfm-heading-id"
marked.use(gfmHeadingId())

const files = [
    ['README.md', 'index.html'],
    ['contributing/development.md', 'contributing/development.html'],
    ['contributing/self-review.md', 'contributing/self-review.html'],
    ['contributing/types-of-contributions.md', 'contributing/types-of-contributions.html'],
    ['CHANGELOG.md', 'changelog.html'],
    ['CODE_OF_CONDUCT.md', 'code-of-conduct.html'],
    ['CONTRIBUTING.md', 'contributing.html'],
    ['LICENSE', 'license.html'],
    ['SECURITY.md', 'security.html'],
]

const dom = {
    pre: `<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="styles/github-markdown-css/github-markdown.css">
        <title>README</title>
    </head>
    <body>`,
    pages: `<ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="contributing/development.html">Development</a></li>
        <li><a href="contributing/self-review.html">Self Review</a></li>
        <li><a href="contributing/types-of-contributions.html">Types of Contributions</a></li>
        <li><a href="changelog.html">Changelog</a></li>
        <li><a href="code-of-conduct.html">Code of Conduct</a></li>
        <li><a href="contributing.html">Contributing</a></li>
        <li><a href="license.html">License</a></li>
        <li><a href="security.html">Security</a></li>
    </ul>`,
    post: `</body></html>`
}

Promise.all([
    copyFile('node_modules/github-markdown-css/github-markdown.css', 'build/styles/github-markdown-css/github-markdown.css'),
    copyFile('node_modules/github-markdown-css/license', 'build/styles/github-markdown-css/license'),
])

Promise.all(files.map(async ([src, dest]) => {

function makeNavList(files) {
    let nav = '<ul><li><a href="index.html">Home</a></li>'
    for (let i = 1; i < files.length; i++) {
        nav += '<li><a href="' + files[i][1] + '">' + files[i][0] + '</a></li>'
    }
    nav += '</ul>'
    return nav
}

async function copyFile(src, dest) {
    const destDirectory = dest.substring(0, dest.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.copyFileSync(src, dest)
}

async function buildMarkdown(path) {
    const content = fs.readFileSync(path[0], 'utf8')
    const html = marked.parse(content, { mangle: false })
    const destination = 'build/' + path[1]
    const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.writeFileSync(destination, dom.pre + html + dom.post)
}
