import React, { useEffect } from 'react'
import { Switch, Route, Redirect, useHistory, Link } from 'react-router-dom'
import Idle from 'react-idle'
import { useDispatch, useSelector } from 'react-redux'
import { returnUser, logout } from './reducers/userReducer'
import Login from './components/user/Login'
import Register from './components/user/Register'
import FrontPage from './components/FrontPage'
import BacteriaList from './components/bacteria/BacteriaList'
import CaseList from './components/case/CaseList'
import TestList from './components/test/TestList'
import CreditList from './components/credit/CreditList'
import GamePage from './components/GamePage'
import ProfilePage from './components/ProfilePage'
import Notification from './components/Notification'
import Footer from './components/Footer'
import { Button, Navbar, Nav } from 'react-bootstrap'

const App = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const game = useSelector(state => state.game)

    useEffect(() => {
        dispatch(returnUser(history))
    }, [dispatch, history])
    const logoutButton = async () => {
        dispatch(logout(history))
    }

    const handleOnBeforeUnload = () => {
        window.localStorage.setItem('lastPage', window.location.pathname)
        window.localStorage.setItem('gameState', JSON.stringify(game))
    }

    window.onbeforeunload = handleOnBeforeUnload

    const padding = {
        padding: 5
    }

    const paddingContainer = {
        paddingBottom: '60px',
        paddingTop: '40px'
    }

    const paddingPage = {
        paddingBottom: '0px'
    }

    const footerStyle = {
        position: 'relative',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'gainsboro',
        textAlign: 'center',
        borderRadius: '5px'
    }

    const marginTop = {
        marginTop: '15px'
    }

    return (
        <div style={paddingPage}>
            {user ?
                <Idle
                    timeout={7200000}
                    onChange={({ idle }) => {
                        if (idle && user) {
                            dispatch(logout(history))
                            alert('Sinut kirjattiin ulos automaattisesti, koska olet ollut pitkään epäaktiivisena.')
                        }
                    }} />
                :
                null
            }
            <Navbar style={{ minHeight: '10vh', borderRadius: '5px' }} collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" >
                    <Nav className="mr-auto">
                        <Nav.Link href="#" as="span">
                            {user
                                ? <Link style={padding} to="/">Etusivu</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            {user?.admin
                                ? <Link style={padding} to="/bakteeriLista">Bakteerien hallinta</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            {user?.admin
                                ? <Link style={padding} to="/tapausLista" >Tapausten hallinta</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            {user?.admin
                                ? <Link style={padding} to="/testiLista">Testien hallinta</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            {user?.admin
                                ? <Link style={padding} to="/suoritusLista">Suoritusten hallinta</Link>
                                : null
                            }
                        </Nav.Link>
                    </Nav>
                    <Nav.Link href="#" as="span">
                        {user
                            ? <em><p style={marginTop}>Tervetuloa <Link style={padding} to="/profiilini">{user.username}</Link></p></em>
                            : <Link style={padding} to="/kirjautuminen">Kirjaudu sisään</Link>
                        }
                    </Nav.Link>
                    <Nav.Link href="#" as="span">
                        {user
                            ? null
                            : <Link style={padding} to="/rekisteröityminen">Rekisteröidy</Link>
                        }
                    </Nav.Link>
                    <Nav.Item>
                        {user
                            ? <Button id="submit" variant="primary" type="button" onClick={logoutButton}>Kirjaudu ulos</Button>
                            : null
                        }
                    </Nav.Item>
                </Navbar.Collapse>
            </Navbar>
            <div style={{ minHeight: '82vh' }}>
                <div style={paddingContainer} className="container">
                    <Notification></Notification>
                    {user ?
                        <>
                            <Switch>
                                <Route path='/bakteeriLista'>
                                    {user.admin ?
                                        <BacteriaList></BacteriaList>
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/tapausLista'>
                                    {user.admin ?
                                        <CaseList />
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/testiLista'>
                                    {user.admin ?
                                        <TestList />
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/suoritusLista'>
                                    {user.admin ?
                                        <CreditList />
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/peli'>
                                    {game ?
                                        <GamePage></GamePage>
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/profiilini'>
                                    {user ?
                                        <ProfilePage />
                                        :
                                        <Redirect to='/'></Redirect>
                                    }
                                </Route>
                                <Route path='/'>
                                    <FrontPage />
                                </Route>
                            </Switch>
                        </>
                        :
                        <>
                            <Switch>
                                <Route path='/kirjautuminen'>
                                    <Login></Login>
                                </Route>
                                <Route path='/rekisteröityminen'>
                                    <Register></Register>
                                </Route>
                                <Route path='/'>
                                    <Redirect to='/kirjautuminen'></Redirect>
                                </Route>
                            </Switch>
                        </>
                    }

                </div>
            </div>

            <div style={footerStyle} className="navbar navbar-inverse navbar-fixed-bottom">
                <Footer />
            </div>
        </div>
    )
}

export default App