import { Hono } from 'hono';
type Args = {
    staticDir: string;
    onInvokeForceCompile?: () => void;
    log?: boolean;
};
export declare function initServer(args: Args): Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
export declare function serveServer({ app, hostname, port }: {
    app: Hono;
    hostname: string;
    port: number;
}): void;
export {};
