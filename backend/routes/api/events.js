const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, Attendee, sequelize } = require('../../db/models');

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
    let { page, size } = req.query;

    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (isNaN(page) || page < 0) page = 1;
    if (isNaN(size) || size < 0) size = 20;

    const offset = (page - 1) * size

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
            'Event.id'
        ],
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
                {
                    model: Group
                }
            ]
        })

        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }
        console.log(event.attendee)
        if (event.attendee.length) {
            status = event.attendee[0].Attendee.status
            console.log(status)
        }

        if (status === 'host' || status === 'co-host' || status === 'attendee' || req.user.id === event.Group.organizerId) {
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

router.get('/:eventId/attendees', async (req, res) => {
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        },
        include: [
            {
                model: Group,
                include: {
                    model: User,
                    as: 'Members',
                    through: {
                        where: {
                            userId: req.user.id
                        }
                    }
                }
            }
        ]
    })

    //couldn't find event
    if (!event) {
        res.status(404)
        res.json({ message: "Event couldn't be found" })
    }

    //check if user is organizer of the group
    const organizerId = event.Group.organizerId
    console.log(organizerId)

    //check if user has a membership status of co-host
    const membershipStatusOfUser = event.Group.Members[0].Membership.status
    console.log(membershipStatusOfUser)

    //user is organizer of group or co-host of group
    if (req.user.id === organizerId || membershipStatusOfUser === 'co-host') {
        const attendeesOfEvent = await Event.findOne({
            where: {
                id: req.params.eventId
            },
            include: {
                model: User,
                as: 'attendee',
                attributes: ['id', 'firstName', 'lastName'],
                through: {
                    attributes: ['status']
                }
            },
            attributes: []
        })


        res.json(attendeesOfEvent)
    }
    else {
        const nonValidUserResult = await Event.findOne({
            where: {
                id: req.params.eventId
            },
            include: {
                model: User,
                as: 'attendee',
                attributes: ['id', 'firstName', 'lastName'],
                through: {
                    attributes: ['status'],
                    scope: 'notValid'
                }
            },
            attributes: []
        })


        res.json(nonValidUserResult)
    }
})

router.post('/:eventId/attendees', async (req, res) => {
    let userStatus;
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
                        as: 'Members',
                        through: {
                            where: {
                                userId: req.user.id
                            }
                        }
                    }
                }
            ]
        })

        console.log(event.Group.Members[0])

        //event not found
        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }

        //users attendance is already pending
        const findAttendance = await Attendee.findOne({
            where: {
                userId: req.user.id,
                eventId: req.params.eventId
            }
        })
        if (findAttendance) {
            const attendanceStatus = findAttendance.status
            if (attendanceStatus === 'pending') {
                res.status(400)
                res.json({ message: "Attendance has already been requested" })
            }

            //user already got accpted into the event
            if (attendanceStatus === 'attending') {
                res.status(400)
                res.json({ message: "User is already an attendee of the event" })
            }
        }

        //check if user is member of group going to event
        userStatus = event.Group.Members[0].Membership.status
        if (userStatus === 'member') {
            const requestAttendance = await Attendee.create({
                eventId: req.params.eventId,
                userId: req.user.id,
            })

            res.json(requestAttendance)
        }
    }
})

router.put('/:eventId/attendees', async (req, res) => {
    const { userId, status } = req.body
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
                        as: 'Members',
                        through: {
                            where: {
                                userId: req.user.id
                            }
                        }
                    }
                }
            ]
        })

        //check if event exists
        if (!event) {
            res.status(404)
            res.json({ message: "Even't couldn't be found" })
        }

        //check if user is organizer of group
        const organizerOfGroup = event.Group.organizerId

        //check if user is co-host of group
        const membershipStatusOfUser = event.Group.Members[0].Membership.status

        //check if status is being changed to pending
        if (status === 'pending') {
            res.status(400)
            res.json({ message: "Cannot change an attendance status to pending" })
        }

        //change status of user
        if (req.user.id === organizerOfGroup || membershipStatusOfUser === 'co-host') {
            //find attendance of requested user
            const attendanceOfRequestedUser = await Attendee.findOne({
                where: {
                    userId: userId
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            //check if attendance exists
            if (!attendanceOfRequestedUser) {
                res.status(404)
                res.json({ message: "Attendance between the user and the event does not exists" })
            }

            attendanceOfRequestedUser.status = status

            attendanceOfRequestedUser.save()

            res.json(attendanceOfRequestedUser)
        }
    }

})

router.delete('/:eventId/attendees', async (req, res) => {
    const { userId } = req.body
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
                        as: 'Members',
                        through: {
                            where: {
                                userId: req.user.id
                            }
                        }
                    }
                }
            ]
        })
        //check if event was found
        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }
        //check if user if host of group
        const organizerId = event.Group.organizerId
        //check if user is the person who is being deleted
        if (req.user.id === userId || req.user.id === organizerId) {
            const findAttendee = await Attendee.findOne({ where: { userId: userId, eventId: req.params.eventId } })
            //check if attendee exists
            if (!findAttendee) {
                res.status(404)
                res.json({
                    "message": "Attendance does not exist for this User"
                })
            }
            await Attendee.destroy({
                where: {
                    userId: userId,
                    eventId: req.params.eventId
                }
            })
            res.json({
                "message": "Successfully deleted attendance from event"
            })
        } else {
            res.status(403)
            res.json({ message: "Only the User or organizer may delete an Attendance" })
        }
    }
})

module.exports = router
