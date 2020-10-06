import React from 'react'
import { Form, Button } from 'react-bootstrap'

const TestGroup = ({ testgroup, index }) => {
  console.log('testgroup from testgroup')
  console.log(testgroup)
  return (
    <div>
      <Form.Label>Testiryhmä {index + 1}</Form.Label>
<button>Poista testiryhmä</button>
      {testgroup.map((t, i) =>
        <div key={i}>
          {t.test.name}
          {t.isRequired ?
            <>
              <Form.Label text="success">Pakollinen</Form.Label>
            </> : <></>}
          {t.positive ?
            <>
              <Form.Label text="success">Positiivinen</Form.Label>
            </> : <></>}
          {t.alternativeTests ?
            <>
              <Form.Label text="success">Vapaaehtoinen</Form.Label></>
            : <></>}
        </div>
      )}
    </div>

  )
}

export default TestGroup
