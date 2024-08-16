import dotenv from 'dotenv';
import fs from 'fs';
import z from 'zod';
import { camelCase } from 'change-case';
import { parser } from 'zod-opts';
import { Options } from 'zod-opts/dist/type';

import { CompileArgsSchema } from '../lib/crx/compile.js';

const ServerArgsSchema = z.object({
  port: z.number(),
  hotReload: z.coerce
    .string()
    .transform(value => !!value)
    .optional(),
});

const ArgsSchema = CompileArgsSchema.merge(ServerArgsSchema);

export function parseArgs() {
  const options = {
    srcExtensionDir: {
      type: ArgsSchema.shape.srcExtensionDir,
      alias: 's',
    },
    updateUrl: {
      type: ArgsSchema.shape.updateUrl,
      description: 'Public url to crx-server xml file',
    },
    privateKeyPath: {
      type: ArgsSchema.shape.privateKeyPath,
      alias: 'k',
      description: 'Private key path',
    },
    dstDir: {
      type: ArgsSchema.shape.dstDir,
      description: 'Destination served crx-server',
    },
    hotReload: {
      type: ArgsSchema.shape.hotReload,
      description: 'Trigger re-compile on changes to src-extension',
    },
    hostname: {
      type: z.string().default('0.0.0.0'),
      description: 'Port to run the server on',
    },
    port: {
      type: ArgsSchema.shape.port,
      alias: 'p',
      description: 'Port to run the server on',
    },
    loadFromEnvFile: {
      type: z.string().optional(),
      description: 'Load from .env',
    },
    compileOnStart: {
      type: z.string().optional(),
      description: 'Compile on starting server',
    },
  } satisfies Options;
  const parsed = parser().name('crx-server').options(options);

  // try loading from env file
  const idxEnv = process.argv.indexOf('--loadFromEnvFile');
  if (idxEnv > -1) {
    let envFilepath = process.argv[idxEnv + 1] || '.env';
    if (envFilepath && !fs.existsSync(envFilepath)) {
      console.error('env file does not exist', envFilepath);
    }
    console.log('loading from env file');
    const optionsKeys = Object.keys(options);
    const args = [] as string[];
    const envVars = dotenv.config({ path: envFilepath });
    if (envVars.error) {
      console.error('Failed to load env file', envVars.error);
      throw envVars.error;
    }
    for (const key in envVars.parsed) {
      const camelKey = camelCase(key);
      if (optionsKeys.includes(camelKey)) {
        args.push(`--${camelKey}`, envVars.parsed[key]);
      }
    }
    try {
      return parsed.parse(args);
    } catch (e) {
      console.warn('Failed to parse args from env file, args:', args);
      throw e;
    }
  }
  return parsed.parse();
}
