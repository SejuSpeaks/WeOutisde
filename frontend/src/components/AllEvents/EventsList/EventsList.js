import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import './EventsList.css';

const EventsList = ({ events }) => {

    const allEvents = Object.values(events).map(event => {
        return {
            id: event.id,
            previewImage: event.previewImage,
            name: event.name,
            startDate: event.startDate,
            startTime: event.startTime,
            city: event.Group.city,
            state: event.Group.state,
            description: event.description
        }
    })
        .sort((a, b) => {
            const firstDate = new Date(a.startDate);
            const secondDate = new Date(b.startDate);

            if (firstDate < new Date() && secondDate < new Date()) {
                return secondDate - firstDate;
            }

            return firstDate - secondDate;
        })
        .map((event, id) => {
            return (
                <Link className='event-group-link-wrap' to={`/events/${event.id}`} key={event.id} >
                    <div className='event-container-all-events'>

                        <div className='event-top-half-container'>
                            <div>
                                <img className='event-images' src={event.previewImage} />
                            </div>

                            <div >
                                <div className='event-start-times-container'>
                                    <p>{event.startDate}</p>
                                    <p className='dot'>.</p>
                                    <p>{event.startTime}</p>
                                </div>

                                <div>
                                    {event.name}
                                </div>

                                <div>
                                    <p>{`${event.city} ${event.state}`}</p>
                                </div>

                            </div>
                        </div>

                        <div>
                            <p>{event.description}</p>
                        </div>

                    </div>
                </Link>
            )

        })

    return (
        <div>
            {allEvents}
        </div>
    )
}

export default EventsList;

/*

 return (
            <Link className='event-group-link-wrap' to={`/events/${event.id}`} key={event.id} >
                <div className='event-container-all-events'>

                    <div className='event-top-half-container'>
                        <div>
                            <img src={'https://placehold.co/200x200'} />
                        </div>

                        <div >
                            <div className='event-start-times-container'>
                                <p>{event.startDate}</p>
                                <p className='dot'>.</p>
                                <p>{event.startTime}</p>
                            </div>

                            <div>
                                {event.name}
                            </div>

                            <div>
                                <p>{`${event.Venue.city} ${event.Venue.state}`}</p>
                            </div>

                        </div>
                    </div>

                    <div>
                        <p>{event.description}</p>
                    </div>

                </div>
            </Link>
        )

*/
