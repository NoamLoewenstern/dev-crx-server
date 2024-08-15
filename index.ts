import { parseArgs } from './commands/compile';
import { generateCrx } from './lib/crx/compile';
import { generateExtensionId, generatePublicKey } from './lib/crx/utils';
import { initServer, serveServer } from './server';
import pDebounce from 'p-debounce';

async function main() {
  const args = parseArgs();

  if (args.compileOnStart) {
    console.log('compiling Crx');
    await generateCrx(args);
  }

  const app = initServer({
    staticDir: args.dstDir,
    log: true,
    onInvokeForceCompile: pDebounce(async () => {
      await generateCrx(args);
    }, 500),
  });

  console.log('initiated server');
  const publicKey = generatePublicKey(args.privateKeyPath);
  const extensionId = generateExtensionId(publicKey);
  console.log('extensionId', extensionId);

  const hostname = args.hostname || '0.0.0.0';
  console.log(`Starting server on: http://${hostname}:${args.port}, and tunnel via ${args.updateUrl}`);
  serveServer({ app, hostname, port: args.port });
}

main();
