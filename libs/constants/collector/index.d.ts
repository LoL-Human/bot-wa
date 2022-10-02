import { MessageUpdateType, WAMessage, WASocket } from '@adiwajshing/baileys'
import { MessageCollectorOptions, MessageSerialize } from '@constants/message.constant'
import { serialize } from '@utils/serialize.utils'
import { EventEmitter } from 'events'

export interface MessageCollectorOptions {
    filter: RegExp | string
    time?: number
    max?: number
}

export interface MessageCollector {
    on(event: 'collect', listener: (msg: MessageSerialize) => Awaited<void>): this
    on(event: 'end', listener: (reason: 'timeout' | 'limit') => Awaited<void>): this
}

export class MessageCollector extends EventEmitter {
    private client: WASocket
    private options: MessageCollectorOptions
    private msg: MessageSerialize
    private countMessage: number
    private _timeout: any

    constructor(client: WASocket, options: MessageCollectorOptions, msg: MessageSerialize)
    async messageHandler(m: { messages: WAMessage[]; type: MessageUpdateType })
    stop(reason: string)
}
