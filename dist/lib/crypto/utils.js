import fs from 'fs';
import cp from 'child_process';
export async function calculatePublicKeyForManifestViaOpenSSLCMD(privateKeyFilepath) {
    if (!fs.existsSync(privateKeyFilepath)) {
        throw new Error(`Private key file not found: ${privateKeyFilepath}`);
    }
    const { stderr, stdout, error } = cp.spawnSync('sh', ['-c', `openssl rsa -in ${privateKeyFilepath} -pubout -outform DER | openssl base64 -A`], {
        encoding: 'utf8',
    });
    if (error) {
        throw new Error(`Error: ${error}\nstderr: ${stderr}`);
    }
    return stdout;
}
//# sourceMappingURL=utils.js.map