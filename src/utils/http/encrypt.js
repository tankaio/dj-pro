
/* jshint esversion: 6 */ 

import CryptoJS from '../enc/bindAES';
let RSLib = require('../enc/bindRSA');
import base64 from '../enc/base64.js';
import md5 from '../enc/md5.js';

let encrypt = {
    
    //加密 aes
    encAes (str, key, iv) {
        let str1 = CryptoJS.enc.Utf8.parse(str);
        key = CryptoJS.enc.Utf8.parse(key);
        iv = CryptoJS.enc.Utf8.parse(iv);

        let encrypted = CryptoJS.AES.encrypt(str1, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let encryptedData = encrypted.ciphertext.toString();
        var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);
        return CryptoJS.enc.Base64.stringify(encryptedHexStr);
    },
    encMe (str) {
        try { return this.encAes(str, this.enckey, "0000000000000000"); }
        catch (e) {return "";}
    },

    
    //解密 aes
    uncAes (str, key, iv) {
        key = CryptoJS.enc.Utf8.parse(key);
        iv = CryptoJS.enc.Utf8.parse(iv);
        let decrypt = CryptoJS.AES.decrypt(str, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypt.toString(CryptoJS.enc.Utf8);
    },
    uncMe (str) {
        try { return this.uncAes(str, this.enckey, "0000000000000000"); }
        catch (e) {return "";}
    },



    // 生成临时 32 位 aes key，并用 rsa 加密
    _randomString (length) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        let str = '';
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        for (let i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    },
    getTmpKey (pubkey) {
        if(null == pubkey.e || null == pubkey.m) return null;
        RSLib.setMaxDigits(512);
        let tmpkey = this._randomString(32);
        return {ori:tmpkey, enc:RSLib.encryptedString(new RSLib.RSAKeyPair(pubkey.e, '', pubkey.m), tmpkey)};
    },



    // base64
    encBase64 (str) {
        try {
            return base64.encode(str);
        }
        catch (e) {return '';}
    },
    uncBase64 (str) {
        try {
            return base64.decode(str);
        }
        catch (e) {return '';}
    },


    // md5
    getMd5 (str) {
        try {
            return md5.getmd5(str);
        }
        catch (e) {return '';}
    },

    // 循环加密
    encNormal(str, key) {
        try {
            var result = "";
            var ind = 0;
            var keylen = key.length;
            for (var i = 0, len=str.length; i < len; i++) {
                result += String.fromCharCode(str.charCodeAt(i) + key.charCodeAt(ind));
                if (ind + 1 < keylen) ind++; else ind = 0;
            } 
            return result;
        }
        catch (e) {return '';}
    },

    // 循环解密
    uncNormal(str, key) {
        try {
            var result = "";
            var ind = 0;
            var keylen = key.length;
            for (var i = 0, len=str.length; i < len; i++) {
                result += String.fromCharCode(str.charCodeAt(i) - key.charCodeAt(ind));
                if (ind + 1 < keylen) ind++; else ind = 0;
            } 
            return result;
        }
        catch (e) {return '';}
    }
};

export default encrypt;
