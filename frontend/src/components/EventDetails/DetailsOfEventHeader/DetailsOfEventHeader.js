import { Link } from "react-router-dom/cjs/react-router-dom.min"


const DetailsOfEvent = ({ event }) => {

    return (
        <div>
            <Link to='/events'>Events</Link>
            <h1>{event.name}</h1>
            <span>Hosted by { }</span>
        </div>
    )
}

export default DetailsOfEvent
