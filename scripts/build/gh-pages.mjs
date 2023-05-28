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

/**
 * Builds a set of web pages from Markdown files and copies assets to a specified directory.
 * @param {Object} options - The build options.
 * @param {Array} options.markdown - An array of Markdown files to build.
 * @param {Array} options.assets - An array of asset files to copy.
 * @param {string} options.directory - The directory to output the built files to.
 * @param {Object} [options.page] - An object containing template parts to use for the built pages.
 * @returns {void}
 */
function build({ markdown, assets, directory, page }) {
    page = page ? { ...templateParts, ...page } : templateParts

    const queue = []

    for (let i = 0; i < markdown.length; i++) {
        queue.push(buildMarkdownWebpage(i, markdown, directory, page))
    }

    for (let i = 0; i < assets.length; i++) {

        queue.push(new Promise((resolve) => {

            const destDirectory = directory + '/' + assets[i][1].substring(0, assets[i][1].lastIndexOf('/'))

            if (!fs.existsSync(destDirectory)) {
                fs.mkdirSync(destDirectory, { recursive: true })
            }

            resolve(fs.copyFileSync(assets[i][0], directory + '/' + assets[i][1]))

        }))

    }

    Promise.all(queue)

}

/**
 * Builds a web page from a Markdown file.
 * @param {number} index - The index of the Markdown file entry within the fileMap array.
 * @param {[string[]]} fileMap - An array of Markdown files and their destination HTML file path.
 * @param {string} directory - The directory to output the built files to.
 * @param {Object} page - An object containing template parts to use for the built page.
 * @returns {Promise} A promise that resolves when the page has been built.
 */
async function buildMarkdownWebpage(index, fileMap, directory, page) {

    const source = fileMap[index][0]
    const destination = directory + '/' + fileMap[index][1]

    const content = fs.readFileSync(source, 'utf8')

    marked.parse(content, { mangle: false }).then((markdownHtml) => {

        const html = applyTemplate(markdownHtml, page, destination, fileMap)

        const destDirectory = destination.substring(0, destination.lastIndexOf('/'))

        if (!fs.existsSync(destDirectory)) {
            fs.mkdirSync(destDirectory, { recursive: true })
        }

        fs.writeFileSync(destination, html)
    })

}

/**
 * Apply a webpage template to the Markdown content.
 * @param {string} markdownHtml
 * @param {string} template
 * @param {string} destination
 * @param {[string[]]} fileMap
 * @returns
 */
function applyTemplate(markdownHtml, template, destination, fileMap) {

    let html = relinkFileRoutes(markdownHtml, fileMap)
    html = pathIsDeep(destination)
        ? setStylesheetDepth(template.pre, pathDepth(destination)) + html
        : template.pre + html
    html += template.post
    return html

}

// Update markdown file references to html file references for this repository's files being built for GitHub Pages.
function relinkFileRoutes(html, fileMap) {

    for (let i = 0; i < fileMap.length; i++) {
        const source = fileMap[i][0]
        const position = html.indexOf(`href="./${source}"`)
        if (position > -1) {
            const destination = fileMap[i][1]
            html = html.replaceAll(`href="./${source}"`, `href="./${destination}"`)
        }
    }

    // Also relink any relative links to other markdown files.
    html = html.replaceAll(/href="(\.\/[^"]+)\.md"/g, 'href="$1.html"')

    return html

}

/**
 * Update CSS stylesheet link for nested routes.
 * @param {string} html - The HTML to update.
 * @param {number} depth - The depth of the HTML file.
 * @returns {string} The updated HTML.
 */
function setStylesheetDepth(html, depth) {

    return html.replace(
        'href="./styles/github-markdown-css/github-markdown.css"',
        `href="${'../'.repeat(depth - 1)}styles/github-markdown-css/github-markdown.css"`
    )

}

/**
 * Detect whether a given path is nested.
 * @param {string} path - The path to check.
 * @returns {boolean} Whether the path is nested.
 */
function pathIsDeep(path) {

    if (0 === path.indexOf('./')) {
        return path.substring(2).split('/').length > 1
    }

    return path.split('/').length > 1

}

/**
 * Get a zero-based depth of the given file path.
 * @param {string} path - The path to evaluate.
 * @returns {number} The zero-based depth of the path.
 */
function pathDepth(path) {

    if (0 === path.indexOf('./')) {
        return path.substring(2).split('/').length - 1
    }

    return path.split('/').length - 1

}

export default build
