import { test, expect } from '@playwright/test'
import { start, stop } from '../scripts/server.js'

test('server can start and stop', async () => {
    const server = await start(3001, true)
    expect(server.listening).toBe(true)
    await stop(server)
    expect(server.listening).toBe(false)
})
