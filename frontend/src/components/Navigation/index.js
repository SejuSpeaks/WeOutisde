import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from "./ProfileButton"
import OpenModalButton from "../OpenModalButton"
import LoginFormModal from "../LoginFormModal"
import SignUp from "../SignupFormModal"

import { sessionRemove } from "../../store/session"

import './Navigation.css';

const Navigation = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionStatus = useSelector(state => state.session.user)

    console.log('sessionStatus', sessionStatus)

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
            <div className="nav-logged-out-links">
                <li>
                    <OpenModalButton buttonText={`Log In`} modalComponent={<LoginFormModal />} />
                </li>
                <li>
                    <OpenModalButton buttonText="Sign Up" modalComponent={<SignUp />} />
                </li>
            </div>
        );
    }


    const returnHome = () => {
        console.log('goingHome')
        return history.push('/');
    }


    return (
        <div className="navigation-container">
            <h1 id="logo" onClick={returnHome}>WeOutside</h1>
            <ul className="navigation-links">
                <li>
                    <NavLink id='nav-navlink' exact to='/'>Home</NavLink>
                </li>
                {isLoaded && loggedInLinks}
            </ul>
        </div>
    )
}

export default Navigation
