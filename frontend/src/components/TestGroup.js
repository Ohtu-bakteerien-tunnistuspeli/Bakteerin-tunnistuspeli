import React from 'react'
import { Form, Button } from 'react-bootstrap'



const TestGroup = ({ testgroup, index, tests, testChange,
  isRequired, isRequiredChange,
  positive, positiveChange,
  alternativeTests, alternativeTestsChange,
  addTest }) => {
  return (
    <div>
      <Form.Label>Testiryhmä {index + 1}</Form.Label>

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
      <Form.Label>Lisää testiryhmään</Form.Label>
      <Form.Control as="select" onChange={testChange} value={tests[0].id}>
        {tests.map(t =>
          <option key={t.id} value={t.id}>{t.name}</option>
        )}
      </Form.Control>
      <Form.Check onChange={isRequiredChange}
        type="checkbox"
        label="Pakollinen"
        checked={isRequired}
      />
      <Form.Check onChange={positiveChange}
        type="checkbox"
        label="Positiivinen"
        checked={positive}
      />
      <Form.Check onChange={alternativeTestsChange}
        type="checkbox"
        label="Vaihtoehtoinen testi"
        checked={alternativeTests}
      />
      <Button onClick={(event) => {
        event.preventDefault()
        addTest(testgroup)
      }}>Lisää testi</Button>
    </div>

  )
}

export default TestGroup
