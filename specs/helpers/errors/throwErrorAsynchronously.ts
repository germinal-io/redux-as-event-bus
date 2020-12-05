export function throwErrorAsynchronously(message: string) {
    return async () => {
        throw new Error(message)
    }
}
