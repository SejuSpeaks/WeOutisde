import { NavLink } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from "./ProfileButton"
import OpenModalButton from "../OpenModalButton"
import LoginFormModal from "../LoginFormModal"
import SignUp from "../SignupFormModal"

import { sessionRemove } from "../../store/session"

import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const sessionStatus = useSelector(state => state.session.user)

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
                    <OpenModalButton buttonText={`Log In`} modalComponent={<LoginFormModal />} />
                </li>
                <li>
                    <OpenModalButton buttonText="Sign In" modalComponent={<SignUp />} />
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
