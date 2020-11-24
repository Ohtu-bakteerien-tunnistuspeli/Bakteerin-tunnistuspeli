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

const App = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const game = useSelector(state => state.game)
    const language = useSelector(state => state.language)
    useEffect(() => {
        dispatch(returnUser(history))
        dispatch(getLanguage())
    }, [dispatch, history])
    useEffect(() => {
        if(language && language.library) {
            document.title = language.library.frontend.title
        }
    }, [language])
    const logoutButton = async () => {
        dispatch(logout(history))
    }

    const handleOnBeforeUnload = () => {
        window.localStorage.setItem('lastPage', window.location.pathname)
        window.localStorage.setItem('gameState', JSON.stringify(game))
    }

    window.onbeforeunload = handleOnBeforeUnload
    if (!language || !language.validation || !language.library) {
        return (<></>)
    }
    const library = language.library.frontend
    return (
        <div className='page'>
            {user ?
                <Idle
                    timeout={7200000}
                    onChange={({ idle }) => {
                        if (idle && user) {
                            dispatch(logout(history))
                            alert(library.app.inactivityMessage)
                        }
                    }} />
                :
                null
            }
            <Navbar collapseOnSelect expand='lg' bg='light' variant='light'>
                <Navbar.Toggle className='hidden-nav' aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav' >
                    <Nav className='mr-auto'>
                        <Nav.Link href='#' as='span'>
                            {user
                                ? <Link to='/'>{library.app.navigationBar.frontPage}</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href='#' as='span'>
                            {user?.admin
                                ? <Link to={`/${library.routes.bacteriaList}`}>{library.app.navigationBar.bacteriaList}</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href='#' as='span'>
                            {user?.admin
                                ? <Link to={`/${library.routes.caseList}`} >{library.app.navigationBar.caseList}</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href='#' as='span'>
                            {user?.admin
                                ? <Link to={`/${library.routes.testList}`}>{library.app.navigationBar.testList}</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href='#' as='span'>
                            {user?.admin
                                ? <Link to={`/${library.routes.creditList}`}>{library.app.navigationBar.creditList}</Link>
                                : null
                            }
                        </Nav.Link>
                        <Nav.Link href='#' as='span'>
                            {user?.admin
                                ? <Link to={`/${library.routes.userList}`}>{library.app.navigationBar.userList}</Link>
                                : null
                            }
                        </Nav.Link>
                    </Nav>
                    <Nav.Link href='#' as='span'>
                        {user
                            ? <em><p className='nav-text'>{library.app.navigationBar.welcome}<Link to={`/${library.routes.profile}`}>{user.username}</Link></p></em>
                            : <Link to={`/${library.routes.login}`}>{library.app.navigationBar.login}</Link>
                        }
                    </Nav.Link>
                    <Nav.Link href='#' as='span'>
                        {user
                            ? null
                            : <Link to={`/${library.routes.register}`}>{library.app.navigationBar.register}</Link>
                        }
                    </Nav.Link>
                    <Nav.Item>
                        {user
                            ? <Button id='submit' variant='primary' type='button' onClick={logoutButton}>{library.app.navigationBar.logout}</Button>
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
                                <Route path={`/${library.routes.bacteriaList}`}>
                                    {user.admin ?
                                        <BacteriaList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.caseList}`}>
                                    {user.admin ?
                                        <CaseList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.testList}`}>
                                    {user.admin ?
                                        <TestList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.creditList}`}>
                                    {user.admin ?
                                        <CreditList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.userList}`}>
                                    {user.admin ?
                                        <UserList />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.game}`}>
                                    {game ?
                                        <GamePage />
                                        :
                                        <Redirect to='/' />
                                    }
                                </Route>
                                <Route path={`/${library.routes.profile}`}>
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
                                <Route path={`/${library.routes.login}`}>
                                    <Login />
                                </Route>
                                <Route path={`/${library.routes.register}`}>
                                    <Register />
                                </Route>
                                <Route path={`/${library.routes.singleUsePassword}`}>
                                    <SingleUsePassword />
                                </Route>
                                <Route path='/'>
                                    <Redirect to={`/${library.routes.login}`} />
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