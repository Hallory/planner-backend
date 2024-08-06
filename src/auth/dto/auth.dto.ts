import { IsEmail, IsString, MinLength} from "class-validator"

export class AuthDto {
    @IsEmail()
    email?: string

    @MinLength(6, {
        message: 'password is too short'
    })

    @IsString()
    password: string
}