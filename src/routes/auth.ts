// rota que recebe o code do cliente do github 
// pega esse código envia par o github e o git retorna o access toke desse código 
// com esse access token voltando para o back, pegamos o teken envia para o git para 
// que com esse token seja pego os dados do usuário
// com os dados em mãos salvamos eles no banco caso ainda não seja cadastrado  
// e caso ele já exista apenas valida esse user para ver se é o mesmo 
// user, e retorna o usuario autenticado para aplicação novamente

import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance){
	app.post('/register', async (request) =>{
		const bodyschema = z.object({
			code: z.string(),
		});

		const { code } = bodyschema.parse(request.body);

		//enviando o código e querendo ele de volta com as informações
		// usando o axios para fazer uma chamada para api do github
		const accessTokenResponse = await axios.post(
			//para onde vai ser feita a req
			'https://github.com/login/oauth/access_token',
			// corpo da req
			null,
			// config da req
			{   
				//parametro da url, o que precisa ser enviado para o github 
				// para retornar os dados do usuário
				params:{
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				},

				headers:{
					// formato com que o github deve retornar a chamada da req(dados do user)
					Accept:'application/json',
				}
			}
		);

		// pegando de dentro da requisição para o github o access token
		const { access_token } = accessTokenResponse.data;

		//pegando as informações do user com o access token, esse access token permite 
		// que busquemos informações como se estivessemos logados com a conta do github do usuario
		
		const userResponse = await axios.get('https://api.github.com/user', {
			headers:{
				//o authorization é um cabeçalho http usadp para fornecer credenciais 
				// de autenticação para acessar recursos protegidos do use
				// o bearer diz que o token de acesso está sendo enviado no cabeçalho
				// o bearer é para especificar que o token está presente e deve ser considerado para autenticação.
				// com isso é possivel ter acesso aos dados do usuário
				// pois temos o header de authorization que para ele é passa o token de acesso para obter os dados 
				// do usuario
				Authorization: `Bearer ${access_token}`
			}
		});

		// validação para os dados do usuario
		const userSchema = z.object({
			id: z.number(),
			login: z.string(),
			name: z.string(),
			avatar_url: z.string().url(),
		});

		// dados do user retornados 
		const userInfo =  userSchema.parse(userResponse.data);
		// usa o parse para percorrer os dados da resposta do usuario
		// então fazer a validação desses dados

		// foi usado o let pois o conteudo da variavel "user"
		// mudou para que fosse feita a criação do usuario
		let user = await prisma.user.findUnique({
			// pega o userid do usuario 
			// e pesquisa por esse user id no banco
			where:{
				githubId: userInfo.id
			}
		});

		if(!user) {
			// caso esse userid não retorne nenhum usuário 
			// então cria um usuario para esse id 

			// mudando o conteudo da let user
			user = await prisma.user.create({
				data:{
					githubId: userInfo.id,
					login: userInfo.login,
					name: userInfo.name,
					avatarUrl: userInfo.avatar_url,
				}
			});
		}

		const token =  app.jwt.sign({
			// quais informações do usuario estarão dentro do token, aqui não devem possuir informações sensiveis
			// aqui estarão presentes informações que serão exibidas na interface, como o nome e o avatar por exemplo
			name: user.name,
			avatarUrl: user.avatarUrl,
		},{
			// a qual user pertence esse token
			sub: user.id,
			// quanto tempo esse token vai durar
			expiresIn: '30 days',
		});

		return{
			token,
		};
	});
}