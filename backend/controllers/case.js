const caseRouter = require('express').Router()
const Case = require('../models/case')
const Bacterium = require('../models/bacterium')
const Test = require('../models/testCase')
const isComplete = (caseToCheck) => {
    if (caseToCheck.bacterium && caseToCheck.anamnesis && caseToCheck.completionImage && caseToCheck.samples && caseToCheck.testGroups) {
        return true
    }
    return false
}
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
    if (request.files && request.files.completionImage) {
        fs.unlink(`${imageDir}/${request.files.completionImage[0].filename}`, (err) => err)
    }
}

caseRouter.get('/', async (request, response) => {
    if (request.user && request.user.admin) {
        const cases = await Case.find({}).populate('bacterium', { name: 1 }).populate({
            path: 'testGroups.test',
            model: 'Test',
            populate: {
                path: 'bacteriaSpecificImages.bacterium',
                model: 'Bacterium'
            }
        })
        response.json(cases.map(caseToMap => caseToMap.toJSON()))
    } else if (request.user) {
        const cases = await Case.find({})
        response.json(cases.map(caseToMap => caseToMap.toJSON()).filter(caseToFilter => caseToFilter.complete).map(caseToMap => { return { name: caseToMap.name, id: caseToMap.id } }))
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.post('/', upload.fields([{ name: 'completionImage', maxCount: 1 }]), async (request, response) => {
    if (request.user && request.user.admin) {
        try {
            const newCase = new Case({
                name: request.body.name,
            })
            if (request.body.bacterium) {
                let bacterium
                try {
                    bacterium = await Bacterium.findById(request.body.bacterium)
                } catch (e) {
                    deleteUploadedImages(request)
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                if (!bacterium) {
                    deleteUploadedImages(request)
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                newCase.bacterium = bacterium
            }
            if (request.body.anamnesis) {
                newCase.anamnesis = request.body.anamnesis
            }
            if (request.files && request.files.completionImage) {
                newCase.completionImage = { url: request.files.completionImage[0].filename, contentType: request.files.completionImage[0].mimetype }
            }
            if (request.body.samples) {
                newCase.samples = JSON.parse(request.body.samples)
                let descList = newCase.samples.map(sample => sample.description)
                let checkedDescList = []
                for (let i = 0; i < descList.length; i++) {
                    if (checkedDescList.includes(descList[i])) {
                        deleteUploadedImages(request)
                        return response.status(400).json({ error: `Näytettä ${descList[i]} yritetään käyttää tapauksessa useampaan kertaan` })
                    } else {
                        checkedDescList.push(descList[i])
                    }
                }
            }
            if (request.body.testGroups) {
                request.body.testGroups = JSON.parse(request.body.testGroups)
                let addedTestIds = []
                const testGroups = []
                for (let i = 0; i < request.body.testGroups.length; i++) {
                    const newTestGroup = []
                    for (let k = 0; k < request.body.testGroups[i].length; k++) {
                        const test = request.body.testGroups[i][k]
                        let testFromDb
                        try {
                            testFromDb = await Test.findById(test.testId)
                        } catch (e) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        if (!testFromDb) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        const testToAdd = {
                            test: testFromDb,
                            isRequired: test.isRequired,
                            positive: test.positive,
                            alternativeTests: test.alternativeTests
                        }
                        if (testToAdd.test) {
                            if (addedTestIds.includes(testToAdd.test.id)) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: `Testiä ${testToAdd.test.name} yritetään käyttää tapauksessa useampaan kertaan` })
                            }
                            newTestGroup.push(testToAdd)
                            addedTestIds.push(testToAdd.test.id)
                        }
                    }
                    testGroups.push(newTestGroup)
                }
                newCase.testGroups = testGroups
            } else {
                newCase.testGroups = null
            }

            newCase.complete = isComplete(newCase)
            const savedCase = await newCase.save()
            return response.status(201).json(savedCase)
        } catch (error) {
            deleteUploadedImages(request)
            return response.status(400).json({ error: error.message })
        }
    } else {
        deleteUploadedImages(request)
        throw Error('JsonWebTokenError')
    }
})

caseRouter.delete('/:id', async (request, response) => {
    if (request.user && request.user.admin) {
        try {
            const caseToDelete = await Case.findById(request.params.id)
            fs.unlink(`${imageDir}/${caseToDelete.completionImage.url}`, (err) => err)
            await Case.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.put('/:id', upload.fields([{ name: 'completionImage', maxCount: 1 }]), async (request, response) => {
    if (request.user && request.user.admin) {
        const oldLinks = []
        const deleteEndImage = request.body.deleteEndImage
        try {
            const caseToUpdate = await Case.findById(request.params.id)
            if (!caseToUpdate) {
                deleteUploadedImages(request)
                return response.status(400).json({ error: 'Annettua tapausta ei löydy tietokannasta.' })
            }
            let changes = {
                name: request.body.name
            }
            if (request.body.bacterium) {
                let bacterium
                try {
                    bacterium = await Bacterium.findById(request.body.bacterium)
                } catch (e) {
                    deleteUploadedImages(request)
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                if (!bacterium) {
                    deleteUploadedImages(request)
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                changes.bacterium = bacterium
            }
            if (request.body.anamnesis) {
                changes.anamnesis = request.body.anamnesis
            }
            if (request.files && request.files.completionImage) {
                oldLinks.push(caseToUpdate.completionImage.url)
                //fs.unlink(`${imageDir}/${caseToUpdate.completionImage.url}`, (err) => err)
                changes.completionImage = { url: request.files.completionImage[0].filename, contentType: request.files.completionImage[0].mimetype }
            }
            if (request.body.samples) {
                changes.samples = JSON.parse(request.body.samples)
                let descList = changes.samples.map(sample => sample.description)
                let checkedDescList = []
                for (let i = 0; i < descList.length; i++) {
                    if (checkedDescList.includes(descList[i])) {
                        deleteUploadedImages(request)
                        return response.status(400).json({ error: `Näytettä ${descList[i]} yritetään käyttää tapauksessa useampaan kertaan` })
                    } else {
                        checkedDescList.push(descList[i])
                    }
                }
            }
            if (request.body.testGroups) {
                request.body.testGroups = JSON.parse(request.body.testGroups)
                let addedTestIds = []
                const testGroups = []
                for (let i = 0; i < request.body.testGroups.length; i++) {
                    const newTestGroup = []
                    for (let k = 0; k < request.body.testGroups[i].length; k++) {
                        let testId
                        request.body.testGroups[i][k].testId ?
                            testId = request.body.testGroups[i][k].testId :
                            testId = request.body.testGroups[i][k].test.id
                        let testFromDb
                        try {
                            testFromDb = await Test.findById(testId)
                        } catch (e) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        if (!testFromDb) {
                            deleteUploadedImages(request)
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        const testToAdd = {
                            test: testFromDb,
                            isRequired: request.body.testGroups[i][k].isRequired,
                            positive: request.body.testGroups[i][k].positive,
                            alternativeTests: request.body.testGroups[i][k].alternativeTests
                        }
                        if (testToAdd.test) {
                            if (addedTestIds.includes(testToAdd.test.id)) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: `Testiä ${testToAdd.test.name} yritetään käyttää tapauksessa useampaan kertaan` })
                            }
                            newTestGroup.push(testToAdd)
                            addedTestIds.push(testToAdd.test.id)
                        }
                    }
                    testGroups.push(newTestGroup)
                }
                changes.testGroups = testGroups
            }
            if (deleteEndImage === 'true') {
                oldLinks.push(caseToUpdate.completionImage.url)
                changes.controlImage = null
            }
            changes.complete = isComplete(changes)
            const updatedCase = await Case.findByIdAndUpdate(request.params.id, changes, { new: true, runValidators: true, context: 'query' })
            var i
            for (i = 0; i < oldLinks.length; i++) {
                fs.unlink(`${imageDir}/${oldLinks[i]}`, (err) => err)
            }
            return response.status(200).json(updatedCase)
        } catch (error) {
            deleteUploadedImages(request)
            return response.status(400).json({ error: error.message })
        }
    } else {
        deleteUploadedImages(request)
        throw Error('JsonWebTokenError')
    }
})

caseRouter.get('/:id', async (request, response) => {
    if (request.user) {
        try {
            let caseToGet = await Case.findById(request.params.id)
            caseToGet = caseToGet.toJSON()
            caseToGet.samples = caseToGet.samples.map(sample => { return { description: sample.description } })
            delete caseToGet.bacterium
            delete caseToGet.complete
            delete caseToGet.testGroups
            delete caseToGet.completionImage
            response.json(caseToGet)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.post('/:id/checkSamples', async (request, response) => {
    if (request.user) {
        try {
            const caseToCheck = await Case.findById(request.params.id)
            let isRight = true
            let correctSamples = caseToCheck.samples.filter(sample => sample.rightAnswer).map(sample => sample.description)
            if (request.body.samples && correctSamples.length === request.body.samples.length) {
                correctSamples.forEach(sample => {
                    if (!request.body.samples.includes(sample)) {
                        isRight = false
                    }
                })
            } else {
                isRight = false
            }
            if (isRight) {
                return response.status(200).json({ correct: true })
            } else {
                return response.status(200).json({ correct: false })
            }
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.post('/:id/checkTests', async (request, response) => {
    if (request.user) {
        try {
            const caseToCheck = await Case.findById(request.params.id).populate({
                path: 'testGroups.test',
                model: 'Test',
                populate: {
                    path: 'bacteriaSpecificImages.bacterium',
                    model: 'Bacterium'
                }
            })
            const testGroups = caseToCheck.testGroups
            const testsToCheck = request.body.tests
            let extraTests = []
            let currentRequiredTests = []
            let groupIndex = 0

            if (testsToCheck.length === 0) {
                return response.status(400).json({ error: 'Testin lähettämisessä tapahtui virhe.' })
            }

            for (let i = 0; i < testsToCheck.length; i++) {
                if (currentRequiredTests.length === 0 && testGroups.length > groupIndex) {
                    extraTests = [...extraTests, ...testGroups[groupIndex].filter(test => !test.isRequired)]
                    currentRequiredTests = testGroups[groupIndex].filter(test => test.isRequired)
                    groupIndex = groupIndex + 1
                }
                const testToCheck = testsToCheck[i]
                if (currentRequiredTests.map(testForCase => testForCase.test.id).includes(testToCheck)) {
                    currentRequiredTests = currentRequiredTests.filter(testForCase => testForCase.test.id !== testToCheck)
                } else if (extraTests.map(testForCase => testForCase.test.id).includes(testToCheck)) {
                    extraTests = extraTests.filter(testForCase => testForCase.test.id !== testToCheck)
                } else {
                    return response.status(200).json({ correct: false })
                }
            }
            let latestTestId = testsToCheck[testsToCheck.length - 1]
            let latestTestForCase
            for (let i = 0; i < testGroups.length; i++) {
                const searchTestForCase = testGroups[i].filter(testForCase => testForCase.test.id === latestTestId)
                if (searchTestForCase.length === 1) {
                    latestTestForCase = searchTestForCase[0]
                    break
                }
            }

            let requiredDone = false
            let allDone = false

            if (groupIndex === testGroups.length && currentRequiredTests.length === 0) {
                requiredDone = true
            }

            if (requiredDone && extraTests.length === 0) {
                allDone = true
            }

            let imageUrl
            if (latestTestForCase.positive) {
                const bacteriaSpecificImages = latestTestForCase.test.bacteriaSpecificImages.filter(bacteriaImage => bacteriaImage.bacterium.name === caseToCheck.bacterium.name)
                if (bacteriaSpecificImages.length > 0) {
                    imageUrl = bacteriaSpecificImages[0].url
                } else {
                    imageUrl = latestTestForCase.test.positiveResultImage.url
                }
            } else {
                imageUrl = latestTestForCase.test.negativeResultImage.url
            }
            return response.status(200).json({ correct: true, imageUrl, testName: latestTestForCase.test.name, allDone, requiredDone })

        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.post('/:id/checkBacterium', async (request, response) => {
    if (request.user) {
        try {
            const caseToCheck = await Case.findById(request.params.id).populate('bacterium', { name: 1 })
            if (caseToCheck.bacterium.name.toLowerCase() === request.body.bacteriumName.toLowerCase()) {
                return response.status(200).json({ correct: true, completionImageUrl: caseToCheck.completionImage.url })
            } else {
                return response.status(200).json({ correct: false })
            }
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = caseRouter