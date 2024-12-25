# @trenskow/reader

A simple package to ask questions of a stream.

## Usage

To ask a question use the example below.

````javascript
import { question } from '@trenskow/reader';

const answer = await question('What is your name?', {
  // options
});

console.info(answer);
````

### Options

These are the options available for `question`.

| Name           | Description                                  | Default value    |
| -------------- | -------------------------------------------- | ---------------- |
| `defaultValue` | The default value for the question.          |                  |
| `silent`       | Do not echo input (useful for private data). | `false`          |
| `input`        | The input stream to read from.               | `process.stdin`  |
| `output`       | The output stream to write to.               | `process.stdout` |

## Interviews

There is also an interview mechanism for filling an entire data structure. The data is validated using [isvalid](https://npmjs.com/package/isvalid).


### Usage

````javascript
import { interview } from '@trenskow/reader';

const data = await interview({
  // schema
  'username': {
	type: String,
	name: 'Username',
	description: 'Enter your username.',
	type: String,
	required: true,
	len: '3-'
  },
  'password': {
	type: String,
	name: 'Password',
	description: 'Enter your password.',
	type: String,
	required: true,
	silent: true // Tells the interviewer to not echo input.
  }
}, {
  // options
});

console.info(data); // Will output `{ username: 'my-username', password: 'my-password' }`.
````

### Options

These are the options available for `interview`.

| Name      | Description                                               | Default value    |
| --------- | --------------------------------------------------------- | ---------------- |
| `spacing` | The number of vertical spacing (lines) between questions. | `0`              |
| `input`   | The input stream to read from.                            | `process.stdin`  |
| `output`  | The output stream to write to.                            | `process.stdout` |

### Extensions to isvalid schemas

In addition to the build-in validators of isvalid, the following is also supported (as in the example above).

| Name          | Description                                                 |   Type    | Default value |
| ------------- | ----------------------------------------------------------- | :-------: | :-----------: |
| `name`        | The string to print before the user input.                  | `String`  |               |
| `description` | The string to print above the question.                     | `String`  |               |
| `silent`      | Indicates if the property is private (does not echo input). | `Boolean` |    `false`    |

# License

See license in LICENSE.
