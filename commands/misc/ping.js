const { ICommand } = require('@libs/builders/command/command.builder')
const moment = require('moment-timezone')

/**
 * @type { ICommand }
 */
module.exports = {
    aliases: ['p'],
    category: 'misc',
    description: 'Test bot response.',
    callback: async ({ msg, message }) => {
        return msg.reply(`*_${moment.duration(Date.now() - parseInt(message.messageTimestamp.toString()) * 1000).asSeconds()} second(s)_*`)
    },
}
