const { LoLHuman } = require('lolhuman-api')
const config = require('@config')

const lolhuman = new LoLHuman(config.apikey)

module.exports = {
    lolhuman,
}
