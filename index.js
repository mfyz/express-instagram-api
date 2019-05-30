const express = require('express')
const path = require('path')
const ig = require('instagram-node').instagram()
const session = require('express-session')

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
app.use(session({
	secret: 'keyboard cat on instagram',
	cookie: { secure: true, maxAge: 60000 },
	resave: true,
	saveUninitialized: true
}))

app.get('/', (req, res) => {
	res.render('index', { message: 'Go ahead and login with Instagram' })
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
		if(err) return res.send(err)
		// store token in db and create a browser session id to use the token from db
		// method below is not secure at all
		req.session.igAccessToken = result.access_token
		res.redirect('/instagram/photos')
	})
})

app.get('/instagram/photos', (req, res) => {
	// use ig token from db (that is linked to the browser session id)
	const accessToken = req.session.igAccessToken

	console.log(req.session.igAccessToken)
	return res.json(req.session.igAccessToken)

	try {
		ig.use({ access_token: accessToken })

		// access token format: 1654560409.903ee15.416181f715cc44f99f9cf5b
		const userId = accessToken.split('.')[0]
		
		ig.user_media_recent(userId, (err, result, pagination, remaining, limit) => {
			if(err) return res.render('error')
			// console.log('instagram recent photos api call result', result)
			return res.json(result)
			res.render('photos', { photos: result })
		})
	}
	catch (e) {
		res.render('error')
	}
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))