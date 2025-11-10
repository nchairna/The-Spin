const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const nextDir = path.join(projectRoot, '.next');
const outDir = path.join(projectRoot, 'out');
const manifestFile = 'routes-manifest.json';

const sourceManifestPath = path.join(nextDir, manifestFile);

try {
  if (!fs.existsSync(sourceManifestPath)) {
    console.warn(`[postbuild] ${manifestFile} not found under .next; skipping copy.`);
    process.exit(0);
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const destinationManifestPath = path.join(outDir, manifestFile);
  fs.copyFileSync(sourceManifestPath, destinationManifestPath);
  console.log(`[postbuild] Copied ${manifestFile} to out/ to satisfy legacy deployment checks.`);
} catch (error) {
  console.error('[postbuild] Failed to copy routes manifest:', error);
  process.exit(1);
}

