# Development

Once you've installed Node.js (which includes the popular `npm` package manager), open Terminal and run the following:

```sh
git clone https://github.com/zachwatkins/.github
cd .github
npm ci
npm run build
npm start
```

## Cross Platform Development

To maintain this project while allowing as many people as possible to contribute, it's important to keep in mind the different environments that people may be using to develop on.

We will use coding conventions described in this section to improve cross-platform compatibility.

### Bash

Since Windows does not support Bash natively (without WSL), we prefer to write files in the `scripts` folder using JavaScript for Node.js instead of Bash.

### Writing Node.js Scripts

When writing JavaScript files that will run within Node.js:

1. Use the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) `#!/usr/bin/env node` at the top of the file.
2. For regular expressions, use the pattern `\r?\n` to detect a newline within a file instead of `\n` to support both Windows and Unix-based systems. The Node.js [`os.EOL`](https://nodejs.org/api/os.html#os_os_eol) property can be used to detect the newline character for the current operating system.
3. For file paths, Windows uses `\` for the path separator. You can use `path.sep` to get the OS-specific path separator, or use `path.posix` to get the Unix path separator.
```
