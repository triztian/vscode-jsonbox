'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import PrettifyJSONCommand from './command/PrettifyJSON';
import PrettifyEscapedJSONCommand from './command/PrettifyEscapedJSON';
import ConvertToYAMLCommand from './command/ConvertJSONToYAML';

const EDITOR_START_POSITION = new vscode.Position(0, 0);


interface Editor {
    edit(content: string): string;
}

/**
 * 
 * @param editor 
 */
function getEditorEndPosition(editor: vscode.TextEditor): vscode.Position {
	const content = editor.document.getText();
	const lineCount = (content.match(/\n/g) || []).length;
	const lastLineLength = content.length - content.lastIndexOf('\n') - 1;
	return new vscode.Position(lineCount, lastLineLength);
}



/**
 * A function that takes the content of the active editor and replaces it with 
 * the result of the `editor` function.
 * 
 * @param editor A function that takes the content and returns the edited result.
 */
function editActiveContent(contentEditor: Editor) {
    try {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            throw new Error("could not get active editor");
		}

        let result = contentEditor.edit(activeEditor.document.getText());
		const contentEndPosition = getEditorEndPosition(activeEditor);

        activeEditor.edit(editBuilder => {
            const lineCount = (result.match(/\n/g) || []).length;
			const lastLineLength = result.length - result.lastIndexOf("\n") - 1;
			const resultEndPosition = new vscode.Position(lineCount, lastLineLength);

            let fullRange = new vscode.Range(EDITOR_START_POSITION, resultEndPosition);
			if  (resultEndPosition.isBefore(contentEndPosition)) {
				fullRange = new vscode.Range(EDITOR_START_POSITION, contentEndPosition);
			}

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

    context.subscriptions.push(vscode.commands.registerCommand(PrettifyEscapedJSONCommand.COMMAND_ID, () => {
        editActiveContent(new PrettifyEscapedJSONCommand());
    }));

    context.subscriptions.push(vscode.commands.registerCommand(PrettifyJSONCommand.COMMAND_ID, () => {
        editActiveContent(new PrettifyJSONCommand());
    }));

    context.subscriptions.push(vscode.commands.registerCommand(ConvertToYAMLCommand.COMMAND_ID, () => {
        editActiveContent(new ConvertToYAMLCommand());
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}