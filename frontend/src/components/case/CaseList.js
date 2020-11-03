import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CaseListing from './CaseListing'
import CaseForm from './CaseForm'
import { deleteCase } from '../../reducers/caseReducer'
import { Table } from 'react-bootstrap'

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
            {cases.length !== 0 ?
                <Table id='caseTable'>
                    <thead>
                        <tr>
                            <th>Nimi</th>
                            <th>Lopetuskuva</th>
                            <th>
                                {user?.admin ?
                                    <CaseForm></CaseForm>
                                    :
                                    <></>
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map(caseItem =>
                            <CaseListing key={caseItem.id} caseItem={caseItem} admin={user?.admin} deleteCase={delCase} />
                        )}
                    </tbody>
                </Table>
                :
                <>
                    {user?.admin ?
                        <CaseForm></CaseForm>
                        :
                        <></>
                    }
                    <div>Ei tapauksia</div>
                </>
            }
        </div>
    )
}

export default CaseList