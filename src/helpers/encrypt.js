import CryptoJS from "crypto-js";

export const encrypt = (text, secretKey) => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encrypted;
};
