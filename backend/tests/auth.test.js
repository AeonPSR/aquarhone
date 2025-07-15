const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

beforeAll(async () => {
	await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
	await mongoose.connection.collection('users').deleteMany({ email: 'testuser@example.com' });
	await mongoose.disconnect();
});

describe('Auth Routes', () => {
	it('should register a new user', async () => {
		const res = await request(app).post('/api/auth/register').send({
		name: 'Test',
		email: 'testuser@example.com',
		password: 'aaaaa123',
		});

		expect(res.statusCode).toBe(201);
		expect(res.body.message).toBe('User registered');
	});
});
