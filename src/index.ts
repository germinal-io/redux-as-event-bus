import { AnyAction, Middleware } from 'redux'

export interface EventBus<TEvents extends AnyAction> {
    onEvent: OnEvent<TEvents>
}

type OnEvent<TEvents extends AnyAction> = <TEvent extends TEvents>(
    key: TEvent['type'],
    handler: Handler<TEvent>
) => void

type Handler<TEvent> = (event: TEvent) => void

export function prepareEventBus<TEvents extends AnyAction>() {
    const eventBus: EventBus<TEvents> = { onEvent }
    const eventBusMiddleware: Middleware = (store: unknown) => {
        return (next) => (action) => {
            const result = next(action)
            triggerHandlers(action)

            return result
        }
    }

    const handlers: Record<string, Handler<any>> = {}

    function triggerHandlers(event: TEvents): void {
        handlers[event.type](event)
    }

    function onEvent<TEvent extends TEvents>(
        key: TEvent['type'],
        handler: Handler<TEvent>
    ): void {
        handlers[key] = handler
    }

    return { eventBus, eventBusMiddleware }
}
