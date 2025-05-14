"use server";

//next_auth config
import { auth, signIn, signOut } from "@/auth";

import { hash } from "bcryptjs";

import crypto from "crypto";

//schemas
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  type updateUserSchema,
} from "../validators";

//RedirectError and formatError
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";

//bcrypt
import { hashSync } from "bcrypt-ts-edge";

//prisma
import { prisma } from "@/db/prisma";

// Shipping Address types
import type { ShippingAddress } from "@/types";

//zod
import type { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { resetPasswordHTMLTemplate } from "../emailTemplate";
import sendEmail from "../sendEmail";
import { sendResetEmail } from "@/email";
import { redirect } from "next/navigation";

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

// Sign the user out
export async function signOutUser() {
  await signOut(); // logout normal para login com senha ou Google, etc.
}

// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      confirmPassword: formData.get("confirmPassword"),
      password: formData.get("password"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");
  return user;
}

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    if (!session?.user?.id) throw new Error("USer noot Authenticated");
    const userId = session.user.id;

    const currentUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();

    if (!session?.user?.id) throw new Error("USer noot Authenticated");
    const userId = session.user.id;

    const currentUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update User Profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete user by ID
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//forgot Password
export async function forgotPassword(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    // Gerar token simples (envia para o usuário)
    const rawToken = crypto.randomBytes(20).toString("hex");

    // Gerar token com hash (armazenado no banco)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Atualizar usuário com token e validade
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      },
    });

    // Enviar e-mail com link de reset
    const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/password/reset/${rawToken}`;
    const html = resetPasswordHTMLTemplate(user.name, resetUrl);

    await sendEmail({
      email: user.email,
      subject: "Recuperação de Senha",
      message: html,
    });

    return { success: true, message: `E-mail enviado para ${user.email}` };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string
) {
  try {
    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { gt: new Date() },
      },
    });

    if (!user) throw new Error("Token inválido ou expirado");

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    return { success: true, message: "Senha redefinida com sucesso" };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

// Upload Avatar
export async function uploadUserAvatar(userId: string, image: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image },
    });

    revalidatePath("/me/settings");
    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Enviar link de redefinição
export async function sendResetPasswordLink(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado");

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: expireTime,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset/${token}`;
  await sendResetEmail({ to: email, name: user.name, resetUrl });

  return { success: true, message: "Link enviado com sucesso para " + email };
}

// Server action para usar no formulário
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  if (!email) return { success: false, message: "O e-mail é obrigatório" };

  try {
    return await sendResetPasswordLink(email);
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, message: error.message };
  }
}

// Redefinir a senha
export async function resetPasswordAction(formData: FormData) {
  const token = formData.get("token")?.toString();
  const password = formData.get("password")?.toString();

  if (!token || !password) {
    return { success: false, message: "Token e senha obrigatórios" };
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { gt: new Date() },
    },
  });

  if (!user) {
    return { success: false, message: "Token inválido ou expirado" };
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  // Login automático
  await signIn("credentials", {
    redirect: true,
    callbackUrl: "/dashboard", // ajuste a página desejada
    email: user.email,
    password,
  });

  return { success: true, email: user.email };
}
