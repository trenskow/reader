//
// interview.js
// 0-bit-games-cli
//
// Created by Kristian Trenskow on 2025/12/23
// See license in LICENSE.
//

import print from '@trenskow/print';
import keyd from 'keyd';
import Puqeue from 'puqeue';

import question from './question.js';

const queue = new Puqeue();

let _isvalid;

const isvalid = async () => {
	return await queue.add(async () => {

		if (typeof globalThis.isvalid === 'undefined') {
			globalThis.isvalid = (await import('isvalid')).default;
		}

		if (typeof _isvalid === 'undefined') {
			_isvalid = globalThis.isvalid;
			_isvalid.plugins.use('readerInterview', () => ({
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

		}

		return _isvalid;

	});
};

const interview = async (schema, { spacing = 0, input = process.stdin, output = process.stdout, strings = {} } = {}) => {

	schema = (await isvalid()).formalize(schema);

	if (schema.type === Object) {

		const allKeyPaths = (await isvalid()).keyPaths(schema)
			.all({ maxDepth: 1 })
			.filter((keyPath) => keyPath);

		let result = {};

		for (let idx in allKeyPaths) {

			const keyPath = allKeyPaths[idx];

			keyd(result).set(keyPath, await interview((await isvalid()).keyPaths(schema).get(keyPath), { spacing, strings }));

			if (idx < allKeyPaths.length - 1) {
				for (let i = 0; i < spacing; i++) {
					print();
				}
			}

		}

		return await (await isvalid())(result, schema);

	}

	if (schema.type === Array) {

		let result = [];

		while (true) {

			const item = await interview(schema.items, { spacing, strings });

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

			return await (await isvalid())(await question(`${schema.label}${schema.required ? ` ${strings?.required || '(required)'}` : ''}: `, {
				defaultValue: schema.default,
				input,
				output,
				silent: schema.silent === true
			}) || undefined, schema);

		} catch (error) {
			print.err.bold(error.message);
			print.tty();
			attempts++;
		}
	}

};

export default interview;
