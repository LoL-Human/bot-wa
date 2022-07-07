const { ICommand } = require('@libs/builders/command/command.builder')
const { lolhuman } = require('@libs/constants/api/api.constant')

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['tta', 'ttaudio', 'ttmp3', 'ttmusic'],
    category: 'tiktok',
    description: 'Tiktok Music Downloader',
    waitMessage: true,
    minArgs: 1,
    expectedArgs: '<link>',
    example: '{prefix}{command} https://vt.tiktok.com/ZSwWCk5o/',
    callback: async ({ msg, args }) => {
        const result = await lolhuman.tiktokMusic(args[0])
        return msg.replyAudio(result)
    },
}
