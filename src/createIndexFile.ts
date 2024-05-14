import { readdir, writeFile } from "node:fs/promises";
import * as path from "path";
import * as vscode from "vscode";
import { getExportsFromFile } from "./getExportsFromFile";
import { isValidFile } from "./isValidFile";

// Create an index file in the given folder with explicit exports from all files in the folder
export const createIndexFile = async (folderPath: string) => {
  try {
    const files = await readdir(folderPath, { recursive: true });

    const tsFileNames: string[] = files.filter(isValidFile);

    let content = "";

    tsFileNames.forEach(fileName => {
      const filePath = path.join(folderPath, fileName);
      const exports = getExportsFromFile(filePath);
      if (exports.length > 0) {
        const exportsString = exports.join(",\n  ");
        content += `export {\n  ${exportsString}\n } from './${fileName
          .replace(/\.ts(x)?/, "")
          .replace("/index", "")}';\n`;
      }
    });

    const pathToIndex = path.join(folderPath, "index.ts");

    await writeFile(pathToIndex, content);

    // Open the new index file
    const document = await vscode.workspace.openTextDocument(pathToIndex);
    await vscode.window.showTextDocument(document);

    vscode.window.showInformationMessage("Index file created successfully");
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(error.message);
    } else {
      vscode.window.showErrorMessage(
        "Error while creating the index file: " + JSON.stringify(error)
      );
    }
  }
};
