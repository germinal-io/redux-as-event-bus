import { applyMiddleware, createStore, Reducer, Store } from 'redux'
import { EventBus, prepareEventBus } from '../../src'
import { AppEvent } from './events'

export interface Test<TState> {
    eventBus: EventBus<AppEvent>
    store: AppStore<TState>
}

export type AppStore<TState> = Store<TState, AppEvent>

export function prepareTest<TState>(
    rootReducer: Reducer<TState, AppEvent>
): Test<TState> {
    const { eventBus, eventBusMiddleware } = prepareEventBus()
    const store: AppStore<TState> = createStore(
        rootReducer,
        applyMiddleware(eventBusMiddleware)
    )

    return { eventBus, store }
}
