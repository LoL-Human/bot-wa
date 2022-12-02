const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'islami',
    description: 'Random Asmaul Husna',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get('/api/asmaulhusna')
            .then(({ data }) => {
                return msg.reply(`
Latin : ${data.result.latin}
Arab : ${data.result.ar}
Indonesia : ${data.result.id}
English : ${data.result.en}
`)
            })
    },
}
