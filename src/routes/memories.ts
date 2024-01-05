import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function memoriesRoutes(app: FastifyInstance) {
	// rota para retornar as memorias
	app.get('/memories', async () => {
		// find menay pega todas as mermorias e ordena das mais antigas para as mais novas 
		const memories = await prisma.memory.findMany({
			orderBy:{
				createdAt: 'asc'
			}
		});
		return memories.map(memory => {
			return {
				id: memory.id,
				coverUrl: memory.coverUrl,
				excerpt: memory.content.substring(0, 115).concat('...')
			};
		});
	});
	// rota par retornar uma momoria em especifico, filtando pelo id 
	app.get('/memories/:id', async (request) => {

		// passando o parametro que no caso é o id o zod fara a verificação se o id é uma string
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});
		// ler esse primeiro
		// para os parametros da requisição e passa para dentro do parmsschema
		const { id } = paramsSchema.parse(request.params);


		const memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});
		return memory;
	});
	// rota para criação de memorias por isso usa-se o post 
	app.post('/memories', async (request) => {
        
		const BodySchema = z.object({
			coverUrl: z.string(),
			content: z.string(),
			// o coerce ele converte valores que pode ser booleans em true ou false 
			// por exemplo, normamente quando é enviado algo ao que seja booblean 
			// esse valor pode retornar como undefined, null, 0 entre outras formas
			// então o corce pega esse valor independente de qual seja e tranforma para boolean(true ou false) 
			isPublic: z.coerce.boolean().default(false)
		});

		const { content, isPublic, coverUrl } = BodySchema.parse(request.body);

		const memory = await prisma.memory.create({
			data:{
				content,
				coverUrl,
				isPublic,
				userId: '7f8467be-0602-44e0-ac3f-9b033761bc12'
			}
		});

		return memory;
	});    

	// atualiza uma memoria
	app.put('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = paramsSchema.parse(request.params);

		const BodySchema = z.object({
			coverUrl: z.string(),
			content: z.string(),
			isPublic: z.coerce.boolean().default(false)
		});

		const { content, isPublic, coverUrl } = BodySchema.parse(request.body);

		const memory = await prisma.memory.update({
			where: {
				id,
			},
			data: {
				content,
				isPublic,
				coverUrl
			}
		});

		return memory;
	});

	// delata uma memoria
	app.delete('/memories/:id', async (request) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = paramsSchema.parse(request.params);

		await prisma.memory.delete({
			where: {
				id,
			},
		});
	});
    
}