import { Link } from "react-router-dom/cjs/react-router-dom.min"


const DetailsOfEvent = ({ event }) => {

    return (
        <div className="event-details-header-containerr">
            <div>
                <Link to='/events'>Events</Link>
                <h1>{event.name}</h1>
                <span>Hosted by {`${event.Host.firstName} ${event.Host.lastName}`}</span>
            </div>
        </div>
    )
}

export default DetailsOfEvent
