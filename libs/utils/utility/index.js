const { commands, listCommands } = require('@libs/constants/command')
const { watchFile } = require('fs')
const logger = require('../logger')
const { GlobSync } = require('glob')
const cron = require('node-cron')
const rimraf = require('rimraf')
const path = require('path')
const config = require('@config')
const knex = require('@database/connection')

class Utility {
    constructor() {
        Promise.all([this.deleteSession(), this.registerCommand(), this.initCronJob()])
    }

    getAllFiles(directory) {
        const pathFiles = new GlobSync(path.join(directory, '**', '*.js').replace(/\\/g, '/')).found
        const files = []
        for (let file of pathFiles) {
            const basename = path.parse(file).name.toLowerCase()
            files.push({
                basename,
                file,
            })
        }
        return files
    }

    deleteSession() {
        const sessionFiles = new GlobSync('session/*-jadibot-session').found
        if (sessionFiles.length !== 0) {
            sessionFiles.forEach((v) => rimraf.sync(v))
            logger.info('Clear session jadibot')
        }
    }

    initCronJob() {
        // reset limit
        cron.schedule('0 0 * * *', async () => {
            await knex('users').update({ user_limit: config.limit || 100 })
        })
        logger.info('CronJob init')
    }

    registerCommand() {
        const files = this.getAllFiles(path.join(__dirname, '..', '..', '..', 'commands'))
        for (let { basename, file } of files) {
            if (commands.get(basename)) {
                continue
            } else if (!require(file).callback) {
                continue
            } else {
                commands.set(basename, require(file))
                watchFile(file, () => {
                    const dir = path.resolve(file)
                    if (dir in require.cache) {
                        delete require.cache[dir]
                        commands.set(basename, require(file))
                        logger.info(`reloaded ${basename}`)
                    }
                })
            }
        }

        for (let x of commands.keys()) {
            let command = commands.get(x)
            let category = command?.category
            if (!category) {
                continue
            }
            if (!listCommands[category]) {
                listCommands[category] = []
            }

            !listCommands[category].includes(x) && listCommands[category].push(x)
        }

        logger.info(`Loaded commands ${commands.size} of ${files.length}`)
    }
}

module.exports = {
    Utility,
}
