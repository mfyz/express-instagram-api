const express = require('express')
const path = require('path')
const ig = require('instagram-node').instagram()

const PORT = process.env.PORT || 8110

ig.use({
	client_id: process.env.IG_CLIENT_ID,
	client_secret: process.env.IG_CLIENT_SECRET
})

const igRedirecrUri = 'https://mfyz-express-ig-api.herokuapp.com/instagram/callback'

const app = express()
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/login', function (req, res) {
	res.render('login')
})

app.get('/instagram/authorize', function(req, res){
	res.redirect(ig.get_authorization_url(igRedirecrUri, {
		scope: ['public_content', 'likes']
	}))
})

app.get('/instagram/callback', function (req, res) {
	console.log('ig callback received!')
	res.send('OK')
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))