import { firstEvent } from './helpers/events'
import { asynchronousHandlerResult } from './helpers/handlers/asynchronousHandlerResult'
import { handlerResult } from './helpers/handlers/handlerResult'
import { prepareResultListener } from './helpers/listeners/prepareResultListener'
import { nextTick } from './helpers/nextTick'
import { prepareTest } from './helpers/prepareTest'
import { defaultReducer } from './helpers/reducers/defaultReducer'

describe('access handlers results', () => {
    it('should catch handlers results', async () => {
        // GIVEN
        const { eventBus, store } = prepareTest<unknown, string>(defaultReducer)
        const listener = prepareResultListener()
        eventBus.onResult(listener.handler)
        eventBus.onEvent('FirstEvent', handlerResult('Value'))
        // WHEN
        store.dispatch(firstEvent())
        await nextTick()
        // EXPECT
        listener.expectResult('Value')
    })

    it('should catch handlers asynchronous results', async () => {
        // GIVEN
        const { eventBus, store } = prepareTest<unknown, string>(defaultReducer)
        const listener = prepareResultListener()
        eventBus.onResult(listener.handler)
        eventBus.onEvent('FirstEvent', asynchronousHandlerResult('Value'))
        // WHEN
        store.dispatch(firstEvent())
        await nextTick()
        // EXPECT
        listener.expectResult('Value')
    })

    it('should trigger all result handlers', async () => {
        // GIVEN
        const { eventBus, store } = prepareTest<unknown, string>(defaultReducer)
        const firstListener = prepareResultListener()
        const secondListener = prepareResultListener()
        eventBus.onResult(firstListener.handler)
        eventBus.onResult(secondListener.handler)
        eventBus.onEvent('FirstEvent', handlerResult('Value'))
        // WHEN
        store.dispatch(firstEvent())
        await nextTick()
        // EXPECT
        firstListener.expectResult('Value')
        secondListener.expectResult('Value')
    })
})
