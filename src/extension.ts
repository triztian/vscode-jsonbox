'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import PrettifyJSONCommand from './command/PrettifyJSON';
import PrettifyEscapedJSONCommand from './command/PrettifyEscapedJSON';

const EDITOR_START_POSITION = new vscode.Position(0, 0);

/**
 * 
 * @param editor 
 */
function editActiveContent(editor: (content: string) => string) {
    try {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            throw new Error("could not get active editor");
        }

        let result = editor(activeEditor.document.getText());

        activeEditor.edit(editBuilder => {
            const lineCount = (result.match(/\n/g) || []).length;
            const lastLineLength = result.length - result.lastIndexOf("\n") - 1;
            const endPosition = new vscode.Position(lineCount, lastLineLength);
            const fullRange = new vscode.Range(EDITOR_START_POSITION, endPosition);
            editBuilder.replace(fullRange, result);
        }).then((success) => {
            // TODO: 
        });
    } catch(err) {
        vscode.window.showErrorMessage(err.toLocaleString());
    }

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-jsonbox" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand(PrettifyEscapedJSONCommand.COMMAND_ID, () => {
        editActiveContent((rawJSON) => {
            return new PrettifyEscapedJSONCommand().prettify(rawJSON);
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand(PrettifyJSONCommand.COMMAND_ID, () => {
        editActiveContent((rawJSON) => {
            return new PrettifyJSONCommand().prettify(rawJSON);
        });
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}