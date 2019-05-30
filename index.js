const express = require('express')
const path = require('path')
const ig = require('instagram-node').instagram()

const PORT = process.env.PORT || 8110

ig.use({
	client_id: process.env.IG_CLIENT_ID,
	client_secret: process.env.IG_CLIENT_SECRET
})

const igRedirecrUri = 'https://mfyz-express-ig-api.herokuapp.com/instagram/callback'
let accessToken = null

const app = express()
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
	res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.get('/instagram/authorize', (req, res) => {
	res.redirect(ig.get_authorization_url(igRedirecrUri, {
		scope: ['public_content', 'likes']
	}))
})

app.get('/instagram/callback', (req, res) => {
	console.log('ig callback received!')
	ig.authorize_user(req.query.code, igRedirecrUri, (err, result) => {
		if(err) res.send(err)
		accessToken = result.access_token // store token in db and create a browser session id to use the token from db
		res.redirect('/instagram/photos')
	})
})

app.get('/instagram/photos', (req, res) => {
	// use ig token from db (that is linked to the browser session id)

	// access token format:
	// 1654560409.903dd15.416181f715cc44f99f9cf5b9a9f6c169

	ig.use({
		access_token : accessToken
	})
	
	ig.user_media_recent(accessToken.split('.')[0], (err, result, pagination, remaining, limit) => {
		if(err) res.json(err)
		console.log('instagram recent photos api call result')
		console.log(result)
		res.send(result)
		// res.render('pages/index', { instagram : result })
	})
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))