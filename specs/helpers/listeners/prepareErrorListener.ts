interface Listener {
    handler: (error: Error) => void
    expectError: (expectedError: string) => void
}

export function prepareErrorListener(): Listener {
    const errors: Error[] = []

    function handler(error: Error): void {
        errors.push(error)
    }

    function expectError(expectedErrorMessage: string): void {
        expect(errors).toEqual([new Error(expectedErrorMessage)])
    }

    return { handler, expectError }
}
