import baseTest from '@playwright/test'
import { start, stop } from '../scripts/server.js'

const serverTest = baseTest.extend({
    server: [async ({}, use) => { // eslint-disable-line no-empty-pattern
        const server = await start(3001)
        await use(server)
        await stop(server)
    }, { scope: 'worker' }],
})

export default serverTest
