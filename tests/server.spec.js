import { expect } from '@playwright/test'
import test from './serverTest.js'

test('server can start and stop', async ({server}) => {
    expect(server.listening).toBe(true)
})
