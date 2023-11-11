import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { grabGroup, updateGroup } from '../../../store/groups';



const UpdateGroup = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const group = useSelector(state => state.groups[groupId])
    const user = useSelector(state => state.session.user);

    const updateTheGroup = async () => {
        const group = await dispatch(grabGroup(groupId))
        if (user.id !== group.organizerId) history.push('/');

        setName(group.name)
        setLocation(`${group.city} ${group.state}`)
        setAboutGroup(group.about)
        setPrivacy(group.private)
        setImgUrl(group.previewImage)
        setType(group.type)

        setIsLoaded(true)
    }


    useEffect(() => {
        updateTheGroup()

    }, [dispatch, groupId])




    const [location, setLocation] = useState(`${group?.city} ${group?.state}`);
    const [name, setName] = useState(group?.name);
    const [aboutGroup, setAboutGroup] = useState(group?.about);
    const [type, setType] = useState(group?.type);
    const [privacy, setPrivacy] = useState(group?.private)
    const [imgUrl, setImgUrl] = useState(group?.previewImage);
    const [validationErrors, setValidationErrors] = useState({});


    //  if (user.id !== group.organizerId) return history.push('/');

    const onSubmit = async (e) => {
        e.preventDefault()

        //parse location
        const city = location.split(" ")[0]
        const state = location.split(" ")[1]

        console.log('city', city, state, 'state')

        //build group object
        const updatedGroup = {
            name,
            city,
            state,
            about: aboutGroup,
            type: type,
            private: privacy,
            previewImage: imgUrl
        }

        console.log(updatedGroup, 'groupUpdated')


        //dispatch thunk
        dispatch(updateGroup(groupId, updatedGroup))
            .then(res => history.push(`/groups/${res.id}`))
            .catch(async (err) => {
                if (err && err.status) {
                    const errors = await err.json()
                    setValidationErrors(errors.errors)
                }
            })

        //new thunk to dispatch update group

        //catch errors
        //send errors out

        //redirect
    }


    return (
        <>
            {isLoaded &&
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
            }
        </>
    )
}

export default UpdateGroup;
