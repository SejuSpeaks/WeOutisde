import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { grabGroup } from '../../../store/groups';
import { createEvent } from '../../../store/events';
import './CreateEvent.css';

const CreateEvent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);

    //input states
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEventEnd] = useState("");
    const [about, setAbout] = useState("");
    const [img, setImg] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    //group details
    const group = useSelector(state => state.groups[groupId])

    //user state
    const user = useSelector(state => state.session.user)


    useEffect(() => {
        dispatch(grabGroup(groupId))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const onSubmit = (e) => {
        e.preventDefault();

        const startDate = eventStart.split(" ")[0]
        const startTime = eventStart.split(" ")[1]

        const endDate = eventEnd.split(" ")[0]
        const endTime = eventEnd.split(" ")[1]

        //add host to event

        const createdEvent = {
            name,
            groupId: group.id,
            startDate,
            endDate,
            previewImage: img,
            type,
            price,
            description: about,
            startTime,
            endTime,
        }

        console.log(createEvent, 'CREATEDCAREADFS')

        //fix problems with Venue
        //when creating group, group dosent include Venue
        //i need Venue for the city state of event and group
        //venue is basically non existent in this application
        dispatch(createEvent(group.id, createdEvent))
            .then(event => history.push(`/events/${event.id}`))
            .catch(async (err) => {
                if (err && err.status) {
                    const errors = await err.json()
                    console.log(errors.errors)
                    setValidationErrors(errors.errors)
                    console.log(validationErrors);
                }
            })


    }


    return (
        <>
            {isLoaded &&
                <h1>{`Create a new Event for ${group.name}`}</h1>
            }
            <form onSubmit={onSubmit}>
                <div className='create-event-form-container'>
                    <label className='form-input'>
                        What is the name of your event?
                        <input type='text' placeholder='Event Name' value={name} onChange={(e) => setName(e.target.value)} ></input>
                    </label>
                    {validationErrors.name}
                </div>

                <div className='create-event-form-container'>
                    <label className='form-input'>
                        Is this an in perosn or online event?
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value={""}>Select One</option>
                            <option value={`In person`}>In person</option>
                            <option value={`Online`}>Online</option>
                        </select>
                        {validationErrors.type}
                    </label>

                    <label className='form-input'>
                        What is the price for your event?
                        <input type='number' placeholder={0.00} value={price} onChange={(e) => setPrice(e.target.value)}></input>
                    </label>
                    {validationErrors.price}
                </div>

                <div className='create-event-form-container'>
                    <label className='form-input'>
                        When does your event start
                        <input type='text' placeholder='MM/DD/YYYY HHmm AM' value={eventStart} onChange={(e) => setEventStart(e.target.value)}></input>
                        {validationErrors.startDate}
                    </label>

                    <label className='form-input'>
                        When does your event end
                        <input type='text' placeholder='MM/DD/YYYY HHmm PM' value={eventEnd} onChange={(e) => setEventEnd(e.target.value)}></input>
                        {validationErrors.endDate}
                    </label>

                </div>

                <div className='create-event-form-container'>
                    <label className='form-input'>
                        Please describe your event
                        <textarea placeholder='Please include at least 30 characters' value={about} onChange={(e) => setAbout(e.target.value)} />
                        {validationErrors.description}
                    </label>
                </div>

                <div className='create-event-form-container'>
                    <label className='form-input'>
                        Provide an Image for your Event
                        <input placeholder='Image Url' value={img} onChange={(e) => setImg(e.target.value)}></input>
                    </label>
                    {validationErrors.previewImage}
                </div>

                <button>Create Event</button>
            </form>

        </>
    )
}

export default CreateEvent;
