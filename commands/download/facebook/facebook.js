const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['fb', 'fbdl'],
    category: 'facebook',
    description: 'Facebook Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://web.facebook.com/watch/?v=892725951575913',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get('/api/facebook', {
                params: {
                    url: args[0],
                },
            })
            .then(({ data }) => {
                return msg.replyVideo({ url: data.result })
            })
    },
}
