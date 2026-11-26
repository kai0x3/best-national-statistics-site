// Indonesia in Numbers — hand-in program (Node 22, standard library only).
//
// It takes the finished entry from this repository and lays it out for the
// grader: app/ (the static site) and screenshots/ (four real renders) are
// copied beside each other into the output directory, and dossier.json is
// written from them with the vendored make.fun library, which is what the
// judge reads. Run it as:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside this machine MAKEFUN_OUTPUT_DIR stands in for /output, the
// directory the grader hands the program.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The site and its screenshots go in verbatim; the dossier is derived.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// Caps from the competition gate: the dossier text is capped at 160 KiB,
// at most 4 screenshots of at most 256 KiB each, app/ at most 993 files
// and directories and 16 MiB in all.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);
