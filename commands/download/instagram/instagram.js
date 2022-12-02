const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['ig', 'igdl'],
    category: 'instagram',
    description: 'Instagram Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.instagram.com/p/CU0MhPjBZO2/',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get('/api/instagram', {
                params: {
                    url: args[0],
                },
            })
            .then(({ data }) => {
                data.result.forEach((url) => {
                    if (url.includes('.mp4')) {
                        return msg.replyVideo({ url })
                    } else {
                        return msg.replyImage({ url })
                    }
                })
            })
    },
}
