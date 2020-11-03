import React from 'react'
import { CSVLink } from 'react-csv'
import { Button } from 'react-bootstrap'
const CSVExport = ({ data }) => {
    const headers = [
        { label: 'Opiskelijanumero', key: 'studentNum' },
        { label: 'Sähköposti', key: 'email' },
        { label: 'Vuosikurssi', key: 'class' },
        { label: 'Suoritukset', key: 'cases' }
    ]

    let cleanData = []
    for (let i = 0; i < data.length; i++) {
        const credit = {
            studentNum: data[i].user.studentNumber,
            email: data[i].user.email,
            class: data[i].user.classGroup,
            cases: data[i].testCases.toString()
        }
        cleanData = cleanData.concat(credit)
    }

    const csvReport = {
        data: cleanData,
        headers: headers,
        filename: 'Bakteeripeli-suoritukset.csv'
    }

    return (
        <>
            <CSVLink {...csvReport}>
                <Button variant='success' style={{ margin: '2px', float: 'right' }}>Tallenna Excel-muodossa</Button>
            </CSVLink>
        </>
    )
}


export default CSVExport