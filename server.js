const { createServer } = require('http')
const { parse } = require('url')
const path = require('path')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

// Ensure __dirname is used for standalone compatibility
process.env.NODE_ENV = 'production'

const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error handling request:', err)
            res.statusCode = 500
            res.end('Internal Server Error')
        }
    }).listen(port, hostname, () => {
        console.log(`> Reset HTX ready on http://${hostname}:${port}`)
    })
})
