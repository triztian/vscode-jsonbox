import * as jsYAML from 'js-yaml';

export default class ConvertJSONToYAMLCommand {
	public static readonly COMMAND_ID = 'jsonbox.convertJSONtoYAML';

	edit(content: string): string {
		let obj = JSON.parse(content);
		return jsYAML.dump(obj);
	}
}