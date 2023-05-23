#!/usr/bin/env node
/**
 * Package GitHub integration files for a personal project.
 *
 * @author   Zachary K. Watkins
 * @version  0.1.0
 * @date     2023-05-22 22:06:00
 * @location College Station, TX (United States)
 */
const files = [
    '.github/dependabot.yml',
    'AUTHORS',
    'LICENSE',
    'README.md'
];
const language_files = {
    'js': [
        '.github/actions/node-npm-setup/action.yml',
        '.github/workflows/lint_js.yml',
        '.github/workflows/package-lock-lint.yml',
        '.github/workflows/test_js.yml',
        '.npmrc',
        'package.json',
    ],
    'php': [
        '.github/actions/php-composer-setup/action.yml',
    ],
}
