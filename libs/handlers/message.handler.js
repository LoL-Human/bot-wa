const { getContentType, MessageUpdateType, WAMessage, WASocket } = require('@adiwajshing/baileys')
const { commands } = require('@libs/constants/command/command.constant')
const { ICommand } = require('@libs/builders/command/command.builder')
const { serialize } = require('@libs/utils/serialize/serialize.util')
const { cooldown } = require('@libs/utils/cooldown/cooldown.util')
const database = require('@libs/databases')
const moment = require('moment-timezone')
const config = require('@config')
const chalk = require('chalk')

/**
 *
 * @param { WASocket } client
 * @param { { messages: WAMessage[], type: MessageUpdateType } } param1
 */
module.exports = async (client, { messages, type }) => {
    const message = messages[0]
    if (message.key && message.key.remoteJid === 'status@broadcast') return
    if (!message.message) return

    message.type = getContentType(message.message)
    let body =
        message.message?.conversation ||
        message.message[message.type]?.text ||
        message.message[message.type]?.caption ||
        message.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        message.message?.buttonsResponseMessage?.selectedButtonId ||
        message.message?.templateButtonReplyMessage?.selectedId ||
        null
    const isCommand = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^@*&.+-,©^\/]/.test(body)
    client.readMessages([message.key])
    if (message.type === 'protocolMessage' || message.type === 'senderKeyDistributionMessage' || !message.type) return
    if (!isCommand) return

    const msg = await serialize(message, client)
    if (msg.responseId) {
        msg.body = msg.responseId
    }

    const prefix = isCommand ? msg.body[0] : null
    const args = msg.body?.trim()?.split(/ +/)?.slice(1)
    const command = isCommand ? msg.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : null
    const fullArgs = msg.body?.replace(command, '')?.slice(1)?.trim() || null

    /**
     * @type { ICommand }
     */
    const getCommand = commands.get(command) || commands.find((v) => v?.aliases && v?.aliases?.includes(command))
    if (getCommand) {
        database.users.insert(msg.senderNumber)
        let user = database.users.findOne(msg.senderNumber)
        const command_log = [chalk.whiteBright('├'), chalk.keyword('aqua')(`[ ${msg.isGroup ? ' GROUP ' : 'PRIVATE'} ]`), msg.body.substr(0, 50).replace(/\n/g, ''), chalk.greenBright('from'), chalk.yellow(msg.senderNumber)]
        if (msg.isGroup) {
            command_log.push(chalk.greenBright('in'))
            command_log.push(chalk.yellow(msg.groupMetadata.subject))
        }
        console.log(...command_log)

        if (getCommand.ownerOnly && config.ownerNumber.includes(msg.senderNumber)) {
            return msg.reply('Sorry, command only for owner.')
        }
        if (getCommand.premiumOnly && !user.user_premium) {
            return msg.reply('Sorry, command only for premium user.')
        }
        if (getCommand.groupOnly && !msg.isGroup) {
            return msg.reply('Sorry, command only for group.')
        }
        if (
            getCommand.groupOnly &&
            getCommand.adminOnly &&
            !msg.groupMetadata.participants
                .filter((v) => v.admin)
                .map((v) => v.id)
                .includes(msg.senderNumber + '@s.whatsapp.net')
        ) {
            return msg.reply('Sorry, command only for admin group.')
        }
        if (getCommand.privateOnly && msg.isGroup) {
            return msg.reply('Sorry, command only for private chat.')
        }

        if (getCommand.minArgs && getCommand.minArgs > args.length) {
            var text = `*Minimal argument is ${getCommand.minArgs}*\n`
            if (getCommand.expectedArgs) {
                text += `*Argument :* ${getCommand.expectedArgs}\n`
                text += `*Usage :* {prefix}{command} {argument}\n`
            }
            if (getCommand.example) {
                text += `*Example :* ${getCommand.example}`
            }
            return msg.reply(text.format({ prefix, command, argument: getCommand.expectedArgs }))
        }

        if (getCommand.cooldown) {
            const cooldownBuilder = `${msg.senderNumber}-${command}`
            if (cooldown.get(cooldownBuilder) && cooldown.get(cooldownBuilder) > moment()) {
                const duration = moment.duration(cooldown.get(cooldownBuilder).diff(moment()))
                return msg.reply(`Cooldown, please waiting ${Math.round(duration.asSeconds())} seconds again.`)
            }
            if (!cooldown.get(cooldownBuilder) || (cooldown.get(cooldownBuilder) && cooldown.get(cooldownBuilder) < moment())) {
                cooldown.set(cooldownBuilder, moment().add(moment.duration(getCommand.cooldown)))
                setTimeout(() => cooldown.delete(cooldownBuilder), getCommand.cooldown)
            }
        }

        if (getCommand.waitMessage) {
            if (typeof getCommand.waitMessage === 'string') {
                await msg.reply(getCommand.waitMessage)
            } else {
                await msg.reply('Please wait...')
            }
        }
        database.users.addExp(msg, msg.senderNumber, 100)
        return getCommand.callback({ client, message, msg, command, prefix, args, fullArgs, database })
    }
}
