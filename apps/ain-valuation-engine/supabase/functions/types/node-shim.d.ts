/* Minimal shims so Deno type-check passes for storage-js d.ts */
declare type Buffer = unknown;
declare namespace NodeJS { interface ReadableStream {} }
