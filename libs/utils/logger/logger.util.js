const chalk = require('chalk')

class Logger {
    stats(...args) {
        console.log(chalk.whiteBright('├'), chalk.keyword('aqua')(`[  STATS  ]`), ...args)
    }

    private(...args) {
        console.log(chalk.whiteBright('├'), chalk.keyword('aqua')(`[ PRIVATE ]`), ...args)
    }

    group(...args) {
        console.log(chalk.whiteBright('├'), chalk.keyword('aqua')(`[  GROUP  ]`), ...args)
    }

    store(...args) {
        console.log(chalk.whiteBright('├'), chalk.keyword('aqua')(`[  STORE  ]`), ...args)
    }

    error(...args) {
        console.log(chalk.whiteBright('├'), chalk.keyword('red')('[  ERROR  ]'), ...args)
    }
}

module.exports = {
    logger: new Logger(),
}
