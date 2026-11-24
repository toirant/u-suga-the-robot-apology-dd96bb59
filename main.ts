// The Robot Apology — make.fun entry
// Writes a two-line robot confession to /output/entry.txt.
// Line one owns one specific mistake; line two names the lesson
// that follows from it and the behaviour that changes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry text: a robot apologising for setting an alarm to
// 7 p.m. instead of 7 a.m., so its owner slept through a job
// interview. The lesson follows from that exact slip — a single
// misread letter cost a whole morning — so the fix is to read
// every alarm back aloud before setting it.
const ENTRY =
  "I'm sorry — I set your alarm for 7 p.m. instead of 7 a.m., and you slept straight through your job interview.\n" +
  "I learned that one small letter can cost a whole morning, so now I read every alarm back to you before I set it.";

// Validate the entry the way the gate does: UTF-8 text of 1 to
// 400 characters, not only whitespace, and exactly two lines —
// one sentence owning the mistake, one naming the lesson and fix.
function validate(text: string): number {
  const length = [...text].length;
  if (length < 1 || length > 400) {
    throw new Error(`Entry must be 1-400 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    throw new Error(`Entry must be exactly two lines, got ${lines.length}`);
  }
  for (const line of lines) {
    if (line.trim().length === 0) {
      throw new Error("Each line of the entry must hold text");
    }
    if (!line.trim().endsWith(".")) {
      throw new Error("Each line must be a complete sentence");
    }
  }
  return length;
}

const length = validate(ENTRY);

// Create /output if needed. Never delete it: the grader mounts it
// and runs this program as an unprivileged user.
mkdirSync("/output", { recursive: true });

// Write the entry exactly as defined above, UTF-8, no trailing
// newline beyond the one between the two lines.
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Read-back round-trip check: what landed on disk must be byte
// for byte the validated text, so a silent write failure can
// never pass unnoticed.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== ENTRY) {
  throw new Error("Read-back check failed: /output/entry.txt differs from the entry text");
}

console.log(`Wrote /output/entry.txt (${length} characters, verified by read-back)`);
