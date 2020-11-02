import React from 'react'
import { CSVLink } from 'react-csv'

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
        <div className="Export">
            <CSVLink {...csvReport}>Lataa Excel-muodossa</CSVLink>
        </div>
    )
}


export default CSVExport