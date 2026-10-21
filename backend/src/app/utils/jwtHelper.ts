import jwt, { type JwtPayload } from "jsonwebtoken";

const generateToken = (payload: any, secret: string) => {
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  return token;
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
