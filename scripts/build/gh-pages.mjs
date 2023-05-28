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

    for (let i = 0; i < markdown.length; i++) {

        queue.push(new Promise((resolve) => {

            resolve(MarkdownWebpageFactory.build(markdown[i], directory))

        }))

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

    Promise.all(queue)

}

const MarkdownWebpageFactory = {
    /**
     * Get the template object used to convert a Markdown file to a web page.
     * @param {number} depth - The depth of the web page file in the directory structure.
     * @returns {Object} The template object.
     */
    template: function(depth = 0) {

        const relativeRootDirectoryPrefix = !depth ? './' : '../'.repeat(depth)

        return {
            pre: `<!doctype html>
                <html lang="en-US">
                    <head>
                        <meta charset="utf-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <link rel="stylesheet" href="${relativeRootDirectoryPrefix}styles/github-markdown-css/github-markdown.css">
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
            post: `</body></html>`,
        }

    },

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
        const content = fs.readFileSync(source, 'utf8')

        marked.parse(content, { mangle: false }).then((markdownHtml) => {

            markdownHtml = this.applyTemplate(markdownHtml, this.template(depth))

            if (!fs.existsSync(destDirectory)) {
                fs.mkdirSync(destDirectory, { recursive: true })
            }

            fs.writeFileSync(destination, markdownHtml)

        })

    },

    /**
     * Format a Markdown file path into a destination HTML file path.
     * Files in the "content" directory will not include that directory in their destination path.
     * Files without a file extension will be treated as markdown files.
     * Underscores will be replaced with hyphens.
     * @param {string} path - Markdown file path.
     * @returns {string} Directory where the file should be copied to as `index.html`.
     */
    getRoute: function (path) {

        path = path.toLowerCase()

        if ('readme.md' !== path) {
            return path.toLowerCase().replaceAll('_', '-').replace(/^content\//, '').replace(/\.md$/, '') + '/'
        }

        return ''

    },

    /**
     * Apply a webpage template to the Markdown content.
     * @param {string} markdownHtml - The HTML generated from the Markdown content.
     * @param {string} template - The template to apply.
     * @returns
     */
    applyTemplate: function (markdownHtml, template) {

        return template.pre + markdownHtml + template.post

    }
}

export default build
