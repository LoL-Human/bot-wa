const config = require('@config')
const knex = require('@database/connection')

const findOne = async (user_jid) => {
    return knex('users').where({ user_jid }).first()
}

const create = async (user_jid) => {
    return knex('users')
        .insert({
            user_jid,
            user_limit: config.limit || 100,
        })
        .then((res) => {
            return res[0] > 0
        })
}

const update = async (user_jid, data) => {
    return knex('users')
        .update(data)
        .where({ user_jid })
        .then((res) => {
            return res[0] > 0
        })
}

const addExp = async (msg, user_jid, exp) => {
    return knex('users')
        .where({ user_jid })
        .increment('user_exp', exp)
        .then(async () => {
            let user = await findOne(user_jid)
            if (user && user.user_exp >= user.user_level * 1000) {
                await knex('users').where({ user_jid }).increment('user_level', 1).update({ user_exp: 0 })
                await msg.replyWithMentions(`Congratulations! @${msg.senderNumber} leveling up to level ${user.user_level + 1}!`, [msg.sender])
            }
            return true
        })
}

module.exports = {
    findOne,
    create,
    update,
    addExp,
}
