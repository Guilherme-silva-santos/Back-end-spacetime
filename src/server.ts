/**
 app restfull é aquela que vai fazer conexão com o front trazendo dados do back
 sempre que for criar uma api, precisamos ter um server http, que é o endereço que o front vai fazer recsições 
 http, esse server recebe as equisições e devolve uma esposta para elas.
 o server ficara ouvindo a porta 3333.
 o then significa, quando o server estiver no ar, então(then) executa uma função
 Prisma fica interceptando a comunicação do do back com o db e ele cria uma forma unificada do back 
 acessar informações do banco com uma linguagem mais apropriada paa devs, para que não seja necessário criar as querys na mão 
 não precisando executar("select, delete e assim por diante")
 npx prisma init --datasource-provider SQLite dizendo deve ser usado um bado swlite no prisma

 Criando tabelas nobando com brisam usase o model

model User{
  id String @id @default(uuid()) @id para que ele seja a primary key 
  uuid para cada user ele ira gerar um id diferente 

  apos fazer o model executar npx priimsa migarte dev para ler o arquivo de schema 
  e detecta todas as alterações que foram feitas
}
*/

import fastify from 'fastify';
import { memoriesRoutes } from './routes/memories';

const app = fastify();

// registrar um arquivo de rotas separado
app.register(memoriesRoutes);

app.listen({
	port: 3333,
}).then(() => {
	console.log('🚀 HTTP server running on http://localhost:3333');
});
