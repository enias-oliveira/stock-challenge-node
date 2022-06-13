export interface UserPayload extends Omit<User, "passwordHash"> { }

export interface UserCredentials {
    email: string
    password: string
}
