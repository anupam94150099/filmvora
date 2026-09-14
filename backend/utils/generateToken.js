import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "filmvora_jwt_super_secret_key_2026_cinematic", {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export default generateToken;
