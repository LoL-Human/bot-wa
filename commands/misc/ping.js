const moment = require('moment-timezone')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['p'],
    category: 'misc',
    description: 'Test bot response.',
    cooldown: 10 * 1000,
    callback: async ({ msg, message }) => {
        return msg.reply(`*_${moment.duration(Date.now() - parseInt(message.messageTimestamp.toString()) * 1000).asSeconds()} second(s)_*`)
    },
}
