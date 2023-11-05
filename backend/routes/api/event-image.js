const express = require('express');
const router = express.Router();
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, Attendee, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:eventImageId', requireAuth, async (req, res) => {
    let userStatus;
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
                        as: 'Members',
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

    const membershipStatusOfUser = await Membership.findOne({
        where: { userId: req.user.id, groupId: image.Event.Group.id }
    })
    if (membershipStatusOfUser) userStatus = membershipStatusOfUser.status

    //check if user is cohost of group


    if (req.user.id === organizerId || userStatus === 'co-host') {
        await EventImage.destroy({
            where: {
                id: req.params.eventImageId
            }
        })

        res.json({ message: "Successfully deleted" })
    } else {
        res.status(403)
        res.json({ message: "Forbidden" })
    }
})

module.exports = router
