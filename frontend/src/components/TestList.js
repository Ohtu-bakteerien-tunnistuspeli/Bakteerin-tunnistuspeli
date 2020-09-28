import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TestForm from './TestForm'
import TestListing from './TestListing'
import { deleteTest, updateTest } from '../reducers/testReducer'

const TestList = () => {
    const style = {margin: '10px', fontSize: '40px'}
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deleteTests = test => {
        dispatch(deleteTest(test, user.token))
    }
    const updateTests = (id, name, type, contImg, photoPos, photoNeg, bacteriaSpecificImg,  token) => {
        dispatch(updateTest(id, name, type, contImg, photoPos, photoNeg, bacteriaSpecificImg, user.token))
    }

    return (
        <div>
            <h2 style={style}>Testit</h2>
            {user?.admin ?
                <TestForm></TestForm>
                :
                <></>
            } 
            {tests ?
                <ul>
                    {tests.map(test =>
                        <TestListing key={test.id} test={test} deleteTest={deleteTests} updateTest={updateTests} isAdmin={user?.admin}></TestListing>
                    )}
                </ul>
                :
                <div>Ei testejä</div>
                }
        </div>
    )
}

export default TestList