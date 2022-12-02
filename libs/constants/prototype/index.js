String.prototype.format = function (dict) {
    return this.replace(/{(\w+)}/g, function (match, key) {
        return typeof dict[key] !== 'undefined' ? dict[key] : match
    })
}

Map.prototype.find = function (fn) {
    for (const [key, val] of this) {
        if (fn(val, key, this)) return val
    }
    return undefined
}

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}
