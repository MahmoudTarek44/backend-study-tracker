import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const publishDir = "dist/analog/public";
const indexPath = `${publishDir}/index.html`;

if (!existsSync(indexPath)) {
  throw new Error(
    `Missing ${indexPath}. Run the Analog build before preparing GitHub Pages.`,
  );
}

copyFileSync(indexPath, `${publishDir}/404.html`);
writeFileSync(`${publishDir}/.nojekyll`, "");
