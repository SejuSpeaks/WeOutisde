import { csrfFetch } from "./csrf"

const GET_ALL_GROUPS = 'groups/GETGROUPS'
const GET_GROUP = 'groups/GETGROUP'
const CREATE_GROUP = 'groups/CREATE'
const CLEAR_GROUPS = 'groups/CLEAR';


/*-------------------------------------------------------------------------- */
//action create Group
const createAGroup = (createdGroup) => {
    return {
        type: CREATE_GROUP,
        createdGroup
    }
}

export const CreateGroup = (groupReceived) => async dispatch => {
    const res = await csrfFetch('/api/groups', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(groupReceived)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(createAGroup(data));
        return data
    }
    else {
        const data = await res.json();
        throw new Error(data.errors)
        return data.errors
    }

}




/*------------------------------------------------------------------------- */

/*Get all Groups action creator */
const getGroups = (allGroups) => {
    return {
        type: GET_ALL_GROUPS,
        allGroups
    }
}

/* Get all Groups thunk */
export const getAllGroups = () => async dispatch => {
    const response = await csrfFetch('api/groups')

    if (response.ok) {
        const data = await response.json();
        dispatch(getGroups(data.Groups))
        return data.Groups;
    }
}
/*------------------------------------------------------------ */


/*Get Specific Group action creator */
const getGroup = (specificGroup) => {
    return {
        type: GET_GROUP,
        specificGroup
    }
}

/*Get Specific Group thunk  */
export const grabGroup = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`)

    if (res.ok) {
        const data = await res.json();
        console.log(data)
        dispatch(getGroup(data))
        return data;
    }

}

/**----------------------------------------------------------------- */

export const clearGroups = () => {
    return {
        type: CLEAR_GROUPS,
    }
}

/*------------------------------------------------------------- */




const initialState = {}

const groups = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CLEAR_GROUPS:
            return newState = {};

        case GET_ALL_GROUPS:
            newState = { ...state }
            action.allGroups[0].map((group, i) => newState[group.id] = group)
            return newState
            break;

        case CREATE_GROUP:
            newState = { ...state }
            newState[action.createdGroup.id] = action.createdGroup;
            return newState;
            break;

        case GET_GROUP:
            newState = { ...state }
            console.log(action, 'GROUPBOII')
            newState[action.specificGroup.id] = action.specificGroup;
            return newState;
            break;

        default:
            return state;
    }

}

export default groups;
