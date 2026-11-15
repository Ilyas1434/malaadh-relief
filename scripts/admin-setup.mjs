#!/usr/bin/env node
// Set up sign-in for the admin portal.
//
//   pnpm admin:setup            set the live site's password and tokens (stored in Vercel)
//   pnpm admin:setup --local    write them to .env.local, for testing on this computer
//
// The password is never stored. Only a scrypt hash of it is, and what you type here is not
// shown, saved to a file, or written to your shell history.
import { execFileSync } from "node:child_process";
import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const local = process.argv.includes("--local");

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const input = process.stdin;
    if (!hidden || !input.isTTY) {
      input.resume();
      input.once("data", (d) => (input.pause(), resolve(d.toString().trim())));
      return;
    }
    let value = "";
    input.setRawMode(true);
    input.resume();
    const onData = (chunk) => {
      for (const ch of chunk.toString()) {
        if (ch === "\r" || ch === "\n") {
          input.setRawMode(false);
          input.pause();
          input.off("data", onData);
          process.stdout.write("\n");
          return resolve(value);
        }
        if (ch === "\u0003") process.exit(1);
        if (ch === "\u007f") value = value.slice(0, -1);
        else value += ch;
      }
    };
    input.on("data", onData);
  });
}

// ADMIN_SETUP_PASSWORD lets a test script supply a throwaway password without a prompt.
let password = process.env.ADMIN_SETUP_PASSWORD;
if (!password) {
  password = await ask("Admin password: ", { hidden: true });
  if ((await ask("Type it again: ", { hidden: true })) !== password) {
    console.error("Those did not match.");
    process.exit(1);
  }
}
if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

// Must match SCRYPT in src/lib/admin/auth.ts.
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
const settings = {
  ADMIN_PASSWORD_HASH: `${salt.toString("base64")}:${hash.toString("base64")}`,
  ADMIN_SESSION_SECRET: randomBytes(48).toString("base64url"),
};

if (local) {
  const file = join(root, ".env.local");
  const kept = existsSync(file) ? readFileSync(file, "utf8").split("\n").filter((l) => !/^ADMIN_(PASSWORD_HASH|SESSION_SECRET)=/.test(l)) : [];
  const lines = Object.entries(settings).map(([k, v]) => `${k}="${v}"`);
  writeFileSync(file, [...kept.filter((l, i) => l || i < kept.length - 1), ...lines, ""].join("\n"));
  console.log("Saved to .env.local. Restart the dev server to pick it up.");
  process.exit(0);
}

const token = process.env.ADMIN_SETUP_PASSWORD
  ? ""
  : await ask("GitHub token for publishing (paste it, or press Enter to keep the current one): ", { hidden: true });
if (token) settings.GITHUB_DISPATCH_TOKEN = token;

for (const [name, value] of Object.entries(settings)) {
  try {
    execFileSync("vercel", ["env", "rm", name, "production", "--yes"], { cwd: root, stdio: "ignore" });
  } catch {}
  execFileSync("vercel", ["env", "add", name, "production", "--sensitive"], { cwd: root, input: value, stdio: ["pipe", "ignore", "inherit"] });
  console.log(`Set ${name}`);
}
// Settings only reach the live site when it is published again.
try {
  execFileSync("vercel", ["redeploy", "malaadh-relief.vercel.app", "--target", "production"], { cwd: root, stdio: "inherit" });
  console.log("Done. The portal is ready.");
} catch {
  console.log("Saved. Publish the site once more (push any change) for the settings to take effect.");
}
