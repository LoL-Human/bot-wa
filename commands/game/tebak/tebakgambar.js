const { ICommand } = require('@libs/builders/command')
const axios = require('axios').default
const users = require('@database/services/users')
const config = require('@config')
const i18n = require('i18n')

const _collection = new Map()

/**
 * @type { ICommand }
 */
module.exports = {
    category: 'game',
    description: 'Game tebak gambar, guest and get exp.',
    callback: async ({ msg }) => {
        if (_collection.get(msg.from)) {
            return msg.reply(i18n.__('game.finish_last_first'), _collection.get(msg.from))
        }

        const { data } = await axios.get('https://api.lolhuman.xyz/api/tebak/gambar2?apikey={apikey}'.format({ apikey: config.apikey })).catch(console.log)
        let question = await msg.replyImage({ url: data.result.image }, 'Time 60 seconds!')

        _collection.set(msg.from, question)

        msg.createMessageCollector({
            filter: data.result.answer,
            max: 1,
        })
            .on('collect', (msg) => {
                let xp = Math.floor(Math.random() * (999 - 1) + 1)
                users.addExp(msg, msg.senderNumber, xp)
                msg.reply(i18n.__('game.right_answer', { xp }))
            })
            .on('end', (res) => {
                _collection.delete(msg.from)
                if (res == 'timeout') {
                    msg.reply(i18n.__('game.timeout_answer', { answer: data.result.answer }), question)
                }
            })
    },
}
