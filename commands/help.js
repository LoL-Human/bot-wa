const { listCommands, commands } = require('@libs/constants/command')
const { timeFormat } = require('@libs/utils')
const moment = require('moment-timezone')
const config = require('@config')
const i18n = require('i18n')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    aliases: ['menu'],
    callback: async ({ msg, client, args, prefix }) => {
        if (args.length > 0) {
            if (args[0] === 'listmenu') {
                var sections = []
                for (var title in listCommands) {
                    sections.push({
                        title: title.toUpperCase(),
                        rows: listCommands[title].map((v) => ({
                            title: v,
                            rowId: `${prefix}help ${v}`,
                            description: commands.get(v).description,
                        })),
                    })
                }

                return client.sendMessage(msg.from, {
                    title: `${config.botName} Menu's`,
                    text: `To see how command work type ${prefix}help <command>`,
                    footer: `© ${config.botName} Bot`,
                    buttonText: 'Menu',
                    sections,
                    viewOnce: true,
                })
            }

            /**
             * @type { import('@libs/builders/command').ICommand }
             */
            let command = commands.get(args[0]) || commands.find((v) => v?.aliases?.includes(args[0]))
            if (command) {
                let text = `*➪ Command :* ${args[0]}\n`
                text += `*➪ Alias :* ${command?.aliases?.join(', ') || '-'}\n`
                text += `*➪ Category :* ${command.category}\n`
                if (command?.groupOnly) {
                    text += `*➪ Group Only :* Yes\n`
                }
                if (command?.adminOnly) {
                    text += `*➪ Admin Only :* Yes\n`
                }
                if (command?.privateOnly) {
                    text += `*➪ Private Only :* Yes\n`
                }
                if (command?.premiumOnly) {
                    text += `*➪ Premium Only :* Yes\n`
                }
                if (command?.ownerOnly) {
                    text += `*➪ Owner Only :* Yes\n`
                }
                text += `*➪ Description :* ${command.description}\n`
                text += `*➪ Example :* ${command?.example?.format({ prefix, command: args[0] }) || `${prefix}${args[0]}`}`
                return client.sendMessage(msg.from, {
                    text: text.trim(),
                    templateButtons: [
                        {
                            urlButton: {
                                displayText: 'Copy',
                                url: `https://www.whatsapp.com/otp/copy/${prefix}${args[0]}`,
                            },
                        },
                    ],
                    viewOnce: true,
                })
            } else {
                return msg.reply(i18n.__('command.not_found', { command: args[0] }))
            }
        }

        var text =
            `Hi ${msg.pushName || `@${msg.senderNumber}`}, How can I help you?\n\n` +
            `―――――――――――――――\n` +
            `🕰️ *Server time:* ${moment().locale('id').tz(config.timezone).format('dddd, DD MMMM YYYY HH:mm:ss')}\n` +
            `🗒️ *Total command:* ${commands.size}\n` +
            `🚀 *Uptime:* ${timeFormat(process.uptime())}\n` +
            `❕ *Prefix:* Multi Prefix\n` +
            `―――――――――――――――\n\n`

        return client.sendMessage(msg.from, {
            text,
            footer: `© ${config.botName} Bot`,
            title: `${config.botName} Help`,
            templateButtons: [
                { index: 1, quickReplyButton: { displayText: 'Owner Bot', id: prefix + 'owner' } },
                { index: 2, quickReplyButton: { displayText: 'Complete Menu', id: prefix + 'help listmenu' } },
            ],
            viewOnce: true,
            mentions: [msg.sender],
        })
    },
}
