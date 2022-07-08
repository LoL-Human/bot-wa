require('module-alias/register')
require('@libs/constants/prototype/prototype.constant')

const chalk = require('chalk')
console.log(chalk.whiteBright('╭─── [ LOG ]'))
const { connect } = require('./libs/connect.lib')

connect()
