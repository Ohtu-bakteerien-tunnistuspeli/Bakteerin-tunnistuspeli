const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const Bacterium = require('../models/bacterium')
const User = require('../models/user')
const Test = require('../models/testCase')
const Case = require('../models/case')

const initialTests = [
    {
        name: 'test0',
        type: 'Viljely'
    },
    {
        name: 'test1',
        type: 'Viljely'
    },
    {
        name: 'test2',
        type: 'Viljely'
    },
    {
        name: 'test3',
        type: 'Värjäys'
    },
    {
        name: 'test4',
        type: 'Testi'
    },
    {
        name: 'test5',
        type: 'Testi'
    },
    {
        name: 'test6',
        type: 'Viljely'
    },
    {
        name: 'test7',
        type: 'Viljely'
    },
    {
        name: 'test8',
        type: 'Testi'
    },
    {
        name: 'test9',
        type: 'Viljely'
    },
    {
        name: 'test10',
        type: 'Värjäys'
    },
    {
        name: 'test11',
        type: 'Muu'
    },
]

const initialBacteriumForCase = new Bacterium({
    name: 'testBacterium'
})

const initialSamples = [
    {
        description: 'Sample1',
        rightAnswer: true
    },
    {
        description: 'Sample2',
        rightAnswer: false
    }
]

let adminUserToken // For easy access to token
let testMap = {} // For easy access to IDs
let addedCaseId // For easy access to case information
let addedTests

beforeEach(async () => {
    // Clean db
    await Bacterium.deleteMany({})
    await User.deleteMany({})
    await Test.deleteMany({})
    await Case.deleteMany({})
    // Create admin
    const adminPassword = await bcrypt.hash('admin', 10)
    const admin = new User({ username: 'adminNew', passwordHash: adminPassword, admin: true, email: 'example@com' })
    await admin.save()
    // Get admin token
    const loginRes = await api
        .post('/api/user/login')
        .send({
            username: 'adminNew',
            password: 'admin'
        })
    adminUserToken = loginRes.body.token
    // Add all tests
    addedTests = initialTests.map(test => new Test(test))
    for (let i = 0; i < addedTests.length; i++) {
        addedTests[i].save()
    }
    await Promise.all(addedTests)
    // Create name -> id map of tests
    testMap = {}
    const testsInDB = await api
        .get('/api/test')
        .set('Authorization', `bearer ${adminUserToken}`)
    for (let i = 0; i < testsInDB.body.length; i++) {
        testMap[testsInDB.body[i].name] = testsInDB.body[i].id
    }
    // Add initial bacterium
    const initialBacterium = await new Bacterium(initialBacteriumForCase).save()
    // Add initial case
    const caseToAdd = new Case({
        name: 'Test case',
        anamnesis: 'Test case',
        bacterium: initialBacterium,
        samples: initialSamples,
        testGroups:
            [
                [ // Group 1
                    {
                        tests: [
                            { test: addedTests[0], positive: true },
                            { test: addedTests[1], positive: false }
                        ],
                        isRequired: true
                    },
                    {
                        tests: [
                            { test: addedTests[2], positive: true }
                        ],
                        isRequired: false
                    }
                ],
                [ // Group 2
                    {
                        tests: [
                            { test: addedTests[3], positive: true }
                        ],
                        isRequired: true
                    },
                    {
                        tests: [
                            { test: addedTests[4], positive: false }
                        ],
                        isRequired: false
                    }
                ],
                [ // Group 3
                    {
                        tests: [
                            { test: addedTests[5], positive: true },
                            { test: addedTests[6], positive: true }
                        ],
                        isRequired: true
                    },
                    {
                        tests: [
                            { test: addedTests[7], positive: true },
                            { test: addedTests[8], positive: false }
                        ],
                        isRequired: true
                    }
                ],
                [ // Group 4
                    {
                        tests: [
                            { test: addedTests[9], positive: true }
                        ],
                        isRequired: true
                    }
                ]
            ]
    })
    addedCaseId = await caseToAdd.save()
    addedCaseId = addedCaseId._id
})

describe('it is possible to do tests', () => {
    test('correct first required test can be done', async () => {
        const data = [
            testMap['test0']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
    })

    test('correct first extra test can be done', async () => {
        const data = [
            testMap['test2']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
    })

    test('required tests cannot be done too early', async () => {
        const data = [
            testMap['test3']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(false)
    })

    test('extra tests cannot be done too early', async () => {
        const data = [
            testMap['test4']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(false)
    })

    test('incorrect tests cannot be done', async () => {
        const data = [
            testMap['test11']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(false)
    })
})

describe('it is possible to do multiple tests', () => {
    test('user can do tests from second group after completing all required tests from the first one', async () => {
        const data = [
            testMap['test0'],
            testMap['test3']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
    })

    test('alternative required test can be done as extra', async () => {
        const data = [
            testMap['test0'],
            testMap['test1']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
    })

    test('only required tests are required for completion', async () => {
        const data = [
            testMap['test0'],
            testMap['test3'],
            testMap['test5'],
            testMap['test7'],
            testMap['test9']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
        expect(res.body.requiredDone).toEqual(true)
    })

    test('allDone is false if not all tests are done', async () => {
        const data = [
            testMap['test0'],
            testMap['test3'],
            testMap['test5'],
            testMap['test7'],
            testMap['test9']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
        expect(res.body.allDone).toEqual(false)
    })

    test('allDone is true if all tests are done', async () => {
        const data = [
            testMap['test0'],
            testMap['test1'],
            testMap['test2'],
            testMap['test3'],
            testMap['test4'],
            testMap['test5'],
            testMap['test6'],
            testMap['test7'],
            testMap['test8'],
            testMap['test9']
        ]
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(200)
        expect(res.body.correct).toEqual(true)
        expect(res.body.requiredDone).toEqual(true)
        expect(res.body.allDone).toEqual(true)
    })
})

describe('correct errors are given', () => {
    test('when empty list is posted', async () => {
        const data = []
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .send({ tests: data })
            .expect(400)
        expect(res.body.error).toContain('Testin lähettämisessä tapahtui virhe.')
    })

    test('when no list is posted', async () => {
        const res = await api
            .post(`/api/case/${addedCaseId}/checkTests`)
            .set('Authorization', `bearer ${adminUserToken}`)
            .expect(400)
        expect(res.body.error).toContain('Testin lähettämisessä tapahtui virhe.')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongoose.disconnect()
})