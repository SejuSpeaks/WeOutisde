import './WhatWeAbout.css';

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
                    <p>{group.description}</p>
                </div>

                <div>
                    <b>Upcoming Events {group.Events.length} </b>

                </div>
            </div>
        </>
    )
}

export default WhatWeAbout;
