const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, EventImage, Attendee, sequelize } = require('../../db/models');

const validateEvent = [
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
        .isFloat({ min: 0 })
        .exists({ checkFalsy: true })
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('startDate')
        .custom((value) => {
            const currentDate = new Date();
            const startDate = new Date(value);
            if (startDate <= currentDate) {
                throw new Error('Start date must be in the future');
            }
            return true;
        }),
    check('endDate')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDate)
            if (Date.parse(startDate) > Date.parse(value)) throw new Error('End date is less than Start date')
            return true
        }),
    handleValidationErrors
];

const validateQuery = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('name')
        .optional()
        .custom(value => {
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                throw new Error('Name must be a string');
            }
            return true;
        }),
    check('type')
        .optional()
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In Person"),
    check('startDate')
        .optional()
        .custom(value => {
            if (!Date.parse(value)) throw new Error('must be valid date')
            return true
        })
        .withMessage("Start date must be a valid datetime"),
    handleValidationErrors
];



router.get('/', validateQuery, async (req, res) => { //fix filters
    let { page, size, name, type, startDate } = req.query;
    console.log(name)
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    if (isNaN(page) || page < 0) page = 1;
    if (isNaN(size) || size < 0) size = 20;

    const offset = (page - 1) * size

    //search filters
    const where = {}
    if (name) where.name = name
    if (type) where.type = type
    if (startDate) where.startDate = startDate

    const events = await Event.findAll({
        include: [ //num attending
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state'],
                include: [
                    {
                        model: Venue,
                        as: 'Venues',
                        attributes: ['id', 'city', 'state']
                    }
                ]
            },
            {
                model: User,
                as: 'attendee',
                attributes: ['id']
            }
        ],
        where,
        limit: size,
        offset: offset,
    })
    const returnEvents = events.map(obj => {
        const event = obj.toJSON()
        event.numAttending = event.attendee.length
        delete event.attendee
        return event
    })
    res.json({
        Events: returnEvents
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
                    model: Venue,
                    as: 'Venues'
                }
            },
            {
                model: User,
                as: 'attendee',
                attributes: []
            },
            {
                model: EventImage,
                as: 'EventImages'
            }
        ],
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('attendee.id')), 'numAttending']]
        },
        group: [
            'Event.id',
            'Group.Venues.id',
            'EventImages.id',
            'Group.id',
            'attendee.Attendee.id'
        ]
    })

    if (!event) {
        res.status(404)
        res.json({ message: "Event couldn't be found" })
    }

    res.json(event);
})

router.put('/:eventId', requireAuth, validateEvent, async (req, res) => {
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
                    include: {
                        model: User,
                        as: 'Members',
                    }
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

        const membershipStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: event.Group.id }
        })
        if (membershipStatusOfUser) status = membershipStatusOfUser.status

        if (event.Group) {
            organizerId = event.Group.organizerId;
        }

        if (req.user.id === organizerId || status === 'co-host') {
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
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

    }
})

router.delete('/:eventId', requireAuth, async (req, res) => {
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

        const membershipStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: event.Group.id }
        })
        if (membershipStatusOfUser) status = membershipStatusOfUser.status

        if (req.user.id === organizerId || status === 'co-host') {
            await Event.destroy({
                where: { id: req.params.eventId }
            })
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }

        res.json({ message: "Successfully deleted" })
    }
})

router.post('/:eventId/images', requireAuth, async (req, res) => {
    let status = undefined;
    let userAttendance;
    let organizerId;
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
                    model: Group,
                    include: {
                        model: User,
                        as: 'Members',
                    }
                }
            ]
        })

        if (!event) {
            res.status(404)
            res.json({ message: "Event couldn't be found" })
        }

        //find the organizer of group
        if (event.Group) {
            organizerId = event.Group.organizerId
        }
        //find status of user in group
        const membershipStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: event.Group.id }
        })

        if (membershipStatusOfUser) status = membershipStatusOfUser.status

        //check if user is attenddee find user attendee status
        const userAttendee = await Attendee.findOne({ where: { userId: req.user.id, eventId: req.params.eventId } })
        if (userAttendee) userAttendance = userAttendee.status
        //res.json(userAttendee)
        //check status
        if (status === 'co-host' || req.user.id === event.Group.organizerId || userAttendee.status === 'attending') {
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
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }
    }
})

router.get('/:eventId/attendees', async (req, res) => {
    let status;
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
    const membershipStatusOfUser = await Membership.findOne({
        where: { userId: req.user.id, groupId: event.Group.id }
    })
    if (membershipStatusOfUser) status = membershipStatusOfUser.status

    //user is organizer of group or co-host of group
    if (req.user.id === organizerId || status === 'co-host') {
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
                    where: {
                        status: {
                            [Op.ne]: 'pending'
                        }
                    }
                }
            },
            attributes: []
        })


        res.json(nonValidUserResult)
    }
})

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
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
                    }
                }
            ]
        })

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
            console.log(attendanceStatus)
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
        const membershipStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: event.Group.id }
        })
        if (membershipStatusOfUser) userStatus = membershipStatusOfUser.status

        if (userStatus === 'member' || userStatus === 'co-host') {
            const requestAttendance = await Attendee.create({
                eventId: req.params.eventId,
                userId: req.user.id,
            })

            res.json(requestAttendance)
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }
    }
})

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    let membershipStatusOfUser
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
        const findStatusOfUser = await Membership.findOne({
            where: { userId: req.user.id, groupId: event.Group.id }
        })
        if (findStatusOfUser) membershipStatusOfUser = findStatusOfUser.status

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

            // attendanceOfRequestedUser.status = status
            // await attendanceOfRequestedUser.validate()
            // await attendanceOfRequestedUser.save()

            const updatedAttendee = await Attendee.update({ status: status }, {
                where: {
                    userId: userId
                }
            })

            res.json(attendanceOfRequestedUser)
        } else {
            res.status(403)
            res.json({ message: "Forbidden" })
        }
    }

})

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
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
            res.json({ message: "Forbidden" })
        }
    }
})

module.exports = router
