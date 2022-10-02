const { default: WASocket, fetchLatestBaileysVersion, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys')
const { Utility } = require('./utils/utility')
const logger = require('./utils/logger')
const { sessionName } = require('@config')
const { messageHandler } = require('./handlers')
const { Boom } = require('@hapi/boom')
const { existsSync } = require('fs')
const store = require('@store')
const Pino = require('pino')

existsSync('./store/baileys_store.json') && store.readFromFile('./store/baileys_store.json')
setInterval(() => {
    store.writeToFile('./store/baileys_store.json')
}, 60_000)

const utility = new Utility()

const connect = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(`./session/${sessionName}-session`)
    const { version, isLatest } = await fetchLatestBaileysVersion()

    const client = WASocket({
        printQRInTerminal: true,
        auth: state,
        logger: Pino({ level: 'silent' }),
        browser: ['LoL Human', 'Safari', '1.0'],
        version,
    })

    store.bind(client.ev)

    client.ev.on('chats.set', () => {
        logger.store(`Got ${store.chats.all().length} chats`)
    })

    client.ev.on('contacts.set', () => {
        logger.store(`Got ${Object.values(store.contacts).length} contacts`)
    })

    client.ev.on('creds.update', saveCreds)
    client.ev.on('connection.update', async (up) => {
        const { lastDisconnect, connection, qr } = up

        if (qr) {
            logger.info('Please scanning QR Code to connect')
        }

        if (connection) {
            logger.info(`Connection Status: ${connection}`)
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect.error).output.statusCode
            if (reason === DisconnectReason.badSession) {
                logger.error(`Bad Session File, Please Delete ./session/${sessionName}-session and Scan Again`)
                client.logout()
            } else if (reason === DisconnectReason.connectionClosed) {
                logger.error('Connection closed, reconnecting....')
                connect()
            } else if (reason === DisconnectReason.connectionLost) {
                logger.error('Connection Lost from Server, reconnecting...')
                connect()
            } else if (reason === DisconnectReason.connectionReplaced) {
                logger.error('Connection Replaced, Another New Session Opened, Please Close Current Session First')
                client.logout()
            } else if (reason === DisconnectReason.loggedOut) {
                logger.error(`Device Logged Out, Please Delete ./session/${sessionName}-session and Scan Again.`)
                client.logout()
            } else if (reason === DisconnectReason.restartRequired) {
                logger.error('Restart Required, Restarting...')
                connect()
            } else if (reason === DisconnectReason.timedOut) {
                logger.error('Connection TimedOut, Reconnecting...')
                connect()
            } else {
                client.end(new Error(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`))
            }
        }
    })

    // messages.upsert
    client.ev.on('messages.upsert', ({ messages, type }) => {
        if (type !== 'notify') return
        messageHandler(client, { messages, type })
    })
}

module.exports = {
    connect,
}
