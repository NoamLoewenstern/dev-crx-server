export type Version = `${number}.${number}.${number}`;
export type SemVersion = 'major' | 'minor' | 'patch' | Version;
export declare function patchManifest(args: {
    privateKeyPath: string;
    manifestFilepath: string;
    xmlUpdateUrl: string;
}): void;
