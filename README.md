# Express Instagram API App

Create .env file and set up instagram application in developer page. Then add your app id and secret in .env file:

```
IG_CLIENT_ID=903dd1............968e431
IG_CLIENT_SECRET=400b5f...............3f1c7749b9
IG_REDIRECT_URI=https://my-ig-app.herokuapp.com/instagram/callback
```

Then install dependencies and run the application:

```
npm install
mode index.js
```


### To deploy on heroku

1. heroku login
2. heroku create
3. git push heroku master


### To set up env variables on heroku:

1. ```heroku config:set IG_CLIENT_ID='...'```
2. ```heroku config:set IG_CLIENT_SECRET='...'```
3. ```heroku config:set IG_REDIRECT_URI='...'```
