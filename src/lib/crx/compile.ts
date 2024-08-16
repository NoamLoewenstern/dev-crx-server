import path from 'path';
import fs from 'fs';
import z from 'zod';
// @ts-expect-error crx doesn't have types
import ChromeExtension from 'crx';
import os from 'os';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

import { patchManifest } from './fixupManifest.js';

export const CompileArgsSchema = z.object({
  srcExtensionDir: z.string().refine(value => fs.existsSync(value)),
  updateUrl: z
    .string()
    .url()
    .transform(value => value.replace(/\/$/, '')), // remove trailing slash
  privateKeyPath: z.string().refine(value => fs.existsSync(value)),
  dstDir: z.string().refine(value => {
    if (!fs.existsSync(value)) {
      fs.mkdirSync(value, { recursive: true });
    }
    return true;
  }),
  extensionId: z.string().optional(),
});
export type CompileArgs = z.infer<typeof CompileArgsSchema>;

export async function generateCrx(args: CompileArgs) {
  if (mutex.isLocked()) {
    console.log('generateCrx is already running, skipping...');
    return;
  }
  await mutex.runExclusive(async () => {
    console.log('packing crx generation...');
    if (!fs.existsSync(args.dstDir)) {
      fs.mkdirSync(args.dstDir, { recursive: true });
    }
    const tempDir = path.join(os.tmpdir(), 'crx-server', Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });
    fs.cpSync(args.srcExtensionDir, tempDir, { recursive: true });

    const crxFilePath = path.join(args.dstDir, 'extension.crx');
    const xmlFilepath = path.join(args.dstDir, 'update.xml');
    const extensionDownloadUrl = `${args.updateUrl}/${'extension.crx'}`;
    const xmlUpdateUrl = `${args.updateUrl}/update.xml`;

    const manifestFilepath = path.join(tempDir, 'manifest.json');
    patchManifest({
      privateKeyPath: args.privateKeyPath,
      manifestFilepath,
      xmlUpdateUrl,
    });

    await packCrx({
      privateKeyPath: args.privateKeyPath,
      srcExtensionDir: tempDir,
      extensionDownloadUrl,
      xmlFilepath,
      crxFilePath,
    });

    console.log(
      `crx generated at: ${crxFilePath} with version: ${JSON.parse(fs.readFileSync(manifestFilepath, 'utf8')).version}`,
    );
  });
}

function packCrx(args: {
  extensionDownloadUrl: string;
  privateKeyPath: string;
  srcExtensionDir: string;
  xmlFilepath: string;
  crxFilePath: string;
}) {
  return new Promise<void>((resolve, reject) => {
    const crx = new ChromeExtension({
      codebase: args.extensionDownloadUrl,
      privateKey: fs.readFileSync(args.privateKeyPath),
      rootDirectory: args.srcExtensionDir,
      version: JSON.parse(fs.readFileSync(path.join(args.srcExtensionDir, 'manifest.json'), 'utf8')).version,
    });
    crx
      .pack()
      .then((crxBuffer: Buffer) => {
        const updateXML = crx.generateUpdateXML();

        fs.writeFileSync(args.xmlFilepath, updateXML);
        fs.writeFileSync(args.crxFilePath, crxBuffer as any);
        resolve();
      })
      .catch((err: unknown) => {
        console.error(err);
        reject(err);
      });
  });
}
