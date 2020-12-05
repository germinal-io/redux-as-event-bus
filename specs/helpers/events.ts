export type AppEvent = FirstEvent | SecondEvent

export interface FirstEvent {
    type: 'FirstEvent'
}

export interface SecondEvent {
    type: 'SecondEvent'
}

export function firstEvent(): FirstEvent {
    return { type: 'FirstEvent' }
}

export function secondEvent(): SecondEvent {
    return { type: 'SecondEvent' }
}
