import { csrfFetch } from "./csrf"

const GET_ALL_GROUPS = 'groups/GETGROUPS'

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

const initialState = {}

const groups = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS:
            const newState = { ...state }
            action.allGroups[0].map((group, i) => newState[i] = group)
            return newState
            break;

        default:
            return state;
    }

}

export default groups;
