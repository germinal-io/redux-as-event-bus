import { AppStore } from '../prepareTest'

interface Listener<TState> {
    handler: () => void
    expectState: (expectedState: TState) => void
}

export function prepareStateAtTriggerListener<TState>(
    store: AppStore<TState>
): Listener<TState> {
    let stateAtTrigger: TState

    function handler(): void {
        stateAtTrigger = store.getState()
    }

    function expectState(expectedState: TState): void {
        expect(stateAtTrigger).toEqual(expectedState)
    }

    return { handler, expectState }
}
