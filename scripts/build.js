/**
 * Markdown to HTML build script.
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */
import fs from 'fs'
import { marked } from 'marked'
import { gfmHeadingId } from "marked-gfm-heading-id"
marked.use({ gfm: true })
marked.use(gfmHeadingId())

const markdown = [
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

const assets = [
    ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
    ['node_modules/github-markdown-css/license', 'styles/github-markdown-css/license'],
]

const dom = {
    pre: `<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="styles/github-markdown-css/github-markdown.css">
        <title>README</title>
        <style>
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
            }

            @media (max-width: 767px) {
                .markdown-body {
                    padding: 15px;
                }
            }
        </style>
    </head>
    <body class="markdown-body">`,
    navigation: ['<ul>', '</ul>'],
    post: `</body>
</html>`
}

// END OF CONFIGURATION.
// BEGIN BUILD LOGIC.

const queue = []

for (let i = 0; i < markdown.length; i++) {
    queue.push(buildMarkdown(markdown[i][0], markdown[i][1]))
}

for (let i = 0; i < assets.length; i++) {
    queue.push(copyFile(assets[i][0], assets[i][1]))
}

function makeNavList(files) {
    let nav = '<ul><li><a href="index.html">Home</a></li>'
    for (let i = 1; i < files.length; i++) {
        nav += '<li><a href="' + files[i][1] + '">' + files[i][0] + '</a></li>'
    }
    nav += '</ul>'
    return nav
}

async function copyFile(source, destination) {
    destination = 'build/' + destination
    const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.copyFileSync(source, destination)
}

async function buildMarkdown(source, destination) {
    destination = 'build/' + destination
    const content = fs.readFileSync(source, 'utf8')
    const html = marked.parse(content, { mangle: false })
    const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.writeFileSync(destination, dom.pre + html + dom.post)
}
