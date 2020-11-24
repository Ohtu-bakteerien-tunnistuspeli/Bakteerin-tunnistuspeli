import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreditListing from './CreditListing'
import { Table, Button } from 'react-bootstrap'
import CSVExporter from '../CSVExporter'
import { creditsDelete } from '../../reducers/creditReducer'

const CreditList = () => {
    const library = useSelector(state => state.language)?.library?.frontend.credit.list
    const credits = useSelector(state => state.credit)?.sort((credit1, credit2) => credit1.user.studentNumber.localeCompare(credit2.user.studentNumber))
    const [creditsToShow, setCreditsToShow] = useState(credits)
    const [filterByClassGroup, setFilterByClassGroup] = useState('')
    const [filterByStudentNumber, setFilterByStudentNumber] = useState('')
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [timer, setTimer] = useState(null)
    useEffect(() => {
        if (timer) {
            clearTimeout(timer)
        }
        setTimer(setTimeout(() => {
            if (filterByClassGroup === '' && filterByStudentNumber === '') {
                setCreditsToShow(credits)
            } else {
                if (filterByClassGroup === '') {
                    setCreditsToShow(credits.filter(credit => credit.user.studentNumber && credit.user.studentNumber.startsWith(filterByStudentNumber)))
                } else if (filterByStudentNumber === '') {
                    setCreditsToShow(credits.filter(credit => credit.user.classGroup && (credit.user.classGroup.substring(2, credit.user.classGroup.length) === filterByClassGroup || credit.user.classGroup === filterByClassGroup)))
                } else {
                    setCreditsToShow(credits.filter(credit => credit.user.studentNumber && credit.user.studentNumber.startsWith(filterByStudentNumber) && credit.user.classGroup && (credit.user.classGroup.substring(2, credit.user.classGroup.length) === filterByClassGroup || credit.user.classGroup === filterByClassGroup)))
                }
            }
        }, 1000))
    }, [filterByClassGroup, filterByStudentNumber, credits])

    const deleteCredits = () => {
        if (window.confirm(library.deleteConfirm)) {
            dispatch(creditsDelete(creditsToShow.map(credit => credit.id), user.token))
        }
    }

    return (
        <div>
            <h2>{library.title}</h2>
            {library.filterByClassGroup}<input id='classGroupFilter' type='text' value={filterByClassGroup} onChange={({ target }) => setFilterByClassGroup(target.value)}></input>&nbsp;
            {library.filterByStudentNumber}<input id='studentNumberFilter' type='text' value={filterByStudentNumber} onChange={({ target }) => setFilterByStudentNumber(target.value)}></input>&nbsp;
            {credits.length !== 0 ?
                <Table borderless hover>
                    <thead>
                        <tr>
                            <th>{library.studentNumber}</th>
                            <th>{library.username}</th>
                            <th>{library.classGroup}</th>
                            <th>
                                <Button id='deleteCredits' variant='danger' className='small-margin-float-right' onClick={deleteCredits}>{library.deleteCredits}</Button>
                                <CSVExporter data={creditsToShow} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditsToShow.map(credit =>
                            <CreditListing key={credit.id} credit={credit} admin={user.admin} />
                        )}
                    </tbody>
                </Table>
                :
                <div>{library.noCredits}</div>
            }
        </div>
    )
}

export default CreditList