const crypto = require('crypto');
const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
console.log('secret key: ' + secretKey)
const encrypt = (buffer) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag
  };
};
const decrypt = (encryptedData, iv, authTag) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag));
  
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final()
  ]);
  
  return decrypted;
};
module.exports = { encrypt, decrypt };