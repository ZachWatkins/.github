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
    name: {
        type: String,
        default: 'new-repository',
        description: 'The name of the repository.',
    },
    description: {
        type: String,
        default: 'A new repository',
        description: 'A description of the repository.',
    },
    author: {
        type: String,
        default: 'Your Name',
        description: 'The name of the repository\'s primary author.',
    },
    license: {
        type: String,
        default: 'None',
        description: 'The software license to use for the repository, see here for known software licenses: https://spdx.org/licenses/',
    },
    public: {
        type: Boolean,
        default: false,
        description: 'Whether the repository should be public or private.',
        next: {
            true: {
                openSource: {
                    type: Boolean,
                    default: false,
                    description: 'Whether the repository should be open source or not.',
                },
            },
        }
    },
    purpose: {
        type: String,
        default: 'project',
        description: 'The purpose of the repository. Choose "project" if the repository is intended to be used as-is (website, application, CLI-only program, etc). Choose "library" if the repository is intended to be used within other codebases.',
        accepts: ['project', 'library'],
        next: {
            project: {},
            library: {},
        }
    },
    team: {
        type: Boolean,
        default: false,
        description: 'Whether the repository is developed by a team.',
    },
    js: {
        type: Boolean,
        default: true,
    },
    ghPages: {
        type: Boolean,
        default: false,
    },
    azure: {
        type: Boolean,
        default: false,
    },
}

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

prompt.question('Who are you? \n> ', name => {
    console.log(`Hey there ${name}!`)
    prompt.close()
})
