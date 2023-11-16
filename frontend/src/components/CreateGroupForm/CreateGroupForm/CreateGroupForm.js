import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CreateGroup, clearGroups } from '../../../store/groups';


import './CreateGroup.css';

const CreateGroupForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [aboutGroup, setAboutGroup] = useState("");
    const [type, setType] = useState("");
    const [privacy, setPrivacy] = useState("")
    const [imgUrl, setImgUrl] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    //session user
    const user = useSelector((state) => state.session.user)

    //session groups
    const groups = useSelector(state => state.groups)

    useEffect(() => {

    }, [validationErrors])


    const redirect = () => {

        const groupArray = Object.values(groups)
        console.log(groupArray)
        const groupId = groupArray[groupArray.length - 1]
        const id = groups.groupId.id
        return history.push(`/groups/${id}`)
    }


    const onSubmit = async (e) => {
        e.preventDefault()

        //parse location
        const city = location.split(" ")[0]
        const state = location.split(" ")[1]

        //build group object
        const createdGroup = {
            organizerId: user.id,
            name,
            city,
            state,
            about: aboutGroup,
            type: type,
            private: privacy,
            previewImage: imgUrl
        }


        //dispatch thunk

        const createdGroupFr = await dispatch(CreateGroup(createdGroup))
            .then(res => history.push(`/groups/${res.id}`))
            .catch(async (err) => {
                if (err && err.status) {
                    const errorResponse = await err.json();
                    setValidationErrors(errorResponse.errors || {});
                }
            });
        //catch errors
        //send errors out

        //redirect

    }


    return (
        <form onSubmit={onSubmit}>
            <div className='create-group-form-container'>
                <div className='create-group-form-heading'>
                    <p>Start new Group</p>
                    <b>We'll walk you through a few steps to build your local community</b>
                </div>

                <div className='create-group-form-location form-input'>
                    <b>First, set your group's location.</b>
                    <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online </p>
                    <label htmlFor='location'>
                        <input type='text' placeholder='City, STATE' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </label>
                    <div>
                        {validationErrors.city ?? ""}
                        {validationErrors.state ?? ""}
                    </div>
                </div>

                <div className='create-group-form-name form-input'>
                    <b>What will your group's name be?</b>
                    <p>
                        Choose a name that will give people a clear idea of what the group is about.
                        Feel free to get creative! You can edit this later if you change your mind.
                    </p>
                    <label>
                        <input type='text' placeholder='What is your group name?' value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    {validationErrors.name}
                </div>

                <div className='create-group-form-description form-input'>
                    <b>Now describe what your group will be about</b>
                    <p>People will see this when we promote your group, but youll be able to add to it later, too.</p>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea placeholder='Please write at least 30 characters' value={aboutGroup} onChange={(e) => setAboutGroup(e.target.value)} />
                    {validationErrors.about}
                </div>

                <div className='create-group-final-steps form-input'>
                    <b>Final steps...</b>

                    <label htmlFor='type-of-group'>Is this an in person or online group?</label>
                    <select name='type-of-group' value={type} onChange={(e) => setType(e.target.value)}>
                        <option value={""}>{` select one`}</option>
                        <option value='In person' >In Person</option>
                        <option value="Online">Online</option>

                    </select>
                    {validationErrors.type}

                    <label htmlFor='privacy'>Is this group private or public</label>
                    <select name='privacy' value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value={""}>{` select one`}</option>
                        <option value={'false'}>Public</option>
                        <option value={'true'}>Private</option>
                    </select>
                    {validationErrors.private}

                    <label htmlFor='group-image'>Please add an image url for your group below:</label>
                    <input name='group-image' type='text' placeholder='Image Url' value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />

                </div>

                <div>
                    <button>Create Group</button>
                </div>
            </div>
        </form>
    )
}

export default CreateGroupForm;
