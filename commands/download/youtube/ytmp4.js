const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['ytv', 'ytvideo'],
    category: 'youtube',
    description: 'Youtube video downloader.',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://www.youtube.com/watch?v=eZskFo64rs8',
    callback: async ({ msg, args }) => {
        let { data } = await api('lolhuman').get('/api/ytvideo2', { params: { url: args[0] } })
        await msg.replyImage({ url: data.result.thumbnail }, `${data.result.title} - ${data.result.size}`)
        await msg.replyVideo({ url: data.result.link })
    },
}
