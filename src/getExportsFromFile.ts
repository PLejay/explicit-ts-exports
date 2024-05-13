import * as fs from "fs";
import * as ts from "typescript";

export const getExportsFromFile = (filePath: string): string[] => {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES2015,
    true
  );

  const exports: string[] = [];

  sourceFile.forEachChild(node => {
    if (ts.isExportDeclaration(node)) {
      const { exportClause, isTypeOnly } = node;
      if (!exportClause) {
        return;
      }
      if (ts.isNamespaceExport(exportClause)) {
        exports.push(exportClause.name.text);
        return;
      }

      exportClause.elements.forEach(specifier => {
        const exportString = isTypeOnly
          ? `type ${specifier.name.text}`
          : specifier.name.text;
        exports.push(exportString);
      });
      return;
    }

    // Handle variable exports
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach(decl => {
        if (
          ts.isVariableDeclaration(decl) &&
          decl.name.kind === ts.SyntaxKind.Identifier
        ) {
          exports.push(decl.name.text);
        }
      });
      return;
    }

    // Handle type exports
    if (
      ts.isTypeAliasDeclaration(node) &&
      node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      exports.push(`type ${node.name.text}`);
      return;
    }

    // Handle default exports
    if (ts.isExportAssignment(node)) {
      const defaultExpression = `default as ${node.expression.getText()}`;
      exports.push(defaultExpression);
      return;
    }

    // Handle function exports
    if (ts.isFunctionDeclaration(node) && node.name) {
      exports.push(node.name.text);
      return;
    }
  });

  return exports;
};
