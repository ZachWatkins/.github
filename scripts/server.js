const http = require('http')
const fs = require('fs')
const path = require('path')
let quietMode = false

/**
 * Start a web server.
 * @param {number} port - The port to listen on.
 * @param {boolean} [quiet=false] - Whether to log messages.
 * @returns {Promise<http.Server>}
 */
function start(port, quiet = false) {
    quietMode = quiet
    const server = http.createServer((req, res) => {
        if (req.url.matchAll(/\./g).length > 1) {
            throw new Error('URL cannot contain more than one "." character')
        }
        if (req.url.indexOf('\\') > -1) {
            throw new Error('URL cannot contain directory separators')
        }

        const filePath = req.url === '/' ? 'index.html' : req.url
        const extname = path.extname(filePath)
        const contentType = getContentType(extname)

        fs.readFile(path.join(__dirname, filePath), (err, content) => {
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
