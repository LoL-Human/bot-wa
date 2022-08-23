const config = require('./config/index')

/**
 * @type { import("knex").Knex.Config }
 */
const KnexConfig = {
    client: 'better-sqlite3',
    connection: {
        filename: `./database/${config.sessionName}-db.db`,
    },
    migrations: {
        directory: './database/migrations/',
    },
    seeds: {
        directory: './database/seeds/',
    },
    useNullAsDefault: true,
}

module.exports = KnexConfig
