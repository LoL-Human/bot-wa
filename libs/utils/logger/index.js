const chalk = require('chalk')
const winston = require('winston')

const logger = winston.createLogger({
    format: winston.format.combine({
        transform: (info, opts) => {
            switch (info.level) {
                case 'info':
                    console.info(chalk.whiteBright('├'), chalk.keyword('aqua')(`[  INGFO  ]`), info.message)
                    break
                case 'warn':
                    console.warn(chalk.whiteBright('├'), chalk.keyword('yellow')(`[ WARNING ]`), info.message)
                    break
                case 'error':
                    console.error(chalk.whiteBright('├'), chalk.keyword('red')(`[  ERROR  ]`), info.message)
                    break
                case 'debug':
                    console.log(chalk.whiteBright('├'), chalk.keyword('aqua')(`[  DEBUG  ]`), info.message)
                    break
            }
            return false
        },
    }),
    transports: [new winston.transports.Console()],
})

module.exports = logger
