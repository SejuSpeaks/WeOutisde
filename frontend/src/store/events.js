import { csrfFetch } from "./csrf";

//----------------------------------------------------------------------------------------------//
const GET_GROUP_EVENTS = 'events/GET_GROUP_EVENTS';
const GET_EVENT_BY_ID = 'events/GET_EVENT_BY_ ID';
const CLEAR_EVENTS = 'events/CLEAR_EVENTS';

/* get all events from group action */
const getGroupEvents = (groupEvents) => {
    return {
        type: GET_GROUP_EVENTS,
        groupEvents
    }
}

/*thunk for group events */
export const allGroupEvents = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getGroupEvents(data.Events[0]))
        console.log('event data ', data.Events);
        return data.Events
    }
}

/*---------------------------------------------------------------------- */

/* GET Event by Id action --------------------------------------------------*/
const getEvent = (event) => {
    return {
        type: GET_EVENT_BY_ID,
        event
    }
}

export const getEventById = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`)

    if (res.ok) {
        const data = await res.json();
        dispatch(getEvent(data))
        return data;
    }
}

/*---CLEAR EVENTS */

//CLear events action
export const clearEvents = () => {
    return {
        type: CLEAR_EVENTS,
    }
}





/*------------------------------------ */


/*Events reducer */

const events = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case CLEAR_EVENTS:
            return newState = {}

        case GET_GROUP_EVENTS:
            action.groupEvents.map(event => newState[event.id] = event)
            return newState;

        case GET_EVENT_BY_ID:
            newState[action.event.id] = action.event;
            return newState;

        default:
            return newState;
    }
}

export default events;
