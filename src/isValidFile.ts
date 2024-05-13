import * as path from "path";

// Check which files are eligible to be parsed
export const isValidFile = (fileName: string | Buffer): fileName is string => {
  // Ignore buffer type
  if (typeof fileName !== "string") return false;
  // Only cover typescript files
  if (!(fileName.endsWith(".ts") || fileName.endsWith(".tsx"))) return false;
  // Exclude index file in current directory
  if (fileName === "index.ts") return false;
  // Exclude files in nested subdirectories except for direct children
  if (fileName.split(path.sep).length > 2) return false;
  // Exclude files in direct children subdirectories that are not an index file
  if (fileName.includes(path.sep) && !fileName.includes(`${path.sep}index.ts`))
    return false;

  return true;
};
