/**
 * This file is used to initialize the repository when it is used as a template for a new project.
 * It will:
 * - replace references to this repository with references to the new repository
 * - replace the license file with the license selected by the user
 * - remove files that are not needed for the new project's use case (i.e. contributing guide, issue templates, etc.)
 * @author Zachary K. Watkins
 * @license MIT
 * @version 0.1.0
 */
import readline from 'readline'

const HELP = `Usage: node scripts/init [--help]
This file is used to initialize the repository when it is used as a template for a new project.
It will:
- replace references to this repository with references to the new repository
- replace the license file with the license selected by the user
- remove files that are not needed for the new project's use case (i.e. contributing guide, issue templates, etc.)`

if (process.argv.indexOf('--help') >= 0) {
    console.log(HELP)
    process.exit(0)
}

const choices = {}
const options = {
    name: String,
    author: String,
    license: String,
    contributing: Boolean,
    js: Boolean,
    azure: Boolean,
    ghPages: Boolean,
}

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

prompt.question('Who are you? \n> ', name => {
    console.log(`Hey there ${name}!`)
    prompt.close()
})
