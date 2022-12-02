const config = require('@config')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'about',
    description: 'Show owner this bot.',
    callback: async ({ msg, client }) => {
        const vcard =
            'BEGIN:VCARD\n' + // metadata of the contact card
            'VERSION:3.0\n' +
            `FN:${config.ownerName}\n` + // full name
            `ORG:Owner ${config.botName} Bot;\n` + // the organization of the contact
            `TEL;type=CELL;type=VOICE;waid=${config.ownerNumber[0]}:+${config.ownerNumber[0]}\n` + // WhatsApp ID + phone number
            'END:VCARD'
        return client.sendMessage(msg.from, {
            contacts: {
                displayName: config.ownerName,
                contacts: [{ vcard }],
            },
        })
    },
}
