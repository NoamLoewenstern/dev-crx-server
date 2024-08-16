import RSA from 'node-rsa';
import crypto from 'crypto';
import fs from 'fs';
export function generatePublicKey(privateKey) {
    if (!privateKey) {
        throw new Error('Impossible to generate a public key: privateKey option has not been defined or is empty.');
    }
    if (fs.existsSync(privateKey)) {
        privateKey = fs.readFileSync(privateKey, 'utf8');
    }
    const key = new RSA(privateKey);
    const publicKey = key.exportKey('pkcs8-public-der').toString('base64');
    return publicKey;
}
export function generateExtensionId(publicKey) {
    return crypto
        .createHash('sha256')
        .update(publicKey, 'base64')
        .digest()
        .toString('hex')
        .split('')
        .map(x => (parseInt(x, 16) + 0x0a).toString(26))
        .join('')
        .slice(0, 32);
}
//# sourceMappingURL=utils.js.map