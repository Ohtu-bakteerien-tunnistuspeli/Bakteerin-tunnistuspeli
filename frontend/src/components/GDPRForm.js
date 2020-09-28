import React from 'react'

const GDPRForm = () => {
    return (
        <form>
            <div style="height:400px;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:auto;">
                <h3>Bakteerien tunnistuspelin käyttöehdot</h3>
                Bakteerien tunnistuspeli on Helsingin yliopiston eläinlääketieteellisen tiedekunnan käyttöön tarkoitettu valittujen kurssien suoritksessa hyödynnettävä verkkopeli. Peliä sisältöineen kutsutaan myöhemmin tekstissä sanalla palvelut.
                <p></p>
                <h4>Käyttäjien tietosuoja</h4>
                Rekisteröitymällä näissä käyttöehdoissa mainittuihin palveluihin hyväksyt palvelun käytön kannalta tarpeellisen tiedon tallentamisen ja käsittelyn tietosuojaselosteemme mukaisessa muodossa. Henkilötiedon ylläpitämisessä noudatetaan henkilötietolakia, emmekä kerää pelaamisen ja pelaajan opintosuorituksen kirjaamisen kannalta tarpeettomia ylimääräisiä henkilötietoja. Pelin pelaamisesta syntyvien henkilörekisterien avulla kurssien vastuuopettajat pystyvät antamaan opiskelijalle suorituksia ja seuraamaan opiskelijan osaamista. Edellä mainittua tarkoitusta varten tietoja säilytetään Yliopistolain (24.7.2009/558) 44 §:n mukaan vähintään kuuden kuukauden ajan tulosten julkistamisesta. Jos peleistä tehdään akateemista tutkimusta, kun opiskelijalta on saatu siihen lupa, tietoja säilytetään tutkimukseen tarvittava aika. Voit lukea lisää tietosuojasta palveluiden Tietosuojaselosteesta.
                <p></p>
                <h4>Tekijänoikeudet</h4>
                Palvelun materiaalin, kuten tehtävien ja niihin liittyvien kuvien tekijänoikeudet kuuluvat Helsingin yliopistolle tai materiaalin tuottaneille henkilöille, ellei toisin mainita. 
                <p></p>
                <h4>Tiedon ajantasaisuus ja lainmukaisuus</h4>
                Käyttäjä vastaa ilmoittamiensa tietojen oikeellisuudesta. Opintosuoritukset voidaan kirjata palveluun ilmoitettujen tietojen pohjalta, eikä Helsingin yliopisto ole vastuussa väärin ilmoitettujen henkilötietojen johdosta kirjaamatta jääneistä opintosuorituksista.
                <p></p>
                <h4>Voimassaolo ja sovellettava laki</h4>
                Nämä ehdot tulevat voimaan käyttäjän hyväksyessä käyttöehdot palveluun rekisteröitymisen yhteydessä. Käyttäjä voi milloin tahansa lopettaa palveluiden käytön pyytämällä käyttäjätilinsä poistamista palveluiden vastuuopettajilta. Palveluihin sekä näihin käyttöehtoihin sovelletaan Suomen lakia.
            </div>

            <div>
                <input type="checkbox" id="consentBox" name="consentBox" />
                <label for="consentBox">Olen lukenut ja hyväksyn ylläolevat ehdot</label>
            </div>

            <div>
                <input type="checkbox" id="consentAnalytics" name="consentAnalytics" />
                <label for="consentAnalytics">Sallin analytiikkadatan keräämisen, mikä Bakteerien tunnistuspelissä koskee etenemisestä tallentuneita logitietoja.</label>
            </div>
        </form>
    )
}

export default GDPRForm