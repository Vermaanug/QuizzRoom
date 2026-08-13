import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../db/prisma.js";
import { MappedUser } from "../types/index.js";

const mapUser = (user: any): MappedUser | null => {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const findUserByUsernameOrEmail = async (
  username: string,
  email: string
): Promise<MappedUser | null> => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: username.trim() }, { email: normalizeEmail(email) }],
    },
  });

  return mapUser(user);
};

export const findUserForLogin = async (
  identifier: string
): Promise<MappedUser | null> => {
  const trimmedIdentifier = identifier.trim();
  const isEmail = trimmedIdentifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail
      ? { email: normalizeEmail(trimmedIdentifier) }
      : { username: trimmedIdentifier },
  });

  return mapUser(user);
};

export const findUserById = async (id: string): Promise<MappedUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return mapUser(user);
};

export const createUser = async ({
  firstName,
  lastName,
  username,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}): Promise<MappedUser> => {
  const passwordHash = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: normalizeEmail(email),
      passwordHash,
    },
  });

  return mapUser(user)!;
};
