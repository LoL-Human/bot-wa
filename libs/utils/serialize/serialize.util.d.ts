import { GroupMetadata, MessageType, proto, WAMediaUpload, WAMessage, WASocket } from '@adiwajshing/baileys'

interface MessageQuote {
    key?: { id: string; fromMe: boolean; remoteJid: string }
    message?: proto.IMessage
    download?<T extends keyof DownloadType>(type?: T): Promise<DownloadType[T]>
    delete?: () => Promise<proto.WebMessageInfo>
}

interface MessageType {
    isImage?: boolean
    isVideo?: boolean
    isAudio?: boolean
    isSticker?: boolean
    isContact?: boolean
    isLocation?: boolean
    isQuoted?: boolean
    isQuotedImage?: boolean
    isQuotedVideo?: boolean
    isQuotedAudio?: boolean
    isQuotedSticker?: boolean
    isQuotedContact?: boolean
    isQuotedLocation?: boolean
}

interface MessageCollectorOptions {
    filter: RegExp | string
    time?: number
    max?: number
}

interface MessageCollector {
    on(event: 'collect', listener: (msg: Serialize) => Awaited<void>): this
    on(event: 'end', listener: (reason: 'timeout' | 'limit') => Awaited<void>): this
}

declare type DownloadType = {
    buffer: Buffer
    stream: Stream
}

export interface Serialize {
    id?: string
    type?: string
    typeCheck?: MessageType
    from?: string
    isSelf?: boolean
    isGroup?: boolean
    groupMetadata?: GroupMetadata
    responseId?: string
    sender?: string
    senderNumber?: string
    pushName?: string
    mentions?: string[]
    quoted?: MessageQuote
    body?: string

    reply?: (text: string | number, quoted?: WAMessage) => Promise<proto.WebMessageInfo>
    replyWithMentions?: (text: string | number, mentions?: string[], quoted?: WAMessage) => Promise<proto.WebMessageInfo>
    replyImage?: (image: WAMediaUpload, caption?: string) => Promise<proto.WebMessageInfo>
    replyVideo?: (video: WAMediaUpload, caption?: string) => Promise<proto.WebMessageInfo>
    replyAudio?: (audio: WAMediaUpload, ptt?: boolean) => Promise<proto.WebMessageInfo>
    replyDocument?: (document: WAMediaUpload, mimetype: string, fileName?: string) => Promise<proto.WebMessageInfo>
    replySticker?: (sticker: WAMediaUpload) => Promise<proto.WebMessageInfo>
    replyLocation?: (location: proto.ILocationMessage) => Promise<proto.WebMessageInfo>
    replyList?: (text: string, buttonText: string, sections: proto.ISection[], title?: string, footer?: string) => Promise<proto.WebMessageInfo>
    replyButton?: (text: string, buttons: proto.IButton[], title?: string, footer?: string) => Promise<proto.WebMessageInfo>
    replyTemplateButton?: (text: string, templateButtons: proto.IHydratedTemplateButton[], title?: string, footer?: string) => Promise<proto.WebMessageInfo>

    react?: (text: string) => Promise<proto.WebMessageInfo>
    download?<T extends keyof DownloadType>(type?: T): Promise<DownloadType[T]>
    createMessageCollector?: (options: MessageCollectorOptions) => MessageCollector
}

export const serialize = (msg: WAMessage, client: WASocket): Promise<Serialize> => {}
