import { csrfFetch } from "./csrf";

//----------------------------------------------------------------------------------------------//
const GET_GROUP_EVENTS = 'events/GET_GROUP_EVENTS';
const GET_ALL_EVENTS = 'events/GET_ALL_EVENTS';
const GET_EVENT_BY_ID = 'events/GET_EVENT_BY_ ID';
const CLEAR_EVENTS = 'events/CLEAR_EVENTS';
const CREATE_EVENT = 'events/CREATE';
const DELETE_EVENT = 'events/DELETE';

/*-----------------------GET ALL EVENTS----------------------------------------------- */

//action get all events
const getEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events
    }
}

//thunk get all events
export const getAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events')

    if (res.ok) {
        const data = await res.json()
        dispatch(getEvents(data.Events))
        return data.Events
    }
}



/*----------------------GET ALL GROUP EVENTS----------------------------------------------- */


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


/*---------------------CREATE EVENT----------------------------------- */
//action create event
const createAEvent = (eventCreated) => {
    return {
        type: CREATE_EVENT,
        eventCreated
    }
}

//thunk create event

export const createEvent = (groupId, event) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(event)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(createAEvent(data))
        return data
    }
    else {
        const data = await res.json()
        return data.errors
    }
}
/*------------------------DELETE EVENT---------------------------------- */

//action delete event
const deleteAEvent = (eventDeleted) => {
    return {
        type: DELETE_EVENT,
        eventDeleted
    }
}

//thunk delete event
export const deleteEvent = (eventId) => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE",
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(deleteAEvent(data))
        return data
    }
    else {
        const data = await res.json()
        return data.errors
    }

}




/*--------------------------------------------------------------------- */


/*Events reducer */

const events = (state = {}, action) => {
    let newState = { ...state }
    switch (action.type) {
        case DELETE_EVENT:
            delete newState[action.eventDeleted.id]
            return newState
        case CREATE_EVENT:
            newState[action.eventCreated.id] = action.eventCreated
            return newState;

        case CLEAR_EVENTS:
            return newState = {}

        case GET_ALL_EVENTS:
            action.events.map(event => newState[event.id] = event)
            return newState;

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
