"use server"
import { z } from "zod";
import { ResetSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedValues = ResetSchema.safeParse(values)
    if (!validatedValues.success) {
        return {
            error:"Invalid Email address",
        };
    }
    const {email} = validatedValues.data;
    const existingUser = await getUserByEmail(email)
    if (!existingUser) {
        return {
            error:"Email not registered",
        };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(passwordResetToken.email, passwordResetToken.token);
    
    return {
        success:"Reset link sent to your email",
    };
}