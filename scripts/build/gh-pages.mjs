/**
 * Build a GitHub Pages site from Markdown files.
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */
import fs from 'fs'
import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
marked.use({ gfm: true, async: true })
marked.use(gfmHeadingId())

const templateParts = {
    pre: `<!doctype html>
<html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="./styles/github-markdown-css/github-markdown.css">
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
</html>`,
}

function build({ markdown, assets, directory, page }) {
    page = page ? { ...templateParts, ...page } : templateParts

    const queue = []

    for (let i = 0; i < markdown.length; i++) {
        queue.push(buildMarkdown(i, markdown, directory, page))
    }

    for (let i = 0; i < assets.length; i++) {
        queue.push(copyFile(assets[i][0], assets[i][1], directory))
    }
}

async function copyFile(source, destination, directory) {
    destination = directory + '/' + destination
    const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
    if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true })
    }
    fs.copyFileSync(source, destination)
}

async function buildMarkdown(index, fileMap, directory, page) {
    const source = fileMap[index][0]
    const destination = directory + '/' + fileMap[index][1]

    const content = fs.readFileSync(source, 'utf8')

    marked.parse(content, { mangle: false }).then((html) => {

        html = relinkFileRoutes(html, fileMap)
        html = page.pre + html + page.post

        // Update CSS stylesheet link for nested routes.
        const depth = destination.split('/').length - 1
        if (depth > 1) {
            html = html.replace(
                'href="./styles/github-markdown-css/github-markdown.css"',
                `href="${'../'.repeat(depth - 1)}styles/github-markdown-css/github-markdown.css"`
            )
        }

        const destDirectory = destination.substring(0, destination.lastIndexOf('/'))
        if (!fs.existsSync(destDirectory)) {
            fs.mkdirSync(destDirectory, { recursive: true })
        }
        fs.writeFileSync(destination, html)
    })
}

// Update markdown file references to html file references for this repository's files being build for GitHub Pages.
function relinkFileRoutes(html, fileMap) {

    for (let i = 0; i < fileMap.length; i++) {
        const source = fileMap[i][0]
        const position = html.indexOf(`href="./${source}"`)
        if (position > -1) {
            const destination = fileMap[i][1]
            html = html.replaceAll(`href="./${source}"`, `href="./${destination}"`)
        }
    }

    return html

}

export default build
