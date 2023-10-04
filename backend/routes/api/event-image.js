const express = require('express');
const router = express.Router();
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, Attendee, sequelize } = require('../../db/models');

router.delete('/:eventImageId', async (req, res) => {
    const image = await EventImage.findOne({
        where: {
            id: req.params.eventImageId
        },
        include: [
            {
                model: Event,
                include: {
                    model: Group,
                    include: {
                        model: User,
                        as: 'Members'
                    }
                }
            }
        ]
    })



    //check if image exists
    if (!image) {
        res.status(404)
        res.json({ message: "Event Image couldn't be found" })
    }

    //check if user is organizer of group
    const organizerId = image.Event.Group.organizerId
    console.log(organizerId)
    //check if user is cohost of group
    const userStatus = image.Event.Group.Members[0].Membership.status
    console.log(userStatus)

    if (req.user.id === organizerId || userStatus === 'co-host') {
        await EventImage.destroy({
            where: {
                id: req.params.eventImageId
            }
        })

        res.json({ message: "Successfully deleted" })
    }
})

module.exports = router
