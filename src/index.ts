import { parseArgs, printHelp } from "./cli";
import { analyzeLogFile, saveReport } from "./analyzer";

const APP_VERSION = "1.1.0";
const DEFAULT_REPORT_PATH = "reports/summary.json";
async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv);

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

    // ১. লগ ফাইল পড়া ও অ্যানালাইসিস করা
    const report = await analyzeLogFile(options.file, options.level);

    // ২. পুরো রিপোর্ট reports/summary.json ফাইলে সেভ করা
    await saveReport(report, DEFAULT_REPORT_PATH);

    // ৩. টার্মিনালে পরিষ্কার সারসংক্ষেপ দেখানো
    console.log(`\n=== sys-log-guard Report (v${APP_VERSION}) ===`);
    console.log(`File        : ${report.file}`);
    console.log(`Total Lines : ${report.totalLines}`);
    console.log(
      `Summary     : INFO=${report.counts.INFO} | WARN=${report.counts.WARN} | ERROR=${report.counts.ERROR}`
    );
    console.log(`Filter      : ${report.filterLevel}`);
    console.log(`Saved JSON  : ${DEFAULT_REPORT_PATH}`);
    console.log("\nMatched Lines:");

    if (report.matchedLines.length === 0) {
      console.log("  (No matching log lines found)");
    } else {
      for (const line of report.matchedLines) {
        console.log(`  - ${line}`);
      }
    }

    process.exit(0);
  } catch (error) {
    // ফাইলটি খুঁজে না পাওয়া গেলে (Node-এর এরর কোড ENOENT) পরিষ্কার বার্তা দেখানো
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      console.error("[ERROR] Log file not found! Please check the file path.");
    } else {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ERROR] ${message}`);
    }
    process.exit(1);
  }
}

main();
