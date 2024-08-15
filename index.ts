import { parseArgs } from './commands/compile';
import { generateCrx } from './lib/crx/compile';
import { generateExtensionId, generatePublicKey } from './lib/crx/utils';
import { initServer, serveServer } from './server';
import pDebounce from 'p-debounce';
import { watch } from 'node:fs';

async function main() {
  const args = parseArgs();

  if (args.compileOnStart) {
    console.log('compiling Crx');
    await generateCrx(args);
  }
  const compileCrx = pDebounce(() => generateCrx(args), 1000);
  const app = initServer({
    staticDir: args.dstDir,
    log: true,
    onInvokeForceCompile: compileCrx,
  });

  console.log('initiated server');
  const publicKey = generatePublicKey(args.privateKeyPath);
  const extensionId = generateExtensionId(publicKey);
  console.log('extensionId', extensionId);

  const hostname = args.hostname || '0.0.0.0';
  console.log(`Starting server on: http://${hostname}:${args.port}, and tunnel via ${args.updateUrl}`);
  serveServer({ app, hostname, port: args.port });

  if (args.hotReload) {
    const watcher = watch(args.srcExtensionDir, () => {
      console.log(`srcExtension directory changed! recompiling crx...`);
      void compileCrx();
    });
    watcher.unref();
  }
}

main();
