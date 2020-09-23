import React from 'react'
import CaseListing from './CaseListing'
import { useSelector } from 'react-redux'

const CaseList = () => {
    const cases = useSelector(state => state.case)?.sort((case1, case2) => case1.name.localeCompare(case2.name))
    const user = useSelector(state => state.user)

    // Tänne ensimmäisten tyhjien tagien sisälle sitten
    // Casea kuvaava komponentti, kun sellainen olemassa.
    return (
        <div>
            <h2>Tapaukset</h2>
            {cases ?
                <ul>
                    {cases.map(case =>
                        <CaseListing key={ case.id } case={ case } admin={user?.admin}></CaseListing>
                    )}
                </ul>
                :
                <div>Bakteereja haetaan</div>
            }
        </div>
    )
}

export default CaseList