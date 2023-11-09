import { useEffect, useState } from "react";
import { allGroupEvents, clearEvents } from "../../../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import './UpcomingEvents.css'

const UpComingEvents = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const events = useSelector(state => state.events);
    const [isLoaded, setIsLoaded] = useState(false)


    useEffect(() => {
        dispatch(clearEvents())
        dispatch(allGroupEvents(groupId))
            .then(() => setIsLoaded(true))
    }, [dispatch])


    const groupEvents = Object.values(events)
        .map((event) => {
            const eventImage = event.previewImage ? event.previewImage : 'https://w7.pngwing.com/pngs/785/530/png-transparent-desktop-computer-icons-empty-banner-angle-rectangle-photography-thumbnail.png';
            const eventVenue = event.Venue;
            console.log('this is event log', event);
            return {
                eventImage,
                id: event.id,
                startDate: new Date(event.startDate),
                name: event.name,
                city: eventVenue.city,
                description: event.description,
                state: eventVenue.state,
            };
        })
        .sort((a, b) => {
            const firstDate = a.startDate;
            const secondDate = b.startDate;

            if (firstDate < new Date() && secondDate < new Date()) {
                return secondDate - firstDate;
            }

            return firstDate - secondDate;


        })
        .map((event, index) => (
            <div key={index} className="upcoming-events-container" onClick={() => history.push(`/events/${event.id}`)}>
                <div>
                    <img src={event.eventImage} />
                </div>
                {event.description}
                <div>
                    <date>{event.startDate.toDateString()}</date>
                    <b>{event.name}</b>
                    <p>
                        {event.city} {event.state}
                    </p>
                </div>
            </div>
        ));

    return (
        <>
            <h2>Up coming Events</h2>
            {isLoaded && groupEvents}
        </>
    )
}

export default UpComingEvents;
