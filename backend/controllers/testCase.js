const testRouter = require('express').Router()
const Test = require('../models/testCase')
const Bacterium = require('../models/bacterium')
const Case = require('../models/case')
const multer = require('multer')
const fileFilter = (req, file, cb) => {
    if (req.user && req.user.admin) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(null, false)
        }
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
const path = require('path')
const imageDir = path.join(__dirname, '../images')
const fs = require('fs')
const deleteUploadedImages = (request) => {
    if (request.files) {
        if (request.files.controlImage) {
            fs.unlink(`${imageDir}/${request.files.controlImage[0].filename}`, (err) => err)
        }
        if (request.files.positiveResultImage) {
            fs.unlink(`${imageDir}/${request.files.positiveResultImage[0].filename}`, (err) => err)
        }
        if (request.files.negativeResultImage) {
            fs.unlink(`${imageDir}/${request.files.negativeResultImage[0].filename}`, (err) => err)
        }
        if (request.files.bacteriaSpecificImages) {
            for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                fs.unlink(`${imageDir}/${request.files.bacteriaSpecificImages[i].filename}`, (err) => err)
            }
        }
    }
}

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
    console.log(request.user)
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
                        if (!bacterium) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Kuvaan liittyvää bakteeria ei löydy tietokannasta.' })
                        }
                        const imagesForBacterium = test.bacteriaSpecificImages.filter(image => image.bacterium.name === bacterium.name)
                        if (imagesForBacterium.length > 0) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Testille voi antaa vain yhden bakteerikohtaisen kuvan per bakteeri.' })
                        }
                        test.bacteriaSpecificImages.push({ url: file.filename, contentType: file.mimetype, bacterium })
                    }
                }
            }
            const savedTest = await test.save()
            return response.status(201).json(savedTest)
        } catch (error) {
            deleteUploadedImages(request)
            return response.status(400).json({ error: error.message })
        }
    } else {
        deleteUploadedImages(request)
        throw Error('JsonWebTokenError')
    }
})

testRouter.put('/:id', upload.fields([{ name: 'controlImage', maxCount: 1 }, { name: 'positiveResultImage', maxCount: 1 }, { name: 'negativeResultImage', maxCount: 1 }, { name: 'bacteriaSpecificImages', maxCount: 100 }]), async (request, response) => {
    console.log('edit backend pre admin check', request.body)
    console.log(request.user)
    if (request.user.admin) {
        try {
            const testToEdit = await Test.findById(request.params.id).populate({
                path: 'bacteriaSpecificImages.bacterium',
                model: 'Bacterium'
            })
            if (!testToEdit) {
                deleteUploadedImages(request)
                return response.status(400).json({ error: 'Annettua testiä ei löydy tietokannasta' })
            }
            let testToUpdate = {
                name: request.body.name,
                type: request.body.type,
                bacteriaSpecificImages: testToEdit.bacteriaSpecificImages
            }

            console.log('edit backend post admin check', request.body.name)

            if (request.files) {
                if (request.files.controlImage) {
                    fs.unlink(`${imageDir}/${testToEdit.controlImage.url}`, (err) => err)
                    testToUpdate.controlImage = { url: request.files.controlImage[0].filename, contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    fs.unlink(`${imageDir}/${testToEdit.positiveResultImage.url}`, (err) => err)
                    testToUpdate.positiveResultImage = { url: request.files.positiveResultImage[0].filename, contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    fs.unlink(`${imageDir}/${testToEdit.negativeResultImage.url}`, (err) => err)
                    testToUpdate.negativeResultImage = { url: request.files.negativeResultImage[0].filename, contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname.substring(0, file.originalname.indexOf('.')) })
                        if (!bacterium) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Kuvaan liittyvää bakteeria ei löydy tietokannasta.' })
                        }
                        const imageToDelete = testToUpdate.bacteriaSpecificImages.filter(image => image.bacterium.name === bacterium.name)
                        if (imageToDelete.length > 0) {
                            fs.unlink(`${imageDir}/${imageToDelete[0].url}`, (err) => err)
                            testToUpdate.bacteriaSpecificImages.map(image => image.bacterium.name === bacterium.name ? { url: file.filename, contentType: file.mimetype, bacterium } : image)
                        } else {
                            testToUpdate.bacteriaSpecificImages.push({ url: file.filename, contentType: file.mimetype, bacterium })
                        }
                    }
                }
            }
            const updatetTest = await Test.findByIdAndUpdate(request.params.id, testToUpdate, { new: true, runValidators: true, context: 'query' })
            return response.status(200).json(updatetTest)
        } catch (error) {
            deleteUploadedImages(request)
            return response.status(400).json({ error: error.message })
        }
    } else {
        deleteUploadedImages(request)
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
            fs.unlink(`${imageDir}/${testToDelete.controlImage.url}`, (err) => err)
            fs.unlink(`${imageDir}/${testToDelete.positiveResultImage.url}`, (err) => err)
            fs.unlink(`${imageDir}/${testToDelete.negativeResultImage.url}`, (err) => err)
            for (let i = 0; i < testToDelete.bacteriaSpecificImages.length; i++) {
                fs.unlink(`${imageDir}/${testToDelete.bacteriaSpecificImages[i].url}`, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
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
