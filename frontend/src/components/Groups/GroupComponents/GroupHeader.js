import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

import '../GroupsCss/GroupHeader.css'

const GroupHeader = () => {
    return (
        <div className="group-header-container">

            <div id="container-for-group-page-links">
                <NavLink className='groups-inactive-link' activeClassName='groups-active-link' to='/events'>Events</NavLink>
                <NavLink to='/groups'>Groups</NavLink>
            </div>

            <p id="all-groups-caption">Groups in MeetUp</p>
        </div>
    )
}

export default GroupHeader;
