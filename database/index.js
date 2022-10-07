const knex = require('@database/connection')
knex.migrate.latest().then(() => knex.seed.run())
