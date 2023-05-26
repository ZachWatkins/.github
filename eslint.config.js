/**
 * @file ESLint configuration file
 * @author Zachary K. Watkins
 * @description This file's configuration should mirror the `.eslintrc.js`
 * configuration. Both files are needed until the `.eslintrc.js` can be safely
 * removed.
 */
'use strict'

const { defineFlatConfig } = require('eslint-define-config')
const globals = require('globals')
const js = require('@eslint/js')
const jsonc = require('eslint-plugin-jsonc')
const ignores = ['node_modules/', 'build/']

const MyConfig = {
    files: ['**/*.js', '*.js'],
    ignores,
    languageOptions: {
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2018,
        },
        globals: {
            ...globals.serviceworker,
            ...globals.browser,
            ...globals.node,
            ...globals.es2018,
            ...globals.commonjs,
        },
    },
    rules: {
        ...js.configs.recommended.rules,
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'prefer-const': 'error',
        'comma-dangle': ['error', 'always-multiline'],
    },
}

const MyJsonConfig = {
    files: ['**/*.json', '*.json'],
    ignores,
    plugins: { jsonc },
    languageOptions: {
        parser: jsonc,
    },
    rules: jsonc.configs['recommended-with-jsonc'].rules,
}

module.exports = defineFlatConfig([{ ignores }, MyJsonConfig, MyConfig])
