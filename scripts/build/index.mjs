/**
 * Markdown to HTML build script.
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */
import buildGitHubPages from './gh-pages.mjs'
buildGitHubPages({
    assets: [
        ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
        ['node_modules/github-markdown-css/license', 'styles/github-markdown-css/license'],
    ],
    markdown: [
        'README.md',
        'content/new-repository-configuration.md',
        'contributing/development.md',
        'contributing/self-review.md',
        'contributing/types-of-contributions.md',
        'CHANGELOG.md',
        'CODE_OF_CONDUCT.md',
        'CONTRIBUTING.md',
        'LICENSE',
        'SECURITY.md',
    ],
    directory: 'gh-pages',
})
