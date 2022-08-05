const moment = require('moment-timezone')

/**
 * @type { Map<String, moment.Moment> }
 */
const cooldown = new Map()

module.exports = {
    cooldown,
}
