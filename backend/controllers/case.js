const caseRouter = require('express').Router()
const Case = require('../models/case')
const Bacterium = require('../models/bacterium')
const Test = require('../models/testCase')
const isComplete = (caseToCheck) => {
    if (caseToCheck.bacterium && caseToCheck.anamnesis && caseToCheck.completitionText && caseToCheck.samples && caseToCheck.testGroups) {
        return true
    }
    return false
}

caseRouter.get('/', async (request, response) => {
    if (request.user.admin) {
        const cases = await Case.find({}).populate('bacterium', { name: 1 }).populate({
            path: 'testGroups.test',
            model: 'Test',
            populate: {
                path: 'bacteriaSpecificImages.bacterium',
                model: 'Bacterium'
            }
        })
        response.json(cases.map(caseToMap => caseToMap.toJSON()))
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.post('/', async (request, response) => {
    if (request.user.admin) {
        try {
            const newCase = new Case({
                name: request.body.name,
            })
            if (request.body.bacterium) {
                let bacterium
                try {
                    bacterium = await Bacterium.findById(request.body.bacterium)
                } catch (e) {
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                if (!bacterium) {
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                newCase.bacterium = bacterium
            }
            if (request.body.anamnesis) {
                newCase.anamnesis = request.body.anamnesis
            }
            if (request.body.completitionText) {
                newCase.completitionText = request.body.completitionText
            }
            if (request.body.samples) {
                newCase.samples = request.body.samples
            }
            if (request.body.testGroups) {
                const testGroups = []
                for (let i = 0; i < request.body.testGroups.length; i++) {
                    const newTestGroup = []
                    for (let k = 0; k < request.body.testGroups[i].length; k++) {
                        const test = request.body.testGroups[i][k]
                        let testFromDb
                        try {
                            testFromDb = await Test.findById(test.testId)
                        } catch (e) {
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        if (!testFromDb) {
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        const testToAdd = {
                            test: testFromDb,
                            isRequired: test.isRequired,
                            positive: test.positive,
                            alternativeTests: test.alternativeTests
                        }
                        if (testToAdd.test) {
                            newTestGroup.push(testToAdd)
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
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.delete('/:id', async (request, response) => {
    if (request.user.admin) {
        try {
            await Case.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

caseRouter.put('/:id', async (request, response) => {
    if (request.user.admin) {
        try {
            let changes = {
                name: request.body.name
            }
            if (request.body.bacterium) {
                let bacterium
                try {
                    bacterium = await Bacterium.findById(request.body.bacterium)
                } catch (e) {
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                if (!bacterium) {
                    return response.status(400).json({ error: 'Annettua bakteeria ei löydy.' })
                }
                changes.bacterium = bacterium
            }
            if (request.body.anamnesis) {
                changes.anamnesis = request.body.anamnesis
            }
            if (request.body.completitionText) {
                changes.completitionText = request.body.completitionText
            }
            if (request.body.samples) {
                changes.samples = request.body.samples
            }
            if (request.body.testGroups) {
                const testGroups = []
                for (let i = 0; i < request.body.testGroups.length; i++) {
                    const newTestGroup = []
                    for (let k = 0; k < request.body.testGroups[i].length; k++) {
                        const test = request.body.testGroups[i][k]
                        let testFromDb
                        try {
                            testFromDb = await Test.findById(test.testId)
                        } catch (e) {
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        if (!testFromDb) {
                            return response.status(400).json({ error: 'Annettua testiä ei löydy.' })
                        }
                        const testToAdd = {
                            test: testFromDb,
                            isRequired: test.isRequired,
                            positive: test.positive,
                            alternativeTests: test.alternativeTests
                        }
                        if (testToAdd.test) {
                            newTestGroup.push(testToAdd)
                        }
                    }
                    testGroups.push(newTestGroup)
                }
                changes.testGroups = testGroups
            }
            changes.complete = isComplete(changes)
            const updatedCase = await Case.findByIdAndUpdate(request.params.id, changes, { new: true, runValidators: true, context: 'query' })
            if (!updatedCase) {
                return response.status(400).json({ error: 'Annettua tapausta ei löydy tietokannasta.' })
            }
            return response.status(200).json(updatedCase)
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    } else {
        throw Error('JsonWebTokenError')
    }
})

module.exports = caseRouter