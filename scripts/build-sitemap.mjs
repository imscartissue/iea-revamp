#!/usr/bin/env node
/**
 * build-sitemap.mjs
 * ---------------------------------------------------------------------------
 * Writes `public/sitemap.xml` and `public/robots.txt` from `schools.json`.
 *
 * WHY GENERATED
 * A hand-written sitemap goes stale the moment a school is added, and a stale
 * sitemap is worse than none: it advertises URLs that 404, which crawlers
 * penalise. Generating it from the same file the app renders means it cannot
 * drift from the roster.
 *
 * 45 URLs: 3 routes + 42 schools. (The 404 is not a URL worth submitting.)
 *
 * WHY IT RUNS AS PART OF `npm run build`
 * The obvious design — generate once, commit the file, check it in CI — put a
 * human decision ("what is the domain?") in front of the first deploy, on a
 * project whose first deploy is usually what reveals the domain. Vercel assigns
 * a `*.vercel.app` address on that first deploy, so a build that refuses to
 * proceed until the origin is known is a chicken-and-egg trap.
 *
 * So the origin is resolved from the ENVIRONMENT at build time, and the sitemap
 * is generated into `public/` before `vite build` copies it into `dist/`. The
 * committed file becomes a convenience for local development rather than a
 * launch bug waiting to happen, and the output is correct by construction
 * rather than by remembering to run a command.
 *
 * ORIGIN RESOLUTION, highest priority first
 *   1. `--origin=`                      explicit flag
 *   2. `IEA_ORIGIN`                     explicit env var — set this for a
 *                                       custom domain, in the host's settings
 *   3. `VERCEL_PROJECT_PRODUCTION_URL`  set automatically by Vercel, e.g.
 *                                       `iea-revamp.vercel.app`
 *   4. `VERCEL_URL`                     set on every Vercel deploy, including
 *                                       previews, so preview builds are valid
 *   5. `https://ieainstitute.org`       placeholder for local dev —
 *                                       set a real origin before launch.
 *
 * Usage
 *   node scripts/build-sitemap.mjs
 *   node scripts/build-sitemap.mjs --origin=https://example.com
 *   IEA_ORIGIN=https://example.com node scripts/build-sitemap.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/** Placeholder until a domain is chosen. `check-sitemap.mjs` imports this. */
export const DEFAULT_ORIGIN = "https://ieainstitute.org";

/**
 * Where the site lives, right now, in this build.
 *
 * Exported so `check-sitemap.mjs` verifies the content that is *about to be
 * built* rather than whatever happens to be committed. Those are different
 * files, and checking the committed one is how a stale origin reaches
 * production.
 */
export function resolveOrigin(argv = process.argv, env = process.env) {
  const arg = argv.find((a) => a.startsWith("--origin="))?.split("=").slice(1).join("=");
  const raw =
    arg ||
    env.IEA_ORIGIN ||
    // Vercel sets both of these. The project one is the stable production
    // address; the deploy one is unique per deploy and is the right fallback
    // for previews.
    env.VERCEL_PROJECT_PRODUCTION_URL ||
    env.VERCEL_URL ||
    DEFAULT_ORIGIN;

  // VERCEL_PROJECT_PRODUCTION_URL arrives without a scheme, which would make
  // `new URL()` throw and every URL in the file relative.
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  return {
    origin: withScheme.replace(/\/+$/, ""),
    isPlaceholder: withScheme.replace(/\/+$/, "") === DEFAULT_ORIGIN,
    source: arg
      ? "--origin"
      : env.IEA_ORIGIN
        ? "IEA_ORIGIN"
        : env.VERCEL_PROJECT_PRODUCTION_URL
          ? "VERCEL_PROJECT_PRODUCTION_URL"
          : env.VERCEL_URL
            ? "VERCEL_URL"
            : "placeholder",
  };
}

const data = JSON.parse(readFileSync(join(ROOT, "src/data/schools.json"), "utf8"));

/** Routes that are not schools. Priority reflects how much we want them read. */
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/rankings", priority: "0.9", changefreq: "weekly" },
  { path: "/methodology", priority: "0.7", changefreq: "monthly" },
  { path: "/reports", priority: "0.5", changefreq: "monthly" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
];

const xmlEscape = (s) =>
  String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);

/**
 * The sitemap and robots content for a given origin.
 *
 * Pure: takes the origin, returns strings. `check-sitemap.mjs` calls this to
 * inspect exactly what a build would write, so the two cannot disagree.
 */
export function buildSitemap(origin) {
  const lastmod = data.meta.publicationDate;

  const urls = [
    ...STATIC_ROUTES.map((r) => ({
      loc: origin + r.path,
      priority: r.priority,
      changefreq: r.changefreq,
    })),
    // Schools are ordered by rank, not alphabetically: rank order is the site's
    // whole premise, and it is also a more stable ordering than the name.
    ...data.schools.map((s) => ({
      loc: `${origin}/school/${s.id}`,
      priority: s.rank <= 10 ? "0.8" : "0.6",
      changefreq: "monthly",
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENERATED by scripts/build-sitemap.mjs — do not edit by hand. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  const robots = `# GENERATED by scripts/build-sitemap.mjs — do not edit by hand.
# There is nothing to hide: every page is public and contains no user data.

User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return { sitemap, robots, urls, lastmod, origin };
}

function main() {
  const { origin, isPlaceholder, source } = resolveOrigin();
  const { sitemap, robots, urls, lastmod } = buildSitemap(origin);

  writeFileSync(join(ROOT, "public/sitemap.xml"), sitemap);
  writeFileSync(join(ROOT, "public/robots.txt"), robots);

  console.log(`\n  ✓ public/sitemap.xml  — ${urls.length} URLs (${STATIC_ROUTES.length} routes + ${data.schools.length} schools)`);
  console.log(`  ✓ public/robots.txt   — sitemap: ${origin}/sitemap.xml`);
  console.log(`    origin               ${origin}  (from ${source})`);
  console.log(`    lastmod              ${lastmod}\n`);

  if (isPlaceholder) {
    console.log("  ⚠ the origin is still the placeholder. That is fine for local development\n");
    console.log("    but this file must not be deployed. On Vercel the real origin is picked up\n");
    console.log("    automatically from VERCEL_PROJECT_PRODUCTION_URL. Elsewhere set:\n");
    console.log("      IEA_ORIGIN=https://your-domain npm run sitemap\n");
  }
}

/**
 * Only write when run directly.
 *
 * `check-sitemap.mjs` imports `buildSitemap` from here to verify the content a
 * build would produce. Without this guard, importing the module ran `main()` as
 * a side effect — so every *check* rewrote `public/sitemap.xml` and
 * `public/robots.txt`, and left a dirty working tree in CI. A check that mutates
 * the thing it is checking is not a check.
 */
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) main();
