'use strict';

import PrettifyJSONCommand from './PrettifyJSON';

const escapedMappings: Array<[RegExp, string]> = [
	[/\\n/g, ''],
	[/\\"/g, '"']
];

/**
 * 
 */
class PrettifyEscapedJSONCommand extends PrettifyJSONCommand {
	public static COMMAND_ID = 'jsonbox.prettifyEscapedJSON';

	prettify(rawJSON: string): string {
		let cleaned = rawJSON;
		for (let pair of escapedMappings) {
			cleaned = cleaned.replace(pair[0], pair[1]);
		}

		return super.prettify(cleaned);
	}

	// satisfy the editor interface.
	edit(content: string): string { return this.prettify(content); }
}

export default PrettifyEscapedJSONCommand;