import React from 'react'
import { useSelector } from 'react-redux'
import TestForm from './TestForm'
import TestListing from './TestListing'

const TestList = () => {

    const style = {margin: '10px', fontSize: '40px'}
    const tests = useSelector(state => state.test)?.sort((test1, test2) => test1.name.localeCompare(test2.name))
    const user = useSelector(state => state.user)

  return (
      <div>
        <h2 style={style}>Testit</h2>
           <p></p>
            {user?.admin ?
           <TestForm></TestForm>
                :
            <></>
            } 
            {tests ?
            <TestListing></TestListing>
                   :
            <div>Ei testejä</div>
            }
        </div>
   )
}

export default TestList