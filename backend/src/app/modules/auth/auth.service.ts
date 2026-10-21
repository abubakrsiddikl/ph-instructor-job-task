import bcrypt from "bcrypt";
import { db } from "../../../prisma/db";
import { jwtHelpers } from "../../utils/jwtHelper";
import config from "../../config";

const login = async (payload: { email: string; passwordHash: string }) => {
  const userData = await db.orm.public.User.first({
    email: payload.email,
  });
  if (!userData) {
    throw new Error("User not found");
  }
  // Add password verification logic here
  const isCorrectPassword = await bcrypt.compare(
    payload.passwordHash,
    userData.passwordHash,
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
  );

  return {
    accessToken,
  };
};
const logout = async () => {};

export const AuthService = {
  login,
  logout,
};
