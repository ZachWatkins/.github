import baseTest from '@playwright/test'
import { startServer } from '../scripts/modules/server.mjs'

const serverTest = baseTest.extend({
    port: [async ({}, use, workerInfo) => { // eslint-disable-line no-empty-pattern
        await use(3000 + workerInfo.workerIndex)
    }, { scope: 'worker' }],
    baseUrl: [async ({ port }, use) => {
        await use(`http://localhost:${port}`)
    }, { scope: 'worker' }],
    server: [async ({ port }, use) => { // eslint-disable-line no-empty-pattern
        const server = await startServer(port)
        await use(server)
        await server.close()
    }, { scope: 'worker', auto: true }],
    page: async ({ baseUrl, page }, use) => {
        await page.goto(baseUrl)
        await use(page)
    },
})

export default serverTest
