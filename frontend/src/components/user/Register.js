import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { Form, Button, Modal } from 'react-bootstrap'
import { setNotification } from '../../reducers/notificationReducer'
import PasswordQualityIndicator from './components/PasswordQualityIndicator'
import GDBRText from './GDPRText'
import PrivacyText from './PrivacyText'
import * as Yup from 'yup'
import { Formik } from 'formik'

const Register = () => {
    const validation = useSelector(state => state.language)?.validation?.user
    const dispatch = useDispatch()
    const history = useHistory()
    const [accept, setAccept] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const checkPassWord = require('zxcvbn')

    if(!validation) {
        return<></>
    }
    const UserSchema = Yup.object().shape({
        username: Yup.string()
            .min(validation.username.minlength, validation.username.minMessage)
            .max(validation.username.maxlength, validation.username.maxMessage)
            .required(validation.username.requiredMessage),
        password: Yup.string()
            .min(validation.password.minlength, validation.password.minMessage)
            .max(validation.password.maxlength, validation.password.maxMessage)
            .required(validation.password.requiredMessage)
            .test('level0', validation.password.level0, (password) => {
                if(password){
                    if(checkPassWord(password).score === 0){
                        return false
                    }
                }
                return true
            })
            .test('level1', validation.password.level1, (password) => {
                if(password){
                    if(checkPassWord(password).score === 1){
                        return false
                    }
                }
                return true
            }),
        passwordAgain: Yup.string(),
        email: Yup.string()
            .required(validation.email.requiredMessage)
            .email(validation.email.validationMessage)
            .max(validation.email.maxlength, validation.email.maxMessage),
        classGroup: Yup.string()
            .test('unique', validation.classGroup.validationMessage, (classGroup) => {
                if (!classGroup) {
                    return true
                }
                return /C-+\d+/.test(classGroup)
            })
            .max(validation.classGroup.maxlength, validation.classGroup.maxMessage),
        studentNumber: Yup.string()
            .test('unique', validation.studentNumber.validationMessage, (studentNumber) => {
                if (!studentNumber) {
                    return true
                }
                return /^[0-9]+/.test(studentNumber)
            })
            .max(validation.studentNumber.maxlength, validation.studentNumber.maxMessage)
    })

    const handleRegister = async (values) => {
        const username = values.username
        const email = values.email
        const studentNumber = values.studentNumber
        const classGroup = values.classGroup
        const password = values.password
        const passwordAgain = values.passwordAgain
        if (accept) {
            if (password === passwordAgain) {
                dispatch(register(username, email, studentNumber, classGroup, password, history))
            } else {
                dispatch(setNotification({ message: 'Salasanojen tulee olla samat.', success: false }))
            }
        } else {
            dispatch(setNotification({ message: 'Käyttöehtojen hyväksyminen on pakollista.', success: false }))
        }
    }

    return (
        <div >
            <h2>Rekisteröidy Bakteeripeliin</h2>
            <Formik
                validationSchema={UserSchema}
                onSubmit={handleRegister}
                initialValues={{
                    username: '',
                    password: '',
                    passwordAgain: '',
                    email: '',
                    classGroup: 'C-',
                    studentNumber: ''
                }}
            >
                {({
                    handleSubmit,
                    errors,
                    setFieldValue,
                    touched,
                    handleBlur,
                    values
                }) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Käyttäjänimi:</Form.Label>
                                <Form.Control
                                    type='text'
                                    id='username'
                                    name='username'
                                    isInvalid={errors.username && touched.username}
                                    onChange={(event) => setFieldValue('username', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type='invalid' hidden={!touched.username}>
                                    {errors.username}
                                </Form.Control.Feedback>
                                <Form.Label>Sähköposti:</Form.Label>
                                <Form.Control
                                    type='text'
                                    id='email'
                                    name='email'
                                    isInvalid={errors.email && touched.email}
                                    onChange={(event) => setFieldValue('email', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type='invalid' hidden={!touched.email}>
                                    {errors.email}
                                </Form.Control.Feedback>
                                <Form.Label>Opiskelijanumero:</Form.Label>
                                <Form.Control
                                    type='text'
                                    id='studentNumber'
                                    name='studentNumber'
                                    isInvalid={errors.studentNumber && touched.studentNumber}
                                    onChange={(event) => setFieldValue('studentNumber', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type='invalid' hidden={!touched.studentNumber}>
                                    {errors.studentNumber}
                                </Form.Control.Feedback>
                                <Form.Label>Vuosikurssi:</Form.Label>
                                <Form.Control
                                    type='text'
                                    id='classGroup'
                                    name='classGroup'
                                    defaultValue='C-'
                                    isInvalid={errors.classGroup && touched.classGroup}
                                    onChange={(event) => setFieldValue('classGroup', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type='invalid' hidden={!touched.classGroup}>
                                    {errors.classGroup}
                                </Form.Control.Feedback>
                                <Form.Label>Salasana:</Form.Label>
                                <Form.Control
                                    type='password'
                                    id='password'
                                    isInvalid={errors.password && touched.password}
                                    onChange={(event) => setFieldValue('password', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <Form.Control.Feedback type='invalid' hidden={!touched.password}>
                                    {errors.password}
                                </Form.Control.Feedback>
                                <PasswordQualityIndicator
                                    value={checkPassWord(values.password).score}
                                    show={values.password.length>0}
                                    messages={validation.password}
                                ></PasswordQualityIndicator>
                                <Form.Label>Salasana toisen kerran:</Form.Label>
                                <Form.Control
                                    type='password'
                                    id='passwordAgain'
                                    isInvalid={errors.passwordAgain && touched.passwordAgain}
                                    onChange={(event) => setFieldValue('passwordAgain', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <div className='form-group form-inline'>
                                    <Form.Label>Olen lukenut ja hyväksyn&nbsp;{<a href='#' onClick={() => setShowModal(true)}>käyttöehdot</a>//eslint-disable-line
                                    }&nbsp;
                        ja&nbsp;{<a href='#' onClick={() => setShowModal2(true)}>tietosuojailmoituksen</a> //eslint-disable-line
                                    }:&nbsp;
                                    </Form.Label>
                                    <Form.Check type='checkbox' label='' id='acceptCheckBox' value={accept} onChange={() => setAccept(!accept)} />
                                </div>
                                <Button id='submit' variant='success' type='submit'>
                                    Rekisteröidy
                                </Button>
                            </Form.Group>
                        </Form>
                    )
                }}
            </Formik>
            <Modal show={showModal} size='lg' onHide={() => setShowModal(false)} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <GDBRText></GDBRText>
                </Modal.Body>
            </Modal>
            <Modal show={showModal2} size='lg' onHide={() => setShowModal2(false)} >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <PrivacyText></PrivacyText>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Register
