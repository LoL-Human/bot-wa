const { ICommand } = require('@libs/builders/command/command.builder')

/**
 * @type { ICommand }
 */
module.exports = {
    category: 'about',
    description: 'Show your stats.',
    callback: async ({ msg, database }) => {
        const user = database.users.findOne(msg.senderNumber)
        return msg.reply(`
User Number : ${user.user_wa_number}
User Limit : ${user.user_limit}
User Level : Lv. ${user.user_level}
User Exp : ${user.user_exp} XP
User Premium : ${user.user_premium ? 'Yes' : 'No'}
User Registered : ${user.user_create_at}
`)
    },
}
