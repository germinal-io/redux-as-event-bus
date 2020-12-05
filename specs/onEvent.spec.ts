import { firstEvent, secondEvent } from './helpers/events'
import { prepareListener } from './helpers/prepareListener'
import { prepareTest } from './helpers/prepareTest'

describe('listen for a specific event', () => {
    it('should trigger handler listening for the event', () => {
        // GIVEN
        const { eventBus, dispatch } = prepareTest()
        const firstListener = prepareListener()
        const secondListener = prepareListener()
        eventBus.onEvent('FirstEvent', firstListener.handler)
        eventBus.onEvent('SecondEvent', secondListener.handler)
        // WHEN
        dispatch(firstEvent())
        dispatch(secondEvent())
        // EXPECT
        firstListener.expectEvents([firstEvent()])
        secondListener.expectEvents([secondEvent()])
    })
})
