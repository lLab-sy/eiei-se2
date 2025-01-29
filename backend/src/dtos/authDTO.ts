export class RegisterDTO {
    constructor(
        public username: string,
        public password: string,
        public role: string
    ) {}
}

export class LoginDTO {
    constructor(
        public username: string,
        public password: string,
    ) {}
}