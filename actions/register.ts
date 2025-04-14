"use server"
import * as z from 'zod';
import { RegisterSchema } from "@/schema";
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
export const register = async (values:z.infer<typeof RegisterSchema>) => {
  console.log(values)
  const validatedValues = RegisterSchema.safeParse(values)
  if (!validatedValues.success) {
    return {
        error:"Invalid Credentials",
    };
  }
  const {email, password, name} = validatedValues.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser= await getUserByEmail(email)
  if (existingUser) {
    return {
        error:"User already exists",
    };
  }
  await db.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name,
    },
  })

  const verificationToken = await generateVerificationToken(email)

  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token)

  return {
    success: "Confirmation email sent",
  }

}