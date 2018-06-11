import * as jsYAML from 'js-yaml';

export default class ConvertYAMLToJSONCommand {
	public static readonly COMMAND_ID = 'jsonbox.convertYAMLtoJSON';

	edit(content: string): string {
		let obj = jsYAML.load(content);
		return JSON.stringify(obj);
	}
}