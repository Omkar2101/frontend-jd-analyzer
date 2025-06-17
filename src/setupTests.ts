import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'
import '@testing-library/jest-dom';


// Mock localStorage
const localStorageMock: Storage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
global.localStorage = localStorageMock

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests
afterEach(() => {
  server.resetHandlers()
  cleanup()
  vi.clearAllMocks()
})

// Clean up after the tests are finished
afterAll(() => server.close())