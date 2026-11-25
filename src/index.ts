import { parseArgs, printHelp } from "./cli";

const APP_VERSION = "1.0.0";
function main(): void {
  try {
    // টার্মিনাল থেকে পাওয়া আর্গুমেন্টগুলো আমাদের পার্সারে পাঠানো হলো
    const options = parseArgs(process.argv);

    // ১. ইউজার --help চাইলে হেল্প মেনু দেখিয়ে সফলভাবে (exit code 0) বন্ধ হবে
    if (options.help) {
      printHelp();
      process.exit(0);
    }
  if (options.version) {
      console.log(`sys-log-guard v${APP_VERSION}`);
      process.exit(0);
    }
if (!options.file) {
      console.error("[ERROR] Please provide a log file using --file <path>");
      console.error("Tip: Run with --help to see available options.");
      process.exit(1);
    }
console.log("[sys-log-guard] Configuration accepted!");
    console.log(`  Target file : ${options.file}`);
    console.log(`  Level filter: ${options.level ?? "ALL"}`);
    process.exit(0);
  } catch (error) {
    // parseArgs থেকে কোনো Error আসলে তা নিরাপদে ধরে console.error-এ দেখানো
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${message}`);
    process.exit(1);
  }
}

main();
