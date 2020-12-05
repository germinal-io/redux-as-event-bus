export function asynchronousHandlerResult<TValue>(value: TValue) {
    return async () => value
}
