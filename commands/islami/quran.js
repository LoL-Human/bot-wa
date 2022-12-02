const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'islami',
    description: 'Al Quran',
    minArgs: 1,
    expectedArgs: '<surah / surah:ayat>',
    example: '\n- {prefix}{command} 18\n- {prefix}{command} 18:1',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get(`/api/quran/${args[0].split(':').join('/')}`)
            .then(({ data }) => {
                let ayat = data.result.ayat
                let text = `QS. ${data.result.surah} : 1-${ayat.length}\n\n`
                for (var x of ayat) {
                    text += `${x.arab}\n${x.ayat}. ${x.latin}\n${x.indonesia}\n\n`
                }
                text = text.replace(/<u>/g, '').replace(/<\/u>/g, '')
                text = text.replace(/<strong>/g, '').replace(/<\/strong>/g, '')
                text = text.replace(/<u>/g, '').replace(/<\/u>/g, '')
                return msg.reply(text)
            })
    },
}
