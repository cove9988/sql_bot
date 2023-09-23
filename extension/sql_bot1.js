const vscode = require('vscode');
const sqlFormatter = require('sql-formatter');
const sqlParser = require('sql-parser');

function sqlBot() {
  console.log('SQL Bot command invoked');
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const text = editor.document.getText();

    // Parse the SQL script to identify SQL keywords and table aliases
    const parsedSql = sqlParser.parse(text);

    // Function to convert table alias to lowercase snake_case
    const convertTableAlias = (alias) => {
      return alias.toLowerCase().replace(/[A-Z]/g, (match) => `_${match}`);
    };

    // Recursively traverse the parsed SQL and transform table aliases
    const transformAliases = (node) => {
      if (node.type === 'table' && node.alias) {
        node.alias = convertTableAlias(node.alias);
      }
      for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
          transformAliases(node[key]);
        }
      }
    };

    // Apply the transformation
    transformAliases(parsedSql);

    // Convert SQL keywords to uppercase
    const modifiedSql = sqlParser.stringify(parsedSql).toUpperCase();

    // Format the modified SQL
    const beautifiedSql = sqlFormatter.format(modifiedSql, { language: 'sql' });

    editor.edit((editBuilder) => {
      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(editor.document.lineCount - 1, 0);
      editBuilder.replace(new vscode.Range(start, end), beautifiedSql);
    });
  }
}

vscode.commands.registerCommand('extension.sql_bot', sqlBot);

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.sql_bot', sqlBot)
  );
}

exports.activate = activate;
