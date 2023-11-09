import { useHistory, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { getAllGroups } from "../../../store/groups";
import { useDispatch, useSelector } from "react-redux";


import '../GroupsCss/AllGroups.css'

const AllGroups = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const [isLoaded, setIsLoaded] = useState(false);
    let groups = useSelector(state => state.groups)

    useEffect(() => {
        dispatch(getAllGroups())
            .then(() => setIsLoaded(true))
    }, [dispatch])


    const groupInformation = Object.values(groups).map((group) => {

        const privacy = group.private ? "Private" : "Public";

        return (
            <Link to={`/groups/${group.id}`} key={group.id} >
                <div className="group-show-container">

                    <div className="group-show-image-container">
                        <img src={group.previewImage} />
                    </div>

                    <div className="group-show-description-container">
                        <b className="group-show-name">{group.name}</b>
                        <p className="group-show-city">{group.city}</p>
                        <p className="group-show-description">{group.about}</p>

                        <div className="group-show-events-container">
                            <p>{privacy}</p>
                            <span className="dot">.</span>
                            <p>{group.Events?.length} </p>
                            <label htmlFor="events">events</label>
                        </div>

                    </div>

                </div>
            </Link>
        )
    })

    return (
        <div>
            {isLoaded && groupInformation}
        </div>
    )

}

export default AllGroups;
