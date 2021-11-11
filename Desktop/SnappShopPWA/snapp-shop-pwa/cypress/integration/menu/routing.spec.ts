/// <reference types="cypress" />

/* All tests about routing */
describe('Vendor routing', () => {
  describe('Test render vendor correctly with new URL format', () => {
    beforeEach(() => {
      cy.visit(encodeURI('restaurant/menu/P_S__فیلیپر_-r-37x9q9'))
    })

    it('Should render title correctly', () => {
      cy.get('[data-test=vendor-title]').should('have.text', 'P.S (فیلیپر)')
    })
  })

  describe('Test render vendor correctly with old URL format', () => {
    beforeEach(() => {
      cy.visit(encodeURI('restaurant/menu/37x9q9'))
    })

    it('Should render title correctly and set canonical', () => {
      cy.get('[data-test=vendor-title]').should('have.text', 'P.S (فیلیپر)')

      cy.document()
        .get('head link[rel="canonical"]')
        .should(
          'have.attr',
          'href',
          'https://snappfood.ir/restaurant/menu/P_S__فیلیپر_-r-37x9q9'
        )
    })
  })
})
