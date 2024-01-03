import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function memoriesRoutes(app: FastifyInstance) {
	// rota para retornar as memorias
	app.get('/momories', async () => {
	});
	// rota par retornar uma momoria em especifico, filtando pelo id 
	app.get('/momories/:id', async () => {

	});
	// rota para criação de memorias por isso usa-se o post 
	app.post('/momories', async () => {

	});    
	// atualiza uma memoria
	app.put('/momories/:id', async () => {

	});
    
}