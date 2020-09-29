import React from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, isReguiredChange, positiveChange, alternativeTestsChange }) => {
  console.log('heck')
  console.log(testgroup)
  return (
    <div>
      <Form.Label>Testiryhmä {index + 1}</Form.Label>
      
        {testgroup.map((t, i) =>
        <div key={i}>
          {t.test.name}
            {t.isReguired ?
              <>
                <Form.Check onChange={isReguiredChange} type="checkbox" label="Pakollinen" checked />
              </>
              :
              <>
                <Form.Check onChange={isReguiredChange} type="checkbox" label="Pakollinen" />
              </>
            }

            {t.positive ?
              <>
                <Form.Check onChange={positiveChange} type="checkbox" label="Positiivinen" checked />
              </>
              :
              <>
                <Form.Check onChange={positiveChange} type="checkbox" label="Positiivinen" />
              </>
            }

            {t.alternativeTests ?
              <>
                <Form.Check onChange={alternativeTestsChange} type="checkbox" label="Vapaaehtoinen" checked />
              </>
              :
              <>
                <Form.Check onChange={alternativeTestsChange} type="checkbox" label="Vapaaehtoinen" />
              </>}
              </div>
        )}
    </div>

  )
}

export default TestGroup
