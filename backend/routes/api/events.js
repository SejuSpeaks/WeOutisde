const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, sequelize } = require('../../db/models');

const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage('Venue does not exist'),
    check('name')
        .isLength({ min: 5 })
        .exists({ checkFalsy: true })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .isIn(['Online', 'In person'])
        .exists({ checkFalsy: true })
        .withMessage('Type must be Online or In person'),
    check('capacity')
        .isInt()
        .exists({ checkFalsy: true })
        .withMessage('Capacity must be an integer'),
    check('price')
        .isFloat()
        .exists({ checkFalsy: true })
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    handleValidationErrors
];



router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [ //num attending
            {
                model: Group,
                include: [
                    {
                        model: Venue
                    }
                ]
            },
            {
                model: User,
                as: 'attendee',
                attributes: []
            }
        ],
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('attendee.id')), 'numAttending']]
        },
        group: [
            'eventId'
        ]
    })

    res.json({
        Events: [
            events
        ]
    });
})

router.get('/:eventId', async (req, res) => {
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        },
        include: [
            {
                model: Group,
                include: {
                    model: Venue
                }
            },
            {
                model: User,
                as: 'attendee',
                attributes: []
            }
        ],
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('attendee.id')), 'numAttending']]
        },
        group: [
            'eventId'
        ]
    })

    if (!event) {
        res.status(404)
        res.json({ message: "Event couldn't be found" })
    }

    res.json(event);
})

router.put('/:eventId', validateEvent, async (req, res) => {
    let status;
    let organizerId;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    if (req.user) {
        const event = await Event.findOne({
            where: {
                id: req.params.eventId
            },
            include: [
                {
                    model: User,
                    as: 'attendee',
                    //attributes: []
                },
                {
                    model: Group,
                    //attributes: []
                }
            ]
        })

        const findingVenue = await Venue.findByPk(venueId)
        if (!findingVenue) {
            res.status(404)
            res.json({ message: "Venue couldn't be found" })
        }

        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }


        if (event.attendee.length) {
            status = event.attendee[0].Attendee.status
        }

        if (event.Group) {
            organizerId = event.Group.organizerId;
        }


        if (status === 'host' || status === 'co-host' || req.user.id === organizerId) {
            event.venueId = event.venueId
            event.name = name
            event.capacity = capacity
            event.type = type
            event.price = price
            event.description = description
            event.startDate = startDate
            event.endDate = endDate

            await event.validate()
            await event.save()
        }

        const justTheEventObject = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        }

        res.json(justTheEventObject)
    }
})

router.delete('/:eventId', async (req, res) => {
    let status;
    let organizerId;
    if (req.user) {
        const event = await Event.findOne({
            where: {
                id: req.params.eventId
            },
            include: [
                {
                    model: Group,
                    include: {
                        model: User,
                        as: 'Members'
                    }
                },
            ]
        })

        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }

        if (event.Group) organizerId = event.Group.organizerId
        if (event.Group.Members.length) status = event.Group.Members[0].Membership.status

        if (req.user.id === organizerId || status === 'co-host') {
            await Event.destroy({
                where: { id: req.params.eventId }
            })
        }

        res.json({ message: "Successfully deleted" })
    }
})

router.post('/:eventId/images', async (req, res) => {
    let status;
    const { url, preview } = req.body
    if (req.user) {
        const event = await Event.findOne({
            where: {
                id: req.params.eventId
            },
            include: [
                {
                    model: User,
                    as: 'attendee'
                },
            ]
        })

        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }

        if (event.attendee.length) {
            status = event.attendee[0].Attendee.status
        }

        if (status === 'host' || status === 'co-host' || status === 'attendee') {
            const eventImage = await EventImage.build({
                eventId: req.params.eventId,
                url: url,
                preview: preview
            })

            await eventImage.validate();
            await eventImage.save();

            const safeImage = {
                id: eventImage.id,
                url: eventImage.url,
                preview: eventImage.preview
            }

            res.json(safeImage)
        }
    }
})

module.exports = router
