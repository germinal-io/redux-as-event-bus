
# redux-as-event-bus

`redux-as-event-bus` turns your redux store into a fully-typed event bus.

Doing so it allows you to manage your side effects in a clean and testable way.
  
## Getting started  
  
### Install  
  
``` 
$ npm i redux-as-event-bus  
```  
  
### Create the event bus and add the middleware to your store
  
```typescript  
import { prepareEventBus } from 'redux-as-event-bus'  
import { applyMiddleware, createStore, Store } from 'redux'  
  
type AppEvent = FirstEvent | SecondEvent  
type AppStore = Store<AppState, AppEvent>  
    
const { eventBus, eventBusMiddleware } = prepareEventBus<AppEvent>()  
const store: AppStore = createStore(rootReducer, applyMiddleware(eventBusMiddleware))  
```

### Listen for a specific event
  
```typescript    
eventBus.onEvent('FirstEvent', (event: FirstEvent) => {  
    console.log(event.type) // 'FirstEvent'  
})
```

### Listen for all events
  
```typescript      
eventBus.onAllEvents((event: AppEvent) => {  
    console.log(event.type) // 'FirstEvent' or 'SecondEvent'  
})
```

### Inject dependencies

```typescript
interface Dependencies {  
    getState: () => AppState  
    dispatch: Dispatch<AppEvent>  
    userGateway: UserGateway  
}  
  
const deps: Dependencies = {  
    ...store,  
  userGateway: new GraphQlUserGateway()  
}  
  
eventBus.onEvent('CreateProject', handler(deps))  
  
function handler(deps: Dependencies) {  
    return async (event: CreateProject) => {
        // do async logic using store values, then dispatch new event
        const userId = userIdSelector(deps.getState())  
        const project = prepareProjectToCreate(userId)
        await deps.userGateway.createProject(project)  
        deps.dispatch(ProjectCreated(project))  
    }  
}
```

### Catch handlers execution errors

```typescript
eventBus.onError((error: Error) => { 
    console.log(error) // Some error
})
```

### Access handlers results

```typescript  
type HandlerResult = AppEvent[]

const { eventBus, eventBusMiddleware } = prepareEventBus<
    AppEvent, 
    HandlerResult // to ensure typing
>()

eventBus.onResult((result: HandlerResult) => {
    result.map(store.dispatch) // if results are Event you may dispatch them
})
```

## Licence
MIT