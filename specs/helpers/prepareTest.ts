import { applyMiddleware, createStore, Store } from 'redux'
import { EventBus, prepareEventBus } from '../../src'
import { AppEvent } from './events'

export interface Test {
    eventBus: EventBus<AppEvent>
    dispatch: (event: AppEvent) => void
}

export type AppStore = Store<unknown, AppEvent>

export function prepareTest(): Test {
    const { eventBus, eventBusMiddleware } = prepareEventBus()
    const rootReducer = () => ({})
    const store: AppStore = createStore(
        rootReducer,
        applyMiddleware(eventBusMiddleware)
    )

    return { eventBus, dispatch: store.dispatch }
}
