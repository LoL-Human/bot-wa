interface String {
    format(obj: object): string
}

interface Map {
    find(fn: (value: V, key: K, collection: this) => boolean): V | undefined
}

interface Array {
    random(): any
}
