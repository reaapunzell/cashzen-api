import jwt from "jsonwebtoken";
import User from "../model/User.js";

const JWT_KEY = "this is a secret";

const tokenValidation = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      res.status(401).send("authorization missing");
    }

    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    } else {
      return res.status(401).send("Invalid authorizartion format");
    }

    const payload = jwt.verify(token, JWT_KEY);
    if (!payload || !payload.userId) {
      res.status(401).send("user not authorized");
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export default tokenValidation;
