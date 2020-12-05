import { AppEvent } from '../events'

interface Listener {
    handler: (event: AppEvent) => void
    expectEvent: (expectedEvent: AppEvent) => void
    expectEvents: (expectedEvents: AppEvent[]) => void
}

export function prepareEventsListener(): Listener {
    const events: AppEvent[] = []

    function handler(event: AppEvent): void {
        events.push(event)
    }

    function expectEvent(expectedEvent: AppEvent): void {
        expect(events).toEqual([expectedEvent])
    }

    function expectEvents(expectedEvents: AppEvent[]): void {
        expect(events).toEqual(expectedEvents)
    }

    return { handler, expectEvent, expectEvents }
}
