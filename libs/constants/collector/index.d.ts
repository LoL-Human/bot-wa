import { MessageUpdateType, WAMessage, WASocket } from '@adiwajshing/baileys'
import { Serialize } from '@libs/utils/serialize'
import { EventEmitter } from 'events'

export interface MessageCollectorOptions {
    filter: RegExp | string
    time?: number
    max?: number
}

export interface MessageCollector {
    on(event: 'collect', listener: (msg: Serialize) => Awaited<void>): this
    on(event: 'end', listener: (reason: 'timeout' | 'limit') => Awaited<void>): this
}

export class MessageCollector extends EventEmitter {
    private client: WASocket
    private options: MessageCollectorOptions
    private msg: Serialize
    private countMessage: number
    private _timeout: any

    constructor(client: WASocket, options: MessageCollectorOptions, msg: Serialize)
    async messageHandler(m: { messages: WAMessage[]; type: MessageUpdateType })
    stop(reason: string)
}
