export function throwErrorAsynchronously(message: string) {
    return async (): Promise<void> => {
        throw new Error(message)
    }
}
