'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import PrettifyJSONCommand from './command/PrettifyJSON';
import PrettifyEscapedJSONCommand from './command/PrettifyEscapedJSON';
import ConvertYAMLToJSONCommand from './command/ConvertYAMLToJSON';
import ConvertJSONToYAMLCommand from './command/ConvertJSONToYAML';

const EDITOR_START_POSITION = new vscode.Position(0, 0);

/**
 * The editor interface represents an object that modifies content and
 * returns the result of it's modifications.
 */
interface Editor {
    edit(content: string): string;
}

/**
 * Obtain the end position of the editor from it's current content.
 * 
 * @param editor The editor that has the content.
 */
function getContentEndPosition(content: string): vscode.Position {
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

		const contentEndPosition = getContentEndPosition(activeEditor.document.getText());

        let result = contentEditor.edit(activeEditor.document.getText());

        activeEditor.edit(editBuilder => {
			const resultEndPosition = getContentEndPosition(result);

            let fullRange = new vscode.Range(EDITOR_START_POSITION, resultEndPosition);
			if  (resultEndPosition.isBefore(contentEndPosition)) {
				fullRange = new vscode.Range(EDITOR_START_POSITION, contentEndPosition);
			}

            editBuilder.replace(fullRange, result);
        }).then((success) => {
			if (!success) {
				vscode.window.showErrorMessage("could not perform edit");
			}
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

    context.subscriptions.push(vscode.commands.registerCommand(ConvertJSONToYAMLCommand.COMMAND_ID, () => {
        editActiveContent(new ConvertJSONToYAMLCommand());
	}));

    context.subscriptions.push(vscode.commands.registerCommand(ConvertYAMLToJSONCommand.COMMAND_ID, () => {
        editActiveContent(new ConvertYAMLToJSONCommand());
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}