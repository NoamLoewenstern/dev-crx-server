import { generatePublicKey } from './utils';
import fs from 'fs';
import z from 'zod';
export type Version = `${number}.${number}.${number}`;
export type SemVersion = 'major' | 'minor' | 'patch' | Version;

export function patchManifest(args: { privateKeyPath: string; manifestFilepath: string; xmlUpdateUrl: string }) {
  if (!fs.existsSync(args.manifestFilepath)) {
    throw new Error('Manifest filepath does not exist');
  }

  const parsedManifest = ManifestSchema.passthrough().parse(JSON.parse(fs.readFileSync(args.manifestFilepath, 'utf8')));
  parsedManifest.key = createPublicKeyForManifest(args.privateKeyPath);
  parsedManifest.version = bumpManifestVersion((parsedManifest.version || '0.0.0') as Version);
  parsedManifest.xmlUpdateUrl = args.xmlUpdateUrl;
  fs.writeFileSync(args.manifestFilepath, JSON.stringify(parsedManifest, null, 2));
}

function getMaxVersion(ver1: Version, ver2: Version): Version {
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

let cachedPrivateKeyPath: string | null = null;
function createPublicKeyForManifest(privateKeyPath: string) {
  if (!cachedPrivateKeyPath) {
    if (!fs.existsSync(privateKeyPath)) {
      throw new Error('Private key path does not exist');
    }
    cachedPrivateKeyPath = privateKeyPath;
  }
  if (cachedPrivateKeyPath && cachedPrivateKeyPath !== privateKeyPath) {
    throw new Error('Private key path changed');
  }

  return generatePublicKey(fs.readFileSync(cachedPrivateKeyPath));
}

let prevManifestVersion: Version = '0.0.0';
function bumpManifestVersion(version: Version, semVersion: SemVersion = 'patch') {
  const updatedVersion = incrementVersion(getMaxVersion(version, prevManifestVersion), semVersion);

  prevManifestVersion = updatedVersion;

  return prevManifestVersion;
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
