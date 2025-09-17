import { vi } from 'vitest'

const create = vi.fn(async () => ({
  choices: [{ message: { content: 'stubbed' } }],
}))

const client = {
  chat: {
    completions: {
      create,
    },
  },
}

const OpenAIMock = vi.fn(function () {
  return client
})

Object.assign(OpenAIMock, client)

export default OpenAIMock as unknown as {
  new (...args: any[]): typeof client
  (...args: any[]): typeof client
}

export { create as __createChatCompletionMock }
