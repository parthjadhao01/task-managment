import jwt from "jsonwebtoken";
const generateJWTToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export default generateJWTToken;