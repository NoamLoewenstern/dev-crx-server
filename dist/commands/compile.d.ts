export declare function parseArgs(): {
    srcExtensionDir: string;
    updateUrl: string;
    privateKeyPath: string;
    dstDir: string;
    port: number;
    hostname: string;
    hotReload?: boolean | undefined;
    loadFromEnvFile?: string | undefined;
    compileOnStart?: string | undefined;
};
