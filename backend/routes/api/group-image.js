const express = require('express');
const router = express.Router();
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, Attendee, sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

router.delete('/:groupImageId', requireAuth, async (req, res) => {
    const image = await GroupImage.findOne({
        where: {
            id: req.params.groupImageId
        },
        include: {
            model: Group,
            include: {
                model: User,
                as: 'Members'
            }
        }
    })

    //couldn't find image
    if (!image) {
        res.status(404)
        res.json({ message: "Group Image couldn't be found" })
    }

    //check if user is organizer
    const organizerId = image.Group.organizerId
    console.log(organizerId)
    //check if user is cohost of group
    const statusOfUser = image.Group.Members[0].Membership.status
    console.log(statusOfUser)

    if (req.user.id === organizerId || statusOfUser === 'co-host') {
        await GroupImage.destroy({
            where: {
                id: req.params.groupImageId
            }
        })

        res.json({ message: "Successfully deleted" })
    }
})

module.exports = router
