// .env থেকে আসা সেটিংসগুলোর টাইপ কাঠামো (Interface)
export interface AppConfig {
  defaultLogFile?: string;    // .env-এ দেওয়া ডিফল্ট লগ ফাইলের পাথ (নাও থাকতে পারে)
  reportOutput: string;       // JSON রিপোর্ট কোথায় সেভ হবে
  maxErrorThreshold: number;  // সর্বোচ্চ কয়টি ERROR পর্যন্ত সিস্টেমকে স্বাভাবিক ধরা হবে
}
export function loadConfig(): AppConfig {
  // process.env-এর সব মান সবসময় টেক্সট (string) হিসেবে আসে
  const rawThreshold = process.env.MAX_ERROR_THRESHOLD;

  // মান দেওয়া থাকলে Number() দিয়ে সংখ্যায় রূপান্তর করা, নইলে ডিফল্ট 5 ধরা
  const parsedThreshold = rawThreshold !== undefined ? Number(rawThreshold) : 5;

  // কেউ .env-এ ভুল করে সংখ্যার বদলে লেখা দিলে (NaN হলে) নিরাপদ ডিফল্ট 5 ব্যবহার হবে
  const maxErrorThreshold = Number.isNaN(parsedThreshold) ? 5 : parsedThreshold;

  return {
    defaultLogFile: process.env.DEFAULT_LOG_FILE,
    reportOutput: process.env.REPORT_OUTPUT || "reports/summary.json",
    maxErrorThreshold,
  };
}
