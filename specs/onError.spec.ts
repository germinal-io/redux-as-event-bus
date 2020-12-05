import { throwError } from './helpers/errors/throwError'
import { throwErrorAsynchronously } from './helpers/errors/throwErrorAsynchronously'
import { firstEvent } from './helpers/events'
import { prepareErrorListener } from './helpers/listeners/prepareErrorListener'
import { nextTick } from './helpers/nextTick'
import { prepareTest } from './helpers/prepareTest'
import { defaultReducer } from './helpers/reducers/defaultReducer'

describe('handle errors', () => {
    it('should catch event handler execution errors', () => {
        // GIVEN
        const { eventBus, store } = prepareTest(defaultReducer)
        const listener = prepareErrorListener()
        eventBus.onError(listener.handler)
        eventBus.onEvent('FirstEvent', throwError('Some error'))
        // WHEN
        store.dispatch(firstEvent())
        // EXPECT
        listener.expectError('Some error')
    })

    it('should catch event handler asynchronous execution errors', async () => {
        // GIVEN
        const { eventBus, store } = prepareTest(defaultReducer)
        const listener = prepareErrorListener()
        eventBus.onError(listener.handler)
        eventBus.onEvent('FirstEvent', throwErrorAsynchronously('Some error'))
        // WHEN
        store.dispatch(firstEvent())
        await nextTick()
        // EXPECT
        listener.expectError('Some error')
    })

    it('should trigger all error handlers', () => {
        // GIVEN
        const { eventBus, store } = prepareTest(defaultReducer)
        const firstListener = prepareErrorListener()
        const secondListener = prepareErrorListener()
        eventBus.onError(firstListener.handler)
        eventBus.onError(secondListener.handler)
        eventBus.onEvent('FirstEvent', throwError('Some error'))
        // WHEN
        store.dispatch(firstEvent())
        // EXPECT
        firstListener.expectError('Some error')
        secondListener.expectError('Some error')
    })
})
