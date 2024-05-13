import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getExportsFromFile } from "./getExportsFromFile";

// Create an index file in the given folder with explicit exports from all files in the folder
export const createIndexFile = (folderPath: string) => {
  fs.readdir(folderPath, (err, fileNames) => {
    console.log("🚀 ~ fs.readdir ~ fileNames:", fileNames)
    if (err) {
      vscode.window.showErrorMessage("Failed to read the directory");
      return;
    }

    // Cover only .ts and .tsx files
    const isValidFile = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".tsx");

    const tsFileNames = fileNames.filter(
      fileName => isValidFile(fileName) && fileName !== "index.ts"
    );
    let content = "";

    tsFileNames.forEach(fileName => {
      const filePath = path.join(folderPath, fileName);
      const exports = getExportsFromFile(filePath);
      if (exports.length > 0) {
        const exportsString = exports.join(",\n  ");
        content += `export {\n  ${exportsString}\n } from './${fileName.replace(
          ".ts",
          ""
        )}';\n`;
      }
    });

    fs.writeFile(path.join(folderPath, "index.ts"), content, err => {
      if (err) {
        vscode.window.showErrorMessage("Failed to write the index file");
        return;
      }
      vscode.window.showInformationMessage("Index file created successfully");
    });
  });
};
