import { AppEvent } from '../events'

export function hasSeenFirstEventReducer(
    state = false,
    event: AppEvent
): boolean {
    switch (event.type) {
        case 'FirstEvent':
            return true
        default:
            return state
    }
}
