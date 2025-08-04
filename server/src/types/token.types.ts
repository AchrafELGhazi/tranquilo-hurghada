import { Role } from "@prisma/client";

export interface TokenPayload {
     id: string;
     email: string;
     firstName: string;
     lastName: string;
     role: Role;
     isActive: boolean;

}