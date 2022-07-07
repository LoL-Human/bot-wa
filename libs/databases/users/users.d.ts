import { Serialize } from '@libs/utils/serialize/serialize.util'
import { WAMessage } from '@adiwajshing/baileys'

interface UserDTO {
    user_wa_number: string

    user_limit?: number

    user_exp?: number
    user_level?: number

    user_premium?: boolean
    user_premium_end?: string

    user_create_at?: string
}

class User {
    private users: { [_: string]: UserDTO } = {}
    findOne(whatsapp_number: string): UserDTO | null
    insert(whatsapp_number: string): boolean
    update(whatsapp_number: string, newData: UserDTO): boolean
    addExp(msg: Serialize, whatsapp_number: string, exp: number): Promise<WAMessage | boolean>
    save(): void
}

export const users = new User()
