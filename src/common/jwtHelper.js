const jwt = require("jsonwebtoken");

const generateToken = async (payload, secretKey, tokenLife) => {
  try {
    const token = await jwt.sign(payload, secretKey, { expiresIn: tokenLife });
    if (!token) {
      return "Error";
    }
    return token;
  } catch (err) {
    return `Oops! ${err}`;
  }
};

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      }
      return resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
