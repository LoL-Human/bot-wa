const { WAMessage, WASocket, getContentType } = require('@adiwajshing/baileys')
const { downloadMedia } = require('..')
const collector = require('@libs/constants/collector')

/**
 *
 * @param { WAMessage } msg
 * @param { WASocket } client
 * @returns { Promise<import('.').Serialize> }
 */
const serialize = async (msg, client) => {
    /**
     * @type { import('.').Serialize }
     */
    const m = {}
    if (msg.key) {
        m.id = msg.key.id
        m.isSelf = msg.key.fromMe
        m.from = msg.key.remoteJid
        m.isGroup = m.from.endsWith('@g.us')
        m.sender = m.isGroup ? msg.key.participant : msg.key.remoteJid
        m.sender = m.sender.includes(':') ? m.sender.split(':')[0] + '@s.whatsapp.net' : m.sender
        m.senderNumber = m.sender.split('@')[0]
    }
    m.type = getContentType(msg.message)
    if (['ephemeralMessage', 'viewOnceMessage'].includes(m.type)) {
        msg.message = msg.message[m.type].message
        m.type = getContentType(msg.message)
    }
    m.pushName = msg.pushName
    m.body = msg.message?.conversation || msg.message[m.type]?.text || msg.message[m.type]?.caption || null
    if (m.body?.[1] === ' ') {
        m.body = m.body.replace(' ', '')
    }
    m.responseId = msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId || msg.message?.buttonsResponseMessage?.selectedButtonId || msg.message?.templateButtonReplyMessage?.selectedId || null
    m.mentions = msg.message[m.type]?.contextInfo?.mentionedJid || []
    if (msg.message[m.type]?.contextInfo?.quotedMessage) {
        m.quoted = {}
        m.quoted.message = msg.message[m.type].contextInfo.quotedMessage
        m.quoted.key = {
            id: msg.message[m.type].contextInfo.stanzaId,
            fromMe: msg.message[m.type].contextInfo.participant === client.user.id.split(':')[0] + '@s.whatsapp.net',
            remoteJid: m.from,
        }
        m.quoted.delete = () => client.sendMessage(m.from, { delete: m.quoted.key })
        m.quoted.download = (type = 'stream') => downloadMedia(m.quoted.message, type)
    } else {
        m.quoted = null
    }
    if (m.type) {
        m.typeCheck = {}
        m.typeCheck.isImage = m.type == 'imageMessage'
        m.typeCheck.isVideo = m.type == 'videoMessage'
        m.typeCheck.isAudio = m.type == 'audioMessage'
        m.typeCheck.isSticker = m.type == 'stickerMessage'
        m.typeCheck.isContact = m.type == 'contactMessage'
        m.typeCheck.isLocation = m.type == 'locationMessage'
        if (m.quoted) {
            const typeQuoted = Object.keys(m.quoted.message)[0]
            m.typeCheck.isQuotedImage = typeQuoted == 'imageMessage'
            m.typeCheck.isQuotedVideo = typeQuoted == 'videoMessage'
            m.typeCheck.isQuotedAudio = typeQuoted == 'audioMessage'
            m.typeCheck.isQuotedSticker = typeQuoted == 'stickerMessage'
            m.typeCheck.isQuotedContact = typeQuoted == 'contactMessage'
            m.typeCheck.isQuotedLocation = typeQuoted == 'locationMessage'
        }
    }

    m.groupMetadata = m.isGroup ? await client.groupMetadata(m.from) : null

    m.reply = (text, quoted) => {
        return !m.isSelf && client.sendMessage(m.from, { text: text.toString().trim() }, { quoted: quoted || msg })
    }
    m.replyWithMentions = (text, mentions, quoted) => {
        return !m.isSelf && client.sendMessage(m.from, { text: text.toString().trim(), mentions }, { quoted: quoted || msg })
    }
    m.replyImage = (image, caption) => {
        return !m.isSelf && client.sendMessage(m.from, { image, caption }, { quoted: msg })
    }
    m.replyVideo = (video, caption) => {
        return !m.isSelf && client.sendMessage(m.from, { video, mimetype: 'video/mp4', caption }, { quoted: msg })
    }
    m.replyAudio = (audio, ptt) => {
        return !m.isSelf && client.sendMessage(m.from, { audio, mimetype: 'audio/mp4', ptt }, { quoted: msg })
    }
    m.replyDocument = (document, mimetype, fileName) => {
        return !m.isSelf && client.sendMessage(m.from, { document, mimetype, fileName }, { quoted: msg })
    }
    m.replySticker = (sticker) => {
        return !m.isSelf && client.sendMessage(m.from, { sticker }, { quoted: msg })
    }
    m.replyLocation = (location) => {
        return !m.isSelf && client.sendMessage(m.from, { location }, { quoted: msg })
    }
    m.replyTemplateButton = (text, templateButtons, title, footer) => {
        return !m.isSelf && client.sendMessage(m.from, { text, footer, templateButtons, title, viewOnce: true }, { quoted: msg })
    }
    m.replyButton = (text, buttons, title, footer) => {
        return !m.isSelf && client.sendMessage(m.from, { text, footer, buttons, title, viewOnce: true }, { quoted: msg })
    }
    m.replyList = (text, buttonText, sections, title, footer) => {
        return !m.isSelf && client.sendMessage(m.from, { text, buttonText, sections, title, footer, viewOnce: true }, { quoted: msg })
    }
    m.react = (text) => {
        return !m.isSelf && client.sendMessage(m.from, { react: { text, key: msg.key } })
    }

    m.download = (type = 'stream') => downloadMedia(msg.message, type)
    m.createMessageCollector = (options = { filter: null }) => new collector.MessageCollector(client, options, m)
    return m
}

module.exports = {
    serialize,
}
