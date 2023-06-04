const http = require('http')
const fs = require('fs')
const path = require('path')
let quietMode = false

/**
 * Validate a URL request for the server.
 * @param {string} input - The URL to validate.
 * @returns {boolean} - Whether the URL is valid.
 */
function validateUrl (input) {
    const urlRegex = /^\/([a-zA-Z0123456789_-]+\/?)*([a-zA-Z0123456789_-]+\.[a-z0123456789]+)?$/
    return urlRegex.test(input)
}

/**
 * Sanitize a URL request for the server.
 * @param {string} input - The URL to validate.
 * @returns {string} - The sanitized URL.
 */
function sanitizeUrl (input) {
    if (typeof input !== 'string') {
        throw new Error('URL must be a string')
    }
    const illegalRe = /[?<>:*|"]/g
    const controlRe = /[\x00-\x1f\x80-\x9f]/g //eslint-disable-line no-control-regex
    const reservedRe = /^\.+$/
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i
    const windowsTrailingRe = /[. ]+$/
    const sanitized = input
        .replace(illegalRe, '')
        .replace(controlRe, '')
        .replace(reservedRe, '')
        .replace(windowsReservedRe, '')
        .replace(windowsTrailingRe, '')
        .trim()
        .substring(0, 254)

    return sanitized !== input ? '' : sanitized
}

/**
 * Start a web server.
 * @param {number} port - The port to listen on.
 * @param {boolean} [quiet=true] - Whether to log messages.
 * @returns {Promise<http.Server>}
 */
function start(port, quiet = true) {
    quietMode = quiet
    const server = http.createServer((req, res) => {

        if (!validateUrl(req.url)) {
            res.writeHead(400)
            res.end('Invalid URL')
        }

        const sanitizedUrl = sanitizeUrl(req.url)
        const suffix = '/' === sanitizedUrl.charAt(sanitizedUrl.length - 1)
            ? 'index.html'
            : ''
        const filePath = path.resolve(__dirname, '..') + path.sep + sanitizedUrl + suffix
        const extname = path.extname(filePath)
        const contentType = getContentType(extname)

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404)
                    res.end('404 Not Found')
                } else {
                    res.writeHead(500)
                    res.end('500 Internal Server Error')
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
            }
        })
    })

    return new Promise((resolve) => {
        server.listen(port, () => {
            if (!quietMode) {
                console.log(`Server running on port ${port}`)
            }
            resolve(server)
        })
    })
}

function stop(server) {
    return new Promise((resolve) => {
        server.close(() => {
            if (!quietMode) {
                console.log('Server stopped')
            }
            resolve()
        })
    })
}

function getContentType(extname) {
    switch (extname) {
    case '.html':
        return 'text/html'
    case '.css':
        return 'text/css'
    case '.js':
        return 'text/javascript'
    case '.json':
        return 'application/json'
    case '.png':
        return 'image/png'
    case '.jpg':
        return 'image/jpg'
    default:
        return 'text/plain'
    }
}

module.exports = { start, stop }
