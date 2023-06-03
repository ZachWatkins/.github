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

/**
 * Builds a set of web pages from Markdown files and copies assets to a specified directory.
 * @param {Object} options - The build options.
 * @param {Array} options.markdown - An array of Markdown files to build.
 * @param {Array} options.assets - An array of asset files to copy.
 * @param {string} options.directory - The directory to output the built files to.
 * @returns {void}
 */
function build({ markdown, assets, directory }) {

    const queue = []

    if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true })
    }

    for (let i = 0; i < assets.length; i++) {

        queue.push(new Promise((resolve) => {

            const source = assets[i][0]
            const destination = directory + '/' + assets[i][1]
            const destDirectory = destination.substring(0, destination.lastIndexOf('/'))

            if (!fs.existsSync(destDirectory)) {
                fs.mkdirSync(destDirectory, { recursive: true })
            }

            resolve(fs.copyFileSync(source, destination))

        }))

    }

    for (let i = 0; i < markdown.length; i++) {

        queue.push(new Promise((resolve) => {

            resolve(MarkdownWebpageFactory.build(markdown[i], directory))

        }))

    }

    Promise.all(queue)

}

const MarkdownWebpageFactory = {

    /**
     * List words that should be lowercase in page titles.
     * @type {Array}
     * @private
     */
    lowercaseWords: ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'with'],

    /**
     * Builds a web page from a Markdown file.
     * @param {string} source - Path to the Markdown file to build.
     * @param {string} newRoot - New root directory for the built page.
     * @returns {Promise} A promise that resolves when the page has been built.
     */
    build: function (source, newRoot) {

        const route = this.getRoute(source)
        const depth = route.split('/').length - 1
        const destDirectory = newRoot + '/' + route
        const destination = destDirectory + 'index.html'
        const pageTitle = this.parsePageTitle(route)
        const content = fs.readFileSync(source, 'utf8')

        marked.parse(content, { mangle: false }).then((markdownHtml) => {

            markdownHtml = this.applyTemplate(markdownHtml, depth, pageTitle)
            markdownHtml = this.replaceMarkdownFileReferences(markdownHtml, destination)

            if (!fs.existsSync(destDirectory)) {
                fs.mkdirSync(destDirectory, { recursive: true })
            }

            fs.writeFileSync(destination, markdownHtml)

        })

    },

    /**
     * Convert a file path into a web page title using title case.
     * @param {string} path - File path.
     * @returns {string} The page title.
     */
    parsePageTitle: function (path) {

        if (!path) {
            return 'Home'
        }

        return path
            .replace(/index\.html$/, '')
            .replace(/\/$/, '')
            .replace(/\.html$/, '')
            .replaceAll('-', ' ')
            .replaceAll('_', ' ')
            .split('/')
            .pop()
            .split(' ')
            .map((word) => {
                const lower = word.toLowerCase()
                if (this.lowercaseWords.includes(lower)) {
                    return lower
                }
                return word.charAt(0).toUpperCase() + word.slice(1)
            })
            .join(' ')

    },

    /**
     * Replace Markdown file references with HTML file references.
     * @param {string} html - The HTML to search.
     * @param {string} destination - The destination of the HTML file.
     * @returns {string} The HTML with the Markdown file references replaced.
     */
    replaceMarkdownFileReferences: function (html, destination) {

        let markdownRef = this.getMarkdownFileReference(html)
        while (markdownRef) {
            let newRef = this.getRoute(markdownRef[1], destination)
            if (markdownRef[2]) {
                newRef += markdownRef[2]
            }
            html = html.replace(markdownRef[0], `href="${newRef}"`)
            markdownRef = this.getMarkdownFileReference(html)
        }

        return html

    },

    /**
     * Format a Markdown file path into a destination HTML file path.
     * Files in the "content" directory will not include that directory in their destination path.
     * Files without a file extension will be treated as markdown files.
     * Underscores will be replaced with hyphens.
     * @param {string} path - Markdown file path.
     * @param {string} [documentPath] - Path to the document that contains the Markdown file path.
     * @returns {string} Directory where the file should be copied to as `index.html`.
     */
    getRoute: function (path, documentPath) {

        path = path.toLowerCase()

        if ('readme.md' !== path) {
            return path.toLowerCase().replaceAll('_', '-').replace(/^(\.\/)?content\//, '').replace(/\.md$/, '') + '/'
        }

        return !documentPath ? '' : '../'

    },

    /**
     * Get the first Markdown file reference from the HTML string.
     * @param {string} html - The HTML to search.
     * @returns {string} The first Markdown file reference.
     */
    getMarkdownFileReference: function (html) {
        return html.match(/\bhref="(?!#)(?!http)([^"]+\.md)(#[a-zA-Z0-9\-_]+)?"/)
    },

    /**
     * Get the template object used to convert a Markdown file to a web page.
     * @param {Object} options - The template options.
     * @param {number} options.depth - The depth of the web page file in the directory structure.
     * @param {string} options.title - The title of the web page.
     * @returns {Object} The template object.
     */
    template: function({ depth, title }) {

        if (!title || 'Home' === title) {
            title = 'GitHub Guide'
        } else {
            title = title + ' - GitHub Guide'
        }

        const relativeRootDirectoryPrefix = !depth ? './' : '../'.repeat(depth)

        return {
            pre: `<!doctype html>
                <html lang="en-US">
                    <head>
                        <meta charset="utf-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <link rel="stylesheet" href="${relativeRootDirectoryPrefix}styles/github-markdown-css/github-markdown.css">
                        <title>${title}</title>
                        <style>
                            .markdown-body {
                                box-sizing: border-box;
                                min-width: 200px;
                                max-width: 980px;
                                margin: 0 auto;
                                padding: 45px;
                            }

                            .markdown-body a {
                                text-decoration: underline;
                            }

                            @media (max-width: 767px) {
                                .markdown-body {
                                    padding: 15px;
                                }
                            }
                        </style>
                    </head>
                    <body class="markdown-body">`,
            post: `</body></html>`,
        }

    },

    /**
     * Apply a webpage template to the Markdown content.
     * @param {string} markdownHtml - The HTML generated from the Markdown content.
     * @param {number} depth - The depth of the web page file in the directory structure.\
     * @param {string} title - The title of the web page.
     * @returns {string} The HTML with the template applied.
     */
    applyTemplate: function (markdownHtml, depth, title) {

        const template = this.template({ depth, title })

        return template.pre + markdownHtml + template.post

    }
}

export default build
