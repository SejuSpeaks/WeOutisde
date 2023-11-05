import { NavLink } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from "./ProfileButton"

import { sessionRemove } from "../../store/session"

import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const sessionStatus = useSelector(state => state.session.user)

    const logOut = (e) => {
        e.preventDefault()
        dispatch(sessionRemove())
    }

    let loggedInLinks;
    if (sessionStatus) {
        loggedInLinks = (
            <div>
                <li>
                    <ProfileButton user={sessionStatus} />
                </li>
            </div>
        )
    }
    else {
        loggedInLinks = (
            <div>
                <li>
                    <NavLink to="/login">Log In</NavLink>
                </li>
                <li>
                    <NavLink to="/signup">Sign Up</NavLink>
                </li>
            </div>
        );
    }


    return (
        <div>
            <ul>
                <li>
                    <NavLink exact to='/'>Home</NavLink>
                </li>
                {isLoaded && loggedInLinks}
            </ul>
        </div>
    )
}

export default Navigation
