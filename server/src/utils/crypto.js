var CryptoJS = require('crypto-js')

// const cypherText = CryptoJS.AES.encrypt("Banana Hammock", 'secret message').toString()
// console.log("Encrypted text: ", cypherText)

// const bytes = CryptoJS.AES.decrypt(cypherText, 'secret message')
// const decrypted = bytes.toString(CryptoJS.enc.Utf8)
// console.log("DEcrypted text: ", decrypted)

// console.log("Env Variable CRPYTO_KEY: ", process.env.CRYPTO_KEY)

// var CryptoJS = require("crypto-js");

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('Banana Hammock', process.env.CRYPTO_KEY).toString();
// console.log(ciphertext)
// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_KEY);
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText); // 'my message'


const encryptPlainText = (text) => {
    let encryptedText = CryptoJS.AES.encrypt(text, process.env.CRYPTO_KEY).toString()
    // console.log(encryptedText)
    const data = {roundOne: encryptedText}
    const doubleEncrypt = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_KEY_TWO).toString()
    // console.log(doubleEncrypt)
    return doubleEncrypt

}

const decryptPlainText = (encrypted) => {

    const firstDecryptBytes = CryptoJS.AES.decrypt(encrypted, process.env.CRYPTO_KEY_TWO)
    const firstDecrypt = JSON.parse(firstDecryptBytes.toString(CryptoJS.enc.Utf8))

    const bytes = CryptoJS.AES.decrypt(firstDecrypt.roundOne, process.env.CRYPTO_KEY)
    const text = bytes.toString(CryptoJS.enc.Utf8)

    return text
}

module.exports = {
    encryptPlainText, decryptPlainText
}