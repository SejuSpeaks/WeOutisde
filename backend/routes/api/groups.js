const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, sequelize } = require('../../db/models');


const ValidateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage('Type must be "Online" or "In person". '),
    check('private')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    handleValidationErrors
];

const validateVenue = [
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
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];

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


router.post('/', ValidateGroup, async (req, res) => {
    if (req.user) {
        const { name, about, type, private, city, state } = req.body
        const newGroup = await Group.create({
            organizerId: req.user.id,
            name: name,
            about: about,
            type: type,
            private: private,
            city: city,
            state: state
        })

        res.json(newGroup)
    }
})

router.get('/', async (req, res) => {
    let { page, size } = req.query;

    page = parseInt(page) || 1;
    size = parseInt(size) || 20;
    //if page and size arent numbers or less than 0
    if (isNaN(page) || page < 0) page = 1;
    if (isNaN(size) || size < 0) size = 20;

    const offset = (page - 1) * size

    console.log(offset, size)

    const groups = await Group.findAll({
        include: [{
            model: User,
            as: 'Members',
            attributes: [],
        }],
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('Users.id')), 'numMembers'],
            ],
        },
        group: [
            "Users.id",
        ],
        // limit: size,
        // offset: offset,
    });


    res.json({
        Groups: [
            groups,
        ]
    })

})

router.get('/current', async (req, res) => {
    if (req.user) {
        const groups = await Group.findAll({
            where: {
                organizerId: req.user.id
            },
            include: {
                model: User,
                as: 'Members',
                attributes: []
            },
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers'],
                ]
            },
            group: ['Group.id']
        })
        res.json({
            Groups: [
                groups
            ]
        })
    }

})

router.get('/:groupId', async (req, res) => {

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: [
            {
                model: User,
                as: 'Members',
                attributes: []
            },
            {
                model: GroupImage
            },
            {
                model: User
            },
            {
                model: Venue
            },

        ],
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers']]
        }
    })

    if (!group.id) {
        res.status(404)
        res.json({
            message: "Group couldn't be found"
        })
    }

    res.json(group)
})

router.put('/:groupId', ValidateGroup, async (req, res) => {
    if (req.user) {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            }
        })

        if (!group) {
            res.status(404)
            res.json({ message: "Group couldn't be found" })
        }

        if (group.organizerId === req.user.id) {
            const { name, about, type, private, city, state } = req.body

            group.name = name
            group.about = about
            group.type = type
            group.private = private
            group.city = city
            group.state = state

            group.save()

            res.json(group)
        }
    }
})

router.delete('/:groupId', async (req, res) => {
    const { groupId } = req.params
    if (req.user) {
        const group = await Group.findByPk(groupId)
        if (!group) {
            res.status(404)
            res.json({ message: "Group couldn't be found" })
        }

        if (group.organizerId === req.user.id) {
            try {
                await Group.destroy({ where: { id: groupId } })
                res.json({ message: "Successfully deleted" })

            } catch (error) {
                console.log(error)
            }
        }

    }
})

router.post('/:groupId/images', async (req, res) => {
    if (req.user) {
        const { url, preview } = req.body

        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            }
        })

        if (!group) {
            res.status(404)
            res.json({ message: "Group couldn't be found" })
        }

        if (group.organizerId === req.user.id) {
            const image = await GroupImage.create({
                groupId: req.params.groupId,
                url: url,
                preview: preview
            })

            const imageWithoutDefaults = {
                id: image.id,
                url: image.url,
                preview: image.preview
            }

            res.json(imageWithoutDefaults);
        }
        else {
            res.json({ message: 'Umm excuse me?' })
        }
    }
})

router.get('/:groupId/venues', async (req, res) => {
    let status;
    if (req.user) {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            },
            include: {
                model: User,
                as: 'Members',
                attributes: ['username'],
                through: {
                    attributes: ['status']
                }
            }

        });

        if (!group) {
            res.status(404)
            res.json({ message: "Group could't be found" })
        }

        if (group.Members.length) status = group.Members[0].Membership.status


        if (group.organizerId === req.user.id || status === 'host' || status === 'co-host') {
            const venues = await group.getVenues()
            res.json(venues)
        }
    }
})

router.get('/:groupId/events', async (req, res) => {
    const events = await Event.findAll({
        where: {
            groupId: req.params.groupId
        },
        include: [
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
        ]
    })


    if (!events.length) {
        res.status(404)
        res.json({ message: "Group couldn't be found" })
    }

    res.json({
        Events: [
            events
        ]
    })
})

router.post('/:groupId/venues', validateVenue, async (req, res) => {
    let status;
    const { user } = req;
    const { address, city, state, lat, lng } = req.body
    if (user) {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            },
            include: {
                model: User,
                as: 'Members',
                attributes: ['username'],
                through: {
                    attributes: ['status']
                }
            }

        });

        if (!group) {
            res.status(404)
            res.json({ message: "Group could't be found" })
        }
        if (group.Members.length) status = group.Members[0].Membership.status
        if (group.organizerId === user.id || status === 'host' || status === 'co-host') {
            const venue = await Venue.create({
                groupId: req.params.groupId,
                address,
                city,
                state,
                lat,
                lng
            })

            res.json(venue)
        }
    }
})

router.post('/:groudId/events', validateEvent, async (req, res) => {
    let status;
    const { user } = req
    const { name, type, capacity, price, description, startDate, endDate } = req.body
    const group = await Group.findByPk(req.params.groudId, { include: [{ model: User, as: 'Members' }, { model: Venue, attributes: ['id'] }] });

    if (!group) {
        res.status(404)
        res.json({ message: "Group couldn't be found" })
    }

    const venueId = group.Venues[0].id
    if (group.Members.length) {
        status = group.Members[0].Membership.status
    }

    if (user) {
        if (group.organizerId === user.id || status === 'co-host') {
            const event = Event.build({
                groupId: group.id,
                venueId: venueId,
                name: name,
                type: type,
                capacity: capacity,
                price: price,
                description: description,
                startDate: startDate,
                endDate: endDate
            })

            await event.validate()

            await event.save()

            res.json(event)
        }
    }
})

router.get('/:groupId/members', async (req, res) => {
    let organizerId;
    let status;
    const { user } = req

    const group = await Group.findOne({
        where: {
            id: req.params.groupId
        },
        include: {
            model: User,
            as: 'Members',
            attributes: ['id', 'firstName', 'lastName'],
            through: {
                attributes: ['status']
            }
        },
        attributes: []

    })
    if (!group) {
        res.status(404)
        res.json({ message: "Group couldn't be found" })
    }

    if (group.Members.length) status = group.Members[0].Membership.status

    if (user.id === group.id || status === 'co-host') {
        res.json(group)
    }
    else {
        const nonOrganizerGroup = await Group.findOne({
            where: {
                id: req.params.groupId
            },
            include: {
                model: User,
                as: 'Members',
                attributes: ['id', 'firstName', 'lastName'],
                through: {
                    attributes: ['status'],
                    scope: 'notValid'
                },
            },
            attributes: []
        })

        res.json(nonOrganizerGroup)
    }
})

router.post('/:groupId/members', async (req, res) => {
    let status;
    if (req.user) {
        const group = await Group.findByPk(req.params.groupId)

        const membershipStatus = await Membership.findOne({
            where: {
                groupId: req.params.groupId,
                userId: req.user.id
            }
        })
        //group dosent exist
        if (!group) {
            res.status(404)
            res.json({ message: "Group couldn't be found" })
            return
        }
        //if user has requested or is a member of the group
        if (membershipStatus) {
            status = membershipStatus.status

            if (status === 'pending') {
                res.status(400)
                res.json({ message: "Membership has already been requested" })
                return
            }

            if (status === 'member' || status === 'host' || status === 'co-host') {
                res.status(400)
                res.json({ message: "User is already a member of the group" })
                return
            }
        }



        const membershipRequest = await Membership.create({
            userId: req.user.id,
            groupId: req.params.groupId
        })

        const safeMember = {
            userId: req.user.id,
            status: membershipRequest.status
        }

        res.json(safeMember)
    }
})

router.put('/:groupId/members', async (req, res) => {
    const { status, memberId } = req.body
    if (req.user) {

        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            },
            include: {
                model: User,
                as: 'Members'
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        const membership = await Membership.findOne({
            where: {
                userId: memberId,
                groupId: req.params.groupId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        //couldnt find group
        if (!group) {
            res.status(400)
            res.json({
                "message": "Group couldn't be found"
            })
        }

        //couldnt find user
        const user = await User.findByPk(memberId)
        if (!user) {
            res.status(400)
            res.json({
                "message": "Validation Error",
                "errors": {
                    "memberId": "User couldn't be found"
                }
            })
        }

        //membership dosent exist
        if (!membership) {
            res.status(400)
            res.json({
                "message": "Membership between the user and the group does not exist"
            })
        }

        const currentstatus = group.Members[0].Membership.status
        const organizerId = group.organizerId

        //changin status of member to pending
        if (status === 'pending') {
            res.status(400)
            res.json({
                "message": "Validations Error",
                "errors": {
                    "status": "Cannot change a membership status to pending"
                }
            })
        }

        //changing status of user to member
        if (status === 'member') {
            if (req.user.id === group.organizerId || currentstatus === 'co-host') {
                membership.status = 'member'
                membership.save()
                res.json(membership)
                return
            } else {
                res.status(400)
                res.json({ message: 'Not authorized to do this' })
            }
        }

        //changing status of user to co-host
        if (status === 'co-host') {
            if (req.user.id === organizerId) {
                membership.status = 'co-host'
                membership.save()
                res.json(membership)
                return
            }
            else {
                res.status(400)
                res.json({ message: "Not authorized to do this" })
            }
        }

    }
})

router.delete('/:groupId/members', async (req, res) => {
    const { userId } = req.body
    if (req.user) {
        const group = await Group.findOne({
            where: {
                id: req.params.groupId
            }
        })
        //check if group exists
        if (!group) {
            res.status(404)
            res.json({
                "message": "Group couldn't be found"
            })
        }

        //check if user exists
        const requestedUserToDelete = await User.findByPk(userId)
        if (!requestedUserToDelete) {
            res.status(400)
            res.json({
                "message": "Validation Error",
                "errors": {
                    "memberId": "User couldn't be found"
                }
            })
        }
        //check if user is organizer of group
        const organizerId = group.organizerId
        //check if user is deleting themselves
        console.log(req.user.id, 'userId', userId)
        if (req.user.id === userId || req.user.id === organizerId) {
            //check if the membership exists
            const requestedUserMembership = await Membership.findOne({
                where: {
                    groupId: req.params.groupId,
                    userId: userId
                }
            })
            if (!requestedUserMembership) {
                res.status(404)
                res.json({ message: "Membership does not exists for this User" })
            }
            //destory membership
            await Membership.destroy({
                where: {
                    groupId: req.params.groupId,
                    userId: userId
                }
            })

            res.json({ message: "Successfully deleted membership from group" })
        }
    }
})


// module.exports = router

module.exports = router
