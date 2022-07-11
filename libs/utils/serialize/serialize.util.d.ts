import { GroupMetadata, MessageType, proto, WAMediaUpload, WAMessage } from '@adiwajshing/baileys'
import { MessageCollectorOptions, MessageQuote } from '@libs/builders/command/command.builder'

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
    download?: (type: 'buffer' | 'stream') => Promise<Buffer | Stream>
    createMessageCollector?: (options: MessageCollectorOptions) => MessageCollector
}
