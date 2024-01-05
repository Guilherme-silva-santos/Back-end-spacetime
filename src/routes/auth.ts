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

export async function authRoutes(app: FastifyInstance){
	app.post('/register', async (request) =>{
		const bodyschema = z.object({
			code: z.string(),
		});

		const { code } = bodyschema.parse(request.body);

		//enviando o código e querendo ele de volta com as informações
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

		const { access_token } = accessTokenResponse.data;

		return{
			access_token
		};
	});
}