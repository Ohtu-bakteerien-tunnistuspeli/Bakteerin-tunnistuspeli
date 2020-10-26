const testRouter = require('express').Router()
const Test = require('../models/testCase')
const Bacterium = require('../models/bacterium')
const Case = require('../models/case')
const config = require('../utils/config')
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
        cb(null, config.IMAGEURL)
    }
})

const upload = multer({ storage, fileFilter })
const imageDir = config.IMAGEURL
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
    if (request.user && request.user.admin) {
        const tests = await Test.find({}).populate({
            path: 'bacteriaSpecificImages.bacterium',
            model: 'Bacterium'
        })
        response.json(tests.map(test => test.toJSON()))
    } else if (request.user) {
        let tests = await Test.find({}).populate({
            path: 'bacteriaSpecificImages.bacterium',
            model: 'Bacterium'
        })
        tests = tests.map(test => test.toJSON()).map(test => { return { name: test.name, id: test.id, type: test.type, controlImage: test.controlImage } })
        response.json(tests)
    } else {
        throw Error('JsonWebTokenError')
    }
})

testRouter.post('/', upload.fields([{ name: 'controlImage', maxCount: 1 }, { name: 'positiveResultImage', maxCount: 1 }, { name: 'negativeResultImage', maxCount: 1 }, { name: 'bacteriaSpecificImages', maxCount: 100 }]), async (request, response) => {
    if (request.user && request.user.admin) {
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
                        const bacterium = await Bacterium.findOne({ name: file.originalname })
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
    if (request.user && request.user.admin) {
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
                bacteriaSpecificImages: testToEdit.bacteriaSpecificImages,
            }
            const deletePhotos = { ctrl: request.body.deleteCtrl, pos: request.body.deletePos, neg: request.body.deleteNeg }
            const oldLinks = []

            if (request.files) {
                if (request.files.controlImage) {
                    oldLinks.push(testToEdit.controlImage.url)
                    // fs.unlink(`${imageDir}/${testToEdit.controlImage.url}`, (err) => err)
                    testToUpdate.controlImage = { url: request.files.controlImage[0].filename, contentType: request.files.controlImage[0].mimetype }
                }
                if (request.files.positiveResultImage) {
                    oldLinks.push(testToEdit.positiveResultImage.url)
                    // fs.unlink(`${imageDir}/${testToEdit.positiveResultImage.url}`, (err) => err)
                    testToUpdate.positiveResultImage = { url: request.files.positiveResultImage[0].filename, contentType: request.files.positiveResultImage[0].mimetype }
                }
                if (request.files.negativeResultImage) {
                    oldLinks.push(testToEdit.negativeResultImage.url)
                    //fs.unlink(`${imageDir}/${testToEdit.negativeResultImage.url}`, (err) => err)
                    testToUpdate.negativeResultImage = { url: request.files.negativeResultImage[0].filename, contentType: request.files.negativeResultImage[0].mimetype }
                }
                if (request.files.bacteriaSpecificImages) {
                    for (let i = 0; i < request.files.bacteriaSpecificImages.length; i++) {
                        const file = request.files.bacteriaSpecificImages[i]
                        const bacterium = await Bacterium.findOne({ name: file.originalname })
                        if (!bacterium) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Kuvaan liittyvää bakteeria ei löydy tietokannasta.' })
                        }
                        const imageToDelete = testToUpdate.bacteriaSpecificImages.filter(image => image.bacterium.name === bacterium.name)
                        if (imageToDelete.length > 0) {
                            oldLinks.push(imageToDelete[0].url)
                            //fs.unlink(`${imageDir}/${imageToDelete[0].url}`, (err) => err)
                            testToUpdate.bacteriaSpecificImages = testToUpdate.bacteriaSpecificImages.map(image => image.bacterium.name === bacterium.name ? { url: file.filename, contentType: file.mimetype, bacterium } : image)
                        } else {
                            testToUpdate.bacteriaSpecificImages.push({ url: file.filename, contentType: file.mimetype, bacterium })
                        }
                    }
                }
            }
            if (deletePhotos.ctrl === 'true') {
                oldLinks.push(testToEdit.controlImage.url)
                testToUpdate.controlImage = null
            }
            if (deletePhotos.pos === 'true') {
                oldLinks.push(testToEdit.positiveResultImage.url)
                testToUpdate.positiveResultImage = null
            }
            if (deletePhotos.neg === 'true') {
                oldLinks.push(testToEdit.negativeResultImage.url)
                testToUpdate.negativeResultImage = null
            }
            const updatetTest = await Test.findByIdAndUpdate(request.params.id, testToUpdate, { new: true, runValidators: true, context: 'query' })
            for (let i = 0; i < oldLinks.length; i++) {
                fs.unlink(`${imageDir}/${oldLinks[i]}`, (err) => err)
            }
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
    if (request.user && request.user.admin) {
        try {
            const testToDelete = await Test.findById(request.params.id).populate({
                path: 'bacteriaSpecificImages.bacterium',
                model: 'Bacterium'
            })

            const cases = await Case.find({}).populate({
                path: 'testGroups.tests.test',
                model: 'Test',
                populate: {
                    path: 'bacteriaSpecificImages.bacterium',
                    model: 'Bacterium'
                }
            }).populate({
                path:'hints.test',
                model: 'Test'
            })
            let testIsInUse = false
            cases.forEach(element => {
                for (let i = 0; i < element.testGroups.length; i++) {
                    for (let j = 0; j < element.testGroups[i].length; j++) {
                        for (let k = 0; k < element.testGroups[i][j].tests.length; k++) {
                            if (element.testGroups[i][j].tests[k].test.name === testToDelete.name) {
                                testIsInUse = true
                            }
                        }
                    }
                }
            })
            cases.forEach(element => {
                for(let i = 0; i < element.hints.length; i++) {
                    if(element.hints[i].name === testToDelete.name) {
                        testIsInUse = true
                    }
                }
            })
            if (testIsInUse) {
                return response.status(400).json({ error: 'Testi on käytössä ainakin yhdessä tapauksessa, eikä sitä voida poistaa' })
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
