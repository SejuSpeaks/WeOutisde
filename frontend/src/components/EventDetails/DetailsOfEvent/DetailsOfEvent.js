import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getEventById } from "../../../store/events";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import './DetailsOfEvent.css'

//components
import DetailsOfEventHeader from '../DetailsOfEventHeader/DetailsOfEventHeader'
import GroupDetailsBox from "../GroupDetailBox/GroupDetailBox";
import PriceInformation from "../PriceInformationBox/PriceInformation";

const DetailsOfEvent = () => {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const event = useSelector(state => state.events[eventId])
    let eventPreviewImage;

    useEffect(() => {
        console.log('disptching events yippie')
        dispatch(getEventById(eventId))
            .then(() => setIsLoaded(true))
    }, [dispatch, eventId])

    // console.log('checking i am checking', eventPreviewImage);
    // {const eventPreviewImage = !event.previewImage ? "https://placehold.co/600x400" : event.previewImage}

    return (
        <div>
            {isLoaded && (
                <>
                    <DetailsOfEventHeader event={event} />
                    <div className="event-show-container-event-details">
                        <div>
                            <img src={event.previewImage} alt="Event Preview" />
                        </div>

                        <div className="event-and-group-description-box">
                            <GroupDetailsBox event={event} />
                            <PriceInformation event={event} />
                        </div>

                    </div>
                </>
            )}
        </div>
    );

}

export default DetailsOfEvent;
