/**
 * @file ESLint configuration file
 * @author Zachary K. Watkins
 * @description This file's configuration should mirror the `.eslintrc.js`
 * configuration. Both files are needed until the `.eslintrc.js` can be safely
 * removed.
 */
'use strict'

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
    extends: ['eslint:recommended'],
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'build/',
        'public/',
        'includes/',
    ],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
    },
    env: {
        browser: true,
        node: true,
        es2018: true,
        commonjs: true,
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'prefer-const': 'error',
        'comma-dangle': ['error', 'always-multiline'],
    },
})
