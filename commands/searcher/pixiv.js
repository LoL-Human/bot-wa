const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'pixiv',
    description: 'Pixiv search illutration',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<query>',
    example: '{prefix}{command} loli artwork',
    callback: async ({ msg, args, fullArgs }) => {
        return api('lolhuman')
            .get('/api/pixiv', {
                params: {
                    query: fullArgs,
                },
            })
            .then(({ data }) => {
                return msg.replyImage({ url: data.result.random().image })
            })
    },
}
