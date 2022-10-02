const { Chat, Contact, BaileysEventEmitter } = require('@adiwajshing/baileys/lib/Types')
const logger = require('@libs/utils/logger')
const KeyedDB = require('@adiwajshing/keyed-db').default

/**
 * @param { Boolean } pin
 */
const waChatKey = (pin) => ({
    /**
     * @param { Chat } c
     */
    key: (c) => (pin ? (c.pin ? '1' : '0') : '') + (c.archive ? '0' : '1') + (c.conversationTimestamp ? c.conversationTimestamp.toString(16).padStart(8, '0') : '') + c.id,

    /**
     * @param { string } k1
     * @param { string } k2
     */
    compare: (k1, k2) => k2.localeCompare(k1),
})

const chats = new KeyedDB(waChatKey(true), (c) => c.id)

/**
 * @type { { [_: string]: Contact } }
 */
const contacts = {}

/**
 *
 * @param { Contact[] } newContacts
 */
const contactsUpsert = (newContacts) => {
    const oldContacts = new Set(Object.keys(contacts))
    for (const contact of newContacts) {
        oldContacts.delete(contact.id)
        contacts[contact.id] = Object.assign(contacts[contact.id] || {}, contact)
    }

    return oldContacts
}

/**
 *
 * @param { BaileysEventEmitter } ev
 */
const bind = (ev) => {
    ev.on('chats.set', ({ chats: newChats, isLatest }) => {
        if (isLatest) {
            chats.clear()
        }

        const chatsAdded = chats.insertIfAbsent(...newChats).length
    })

    ev.on('contacts.set', ({ contacts: newContacts }) => {
        const oldContacts = contactsUpsert(newContacts)
        for (const jid of oldContacts) {
            delete contacts[jid]
        }
    })

    ev.on('contacts.update', (updates) => {
        for (const update of updates) {
            if (contacts[update.id]) {
                Object.assign(contacts[update.id], update)
            }
        }
    })

    ev.on('chats.upsert', (newChats) => {
        chats.upsert(...newChats)
    })

    ev.on('chats.update', (updates) => {
        for (let update of updates) {
            const result = chats.update(update.id, (chat) => {
                if (update.unreadCount > 0) {
                    update = { ...update }
                    update.unreadCount = chat.unreadCount + update.unreadCount
                }

                Object.assign(chat, update)
            })
        }
    })

    ev.on('chats.delete', (deletions) => {
        for (const item of deletions) {
            chats.deleteById(item)
        }
    })
}

const toJSON = () => ({
    chats,
    contacts,
})

/**
 *
 * @param { { chats: Chat[], contacts: { [id: string]: Contact } } } json
 */
const fromJSON = (json) => {
    chats.upsert(...json.chats)
    contactsUpsert(Object.values(json.contacts))
}

/**
 *
 * @param { string } path
 */
const writeToFile = (path) => {
    // require fs here so that in case "fs" is not available -- the app does not crash
    const { writeFileSync } = require('fs')
    writeFileSync(path, JSON.stringify(toJSON()))
}

/**
 *
 * @param { string } path
 */
const readFromFile = (path) => {
    // require fs here so that in case "fs" is not available -- the app does not crash
    const { readFileSync, existsSync } = require('fs')
    if (existsSync(path)) {
        logger.debug(`Reading store from file (${path})`)
        const jsonStr = readFileSync(path, { encoding: 'utf-8' })
        const json = JSON.parse(jsonStr)
        fromJSON(json)
    }
}

module.exports = { chats, contacts, bind, writeToFile, readFromFile }
