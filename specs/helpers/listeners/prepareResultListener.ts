interface Listener<TResult> {
    handler: (result: TResult) => void
    expectResult: (expectedResult: TResult) => void
}

export function prepareResultListener<TResult>(): Listener<TResult> {
    const results: TResult[] = []

    function handler(result: TResult): void {
        results.push(result)
    }

    function expectResult(expectedResult: TResult): void {
        expect(results).toEqual([expectedResult])
    }

    return { handler, expectResult }
}
