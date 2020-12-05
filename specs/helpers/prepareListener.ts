import { AppEvent } from './events'

export interface Listener {
    handler: (event: AppEvent) => void
    expectEvents: (expectedEvents: AppEvent[]) => void
}

export function prepareListener(): Listener {
    const events: AppEvent[] = []

    function handler(event: AppEvent): void {
        events.push(event)
    }

    function expectEvents(expectedEvents: AppEvent[]): void {
        expect(events).toEqual(expectedEvents)
    }

    return { handler, expectEvents }
}
