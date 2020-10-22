import React, { useEffect } from 'react'
import { Switch, Route, Redirect,/* Link, useRouteMatch,*/ useHistory, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { returnUser, logout } from './reducers/userReducer'
import Login from './components/Login'
import Register from './components/Register'
import FrontPage from './components/FrontPage'
import BacteriaList from './components/BacteriaList'
import CaseList from './components/case/CaseList'
import TestList from './components/TestList'
import GamePage from './components/GamePage'
import Notification from './components/Notification'
import { Button, Navbar, Nav } from 'react-bootstrap'
const App = () => {
    //const match = useRouteMatch('/hello/:name')
    //const name = match ? match.params.name : ''
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const game = useSelector(state => state.game)
    useEffect(() => {
        dispatch(returnUser())
    }, [dispatch])
    const logoutButton = async () => {
        dispatch(logout(history))
    }

    const padding = {
        padding: 5
    }

    const marginBot = {
        marginBottom: '20px'
    }

    const marginTop = {
        marginTop: '15px'
    }

    return (
        <div className="container">
            <Navbar style={ marginBot } collapseOnSelect expand="lg" bg="light" variant="light">
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
                    </Nav>
                    <Nav.Link href="#" as="span">
                        {user
                            ? <em><p style={ marginTop }>Tervetuloa {user.username}</p></em>
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
                        <Route path='/peli'>
                            {game ?
                                <GamePage></GamePage>
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
    )
}

export default App