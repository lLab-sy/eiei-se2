export interface RegisterDTO{
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
}

export interface LoginDTO{
    username: string;
    password: string;
}

export interface ReturnRegisterDTO{
    username: string;
    role: "producer" | "production professional" | "admin";
}

export interface ReturnLoginDTO {
    token: string;
    user: {
        id: string;
        username: string;
        role: string;
    };
}

export interface ProducerReturnGetMeDTO {
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
    email?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: "Male" | "Female" | "Non-Binary" | "Other";
    bankAccount?: {
        bankName?: string;
        accountHolderName?: string;
        accountNumber?: string;
    };
    profileImage?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt?: Date;
    company?: string;
    paymentType?: "qrCode" | "creditDebit";
    nameOnCard?: string; //for Credit/Debit
    cardNumber?: string; //for Credit/Debit
}

export interface ProctionProfessionalReturnGetMeDTO {
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
    email?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: "Male" | "Female" | "Non-Binary" | "Other";
    bankAccount?: {
        bankName?: string;
        accountHolderName?: string;
        accountNumber?: string;
    };
    profileImage?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt?: Date;
    occupation?: string;
    skill?: string[]; // Array of skills (e.g., ['Cameraman', 'Lighting', 'Editing'])
    experience?: number; // Years of experience
    rating?: Array<{
        ratingScore?: number
        comment?: string
    }>;
}

export interface AdMinReturnGetMeDTO {
    username: string;
    password: string;
    role: "producer" | "production professional" | "admin";
    email?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: "Male" | "Female" | "Non-Binary" | "Other";
    bankAccount?: {
        bankName?: string;
        accountHolderName?: string;
        accountNumber?: string;
    };
    profileImage?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt?: Date;
}
