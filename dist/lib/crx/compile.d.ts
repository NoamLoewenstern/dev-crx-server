import z from 'zod';
export declare const CompileArgsSchema: z.ZodObject<{
    srcExtensionDir: z.ZodEffects<z.ZodString, string, string>;
    updateUrl: z.ZodEffects<z.ZodString, string, string>;
    privateKeyPath: z.ZodEffects<z.ZodString, string, string>;
    dstDir: z.ZodEffects<z.ZodString, string, string>;
    extensionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    srcExtensionDir: string;
    updateUrl: string;
    privateKeyPath: string;
    dstDir: string;
    extensionId?: string | undefined;
}, {
    srcExtensionDir: string;
    updateUrl: string;
    privateKeyPath: string;
    dstDir: string;
    extensionId?: string | undefined;
}>;
export type CompileArgs = z.infer<typeof CompileArgsSchema>;
export declare function generateCrx(args: CompileArgs): Promise<void>;
