const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage, sequelize } = require('../../db/models');
const { route } = require('./users');

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
]


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
    const groups = await Group.findAll({
        include: [{ //attributes for Memberships query
            model: User,
            as: 'Members',
            attributes: [],
        }],
        attributes: { //attributes for group query
            include: [
                [sequelize.fn('COUNT', sequelize.col('Members.id')), 'numMembers'],
            ],
        },
        group: [
            'Group.id',
        ],
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
        if (group.Members) status = group.Members[0].Membership.status
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

module.exports = router
