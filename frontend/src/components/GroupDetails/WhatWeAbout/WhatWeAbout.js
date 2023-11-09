import './WhatWeAbout.css';

import UpComingEvents from '../detailsComponenets/GroupDetailsBlock/UpcomingEvents/UpcomingEvents';

const WhatWeAbout = ({ group }) => {
    return (
        <>
            <div className='what-we-about-container'>

                <div>
                    <b>Organizer</b>
                    <p>{group.Organizer.username}</p>
                </div>

                <div>
                    <b>What we're about</b>
                    <p>{group.about}</p>
                </div>

                <div id='what-we-about-events-container'>
                    <b id='what-we-about-events-heading'> {`Events (${group.Events.length})`}</b>
                </div>
                <UpComingEvents />
            </div>
        </>
    )
}

export default WhatWeAbout;
