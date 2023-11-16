
import './EventDescription.css';

const EventDescription = ({ event }) => {
    return (
        <div className='event-description-container-event-description'>
            <b>Description</b>
            <p>{event.description}</p>
        </div>
    )
}

export default EventDescription;
