/**
 * Markdown to HTML build script.
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */

require('./gh-pages.js')({
    assets: [
        ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
        ['node_modules/github-markdown-css/license', 'styles/github-markdown-css/license'],
    ],
    markdown: [
        ['README.md', 'index.html'],
        ['contributing/development.md', 'contributing/development.html'],
        ['contributing/self-review.md', 'contributing/self-review.html'],
        ['contributing/types-of-contributions.md', 'contributing/types-of-contributions.html'],
        ['CHANGELOG.md', 'changelog.html'],
        ['CODE_OF_CONDUCT.md', 'code-of-conduct.html'],
        ['CONTRIBUTING.md', 'contributing.html'],
        ['LICENSE', 'license.html'],
        ['SECURITY.md', 'security.html'],
    ],
    directory: 'gh-pages',
})
