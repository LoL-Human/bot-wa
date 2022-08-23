/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('users').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('users', (table) => {
                table.bigIncrements('user_id')
                table.string('user_jid').unique()
                table.string('user_language').defaultTo('id')
                table.bigInteger('user_limit').defaultTo(100)
                table.bigInteger('user_exp').defaultTo(0)
                table.bigInteger('user_level').defaultTo(1)
                table.boolean('user_premium').defaultTo(0)
                table.date('user_premium_end')
                table.timestamp('user_create_at').defaultTo(knex.fn.now())
            })
        }
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users')
}
