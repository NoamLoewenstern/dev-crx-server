#!/usr/bin/env node
import { parseArgs } from './commands/compile.js';
import { generateCrx } from './lib/crx/compile.js';
import { generateExtensionId, generatePublicKey } from './lib/crx/utils.js';
import { initServer, serveServer } from './server/index.js';
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
//# sourceMappingURL=cli.js.map