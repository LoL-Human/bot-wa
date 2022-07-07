const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant')

/**
 * @type { ICommand }
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
        const result = await lolhuman.tiktokNoWM3(args[0])
        return msg.replyVideo({ url: result })
    },
}
