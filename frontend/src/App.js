import React, { useEffect } from 'react'
import { Switch, Route, Redirect, useHistory, Link } from 'react-router-dom'
import Idle from 'react-idle'
import { useDispatch, useSelector } from 'react-redux'
import { returnUser, logout } from './reducers/userReducer'
import Login from './components/user/Login'
import SingleUsePassword from './components/user/SingleUsePassword'
import Register from './components/user/Register'
import FrontPage from './components/FrontPage'
import BacteriaList from './components/bacteria/BacteriaList'
import CaseList from './components/case/CaseList'
import TestList from './components/test/TestList'
import CreditList from './components/credit/CreditList'
import UserList from './components/users/UserList'
import GamePage from './components/GamePage'
import ProfilePage from './components/ProfilePage'
import Notification from './components/utility/Notification'
import Footer from './components/Footer'
import { Button, Navbar, Nav } from 'react-bootstrap'
import { getLanguage } from './reducers/languageReducer'
import useDetectMobile from './components/utility/useDetectMobile'

const App = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const game = useSelector(state => state.game)

    useEffect(() => {
        dispatch(returnUser(history))
        dispatch(getLanguage())
    }, [dispatch, history])
    const logoutButton = async () => {
        dispatch(logout(history))
    }

    const handleOnBeforeUnload = () => {
        window.localStorage.setItem('lastPage', window.location.pathname)
        window.localStorage.setItem('gameState', JSON.stringify(game))
    }
    window.onbeforeunload = handleOnBeforeUnload

    const mobile = useDetectMobile()
    if (mobile) {
        document.body.style.setProperty('--attachVar', 'scroll')
    } else {
        document.body.style.setProperty('--attachVar', 'fixed')
    }

    return (
        <div className='page'>
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
            <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
                <Navbar.Toggle className='hidden-nav' aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav' >
                    <Nav className='mr-auto'>
                        {user
                            ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/' className='link'>Etusivu</Link>
                            </Nav.Link>
                            : null
                        }
                        {user?.admin ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/bakteeriLista' className='link'>Bakteerien hallinta</Link>
                            </Nav.Link>
                            : null
                        }
                        {user?.admin
                            ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/tapausLista' className='link'>Tapausten hallinta</Link>
                            </Nav.Link>
                            : null
                        }
                        {user?.admin
                            ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/testiLista' className='link'>Testien hallinta</Link>
                            </Nav.Link>
                            : null
                        }
                        {user?.admin
                            ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/suoritusLista' className='link'>Suoritusten hallinta</Link>
                            </Nav.Link>
                            : null
                        }
                        {user?.admin
                            ?
                            <Nav.Link href='#' as='span'>
                                <Link to='/kayttajaLista' className='link'>Käyttäjien hallinta</Link>
                            </Nav.Link>
                            : null
                        }
                    </Nav>
                    <Nav.Link href='#' as='span'>
                        {user
                            ? <p className='nav-text'><em>Kirjautuneena </em><Link to='/profiilini' className='logged-user' >{user.username}</Link></p>
                            : <Link to='/kirjautuminen' className='link'>Kirjaudu sisään</Link>
                        }
                    </Nav.Link>
                    {user
                        ? null
                        :
                        <Nav.Link href='#' as='span'>
                            <Link to='/rekisteroityminen' className='link'>Rekisteröidy</Link>
                        </Nav.Link>
                    }
                    <Nav.Item>
                        {user
                            ? <Button id='submit' variant='primary' type='button' onClick={logoutButton}>Kirjaudu ulos</Button>
                            : null
                        }
                    </Nav.Item>
                </Navbar.Collapse>
            </Navbar>
            <div className='wrapper'>
                <div className='container'>
                    <Notification></Notification>
                    {user ?
                        <>
                            <Switch>
                                <Route path='/bakteeriLista'>
                                    {user.admin ?
                                        <BacteriaList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/tapausLista'>
                                    {user.admin ?
                                        <CaseList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/testiLista'>
                                    {user.admin ?
                                        <TestList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/suoritusLista'>
                                    {user.admin ?
                                        <CreditList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/kayttajaLista'>
                                    {user.admin ?
                                        <UserList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/peli'>
                                    {game ?
                                        <GamePage />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path='/profiilini'>
                                    {user ?
                                        <ProfilePage />
                                        :
                                        <Redirect to='/' />
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
                                    <Login />
                                </Route>
                                <Route path='/rekisteroityminen'>
                                    <Register />
                                </Route>
                                <Route path='/kertakayttoinensalasana'>
                                    <SingleUsePassword />
                                </Route>
                                <Route path='/'>
                                    <Redirect to='/kirjautuminen' />
                                </Route>
                            </Switch>
                        </>
                    }

                </div>
            </div>

            <div className='navbar navbar-inverse navbar-fixed-bottom footer'>
                <Footer />
            </div>
        </div>
    )
}

export default App