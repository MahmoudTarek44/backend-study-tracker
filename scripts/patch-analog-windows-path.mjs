import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const target = join(
  dirname(fileURLToPath(import.meta.url)),
  '../node_modules/@analogjs/vite-plugin-angular/src/lib/angular-vite-plugin.js',
);

const original = `    const fileEmitter = (file) => {
        outputFile?.(file);
        return outputFiles.get(normalizePath(file));
    };`;

const patched = `    const fileEmitter = (file) => {
        outputFile?.(file);
        const key = normalizePath(file);
        // TypeScript lowercases the Windows drive letter. Vite keeps \`C:\`.
        return (
            outputFiles.get(key) ??
            outputFiles.get(key.replace(/^[A-Z]:/, (drive) => drive.toLowerCase()))
        );
    };`;

const source = readFileSync(target, 'utf8');

if (source.includes(patched)) {
  process.exit(0);
}

if (!source.includes(original)) {
  console.warn(
    'Analog Windows path patch was not applied. The plugin source no longer matches Analog 2.7.2.',
  );
  process.exit(0);
}

writeFileSync(target, source.replace(original, patched));
console.log('Patched Analog so Windows drive-letter casing does not drop compiled files.');
