const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['tt', 'ttdl'],
    category: 'tiktok',
    description: 'Tiktok Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://vt.tiktok.com/ZSwWCk5o/',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get('/api/tiktok2', {
                params: {
                    url: args[0],
                },
            })
            .then(({ data }) => {
                return msg.replyVideo({ url: data.result })
            })
    },
}
