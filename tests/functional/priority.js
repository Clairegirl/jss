import expect from 'expect.js'
import {create, SheetsRegistry} from '../../src'

describe('Functional: dom priority', () => {
  function createDummySheets() {
    for (let i = 0; i < 2; i++) {
      const dummySheet = document.createElement('style')
      dummySheet.type = 'text/css'
      dummySheet.setAttribute('data-test-dummy', `dummy${i + 1}`)
      dummySheet.setAttribute('data-jss', `dummy${i + 1}`)
      document.head.appendChild(dummySheet)
    }
  }

  function removeAllSheets() {
    const sheets = document.head.querySelectorAll('[data-jss]')
    for (let i = 0; i < sheets.length; i++) {
      document.head.removeChild(sheets[i])
    }
  }

  afterEach(() => {
    removeAllSheets()
  })

  describe('without a comment node', () => {
    let jss

    beforeEach(() => {
      createDummySheets()
      jss = create({sheets: new SheetsRegistry()})
    })
    afterEach(() => {
      removeAllSheets()
    })

    it('should append sheets to the end of the document head after other stylesheets', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[1].getAttribute('data-test-dummy')).to.be('dummy2')

      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[6].getAttribute('data-meta')).to.be('sheet4')
    })
  })

  describe('with a comment node', () => {
    let jss
    let comment

    beforeEach(() => {
      createDummySheets()
      jss = create({sheets: new SheetsRegistry()})
    })

    afterEach(() => {
      removeAllSheets()
      document.head.removeChild(comment)
    })

    it('should insert sheets after comment without registry', () => {
      const jss2 = create()

      comment = document.createComment('jss')

      document.head.insertBefore(
        comment,
        document.head.querySelector('style')
      )

      jss2.createStyleSheet({}, {meta: 'sheet0'}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(3)
      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet0')
      expect(styleElements[1].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[2].getAttribute('data-test-dummy')).to.be('dummy2')
    })

    it('should insert sheets before other stylesheets', () => {
      comment = document.createComment('jss')

      document.head.insertBefore(
        comment,
        document.head.querySelector('style')
      )

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet4')

      expect(styleElements[5].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[6].getAttribute('data-test-dummy')).to.be('dummy2')
    })

    it('should insert sheets after other stylesheets', () => {
      comment = document.createComment('jss')
      document.head.appendChild(comment)

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')
      expect(styleElements[1].getAttribute('data-test-dummy')).to.be('dummy2')

      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[6].getAttribute('data-meta')).to.be('sheet4')
    })

    it('should insert sheets between other stylesheets', () => {
      comment = document.createComment('jss')
      document.head.insertBefore(
        comment,
        document.head.querySelectorAll('style')[1]
      )

      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 1}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 75}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 35}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(7)

      expect(styleElements[0].getAttribute('data-test-dummy')).to.be('dummy1')

      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[5].getAttribute('data-meta')).to.be('sheet4')

      expect(styleElements[6].getAttribute('data-test-dummy')).to.be('dummy2')
    })
  })

  describe('with zero and negative indices', () => {
    let jss

    beforeEach(() => {
      jss = create({sheets: new SheetsRegistry()})
    })

    it('should insert sheets in the correct order', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 0}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: -5}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: -999}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 3}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 312}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(5)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet1')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet4')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet5')
    })
  })

  describe('with multiple sheets using the same index', () => {
    let jss

    beforeEach(() => {
      jss = create({sheets: new SheetsRegistry()})
    })

    it('should insert sheets with the same index after existing', () => {
      jss.createStyleSheet({}, {meta: 'sheet1', index: 50}).attach()
      jss.createStyleSheet({}, {meta: 'sheet2', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet3', index: 40}).attach()
      jss.createStyleSheet({}, {meta: 'sheet4', index: 20}).attach()
      jss.createStyleSheet({}, {meta: 'sheet5', index: 40}).attach()

      const styleElements = document.head.getElementsByTagName('style')

      expect(styleElements.length).to.be(5)

      expect(styleElements[0].getAttribute('data-meta')).to.be('sheet4')
      expect(styleElements[1].getAttribute('data-meta')).to.be('sheet2')
      expect(styleElements[2].getAttribute('data-meta')).to.be('sheet3')
      expect(styleElements[3].getAttribute('data-meta')).to.be('sheet5')
      expect(styleElements[4].getAttribute('data-meta')).to.be('sheet1')
    })
  })
})
