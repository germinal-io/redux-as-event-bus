export function throwError(message: string) {
    return (): void => {
        throw new Error(message)
    }
}
