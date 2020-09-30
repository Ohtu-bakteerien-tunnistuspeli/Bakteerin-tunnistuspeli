const testRouter = require('express').Router()
const Test = require('../models/testCase')
const Bacterium = require('../models/bacterium')
const Case = require('../models/case')
const multer = require('multer')
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'images')
    }
})
const upload = multer({ storage, fileFilter })

testRouter.get('/', async (request, response) => {
    if (request.user) {
        const tests = await Test.find({}).populate({
            path: 'bacteriaSpecificImages.bacterium',
            model: 'Bacterium'
        })
        response.json(tests.map(test => test.toJSON()))
    } else {
        throw Error('JsonWebTokenError')
    }
})

testRouter.post('/', upload.fields([{ name: 'controlImage', maxCount: 1 }, { name: 'positiveResultImage', maxCount: 1 }, { name: 'negativeResultImage', maxCount: 1 }, { name: 'bacteriaSpecificImages', maxCount: 100 }]), async (request, response) => {
    if (request.user.admin) {
        try {
            const test = new Test({
                name: request.body.name,
                type: request.body.type,
                bacteriaSpecificImages: []
            })

            if (request.files) {
                if (request.files.controlImage) {
                    test.controlImage = { url: request.files.controlImage[0].filename, contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    test.positiveResultImage = { url: request.files.positiveResultImage[0].filename, contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    test.negativeResultImage = { url: request.files.negativeResultImage[0].filename, contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname.substring(0, file.originalname.indexOf('.')) })
                        if(!bacterium) {
                            return response.status(400).json({ error: 'Kuvaan liittyvää bakteeria ei löydy tietokannasta.' })
                        }
                        test.bacteriaSpecificImages.push({ url: file.filename, contentType: file.mimetype, bacterium })
                    }
                }
            }
            const savedTest = await test.save()
            return response.status(201).json(savedTest)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

testRouter.put('/:id', upload.fields([{ name: 'controlImage', maxCount: 1 }, { name: 'positiveResultImage', maxCount: 1 }, { name: 'negativeResultImage', maxCount: 1 }, { name: 'bacteriaSpecificImages', maxCount: 100 }]), async (request, response) => {
    if (request.user.admin) {
        try {
            let testToUpdate = {
                name: request.body.name,
                type: request.body.type,
                bacteriaSpecificImages: []
            }
            if (request.files) {
                if (request.files.controlImage) {
                    testToUpdate.controlImage = { url: request.files.controlImage[0].filename, contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    testToUpdate.positiveResultImage = { url: request.files.positiveResultImage[0].filename, contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    testToUpdate.negativeResultImage = { url: request.files.negativeResultImage[0].filename, contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname.substring(0, file.originalname.indexOf('.')) })
                        if(!bacterium) {
                            return response.status(400).json({ error: 'Kuvaan liittyvää bakteeria ei löydy tietokannasta.' })
                        }
                        testToUpdate.bacteriaSpecificImages.push({ url: file.filename, contentType: file.mimetype, bacterium })
                    }
                }
            }
            const updatetTest = await Test.findByIdAndUpdate(request.params.id, testToUpdate, { new: true, runValidators: true, context: 'query' })
            if (!updatetTest) {
                return response.status(400).json({ error: 'Annettua testiä ei löydy tietokannasta' })
            }
            return response.status(200).json(updatetTest)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

testRouter.delete('/:id', async (request, response) => {
    if (request.user.admin) {
        try {
            const testToDelete = await Test.findById(request.params.id).populate({
                path: 'bacteriaSpecificImages.bacterium',
                model: 'Bacterium'
            })

            const cases = await Case.find({}).populate({
                path: 'testGroups.test',
                model: 'Test',
                populate: {
                    path: 'bacteriaSpecificImages.bacterium',
                    model: 'Bacterium'
                }
            })
            let testIsInUse = false
            cases.forEach(element => {
                for (let i = 0; i < element.testGroups.length; i++) {
                    for (let j = 0; j < element.testGroups[i].length; j++) {
                        if (element.testGroups[i][j].test.name === testToDelete.name) {
                            testIsInUse = true
                        }
                    }
                }
            })
            if (testIsInUse) {
                return response.status(400).json({ error: 'Testi on käytössä ainakin yhdessä taupaksessa, eikä sitä voida poistaa' })
            }

            await Test.findByIdAndRemove(request.params.id)
            return response.status(204).end()
        } catch (error) {
            return response.status(400).json({ error: 'Annettua testiä ei löydy tietokannasta' })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = testRouter
