import { csrfFetch } from "./csrf";

const SET_USER = 'user/SETUSER';
const GET_USER = 'user/GETUSER'
const REMOVE_USER = 'user/REMOVEUSER'
const SIGNUP = 'user/SIGNUP';



/* ---------------LOGIN USER----------------- */
const setUser = (user) => {
    return {
        type: SET_USER,
        user
    }
}

export const setUserThunk = (userLoginInformation) => async dispatch => {

    const response = await csrfFetch('api/session', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userLoginInformation)
    })


    if (response.ok) {
        const userData = await response.json();
        dispatch(setUser(userData.user));
        return userData.user;
    }
    else {
        return await response.json()
    }
}



/* ---------------SIGN UP----------------- */

export const signUp = (userPayload) => async dispatch => {
    const response = await csrfFetch('/api/users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userPayload)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user))
        return data.user;
    }
    else {
        return response;
    }
}


/* ---------------REMOVE USER----------------- */
const removeUser = () => {
    return {
        type: REMOVE_USER,
    }
}

export const sessionRemove = () => async dispatch => {


    const response = await csrfFetch('/api/session', {
        method: "DELETE",
    })

    if (response.ok) {
        const userData = await response.json()
        dispatch(removeUser())
    }
}

/* ---------------GET USER----------------- */

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user))
        return data.user;
    }
    else {
        return response.json()
    }
}



//let user = null;

const session = (state = { user: null }, action) => {
    let newState = { ...state }
    switch (action.type) {
        case SET_USER:
            newState = { user: action.user };
            return newState
        //return { user: action.user }

        case REMOVE_USER:
            newState = { user: action.user }
            return newState;

        default:
            return state;
    }
}

export default session;
