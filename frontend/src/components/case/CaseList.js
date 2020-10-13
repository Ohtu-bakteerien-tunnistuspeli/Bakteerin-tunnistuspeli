import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CaseListing from './CaseListing'
import CaseForm from './CaseForm'
import { deleteCase } from '../../reducers/caseReducer'

const CaseList = () => {
    const cases = useSelector(state => state.case)?.sort((case1, case2) => case1.name.localeCompare(case2.name))
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const delCase = caseToDelete => {
        dispatch(deleteCase(caseToDelete, user.token))
    }
    const style = { margin: '10px', fontSize: '40px' }
    return (
        <div>
            <h2 style={style}>Tapaukset</h2>
            {cases ?
                <ul>
                    {cases.map(c =>
                        <CaseListing key={c.id} c={c} admin={user?.admin} deleteCase={delCase} />
                    )}
                </ul>
                :
                <div>Ei tapauksia</div>
            }
            {user?.admin ?
                <CaseForm></CaseForm>
                :
                <></>
            }
        </div>
    )
}

export default CaseList