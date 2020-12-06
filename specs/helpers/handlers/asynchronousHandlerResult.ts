export function asynchronousHandlerResult<TValue>(value: TValue) {
    return async (): Promise<TValue> => value
}
