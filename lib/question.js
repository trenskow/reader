//
// question.js
// 0-bit-games-cli
//
// Created by Kristian Trenskow on 2024/12/20
// See license in LICENSE.
//

import readline from 'readline';
import { Writable } from 'stream';

const question = async (question, {
	defaultValue,
	silent = false,
	input = process.stdin,
	output = process.stdout
} = {}) => {

	const mutableStdout = new Writable({
		write: function (chunk, encoding, callback) {
			if (!this.muted) {
				output.write(chunk, encoding);
			}
			callback();
		}
	});

	mutableStdout.muted = false;

	const rl = readline.createInterface({
		input: input,
		output: mutableStdout,
		terminal: output.isTTY
	});

	const ask = (question) => new Promise((resolve) => {

		rl.question(question, (answer) => {
			if (silent) output.write('\n');
			resolve(answer);
			rl.close();
		});

		if (defaultValue) {
			rl.write(defaultValue);
		}

		mutableStdout.muted = silent;

	});

	return await ask(question);

};

export default question;
