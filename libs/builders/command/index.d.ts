import { WAMessage, WASocket } from '@adiwajshing/baileys'
import { Serialize } from '@libs/utils/serialize'

interface CommandObject {
    client: WASocket
    message: WAMessage
    command: string
    prefix: string
    args: string[]
    fullArgs: string
    msg: Serialize
}

export class ICommand {
    /**
     * @description Command alias
     * @example aliases: ['blabla', 'blabla']
     */
    aliases?: string[]

    /**
     * @required
     * @description Command category (will use to build help command)
     * @example category: 'downloader'
     */
    category: string

    /**
     * @required
     * @description Command description
     * @example description: 'Youtube Downloader'
     */
    description: string

    /**
     * @description If true and not owner will send forbidden message
     * @example ownerOnly: true
     */
    ownerOnly?: boolean

    /**
     * @description If true and not group and not admin will send forbidden message
     * @example adminOnly: true
     */
    adminOnly?: boolean

    /**
     * @description If true and not group will send forbidden message
     * @example groupOnly: true
     */
    groupOnly?: boolean

    /**
     * @description If true and not private will send forbidden message
     * @example privateOnly: true
     */
    privateOnly?: boolean

    /**
     * @description If true and not premium user will send forbidden message
     * @example premiumOnly: true
     */
    premiumOnly?: boolean

    /**
     * @description Limit controller, if true will use limit
     * @example limit: true
     */
    limit?: boolean

    /**
     * @description Minimum argument, for example ytmp3 without url will send required minimun args message
     * @example minArgs: 1
     */
    minArgs?: number

    /**
     * @description Expected argument
     * @example expectedArgs: '<link1> <link2>'
     */
    expectedArgs?: string

    /**
     * @description Example use of the command
     * @example example: '{prefix}{command} https://www.youtube.com/watch?v=eZskFo64rs8'
     */
    example?: string

    /**
     * @description Send waiting message before execute the callback function
     * @example waitMessage: true
     */
    waitMessage?: boolean | string

    /**
     * @description Cooldown command
     * @example cooldown: 10 * 1000 // 10 seconds
     */
    cooldown?: number

    /**
     * @required
     * @description Callback to execute command function
     * @example callback: async ({ msg }) => msg.reply('Hello World!')
     */
    callback: (obj: CommandObject) => Promise<any>
}
