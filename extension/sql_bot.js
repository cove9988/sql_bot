const vscode = require('vscode');
const sqlFormatter = require('sql-formatter');
const { Parser } = require('node-sql-parser');
const opt = {
    database: 'Postgresql'
}

const outputFilePath = path.join(__dirname, 'sql-bot-log.txt'); // Specify the path to the log file

function appendToLogFile(message) {
  fs.appendFileSync(outputFilePath, message + '\n');
}

const myOutputChannel = vscode.window.createOutputChannel('sql-bot');
myOutputChannel.show();


// Override console.log to capture log messages
console.log = function (...args) {
    const message = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
    myOutputChannel.appendLine(message);
    appendToLogFile(message);
};

console.log('SQL Bot: Extension activated');

function sqlBot() {
    try {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            const parser = new Parser(opt); // Initialize the parser with options

            const { tableList, columnList, ast } = parser.parse(text);

            // Log parsed information
            console.log('Parsed Table List:', tableList);
            console.log('Parsed Column List:', columnList);
            console.log('Parsed AST:', ast);

            const parsedSql = parser.sqlify(ast, opt);
            const beautifiedSql = sqlFormatter.format(parsedSql, { language: 'sql' });

            editor.edit((editBuilder) => {
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(editor.document.lineCount - 1, 0);
                editBuilder.replace(new vscode.Range(start, end), beautifiedSql);
            });
        }
    } catch (error) {
        // Log any exceptions
        console.error('Error:', error);
    }
}

vscode.commands.registerCommand('extension.sql_bot', sqlBot);

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.sql_bot', sqlBot)
    );
}

exports.activate = activate;
