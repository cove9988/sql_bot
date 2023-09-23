const vscode = require('vscode');
const sqlFormatter = require('sql-formatter');

function sqlBot() { // Keep "sqlBot" as the function name
    console.log('SQL Bot command invoked');  
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const text = editor.document.getText();
        const beautifiedSql = sqlFormatter.format(text, { language: 'sql' });

        editor.edit((editBuilder) => {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(editor.document.lineCount - 1, 0);
            editBuilder.replace(new vscode.Range(start, end), beautifiedSql);
        });
    }
}

vscode.commands.registerCommand('extension.sql_bot', sqlBot); // Keep "extension.sql_bot"

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.sql_bot', sqlBot) // Keep "extension.sql_bot"
    );
}

exports.activate = activate;
