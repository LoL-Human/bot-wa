const api = require('@libs/utils/api')

module.exports = {
  category: 'checker',
  description: 'Resi Checker',
  waitMessage: true,
  minArgs: 1,
  expectedArgs: '<resi>',
  example: '{prefix}{command} JP8234909181',
  callback: async ({ msg, args }) => {
    return api('lolhuman')
      .get('/api/checkresi', {
        params: {
          resi: args[0],
        },
      })
      .then(async ({ data }) => {
        let history = data.result.history
        let resultHistory = ''
        await history.forEach(( resi ) => {
          resultHistory += `\n${resi.note}\n${resi.time}\n`
        })
        await msg.reply(`
*Resi:* ${data.result.resi}
*Kurir:* ${data.result.courier}
*Toko Penjual:* ${data.result.origin.name}
*Lokasi Toko Penjual:* ${data.result.origin.address}
*Pembeli:* ${data.result.destination.name}
*Lokasi Pembeli:* ${data.result.destination.address}
*Histori:* \n${resultHistory}
        `)
      })
  },
}
