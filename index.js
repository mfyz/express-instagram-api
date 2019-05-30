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

	// access token format: 1654560409.903ee15.416181f715cc44f99f9cf5b
	const userId = accessToken.split('.')[0]

	ig.use({
		access_token : accessToken
	})
	
	ig.user_media_recent(userId, (err, result, pagination, remaining, limit) => {
		if(err) return res.render('error')
		// console.log('instagram recent photos api call result', result)
		return res.json(result)
		res.render('photos', { photos: result })
	})
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))