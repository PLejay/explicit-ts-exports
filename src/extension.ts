import * as path from "path";
import * as vscode from "vscode";
import { createIndexFile } from "./createIndexFile";

// Activate the extension
export function activate(context: vscode.ExtensionContext) {
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "explicit-ts-exports.createIndexFile",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          "Open a directory to create an index file."
        );
        return;
      }
      const folderPath = path.dirname(editor.document.uri.fsPath);
      createIndexFile(folderPath);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
