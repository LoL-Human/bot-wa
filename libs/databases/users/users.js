const { readFileSync, writeFileSync, existsSync } = require('fs')
const moment = require('moment-timezone')
const config = require('@config')
const path = require('path')
const { logger } = require('@libs/utils/logger/logger.util')

class User {
    /**
     * @type { { [_: string]: import('./users').UserDTO } }
     */
    users = {}

    constructor() {
        const userPath = path.resolve(__dirname, '..', 'json', 'users.json')
        if (!existsSync(userPath)) {
            writeFileSync(userPath, JSON.stringify({}))
            logger.stats('Create database users.json')
        } else {
            logger.stats('Init database users.json')
        }
        this.users = JSON.parse(readFileSync(userPath))
    }

    findOne(whatsapp_number) {
        if (!this.users[whatsapp_number]) {
            return null
        }
        return {
            user_wa_number: whatsapp_number,
            ...this.users[whatsapp_number],
        }
    }

    insert(whatsapp_number) {
        if (this.users[whatsapp_number]) {
            return false
        }
        this.users[whatsapp_number] = {
            user_limit: config.limit,
            user_exp: 0,
            user_level: 1,
            user_premium: false,
            user_premium_end: null,
            user_create_at: moment().tz(config.timezone).format('YYYY-MM-DD HH:mm:ss'),
        }
        this.save()
        return true
    }

    update(whatsapp_number, newData) {
        this.users[whatsapp_number] = {
            user_exp: newData.user_limit || this.users[whatsapp_number].user_limit,
            user_exp: newData.user_exp || this.users[whatsapp_number].user_exp,
            user_level: newData.user_level || this.users[whatsapp_number].user_level,
            user_premium: newData.user_premium || this.users[whatsapp_number].user_premium,
            user_premium_end: newData.user_premium_end || this.users[whatsapp_number].user_premium_end,
            user_create_at: this.users[whatsapp_number].user_create_at,
        }
        this.save()
        return true
    }

    /**
     *
     * @param { import('@libs/utils/serialize/serialize.util').Serialize } msg
     * @param { string } whatsapp_number
     * @param { number } exp
     * @returns { Promise<import('@adiwajshing/baileys').WAMessage | boolean> }
     */
    async addExp(msg, whatsapp_number, exp) {
        this.users[whatsapp_number].user_exp += exp
        if (this.users[whatsapp_number].user_exp >= this.users[whatsapp_number].user_level * 1000) {
            this.users[whatsapp_number].user_exp = 0
            this.users[whatsapp_number].user_level += 1
            this.save()
            return msg.replyWithMentions(`Congratulations! @${msg.senderNumber} leveling up to level ${this.users[whatsapp_number].user_level}!`, [msg.sender])
        }
        this.save()
        return true
    }

    save() {
        writeFileSync(path.resolve(__dirname, '..', 'json', 'users.json'), JSON.stringify(this.users, null, 4))
    }
}

exports.users = new User()
