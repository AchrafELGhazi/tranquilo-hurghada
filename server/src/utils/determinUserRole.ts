import { Role } from "@prisma/client";
import { env } from "../config/env";

export const determineUserRole = (email: string): Role => {
    if (email.toLowerCase() === env.ADMIN_EMAIL?.toLowerCase()) {
        return Role.HOST;
    }
    return Role.GUEST;
};