import { app } from '../../../src/app'
import supertest from 'supertest'

export const request = supertest(app)
