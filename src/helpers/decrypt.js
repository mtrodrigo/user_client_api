import CryptoJS from "crypto-js";

export const decrypt = (encryptedText, secretKey) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
