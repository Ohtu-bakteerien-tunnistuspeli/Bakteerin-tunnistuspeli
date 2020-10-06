import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const FrontPage = () => {

    const cases = useSelector(state => state.case)?.sort((case1, case2) => case1.name.localeCompare(case2.name))
    const dispatch = useDispatch()
    const history = useHistory()
    const startGame = caseId => {
        dispatch()
    }

    return (
        <div>
            <p>
                Pelissä tutkitaan bakteriologinen näyte laboratoriossa. Pelin alussa saat näkyviin
                tapauksen anamneesin, minkä perusteella voit miettiä minkälaisesta taudinaiheuttajasta ja
                sairaudesta voisi olla kyse. Voit luoda itsellesi yhden tai useamman työhypoteesin. Tämän
                jälkeen valitset millaisen näytteen haluat eläimestä ottaa tutkimuksia varten. Sitten voit
                lähteä tutkimaan näytettä laboratoriossa.
                <br />
                Pelin tarkoituksena ei ole pelkästään oikean vastauksen löytäminen, vaan myös näytteen
                johdonmukainen ja systemaattinen labotoriodiagnostiikka ilman suurempia kiertoteitä.
                Ratkaisevaa on tällöin käytännönläheinen ajattelutapa ja olosuhteiden mukainen
                eteneminen.
            </p>
            <div>
                {
                    cases ?
                        <ul>
                            {
                                cases.map(c => {
                                    <li key={c.id} onClick={() => startGame(c.id)}>{c.name}</li>
                                })
                            }
                        </ul>
                        :
                        <div>Ei tapauksia</div>
                }
            </div>
        </div>
    )
}

export default FrontPage