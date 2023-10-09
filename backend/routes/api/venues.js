const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, sequelize } = require('../../db/models');

const validateVenue = [ //touched
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];


router.put('/:venueId', requireAuth, validateVenue, async (req, res) => {
    let status;
    let group;
    const { address, city, state, lat, lng } = req.body
    if (req.user) {
        const venue = await Venue.findOne({ where: { id: req.params.venueId } })
        try {
            group = await venue.getGroup({
                include: {
                    model: User,
                    as: 'Members',
                    attributes: ['username'],
                    through: {
                        attributes: ['status']
                    }
                }
            })
        } catch (error) {
            res.status(404)
            res.json({ message: "Venue couldn't be found" })
        }


        const membershipStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: group.id }
        })

        if (membershipStatusOfUser) status = membershipStatusOfUser.status

        if (req.user.id === group.organizerId || status === 'co-host') {
            venue.address = address
            venue.city = city
            venue.state = state
            venue.lat = lat
            venue.lng = lng

            venue.save()
            res.json(venue)
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

    }
})


module.exports = router
