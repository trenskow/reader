//
// interview.js
// 0-bit-games-cli
//
// Created by Kristian Trenskow on 2025/12/23
// See license in LICENSE.
//

import { default as isvalid, plugins, formalize, keyPaths } from 'isvalid';
import keyd from 'keyd';
import print from '@trenskow/print';

import question from './question.js';

plugins.use(() => ({
	phase: 'pre',
	supportsType: () => true,
	validatorsForType: () => ({
		label: ['string'],
		description: ['string'],
		silent: ['boolean']
	}),
	validate: (data) => data,
	formalize: (schema) => schema
}));

const interview = async (schema, { spacing = 0, input = process.stdin, output = process.stdout } = {}) => {

	schema = formalize(schema);

	if (schema.type === Object) {

		const allKeyPaths = keyPaths(schema)
			.all({ maxDepth: 1 })
			.filter((keyPath) => keyPath);

		let result = {};

		for (let idx in allKeyPaths) {

			const keyPath = allKeyPaths[idx];

			keyd(result).set(keyPath, await interview(keyPaths(schema).get(keyPath), { spacing }));

			if (idx < allKeyPaths.length - 1) {
				for (let i = 0; i < spacing; i++) {
					print();
				}
			}

		}

		return await isvalid(result, schema);

	}

	if (schema.type === Array) {

		let result = [];

		while (true) {

			const item = await interview(schema.items);

			if (!item)
				break;

			result.push(item);

		}

		return result;

	}

	let attempts = 0;

	while (true) {
		try {

			if (!attempts && schema.description) {
				print.tty.nn('\x1b[2m');
				print(schema.description);
				print.tty.nn('\x1b[0m');
			}

			return await isvalid(await question(`${schema.label}${schema.required ? ' (required)' : ''}: `, {
				defaultValue: schema.default,
				input,
				output,
				silent: schema.silent === true
			}) || undefined, schema);

		} catch (error) {
			print.tty.err.nn('\x1b[31m');
			print.err(error.message);
			print.tty.err.nn('\x1b[0m');
			print.err();
			attempts++;
		}
	}

};

export default interview;
