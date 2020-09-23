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
const storage = multer.memoryStorage()
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
                    test.controlImage = { data: Buffer.from(request.files.controlImage[0].buffer).toString('base64'), contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    test.positiveResultImage = { data: Buffer.from(request.files.positiveResultImage[0].buffer).toString('base64'), contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    test.negativeResultImage = { data: Buffer.from(request.files.negativeResultImage[0].buffer).toString('base64'), contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname.substring(0, file.originalname.indexOf('.')) })
                        test.bacteriaSpecificImages.push({ data: Buffer.from(file.buffer).toString('base64'), contentType: file.mimetype, bacterium })
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
            const testToUpdate = {
                id: request.params.id,
                name: request.body.name,
                type: request.body.type,
                bacteriaSpecificImages: []
            }
            if (request.files) {
                if (request.files.controlImage) {
                    test.controlImage = { data: Buffer.from(request.files.controlImage[0].buffer).toString('base64'), contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    test.positiveResultImage = { data: Buffer.from(request.files.positiveResultImage[0].buffer).toString('base64'), contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    test.negativeResultImage = { data: Buffer.from(request.files.negativeResultImage[0].buffer).toString('base64'), contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname.substring(0, file.originalname.indexOf('.')) })
                        test.bacteriaSpecificImages.push({ data: Buffer.from(file.buffer).toString('base64'), contentType: file.mimetype, bacterium })
                    }
                }
            }
            await Test.findOneAndUpdate(request.params.id, testToUpdate, { new: true, context: 'query' })
            const updatetTest = await Test.findById(request.params.id).populate('Bacterium', { name: 1 })
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
            const testToDelete = await Test.findById(request.params.id)
            try {
                const cases = await Case.find({ 'testGroups.test': testToDelete }).populate({
                    path: 'testGroups.test',
                    model: 'Test',
                    populate: {
                        path: 'bacteriaSpecificImages.bacterium',
                        model: 'Bacterium'
                    }
                })
                console.log('cases',cases)
                if (cases > 0) {
                    return response.status(400).json({ error: 'Testiä ei voida poistaa, koska se on jo käytössä tapauksessa' })
                }
            } catch (error){
                return response.status(400).json({ error: error.message })
            }

            await Test.findByIdAndRemove(request.params.id)
            return response.status(200).end()
        } catch (error) {
            return response.status(400).json({ error: 'Annettua testiä ei löydy tietokannasta' })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = testRouter