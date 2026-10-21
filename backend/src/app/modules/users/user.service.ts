import bcrypt from "bcrypt";
import { db } from "../../../prisma/db";
import AppError from "../../utils/AppError";

type RegisterUserPayload = {
  name: string;
  email: string;
  passwordHash: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  // console.log(payload,"this payload")
  const hashedPassword = await bcrypt.hash(payload.passwordHash, 10);

  const existingUser = await db.orm.public.User.first({
    email: payload.email,
  });
  if (existingUser) {
    throw new AppError(409, "User already exists");
  }
  const user = await db.orm.public.User.create({
    name: payload.name,
    email: payload.email,
    passwordHash: hashedPassword,
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const getProfile = async (userId: string) => {
  const user = await db.orm.public.User.first({
    id: userId as string,
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

export const UserService = {
  registerUser,
  getProfile,
};
