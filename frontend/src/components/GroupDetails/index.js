import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { grabGroup } from "../../store/groups";

//componenets
import GroupDetailsBlock from "./detailsComponenets/GroupDetailsBlock/GroupDetailsBlock";
import WhatWeAbout from "./WhatWeAbout/WhatWeAbout";

const GroupDetails = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(grabGroup(groupId))
            setIsLoaded(true)
        };

        fetchData();
    }, [dispatch, groupId])

    return (
        <>
            {isLoaded && (
                <div>
                    <GroupDetailsBlock group={group} />
                    <WhatWeAbout group={group} />
                </div>
            )}
        </>
    )
}
export default GroupDetails
