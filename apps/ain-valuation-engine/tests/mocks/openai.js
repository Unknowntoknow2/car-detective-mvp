export default function OpenAI() {
  return {
    chat: {
      completions: {
        create: async ({ messages }) => ({
          choices: [{ message: { content: (messages?.[0]?.content ? 'mock:' + messages[0].content : 'mock') } }],
        }),
      },
    },
  };
}
