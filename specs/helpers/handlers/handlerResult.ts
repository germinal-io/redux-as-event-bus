export function handlerResult<TValue>(value: TValue) {
    return () => value
}
