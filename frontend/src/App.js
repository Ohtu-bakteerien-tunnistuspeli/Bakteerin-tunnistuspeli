import React, { useEffect } from 'react'
import { Switch, Route, Redirect,/* Link, useRouteMatch,*/ useHistory, Link } from 'react-router-dom'
//import SkeletonComponent from './components/Skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { returnUser, logout } from './reducers/userReducer'
import Login from './components/Login'
import Register from './components/Register'
import BacteriaList from './components/BacteriaList'
import CaseList from './components/CaseList'
import TestList from './components/TestList'
import Notification from './components/Notification'
import { Button, Navbar, Nav } from 'react-bootstrap'
const App = () => {
    //const match = useRouteMatch('/hello/:name')
    //const name = match ? match.params.name : ''
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    useEffect(() => {
        dispatch(returnUser())
    }, [dispatch])
    const logoutButton = async () => {
        dispatch(logout(history))
    }

    const padding = {
        padding: 5
    }

    return (
        <div className="container">
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" >
                    <Nav className="mr-auto">
                        {/*HUOM Tarkista polku ennen käyttöön ottoa<Nav.Link href="#" as span>
                            {user 
                                ? <Link style={padding} to="/bakteeriPeli">Bakteeripeli</Link>
                                : null
                            }
                        </Nav.Link>
                        */}
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
                            ? <em><p>Tervetuloa {user.username}</p></em>
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
                            <BacteriaList></BacteriaList>
                        </Route>
                        <Route path='/tapausLista'>
                            <CaseList />
                        </Route>
                        <Route path='/testiLista'>
                            <TestList />
                        </Route>
                        <Route path='/'>
                            <Redirect to='/bakteeriLista'></Redirect>
                        </Route>
                        {/*<Route path='/skeleton'>
                    <SkeletonComponent></SkeletonComponent>
                    <button onClick={() => history.push('/hello')}>to hello</button>
                </Route>
                <Route path="/hello/:name">
                    <h1>HELLO {name}</h1>
                    <button onClick={() => history.push('/skeleton')}>to skeleton</button>
                </Route>
                <Route path='/hello'>
                    <h1>
                        <Link to='/hello/WORLD'>HELLO</Link>
                    </h1>
                </Route>
                <Route path='/'>
                    <Redirect to='/skeleton'></Redirect>
    </Route>*/}
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