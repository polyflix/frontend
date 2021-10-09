import { mount } from '@cypress/react'

import App from './App'

it('Renders Vite + React page', () => {
  mount(<App />)
  cy.get('p').contains('Vite + React')
})

it('2+2=4', () => {
  expect(2 + 2).equal(4)
})
