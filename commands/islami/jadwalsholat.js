const api = require('@libs/utils/api')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'islami',
    description: 'Jadwal sholat',
    minArgs: 1,
    expectedArgs: '<daerah>',
    example: '{prefix}{command} yogyakarta',
    callback: async ({ msg, args }) => {
        return api('lolhuman')
            .get(`/api/sholat/${args[0]}`)
            .then(({ data }) => {
                return msg.reply(`
Wilayah : ${data.result.wilayah}
Tanggal : ${data.result.tanggal}

Sahur : ${data.result.sahur}
Imsak : ${data.result.imsak}
Subuh : ${data.result.subuh}
Dhuha : ${data.result.dhuha}
Dzuhur : ${data.result.dzuhur}
Ashar : ${data.result.ashar}
Maghrib : ${data.result.maghrib}
Isya' : ${data.result.isya}
`)
            })
    },
}
