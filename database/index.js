const config = require('@config')
const { knex } = require('knex')
const users = require('./services/users')

module.exports = {
    knex: knex({
        client: 'better-sqlite3',
        connection: {
            filename: `./database/${config.sessionName}-db.db`,
        },
        useNullAsDefault: true,
    }),
    users,
}
