import { applyMiddleware, createStore, Reducer, Store } from 'redux'
import { EventBus, prepareEventBus } from '../../src'
import { AppEvent } from './events'

export interface Test<TState, TReturn> {
    eventBus: EventBus<AppEvent, TReturn>
    store: AppStore<TState>
}

export type AppStore<TState> = Store<TState, AppEvent>

export function prepareTest<TState, TReturn>(
    rootReducer: Reducer<TState, AppEvent>
): Test<TState, TReturn> {
    const { eventBus, eventBusMiddleware } = prepareEventBus<
        AppEvent,
        TReturn
    >()
    const store: AppStore<TState> = createStore(
        rootReducer,
        applyMiddleware(eventBusMiddleware)
    )

    return { eventBus, store }
}
