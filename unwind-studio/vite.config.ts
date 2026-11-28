import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/** Writes dist/sw.js with a precache list of every built file, so the whole app works offline. */
function offline(): Plugin {
  return {
    name: 'unwind-offline',
    apply: 'build',
    closeBundle() {
      const dist = join(__dirname, 'dist');
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const f of readdirSync(dir)) {
          const p = join(dir, f);
          if (statSync(p).isDirectory()) walk(p);
          else if (f !== 'sw.js') files.push(relative(dist, p).split('\\').join('/'));
        }
      };
      walk(dist);
      const hash = createHash('sha1');
      for (const f of files.sort()) hash.update(f).update(readFileSync(join(dist, f)));
      const version = hash.digest('hex').slice(0, 10);
      const sw = readFileSync(join(__dirname, 'src/sw.template.js'), 'utf8')
        .replace('__VERSION__', version)
        .replace("'__FILES__'", JSON.stringify(['./', ...files.map((f) => './' + f)]));
      writeFileSync(join(dist, 'sw.js'), sw);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), offline()],
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '1.0.0') },
  build: { target: 'es2022', chunkSizeWarningLimit: 2500 },
  test: { include: ['tests/**/*.test.ts'], testTimeout: 240000 },
});
