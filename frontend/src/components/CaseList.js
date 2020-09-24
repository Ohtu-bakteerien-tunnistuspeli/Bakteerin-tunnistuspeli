import React from 'react'
import { useSelector } from 'react-redux'
import CaseListing from './CaseListing'

const CaseList = () => {
    const cases = useSelector(state => state.case)?.sort((case1, case2) => case1.name.localeCompare(case2.name))
    const user = useSelector(state => state.user)

    return (
        <div>
            <h2>Tapaukset</h2>
            {cases ?
                <ul>
                    {cases.map(c =>
                        <CaseListing key={ c.id } case={ c } admin={user?.admin}/>
                    )}
                </ul>
                :
                <div>Ei tapauksia</div>
            }
        </div>
    )
}

export default CaseList