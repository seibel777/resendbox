import { spawnSync } from "node:child_process";

function hasCommand(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore" });
  return result.status === 0;
}

const hasCargo = hasCommand("cargo");
const hasRustc = hasCommand("rustc");

if (hasCargo && hasRustc) {
  process.exit(0);
}

console.error("\nResendBox Tauri preflight failed.\n");

if (!hasCargo) {
  console.error("- `cargo` was not found in your PATH.");
}

if (!hasRustc) {
  console.error("- `rustc` was not found in your PATH.");
}

console.error(`
To fix the error "failed to run 'cargo metadata'":

1. Install Rust:
   curl https://sh.rustup.rs -sSf | sh

2. Restart your terminal or load Cargo into PATH:
   source "$HOME/.cargo/env"

3. Confirm installation:
   cargo --version
   rustc --version

4. Then run again:
   npm run tauri:dev
`);

process.exit(1);
