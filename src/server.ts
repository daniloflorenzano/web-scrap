import * as express from 'express';
import * as puppeteer from 'puppeteer';

const server = express();
const PORT = 3000;

server.get('/', async (req, res) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('http://jornalbeirario.com.br/portal/?cat=18'); // saude

	const postsInformation = await page.evaluate(() => {
		const titleSelector = document.querySelectorAll('.entry-title > a');
		const textSelector = document.querySelectorAll('.entry-content > p');
		const imageSelector = document.querySelectorAll(
			'.featured-image > a > img'
		);

		const posts = [];

		for (let i = 0; i < titleSelector.length; i++) {
			posts.push({
				titulo: titleSelector[i].innerHTML,
				texto: textSelector[i].innerHTML,
				urlImagem: imageSelector[i].getAttribute('src').replace('/', ''),
			});
		}
		return Object.assign({}, posts); // convertendo para objeto
	});

	await browser.close();

	res.send({
		materias: postsInformation,
	});
});

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
