import { generatePublicKey } from './utils';
import fs from 'fs';
import z from 'zod';
export type Version = `${number}.${number}.${number}`;
export type SemVersion = 'major' | 'minor' | 'patch' | Version;
import crypto from 'crypto';
import os from 'os';

export function patchManifest(args: { privateKeyPath: string; manifestFilepath: string; xmlUpdateUrl: string }) {
  if (!fs.existsSync(args.manifestFilepath)) {
    throw new Error('Manifest filepath does not exist');
  }

  const parsedManifest = ManifestSchema.passthrough().parse(JSON.parse(fs.readFileSync(args.manifestFilepath, 'utf8')));

  const cachedVersion = getCachedVersion(`${parsedManifest.name}${args.xmlUpdateUrl}`);
  parsedManifest.key = createPublicKeyForManifest(args.privateKeyPath);
  parsedManifest.version = incrementVersion(
    getMaxVersion(cachedVersion.getVersion() as Version, parsedManifest.version as Version),
    'patch',
  );

  parsedManifest.xmlUpdateUrl = args.xmlUpdateUrl;
  cachedVersion.setVersion(parsedManifest.version as Version);

  fs.writeFileSync(args.manifestFilepath, JSON.stringify(parsedManifest, null, 2));
}

function getMaxVersion(ver1: Version, ver2: Version): Version {
  if (!ver1) return ver2;
  if (!ver2) return ver1;
  const v1 = ver1.split('.').map(Number);
  const v2 = ver2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) return ver1;
    if (v1[i] < v2[i]) return ver2;
  }
  return ver1;
}

const ManifestSchema = z.object({
  version: z.string(),
  key: z.string(),
});

function createPublicKeyForManifest(privateKeyPath: string) {
  if (!fs.existsSync(privateKeyPath)) {
    throw new Error('Private key path does not exist');
  }
  return generatePublicKey(fs.readFileSync(privateKeyPath));
}

function getCachedVersion(keyId: string) {
  const id = crypto.createHash('md5').update(keyId, 'utf-8').digest('hex');
  const cachedVersionFilepath = `${os.tmpdir()}/crx-server/${id}/version`;
  if (!fs.existsSync(`${os.tmpdir()}/crx-server/${id}`)) {
    fs.mkdirSync(`${os.tmpdir()}/crx-server/${id}`, { recursive: true });
    fs.writeFileSync(cachedVersionFilepath, '');
  }

  return {
    getVersion() {
      return fs.readFileSync(cachedVersionFilepath, 'utf-8').trim() as Version | '';
    },
    setVersion(version: Version) {
      fs.writeFileSync(cachedVersionFilepath, version);
    },
  };
}

function incrementVersion(ver: Version, sem: SemVersion): Version {
  const split = ver.split('.');
  const version = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    version[i] = parseInt(split[i]);
    if (isNaN(version[i])) version[i] = 0;
  }

  switch (sem) {
    case 'major':
      version[0] = version[0] + 1;
      version[1] = version[2] = 0;
      break;
    case 'minor':
      version[1] = version[1] + 1;
      version[2] = 0;
      break;
    case 'patch':
      version[2] = version[2] + 1;
      break;
  }
  return version.join('.') as Version;
}
