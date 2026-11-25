export type LogLevel = "INFO" | "WARN" | "ERROR";
export interface CliOptions {
  file?: string;      // কোন লগ ফাইল পড়বে (যেমন: logs/server.log)
  level?: LogLevel;   // নির্দিষ্ট কোনো লেভেল ফিল্টার করবে কি না
  help: boolean;      // --help ফ্ল্যাগ দিয়েছে কি না
  version: boolean;   // --version ফ্ল্যাগ দিয়েছে কি না
}
export function parseArgs(argv: string[]): CliOptions {
  // index 0 (node) এবং index 1 (ফাইলের পাথ) বাদ দিয়ে শুধু ইউজারের ফ্ল্যাগগুলো নেওয়া হলো
  const args = argv.slice(2);

  // ডিফল্ট অপশন সেট করা হলো
  const options: CliOptions = {
    help: false,
    version: false,
  };
 for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-h":
      case "--help":
        options.help = true;
        break;

      case "-v":
      case "--version":
        options.version = true;
        break;

      case "-f":
      case "--file": {
        // --file ফ্ল্যাগের ঠিক পরের শব্দটি হলো ফাইলের নাম
        const nextValue = args[i + 1];
        if (!nextValue || nextValue.startsWith("-")) {
          throw new Error("Missing file path after --file (Example: --file logs/server.log)");
        }
        options.file = nextValue;
        i++; // পরের শব্দটি যেহেতু ফাইলের নাম হিসেবে নিয়ে নিয়েছি, তাই এক ঘর এগিয়ে গেলাম
        break;
      }
 case "-l":
      case "--level": {
        // --level ফ্ল্যাগের পরের শব্দটি বড় হাতের অক্ষরে (uppercase) নিয়ে যাচাই করা
        const nextValue = args[i + 1];
        if (!nextValue || nextValue.startsWith("-")) {
          throw new Error("Missing level after --level (Allowed: INFO, WARN, ERROR)");
        }
        const upperLevel = nextValue.toUpperCase() as LogLevel;
        const allowedLevels: LogLevel[] = ["INFO", "WARN", "ERROR"];

        if (!allowedLevels.includes(upperLevel)) {
          throw new Error(`Invalid level "${nextValue}". Allowed values: INFO, WARN, ERROR`);
        }
        options.level = upperLevel;
        i++; // লেভেলের মান নেওয়া হয়ে গেছে, তাই এক ঘর এগিয়ে গেলাম
        break;
      }
default:
        // অপরিচিত কোনো ফ্ল্যাগ দিলে এরর ছুঁড়ে (throw) দেবে
        throw new Error(`Unknown argument: ${arg}. Run with --help to see usage.`);
    }
  }

  return options;
}
export function printHelp(): void {
  console.log(`
sys-log-guard - CLI Log & Health Analyzer

Usage:
  node dist/index.js --file <path> [--level INFO|WARN|ERROR]

Options:
  -f, --file <path>     Path to the log file to analyze (required)
  -l, --level <level>   Filter logs by level (INFO, WARN, ERROR)
  -v, --version         Show current version
  -h, --help            Show this help message
`);
}
