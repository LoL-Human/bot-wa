const users = require('@database/services/users')

/**
 * @type { import('@libs/builders/command').ICommand }
 */
module.exports = {
    category: 'about',
    description: 'Show your stats.',
    callback: async ({ msg }) => {
        const user = await users.findOne(msg.senderNumber)
        return msg.reply(`
User Number : ${user.user_jid}
User Limit : ${user.user_limit}
User Level : Lv. ${user.user_level}
User Exp : ${user.user_exp} XP
User Premium : ${user.user_premium ? 'Yes' : 'No'}
User Registered At : ${user.user_create_at}
`)
    },
}
