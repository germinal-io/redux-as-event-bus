import { firstEvent, secondEvent } from './helpers/events'
import { prepareEventsListener } from './helpers/listeners/prepareEventsListener'
import { prepareStateAtTriggerListener } from './helpers/listeners/prepareStateAtTriggerListener'
import { prepareTest } from './helpers/prepareTest'
import { defaultReducer } from './helpers/reducers/defaultReducer'
import { hasSeenFirstEventReducer } from './helpers/reducers/hasSeenFirstEventReducer'

describe('listen for a specific event', () => {
    it('should trigger handler listening for the event', () => {
        // GIVEN
        const { eventBus, store } = prepareTest(defaultReducer)
        const firstListener = prepareEventsListener()
        const secondListener = prepareEventsListener()
        eventBus.onEvent('FirstEvent', firstListener.handler)
        eventBus.onEvent('SecondEvent', secondListener.handler)
        // WHEN
        store.dispatch(firstEvent())
        store.dispatch(secondEvent())
        // EXPECT
        firstListener.expectEvents([firstEvent()])
        secondListener.expectEvents([secondEvent()])
    })

    it('should trigger handlers after state update', () => {
        // GIVEN
        const { eventBus, store } = prepareTest(hasSeenFirstEventReducer)
        const listener = prepareStateAtTriggerListener(store)
        eventBus.onEvent('FirstEvent', listener.handler)
        // WHEN
        store.dispatch(firstEvent())
        // EXPECT
        listener.expectState(true)
    })

    it('should trigger all handlers listening for the event', () => {
        // GIVEN
        const { eventBus, store } = prepareTest(defaultReducer)
        const firstListener = prepareEventsListener()
        const secondListener = prepareEventsListener()
        eventBus.onEvent('FirstEvent', firstListener.handler)
        eventBus.onEvent('FirstEvent', secondListener.handler)
        // WHEN
        store.dispatch(firstEvent())
        // EXPECT
        firstListener.expectEvents([firstEvent()])
        secondListener.expectEvents([firstEvent()])
    })
})
