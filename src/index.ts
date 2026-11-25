import { parseArgs, printHelp } from "./cli";
import { analyzeLogFile, saveReport } from "./analyzer";
import { loadConfig } from "./config";

const APP_VERSION = "1.1.0";

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv);
    // .env (process.env) থেকে প্রজেক্টের কনফিগারেশন লোড করা হলো
    const config = loadConfig();

    if (options.help) {
      printHelp();
      process.exit(0);
    }

    if (options.version) {
      console.log(`sys-log-guard v${APP_VERSION}`);
      process.exit(0);
    }

    // প্রায়োরিটি নিয়ম: টার্মিনালে --file দিলে সেটি চলবে, না দিলে .env-এর DEFAULT_LOG_FILE নেবে
    const targetFile = options.file ?? config.defaultLogFile;

    if (!targetFile) {
      console.error("[ERROR] No log file specified!");
      console.error("Tip: Pass --file <path> OR set DEFAULT_LOG_FILE in your .env file.");
      process.exit(1);
    }

    // ১. লগ ফাইল পড়া ও অ্যানালাইসিস করা
    const report = await analyzeLogFile(targetFile, options.level);

    // ২. কনফিগারেশনে দেওয়া পাথে (যেমন reports/summary.json) রিপোর্ট সেভ করা
    await saveReport(report, config.reportOutput);

    // ৩. টার্মিনালে পরিষ্কার সারসংক্ষেপ দেখানো
    console.log(`\n=== sys-log-guard Report (v${APP_VERSION}) ===`);
    console.log(`File        : ${report.file}`);
    console.log(`Total Lines : ${report.totalLines}`);
    console.log(
      `Summary     : INFO=${report.counts.INFO} | WARN=${report.counts.WARN} | ERROR=${report.counts.ERROR}`
    );
    console.log(`Filter      : ${report.filterLevel}`);
    console.log(`Saved JSON  : ${config.reportOutput}`);
    console.log(`Max Errors  : ${config.maxErrorThreshold}`);
    console.log("\nMatched Lines:");

    if (report.matchedLines.length === 0) {
      console.log("  (No matching log lines found)");
    } else {
      for (const line of report.matchedLines) {
        console.log(`  - ${line}`);
      }
    }

    // ৪. হেলথ অ্যালার্ট চেক: ERROR সংখ্যা সীমা ছাড়ালে সতর্কবার্তা ও exit code 1 রিটার্ন করা
    if (report.counts.ERROR > config.maxErrorThreshold) {
      console.error(
        `\n[ALERT] Health check failed! Found ${report.counts.ERROR} errors (limit: ${config.maxErrorThreshold}).`
      );
      process.exit(1);
    }

    console.log("\n[OK] System health is within allowed error limit.");
    process.exit(0);
  } catch (error) {
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
