export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface CliOptions {
  file?: string;
  level?: LogLevel;
  help: boolean;
  version: boolean;
}

export function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
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
        const nextValue = args[i + 1];
        if (!nextValue || nextValue.startsWith("-")) {
          throw new Error("Missing file path after --file (Example: --file logs/server.log)");
        }
        options.file = nextValue;
        i++;
        break;
      }

      case "-l":
      case "--level": {
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
        i++;
        break;
      }

      default:
        throw new Error(`Unknown argument: ${arg}. Run with --help to see usage.`);
    }
  }

  return options;
}

export function printHelp(): void {
  console.log(`
sys-log-guard - CLI Log & Health Analyzer

Usage:
  log-guard --file <path> [--level INFO|WARN|ERROR]

Options:
  -f, --file <path>     Path to the log file (or set DEFAULT_LOG_FILE in .env)
  -l, --level <level>   Filter logs by level (INFO, WARN, ERROR)
  -v, --version         Show current version
  -h, --help            Show this help message
`);
}
