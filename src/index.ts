import { AnyAction, Middleware } from 'redux'

export interface EventBus<TEvents extends AnyAction> {
    onEvent: OnEvent<TEvents>
    onAllEvents: OnAllEvents<TEvents>
}

type OnEvent<TEvents extends AnyAction> = <TEvent extends TEvents>(
    key: TEvent['type'],
    handler: Handler<TEvent>
) => void

type OnAllEvents<TEvents extends AnyAction> = (
    handler: Handler<TEvents>
) => void

type Handler<TEvent> = (event: TEvent) => void

export function prepareEventBus<TEvents extends AnyAction>() {
    const eventBus: EventBus<TEvents> = { onEvent, onAllEvents }
    const eventBusMiddleware: Middleware = (store: unknown) => {
        return (next) => (action) => {
            const result = next(action)
            triggerHandlers(action)

            return result
        }
    }

    const oneEventHandlers: Record<string, Handler<any>[]> = {}
    const allEventsHandlers: Handler<any>[] = []

    function triggerHandlers(event: TEvents): void {
        getHandlers(event.type).map(triggerHandler(event))
        allEventsHandlers.map(triggerHandler(event))
    }

    function triggerHandler<TEvent extends TEvents>(event: TEvent) {
        return (handler: Handler<TEvent>) => {
            handler(event)
        }
    }

    function getHandlers(key: string) {
        if (!oneEventHandlers[key]) {
            oneEventHandlers[key] = []
        }

        return oneEventHandlers[key]
    }

    function onEvent<TEvent extends TEvents>(
        key: TEvent['type'],
        handler: Handler<TEvent>
    ): void {
        getHandlers(key).push(handler)
    }

    function onAllEvents(handler: Handler<TEvents>): void {
        allEventsHandlers.push(handler)
    }

    return { eventBus, eventBusMiddleware }
}
