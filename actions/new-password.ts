"use server"
import { z } from "zod";
import { NewPasswordSchema } from "@/schema";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>,token?: string | null) => {
    if (!token){
        return {
            error:"Token not found",
        };
    }
    const validatedValues = NewPasswordSchema.safeParse(values)
    if (!validatedValues.success) {
        return {
            error:"Invalid Fields",
        };
    }
    const {password} = validatedValues.data;
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
        return {
            error:"Invalid Token",
        };
    }
    const hasExpired =new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return {
            error:"Token expired",
        };
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return {
            error:"Email does not exist",
        };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            password: hashedPassword,
        },
    })

    await db.passwordResetToken.delete({
        where: {
            id: existingToken.id,
        },
    })
    return {
        success:"Password updated successfully",
    };
}