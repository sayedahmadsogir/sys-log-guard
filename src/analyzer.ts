import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { LogLevel } from "./cli";

export interface LogCounts {
  INFO: number;
  WARN: number;
  ERROR: number;
}
export interface LogReport {
  analyzedAt: string;
  file: string;
  filterLevel: LogLevel | "ALL";
  totalLines: number;
  counts: LogCounts;
  matchedLines: string[];
}
export async function analyzeLogFile(
  filePath: string,
  filterLevel?: LogLevel
): Promise<LogReport> {
  // ১. ফাইলটি UTF-8 টেক্সট হিসেবে পড়া (await দিয়ে পড়া শেষ হওয়া পর্যন্ত অপেক্ষা)
  const content = await readFile(filePath, "utf-8");

const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

 const counts: LogCounts = {
    INFO: 0,
    WARN: 0,
    ERROR: 0,
  };
for (const line of lines) {
    if (line.includes("[INFO]")) counts.INFO++;
    else if (line.includes("[WARN]")) counts.WARN++;
    else if (line.includes("[ERROR]")) counts.ERROR++;
  }
 const matchedLines = filterLevel
    ? lines.filter((line) => line.includes(`[${filterLevel}]`))
    : lines;

return {
    analyzedAt: new Date().toISOString(),
    file: filePath,
    filterLevel: filterLevel ?? "ALL",
    totalLines: lines.length,
    counts,
    matchedLines,
  };
}
export async function saveReport(
  report: LogReport,
  outputPath: string
): Promise<void> {
  // ফাইলের ফোল্ডার (যেমন 'reports') না থাকলে Bash-এর 'mkdir -p'-এর মতো তৈরি করে নেবে
  const dir = path.dirname(outputPath);
  await mkdir(dir, { recursive: true });

  // অবজেক্টকে ২-স্পেস ইনডেন্টসহ পড়া-যোগ্য JSON টেক্সটে রূপান্তর করে ফাইলে লেখা
  const jsonContent = JSON.stringify(report, null, 2);
  await writeFile(outputPath, jsonContent + "\n", "utf-8");
}
