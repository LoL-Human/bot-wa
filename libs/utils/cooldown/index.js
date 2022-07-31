const recentUsedCommand = new Set()
/**
 * Check if command is in cooldown state
 * @param  {String} from
 */
const isCooldown = (from) => !!recentUsedCommand.has(from)

/**
 * Add cooldown on specific source of command
 * @param  {String} from
 * @param  {Number} cooldown
 */
const addCooldown = (from, cooldown) => {
    if (cooldown === undefined) throw "Cooldown is not defined in this command";
    recentUsedCommand.add(from)
    setTimeout(() => recentUsedCommand.delete(from), cooldown)
}

module.exports = {
    isCooldown,
    addCooldown
}