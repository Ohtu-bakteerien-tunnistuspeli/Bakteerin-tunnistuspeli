import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CreditListing from './CreditListing'
import { Table } from 'react-bootstrap'
import CSVExporter from '../CSVExporter'

const BacteriaList = () => {
    const credits = useSelector(state => state.credit)?.sort((credit1, credit2) => credit1.user.studentNumber.localeCompare(credit2.user.studentNumber))
    const [creditsToShow, setCreditsToShow] = useState(credits)
    const [filterByClassGroup, setFilterByClassGroup] = useState('')
    const [filterByStudentNumber, setFilterByStudentNumber] = useState('')
    const user = useSelector(state => state.user)
    const style = { margin: '10px', fontSize: '40px' }
    const exportStyle = { paddingTop: '20px', paddingBottom: '20px' }

    useEffect(() => {
        if (filterByClassGroup === '' && filterByStudentNumber === '') {
            setCreditsToShow(credits)
        } else {
            if (filterByClassGroup === '') {
                setCreditsToShow(credits.filter(credit => credit.user.studentNumber.startsWith(filterByStudentNumber)))
            } else if (filterByStudentNumber === '') {
                setCreditsToShow(credits.filter(credit => credit.user.classGroup.substring(2, credit.user.classGroup.length) === filterByClassGroup))
            } else {
                setCreditsToShow(credits.filter(credit => credit.user.studentNumber.startsWith(filterByStudentNumber) && credit.user.classGroup.substring(2, credit.user.classGroup.length) === filterByClassGroup))
            }
        }
    }, [filterByClassGroup, filterByStudentNumber, credits])

    return (
        <div>
            <h2 style={style}>Suoritukset</h2>
            Filtteröi vuosikurssilla <input type='text' value={filterByClassGroup} onChange={({ target }) => setFilterByClassGroup(target.value)}></input>&nbsp;
            Filtteröi opiskelijanumerolla <input type='text' value={filterByStudentNumber} onChange={({ target }) => setFilterByStudentNumber(target.value)}></input>&nbsp;
            <div style={exportStyle}>
                <CSVExporter data={creditsToShow} />
            </div>
            {credits.length !== 0 ?
                <Table>
                    <thead>
                        <tr>
                            <th>Opiskelijanumero</th>
                            <th>Käyttäjänimi</th>
                            <th>Vuosikurssi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditsToShow.map(credit =>
                            <CreditListing key={credit.id} credit={credit} admin={user.admin} />
                        )}
                    </tbody>
                </Table>
                :
                <div>Ei suorituksia</div>
            }
        </div>
    )
}

export default BacteriaList