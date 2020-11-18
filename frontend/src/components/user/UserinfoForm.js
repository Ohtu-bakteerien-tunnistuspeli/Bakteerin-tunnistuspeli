import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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

const UserInfoForm = ( { user } ) => {

    /* states */

    const [username, setNewUsername] = useState(user.username)
    const [password, setNewPassword] = useState('*********')
    const [passwordAgain, setNewPasswordAgain] = useState('*********')
    const [email, setNewEmail] = useState(user.email)
    const [studentNumber, setNewStudentNumber] = useState(user.studentNumber)
    const [classGroup, setNewClassgroup] = useState(user.classGroup)

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
    const saveUpdatedUserinfo = () => {
        const token = user.token

        if(password === passwordAgain) {
            dispatch(updateUserinfo(username,
                email, password, studentNumber,
                classGroup, token
            ))
        }
    }

    const resetFields = () =>  {
        setNewUsername(user.username)
        setNewEmail(user.email)
        setNewStudentNumber(user.studentNumber)
        setNewClassgroup(user.classGroup)
        setNewPassword('*********')
        setNewPasswordAgain('*********')
    }


    /* schema for validation */
    const UserinfoSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, 'Käyttäjäimen tulee olla vähintään 2 merkkiä pitkä.')
            .max(100, 'Käyttäjänimen tulee olla enintään 100 merkkiä pitkä.'),
        password: Yup.string()
            .min(3, 'Salasanan tulee olla vähintään 2 merkkiä pitkä.')
            .max(100, 'Salasanan tulee olla enintään 100 merkkiä pitkä.'),
        passwordAgain: Yup.string(),
    })
    /* schema for validation end */

    const onSuccess = () => {
        saveUpdatedUserinfo()
        handleClose()
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
                    Muokkaa käyttäjätietoja
            </Button>
            <Modal show={show} size='xl' scrollable='true' onHide={handleClose} backdrop='static'>
                <Modal.Header closeButton>
                    Muokkaa käyttäjätietoja
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={UserinfoSchema}
                        onSubmit={onSuccess}
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
                                        label={'Salasana'}
                                        onChange={setFieldValue}
                                        error={errors.password}
                                        touched={touched.password}
                                        onBlur={handleBlur}
                                        setPassword={setNewPassword}></Password>
                                    <Password typeControlId='password'
                                        password={passwordAgain}
                                        label={'Salasana uudelleen'}
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
                                    <Button id={'updateUserinfo'} variant='success' type='submit'>Päivitä Tiedot</Button>
                                </Form>
                            )}}
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UserInfoForm
