import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import Notification from '../utility/Notification.js'
import { updateUserinfo } from '../../reducers/usersReducer'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Username from './components/Username'
import Email from './components/Email'
import Studentnumber from './components/Studentnumber'
import Password from './components/Password'
import Classgroup from './components/Classgroup'
import { setNotification } from '../../reducers/notificationReducer'

const UserInfoForm = ({ user }) => {

    /* states */
    const library = useSelector(state => state.language)?.library?.frontend.user.userInfo
    const validation = useSelector(state => state.language)?.validation?.user
    const [username, setNewUsername] = useState(user.username)
    const [password, setNewPassword] = useState('')
    const [passwordAgain, setNewPasswordAgain] = useState('')
    const [email, setNewEmail] = useState(user.email)
    const [studentNumber, setNewStudentNumber] = useState(user.studentNumber)
    const [classGroup, setNewClassgroup] = useState(user.classGroup)
    const [confirmText, setConfirmText] = useState('')

    /* states end */

    /* modal */
    const [show, setShow] = useState(false)
    const handleShow = () => {
        resetFields()
        setShow(true)
    }
    const handleClose = () => {
        resetFields()
        setShow(false)
    }
    /* modal end */

    const dispatch = useDispatch()


    /* form control */
    const saveUpdatedUserinfo = (props) => {
        const token = user.token
        const oldPassword = props
        if(password === '' && passwordAgain === '') {
            try {
                dispatch(updateUserinfo(username, email, studentNumber, classGroup, oldPassword, '',
                    token, handleClose
                ))
            } catch(e) {
                return e
            }
        }
        if (password === passwordAgain) {
            try {
                dispatch(updateUserinfo(username,
                    email, studentNumber, classGroup, oldPassword, password,
                    token, handleClose
                ))
            } catch (e) {
                return e
            }
        }
    }

    const resetFields = () => {
        setNewUsername(user.username)
        setNewEmail(user.email)
        setNewStudentNumber(user.studentNumber)
        setNewClassgroup(user.classGroup)
        setNewPassword('')
        setNewPasswordAgain('')
    }


    /* schema for validation */
    const UserinfoSchema = Yup.object().shape({
        username: Yup.string()
            .min(validation.username.minlength, validation.username.minMessage)
            .max(validation.username.maxlength, validation.username.maxMessage)
            .required(validation.username.requiredMessage),
        password: Yup.string()
            .min(validation.password.minlength, validation.password.minMessage)
            .max(validation.password.maxlength, validation.password.maxMessage),
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
    /* schema for validation end */

    const onSuccess = (props) => {
        if (password === passwordAgain) {
            confirmChanges(props)
        } else {
            dispatch(setNotification({ message: library.samePasswordAndSecondPassword, success: false }))
        }
    }

    const confirmChanges = (props) => {
        const oldPassword = props
        try {
            saveUpdatedUserinfo(oldPassword)
        } catch (e) {
            return e
        }
    }

    return (
        <div>
            <Modal>
                <Notification></Notification>
            </Modal>
            <Button
                id={'infoEditButton'}
                variant='primary'
                onClick={() => handleShow()}>
                {library.editInformation}
            </Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleClose} backdrop='static'>
                <Modal.Header closeButton>
                    {library.editInformation}
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={UserinfoSchema}
                        onSubmit={() => onSuccess(confirmText)}
                        initialValues={{
                            username: username,
                            email: email,
                            password: password,
                            passwordAgain: passwordAgain,
                            studentNumber: studentNumber,
                            classGroup: classGroup
                        }}
                    >
                        {({
                            handleSubmit,
                            errors,
                            setFieldValue,
                            touched,
                            handleBlur
                        }) => {
                            return (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    encType='multipart/form-data'>
                                    <Username nameControlId='username'
                                        username={username}
                                        onChange={setFieldValue}
                                        error={errors.username}
                                        touched={touched.username}
                                        onBlur={handleBlur}
                                        setUsername={setNewUsername}></Username>
                                    <Email typeControlId='email'
                                        email={email}
                                        onChange={setFieldValue}
                                        error={errors.email}
                                        touched={touched.email}
                                        onBlur={handleBlur}
                                        setEmail={setNewEmail}></Email>
                                    <Password typeControlId='password'
                                        password={password}
                                        label={library.password}
                                        onChange={setFieldValue}
                                        error={errors.password}
                                        touched={touched.password}
                                        onBlur={handleBlur}
                                        setPassword={setNewPassword}></Password>
                                    <Password typeControlId='passwordAgain'
                                        password={passwordAgain}
                                        label={library.passwordAgain}
                                        onChange={setFieldValue}
                                        error={errors.password}
                                        touched={touched.password}
                                        onBlur={handleBlur}
                                        setPassword={setNewPasswordAgain}></Password>
                                    <Studentnumber typeControlId='studentnumber'
                                        studentnumber={studentNumber}
                                        onChange={setFieldValue}
                                        error={errors.studentNumber}
                                        touched={touched.studentNumber}
                                        onBlur={handleBlur}
                                        setStudentnumber={setNewStudentNumber}></Studentnumber>
                                    <Classgroup typeControlId='classgroup'
                                        classgroup={classGroup}
                                        onChange={setFieldValue}
                                        error={errors.classGroup}
                                        touched={touched.classGroup}
                                        onBlur={handleBlur}
                                        setClassgroup={setNewClassgroup}></Classgroup>
                                    <div>
                                        <br></br>
                                        <Form.Label>{library.warning}</Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="confirmField"
                                            onChange={(event) => setConfirmText(event.target.value)}
                                        />

                                        <Button id="updateUserInfo" variant='success' type="submit">
                                            {library.executeButton}
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserInfoForm
