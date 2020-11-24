import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { Form, Button, Modal, InputGroup } from 'react-bootstrap'
import { setNotification } from '../../reducers/notificationReducer'
import PasswordQualityIndicator from './components/PasswordQualityIndicator'
import Password from './components/Password'
import GDBRText from './GDPRText'
import PrivacyText from './PrivacyText'
import * as Yup from 'yup'
import { Formik } from 'formik'

const Register = () => {
    const validation = useSelector(state => state.language)?.validation?.user
    const library = useSelector(state => state.language)?.library?.frontend.user.register
    const dispatch = useDispatch()
    const history = useHistory()
    const [accept, setAccept] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const checkPassWord = require('zxcvbn') // eslint-disable-line

    const UserSchema = Yup.object().shape({
        username: Yup.string()
            .required(validation.username.requiredMessage)
            .min(validation.username.minlength, validation.username.minMessage)
            .max(validation.username.maxlength, validation.username.maxMessage),
        password: Yup.string()
            .required(validation.password.requiredMessage)
            .min(validation.password.minlength, validation.password.minMessage)
            .max(validation.password.maxlength, validation.password.maxMessage)
            .test('secure', validation.password.unsecurePasswordMessage, (password) => {
                if (password) {
                    if (checkPassWord(password).score < 2) {
                        return false
                    }
                }
                return true
            })
            .when('username',{
                is: true,
                then: Yup.string().notOneOf([Yup.ref('username'), null], validation.password.uniqueMessage),
                otherwise: Yup.string().required(validation.password.requiredMessage)
            })
            .when('email',{
                is: true,
                then: Yup.string().notOneOf([Yup.ref('email'), null], validation.password.uniqueMessage),
                otherwise: Yup.string().required(validation.password.requiredMessage)
            })
            .when('classGroup',{
                is: true,
                then: Yup.string().notOneOf([Yup.ref('classGroup'), null], validation.password.uniqueMessage),
                otherwise: Yup.string().required(validation.password.requiredMessage)
            })
            .when('studentNumber',{
                is: true,
                then: Yup.string().notOneOf([Yup.ref('studentNumber'), null], validation.password.uniqueMessage),
                otherwise: Yup.string().required(validation.password.requiredMessage)
            })
        ,
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
        const password = values.password.trim()
        console.log(password)
        const passwordAgain = values.passwordAgain
        if (accept) {
            if (password === passwordAgain) {
                dispatch(register(username, email, studentNumber, classGroup, password, history))
            } else {
                dispatch(setNotification({ message: library.samePasswordAndSecondPassword, success: false }))
            }
        } else {
            dispatch(setNotification({ message: library.gdbr, success: false }))
        }
    }

    return (
        <div >
            <h2>{library.title}</h2>
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
                                <Form.Label className="required-field">{library.username}</Form.Label>
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
                                <Form.Label className="required-field">{library.email}</Form.Label>
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
                                <Form.Label>{library.studentNumber}</Form.Label>
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
                                <Form.Label>{library.classGroup}</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>C-</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        className="choose-class-field"
                                        type='number'
                                        id='classGroup'
                                        name='classGroup'
                                        isInvalid={errors.classGroup && touched.classGroup}
                                        onChange={(event) => setFieldValue('classGroup', 'C-' + event.target.value)}
                                        onBlur={handleBlur}
                                    />
                                </InputGroup>
                                <Form.Control.Feedback type='invalid' hidden={!touched.classGroup}>
                                    {errors.classGroup}
                                </Form.Control.Feedback>
                                <Password password={values.password}
                                    label={library.password}
                                    onChange={setFieldValue}
                                    error={errors.password}
                                    touched={touched}
                                    handleBlur={handleBlur}
                                    values={values}
                                    instruction={validation.password.instruction}
                                ></Password>
                                <PasswordQualityIndicator
                                    value={checkPassWord(values.password).score}
                                    show={values.password.length > 0}
                                    messages={validation.password}
                                ></PasswordQualityIndicator>
                                <Form.Label className="required-field">{library.passwordAgain}</Form.Label>
                                <Form.Control
                                    type='password'
                                    id='passwordAgain'
                                    isInvalid={errors.passwordAgain && touched.passwordAgain}
                                    onChange={(event) => setFieldValue('passwordAgain', event.target.value)}
                                    onBlur={handleBlur}
                                />
                                <div className='form-group form-inline'>
                    <Form.Label className="required-field">{library.readTermsStart}&nbsp;{<a href='#' onClick={() => setShowModal(true)}>{library.terms}</a>//eslint-disable-line
                                    }&nbsp;{library.and}&nbsp;{<a href='#' onClick={() => setShowModal2(true)}>{library.privacy}</a> //eslint-disable-line
                                    }&nbsp;
                                    </Form.Label>
                                    <Form.Check type='checkbox' label='' id='acceptCheckBox' value={accept} onChange={() => setAccept(!accept)} />
                                </div>
                                <Button id='submit' variant='success' type='submit'>
                                    {library.button}
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
