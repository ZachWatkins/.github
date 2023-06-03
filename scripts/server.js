const http = require('http')
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, 'gh-pages')

function start(port) {
    const server = http.createServer((req, res) => {
        const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url)
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
            console.log(`Server running on port ${port}`)
            resolve(server)
        })
    })
}

function stop(server) {
    return new Promise((resolve) => {
        server.close(() => {
            console.log('Server stopped')
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
