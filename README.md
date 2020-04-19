# RiverLA Volunteer Match

This application automates RiverLA's Volunteer Facilitation Program.

## Setting up your development environment

We highly recommend using [Visual Studio Code](https://code.visualstudio.com/) for your development environment. It comes with a good amount of useful functionality out of the box. Additionally, the following extensions are quite useful:

- Bracket Pair Colorizer
- ESLint
- GitLens

## Team Members

- [Anthony Wiencko](https://github.com/wiencko)
- [Daniel Koo](https://github.com/dkoodev)
- [Madelyn Dubuk](https://github.com/madelyndubuk)
- [Olivia Hong](https://github.com/olivia-hong)
- [Peidi Xie](https://github.com/cx1802)
- [Quinn Ngo](https://github.com/quinnngo)
- [Stacy Phan](https://github.com/stacyvp)
- [Teresa Liu](https://github.com/teresaliu20)
- [Yash Chandak](https://github.com/yash-chandak)

## Running the app

In order to run the app in a local environment, run `npm run dev`.

## Deploying the app

Our webhook is deployed via Heroku in the app `riverla-production`, which has been integrated with this github repository. We use manual deploys to deploy the master branch of this repo. This can be done through the Heroku Dashboard (a tutorial on how to do manual deploys can be found [here](https://devcenter.heroku.com/articles/github-integration#manual-deploys)). Anytime a change is made to the master branch that must be pushed to production, we must manually deploy our app. The login credentials for the the Heroku account can be found in our Notion board. 

All environment variables must be added to our Heroku deploy's configuration as Config Variables. This can be done onine through the [Heroku Dashboard](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard) or in the command line through the [Heroku CLI](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-cli).

For debugging, it is useful to know how to print the logs of incoming requests made to our webhook and the status of our deploy. To do so, make sure you have the Heroku CLI set up (download instructions [here](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)). To print out logs in a realtime stream, run the command: `heroku logs -a riverla-production --tail`

To connect our webhook to NationBuilder, we add our app's URL to the [webhook](https://larivercorp.nationbuilder.com/admin/webhooks/new) section. Our  webhook is deployed at:  https://riverla-production.herokuapp.com/webhooks/nationbuilder/personCreated


## Useful Links

- [AirTable API Documentation](https://airtable.com/appEHr8iHguvEfXTQ/api/docs#curl/introduction)
- [NationBuilder Admin Panel](http://larivercorp.nationbuilder.com/admin/)
- [SendGrid Dashboard](https://app.sendgrid.com/)
