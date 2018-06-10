'use strict';

const defaultIndentDepth = 2;


export default class PrettifyJSONCommand {
	public static COMMAND_ID = 'jsonbox.prettifyJSON';

	constructor(public indentDepth: number =defaultIndentDepth) {}

	prettify(rawJSON: string): string {
		return JSON.stringify(JSON.parse(rawJSON), null, this.indentDepth);
	}
}