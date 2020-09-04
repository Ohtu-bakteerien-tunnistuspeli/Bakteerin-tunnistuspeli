import React from 'react'
import { Switch, Route, Redirect, Link, useRouteMatch, useHistory } from 'react-router-dom'
import SkeletonComponent from './components/Skeleton'

const App = () => {
    const match = useRouteMatch('/hello/:name')
    const name = match ? match.params.name : ''
    const history = useHistory()
    return (
        <div >
            <Switch>
                <Route path='/skeleton'>
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
                </Route>
            </Switch>
        </div>
    )
}

export default App