const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app.cjs') // Assuming the provided code is in a file named app.js

chai.use(chaiHttp)
const expect = chai.expect

describe('API Tests', () => {
  describe('GET /files/list', () => {
    it('should return a list of files', (done) => {
      chai
        .request(app)
        .get('/files/list')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })

  describe('GET /files/data', () => {
    it('should return data for all files when no fileName is provided', (done) => {
      chai
        .request(app)
        .get('/files/data')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })

    it('should return data for a specific file when fileName is provided', (done) => {
      const fileName = 'test2.csv'
      chai
        .request(app)
        .get(`/files/data?fileName=${fileName}`)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body.file).to.equal(fileName)
          expect(res.body.lines).to.be.an('array')
          done()
        })
    })

    it('should return a 404 error when the specified file is not found', (done) => {
      const fileName = 'nonexistent.csv'
      chai
        .request(app)
        .get(`/files/data?fileName=${fileName}`)
        .end((err, res) => {
          if (err) {
            expect(err).to.have.status(404)
            expect(err.response.body.error).to.equal('File not found')
          }
          done()
        })
    })
  })
})
