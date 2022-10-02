const { proto, downloadContentFromMessage } = require('@adiwajshing/baileys')

/**
 *
 * @param { proto.IMessage } msg
 * @param { 'buffer' | 'stream' } returnType
 * @returns { Promise<Buffer | Stream> }
 */
const downloadMedia = async (msg, returnType) => {
    try {
        const type = Object.keys(msg)[0]
        const mimeMap = {
            imageMessage: 'image',
            videoMessage: 'video',
            stickerMessage: 'sticker',
            documentMessage: 'document',
            audioMessage: 'audio',
        }
        const stream = await downloadContentFromMessage(msg[type], mimeMap[type])
        if (returnType === 'stream') {
            return stream
        }
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    } catch {
        return null
    }
}

/**
 *
 * @param { number } seconds
 * @returns { string }
 */
const timeFormat = (seconds) => {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor((seconds % (3600 * 24)) / 3600)
    var m = Math.floor((seconds % 3600) / 60)
    var s = Math.floor(seconds % 60)
    var dDisplay = d > 0 ? d + (d == 1 ? ' Days, ' : ' Days, ') : ''
    var hDisplay = h > 0 ? h + (h == 1 ? ' Hours, ' : ' Hours, ') : ''
    var mDisplay = m > 0 ? m + (m == 1 ? ' Minutes, ' : ' Minutes, ') : ''
    var sDisplay = s > 0 ? s + (s == 1 ? ' Seconds, ' : ' Seconds ') : ''
    return dDisplay + hDisplay + mDisplay + sDisplay
}

module.exports = {
    downloadMedia,
    timeFormat,
}
