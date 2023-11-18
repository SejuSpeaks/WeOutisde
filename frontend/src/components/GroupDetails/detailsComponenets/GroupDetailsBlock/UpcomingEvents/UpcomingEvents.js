import { useEffect, useState } from "react";
import { allGroupEvents, clearEvents } from "../../../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import './UpcomingEvents.css'

const UpComingEvents = ({ group }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const events = useSelector(state => state.events);
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null);


    useEffect(() => {
        dispatch(clearEvents())
        dispatch(allGroupEvents(groupId))
            .then(() => setIsLoaded(true))
            .catch((error) => {
                setError(error);
            });
    }, [dispatch, groupId])


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
                startTime: event.startTime,
                description: event.description,
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
                    <img className="event-image-upcoming-events" src={event.eventImage} />
                </div>
                <div>
                    <b>{event.name}</b>
                    <div className="dates-of-event-container-group-details">
                        <p>{`${event.startDate.toDateString()}`}</p>
                        <p className="dot">.</p>
                        <p>{`${event.startTime}`}</p>
                    </div>

                    <p>
                        {group.city} {group.state}
                    </p>
                    {event.description}
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
