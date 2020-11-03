import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getGame } from '../reducers/gameReducer'
import { Button, Table } from 'react-bootstrap'

const FrontPage = () => {
    const user = useSelector(state => state.user)
    const cases = useSelector(state => state.case)?.sort((case1, case2) => case1.name.localeCompare(case2.name))
    const credits = useSelector(state => state.credit)
    const dispatch = useDispatch()
    const history = useHistory()
    const startGame = (caseId) => {
        dispatch(getGame(history, caseId, user.token))
    }

    return (
        <div>
            <p>
                Pelissä tutkitaan bakteriologinen näyte laboratoriossa. Pelin alussa saat näkyviin
                tapauksen anamneesin, jonka perusteella voit miettiä minkälaisesta taudinaiheuttajasta ja
                sairaudesta voisi olla kyse. Voit luoda itsellesi yhden tai useamman työhypoteesin. Tämän
                jälkeen valitset millaisen näytteen haluat eläimestä ottaa tutkimuksia varten. Sitten voit
                lähteä tutkimaan näytettä laboratoriossa.
                <br></br>
                Pelin tarkoituksena ei ole pelkästään oikean vastauksen löytäminen, vaan myös näytteen
                johdonmukainen ja systemaattinen labotoriodiagnostiikka ilman suurempia kiertoteitä.
                Ratkaisevaa on tällöin käytännönläheinen ajattelutapa ja olosuhteiden mukainen
                eteneminen.
            </p>
            <div>
                {
                    cases ?
                        <Table id='caseTable' borderless hover>
                            <tbody>
                                {cases.map(c =>
                                    <tr key={c.id}>
                                        <td>
                                            <Button variant='light' onClick={() => startGame(c.id)} block>{c.name} {!user.admin && credits.length > 0 && credits[0].testCases.includes(c.name) ? <i className='fas fa-check'></i> : <></>}</Button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </Table>
                        :
                        <div>Ei tapauksia</div>
                }
            </div>
        </div>
    )
}

export default FrontPage