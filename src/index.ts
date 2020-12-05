import { AnyAction, Middleware } from 'redux'

export interface EventBus<TEvents extends AnyAction> {
    onEvent: OnEvent<TEvents>
    onAllEvents: OnAllEvents<TEvents>
    onError: OnError
}

type OnEvent<TEvents extends AnyAction> = <TEvent extends TEvents>(
    key: TEvent['type'],
    handler: EventHandler<TEvent>
) => void

type OnAllEvents<TEvents extends AnyAction> = (
    handler: EventHandler<TEvents>
) => void

type OnError = (handler: ErrorHandler) => void

type EventHandler<TEvent> = (event: TEvent) => void
type ErrorHandler = (error: Error) => void

export function prepareEventBus<TEvents extends AnyAction>() {
    const eventBus: EventBus<TEvents> = { onEvent, onAllEvents, onError }
    const eventBusMiddleware: Middleware = (store: unknown) => {
        return (next) => (action) => {
            const result = next(action)
            triggerHandlers(action)

            return result
        }
    }

    const oneEventHandlers: Record<string, EventHandler<any>[]> = {}
    const allEventsHandlers: EventHandler<any>[] = []
    const onErrorHandlers: ErrorHandler[] = []

    function triggerHandlers(event: TEvents): void {
        getHandlers(event.type).map(triggerHandler(event))
        allEventsHandlers.map(triggerHandler(event))
    }

    function triggerHandler<TEvent extends TEvents>(event: TEvent) {
        return async (handler: EventHandler<TEvent>) => {
            try {
                await handler(event)
            } catch (error) {
                onErrorHandlers.map((errorHandler) => errorHandler(error))
            }
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
        handler: EventHandler<TEvent>
    ): void {
        getHandlers(key).push(handler)
    }

    function onAllEvents(handler: EventHandler<TEvents>): void {
        allEventsHandlers.push(handler)
    }

    function onError(handler: ErrorHandler): void {
        onErrorHandlers.push(handler)
    }

    return { eventBus, eventBusMiddleware }
}
