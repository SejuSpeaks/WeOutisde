import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

import './AllEventsHeader.css';

const AllEventsHeader = () => {
    return (
        <div className="group-header-container">

            <div id="container-for-group-page-links">
                <NavLink activeClassName='groups-active-link' to='/events'>Events</NavLink>
                <NavLink className='groups-inactive-link' to='/groups'>Groups</NavLink>
            </div>

            <p id="all-groups-caption">Events in MeetUp</p>
        </div>
    )
}

export default AllEventsHeader;
