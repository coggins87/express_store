/* eslint-disable strict */

const app = require('../src/app');

describe('App', ()=>{
  it('should return 200 "hello world!"', ()=>{
    return supertest(app)
      .get('/')
      .expect(200, 'hello, world!');
  });
  it('should get an array of users at the /user endpoint', ()=> {
    return supertest(app)
      .get('/user')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res=>{
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const user = res.body[0];
        expect(user).to.include.all.keys('username', 'password', 'favoriteClub', 'newsLetter');
      });
    
  });
  it('should return an error if no username given', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': '',
      'password': 'c00d1ng1sc00l',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Username required');
  });
  it('should return an error if username already exists', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudent',
      'password': 'c00d1ng1sc00l',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Username is already in use, select different username');
  });
  it('should return an error if username is too short', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 's',
      'password': 'c00d1ng1sc00l',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Username must be between 6 and 20 characters');
  });
  it('should return an error if invalid password ', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudenty',
      'password': '',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Password required');
  });
  it('should return error if password is too short', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudenty',
      'password': 'h',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Password must be between 8 and 36 characters');
  });
  it('should return error if password does not contain a number', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudenty',
      'password': 'hellofriend',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Password must contain at least one digit');
  });
  it('should return error if club does not match', ()=>{
    const data = {'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudenty',
      'password': 'h1oieeis111',
      'favoriteClub': 'Disney World',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(400, 'Not a valid club');
  });
  it('successfully adds user if all validation passes', ()=>{
    const data = {
      'username': 'sallyStudenty',
      'password': 'hellofriend123',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'};
    return supertest(app)
      .post('/register')
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(res=>{
        expect(res.body).to.be.an('object');
        expect(res.body.username).to.eql(data.username);
      });
  });
  it('successfully deletes user', ()=>{
    const data = {
      'id': '3c8da4d5-1597-46e7-baa1-e402aed70d80',
      'username': 'sallyStudent',
      'password': 'c00d1ng1sc00l',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'
    };
    return supertest(app)
      .delete(`/user/${data.id}`)
      .expect(200, 'Deleted');
    
  });
  it('returns an error if user is not found when deleting', ()=>{
    const data = {
      'id': '3c8da4d5-46e7-baa1-e402aed70d80',
      'username': 'sallyStudent',
      'password': 'c00d1ng1sc00l',
      'favoriteClub': 'Cache Valley Stone Society',
      'newsLetter': 'true'
    };
    return supertest(app)
      .delete(`/user/${data.id}`)
      .expect(404, 'User not found');
    
  });
});