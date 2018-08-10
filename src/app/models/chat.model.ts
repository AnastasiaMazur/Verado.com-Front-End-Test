import { User } from "./user.model";

export class Chat {
    key?: string
    name?: string
    createdAt?: Date
    companion?: User
    participantsStr?: string
    status?: string
}