const caseRouter = require('express').Router()
const Case = require('../models/case')
const Bacterium = require('../models/bacterium')
const Test = require('../models/testCase')
const isComplete = (caseToCheck) => {
    if (caseToCheck.bacterium && caseToCheck.anamnesis && caseToCheck.completionImage && caseToCheck.completionImage.url && caseToCheck.samples && caseToCheck.testGroups) {
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
            path: 'testGroups.tests.test',
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
                    for (let j = 0; j < request.body.testGroups[i].length; j++) {
                        const testForCase = request.body.testGroups[i][j]
                        let testsFromDb = []
                        for (let k = 0; k < testForCase.tests.length; k++) {
                            let testForAlternativeTests = testForCase.tests[k]
                            let testFromDb
                            try {
                                testFromDb = await Test.findById(testForAlternativeTests.testId)
                            } catch (e) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                            }
                            if (!testFromDb) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                            } else {
                                if (addedTestIds.includes(testFromDb.id)) {
                                    deleteUploadedImages(request)
                                    return response.status(400).json({ error: `Testiä ${testFromDb.name} yritetään käyttää tapauksessa useampaan kertaan` })
                                }
                                addedTestIds.push(testFromDb.id)
                                testsFromDb.push({ test: testFromDb, positive: testForAlternativeTests.positive })
                            }
                        }
                        const testForCaseToAdd = {
                            tests: testsFromDb,
                            isRequired: testForCase.isRequired
                        }
                        newTestGroup.push(testForCaseToAdd)
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
                    for (let j = 0; j < request.body.testGroups[i].length; j++) {
                        const testForCase = request.body.testGroups[i][j]
                        let testsFromDb = []
                        for (let k = 0; k < testForCase.tests.length; k++) {
                            let testForAlternativeTests = testForCase.tests[k]
                            let testFromDb
                            try {
                                testFromDb = await Test.findById(testForAlternativeTests.testId)
                            } catch (e) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                            }
                            if (!testFromDb) {
                                deleteUploadedImages(request)
                                return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                            } else {
                                if (addedTestIds.includes(testFromDb.id)) {
                                    deleteUploadedImages(request)
                                    return response.status(400).json({ error: `Testiä ${testFromDb.name} yritetään käyttää tapauksessa useampaan kertaan` })
                                }
                                addedTestIds.push(testFromDb.id)
                                testsFromDb.push({ test: testFromDb, positive: testForAlternativeTests.positive })
                            }
                        }
                        const testForCaseToAdd = {
                            tests: testsFromDb,
                            isRequired: testForCase.isRequired
                        }
                        newTestGroup.push(testForCaseToAdd)
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
            let updatedCase = await Case.findByIdAndUpdate(request.params.id, changes, { new: true, runValidators: true, context: 'query' })
            let completeChange = { complete: isComplete(updatedCase) }
            updatedCase = await Case.findByIdAndUpdate(request.params.id, completeChange, { new: true, runValidators: true, context: 'query' })
            for (let i = 0; i < oldLinks.length; i++) {
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
                path: 'testGroups.tests.test',
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
            let latestTestForCase
            for (let i = 0; i < testsToCheck.length; i++) {
                if (currentRequiredTests.length === 0 && testGroups.length > groupIndex) {
                    const newGroups = testGroups[groupIndex]
                    const req = newGroups.filter(group => group.isRequired === true)
                    let extra = newGroups.filter(group => group.isRequired === false)
                    extra = extra.map(e => e.tests)
                    extra = [].concat.apply([], extra)
                    extraTests = [...extraTests, ...extra]
                    currentRequiredTests = [...currentRequiredTests, ...req.map(test => test.tests)]
                    groupIndex = groupIndex + 1
                }

                const testToCheck = testsToCheck[i]

                let requiredIndex = -1
                for (let j = 0; j < currentRequiredTests.length; j++) {
                    const currentGroup = currentRequiredTests[j]
                    if (currentGroup.map(t => t.test.id).includes(testToCheck)) {
                        requiredIndex = j
                        break
                    }
                }

                if (requiredIndex !== -1) {
                    const group = currentRequiredTests[requiredIndex]
                    latestTestForCase = group.filter(test => test.test.id === testToCheck)[0]
                    extraTests = [...extraTests, ...group.filter(test => test.test.id !== testToCheck)]
                    currentRequiredTests = currentRequiredTests.filter((test, ind) => ind !== requiredIndex)
                } else if (extraTests.map(testForCase => testForCase.test.id).includes(testToCheck)) {
                    latestTestForCase = extraTests.filter(testForCase => testForCase.test.id === testToCheck)[0]
                    extraTests = extraTests.filter(testForCase => testForCase.test.id !== testToCheck)
                } else {
                    return response.status(200).json({ correct: false })
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
