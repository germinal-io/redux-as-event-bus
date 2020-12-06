export function handlerResult<TValue>(value: TValue) {
    return (): TValue => value
}
