const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const hash = async (plainText) => {
  return await bcrypt.hash(plainText || "", SALT_ROUNDS);
};

const compare = async (plainText, hashText) => {
  return await bcrypt.compare(plainText || "", hashText || "");
};

module.exports = {
  hash,
  compare,
};
