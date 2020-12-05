import { AnyAction, Middleware } from 'redux'

export interface EventBus<TEvents extends AnyAction, TResult> {
    onEvent: OnEvent<TEvents, TResult>
    onAllEvents: OnAllEvents<TEvents, TResult>
    onError: OnError
    onResult: OnResult<TResult>
}

type OnEvent<TEvents extends AnyAction, TResult> = <TEvent extends TEvents>(
    key: TEvent['type'],
    handler: EventHandler<TEvent, TResult>
) => void

type OnAllEvents<TEvents extends AnyAction, TResult> = (
    handler: EventHandler<TEvents, TResult>
) => void

type OnError = (handler: ErrorHandler) => void

type OnResult<TResult> = (handler: ResultHandler<TResult>) => void

type EventHandler<TEvent, TResult> = (
    event: TEvent
) => TResult | Promise<TResult>
type ErrorHandler = (error: Error) => void
type ResultHandler<TResult> = (result: TResult) => void

export function prepareEventBus<TEvents extends AnyAction, TResult>() {
    const eventBus: EventBus<TEvents, TResult> = {
        onEvent,
        onAllEvents,
        onError,
        onResult,
    }
    const eventBusMiddleware: Middleware = (store: unknown) => {
        return (next) => (action) => {
            const result = next(action)
            triggerHandlers(action)

            return result
        }
    }

    const oneEventHandlers: Record<string, EventHandler<any, TResult>[]> = {}
    const allEventsHandlers: EventHandler<any, TResult>[] = []
    const onErrorHandlers: ErrorHandler[] = []
    const onResultHandlers: ResultHandler<TResult>[] = []

    function triggerHandlers(event: TEvents): void {
        getHandlers(event.type).map(triggerHandler(event))
        allEventsHandlers.map(triggerHandler(event))
    }

    function triggerHandler<TEvent extends TEvents>(event: TEvent) {
        return async (handler: EventHandler<TEvent, TResult>) => {
            try {
                const result = await handler(event)
                onResultHandlers.map((resultHandler) => resultHandler(result))
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
        handler: EventHandler<TEvent, TResult>
    ): void {
        getHandlers(key).push(handler)
    }

    function onAllEvents(handler: EventHandler<TEvents, TResult>): void {
        allEventsHandlers.push(handler)
    }

    function onError(handler: ErrorHandler): void {
        onErrorHandlers.push(handler)
    }

    function onResult(handler: ResultHandler<TResult>): void {
        onResultHandlers.push(handler)
    }

    return { eventBus, eventBusMiddleware }
}
