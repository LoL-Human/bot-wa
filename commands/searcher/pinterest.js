const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'searcher',
    description: 'Pinterest search image',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<query>',
    example: '{prefix}{command} loli artwork',
    callback: async ({ msg, fullArgs }) => {
        return api('lolhuman')
            .get('/api/pinterest', {
                params: {
                    query: fullArgs,
                },
            })
            .then(({ data }) => {
                return msg.replyImage({ url: data.result })
            })
    },
}
