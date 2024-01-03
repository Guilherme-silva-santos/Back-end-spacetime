import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
	// vai dar um log para qualquer query executada no back
	log: ['query']
});