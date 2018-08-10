# Angular Universal on Google App Engine

## Project setup

    ng new ng-on-gae
    cd ng-on-gae

## Add Universal module & build target

    ng g universal --clientProject ng-on-gae

## Create node server

    cat >server.js <<'EOD'
    'use strict';
    require('zone.js/dist/zone-node');

    const express = require('express');
    const ngUniversal = require('@nguniversal/express-engine');
    const appServer = require('./dist/ng-on-gae-server/main');
    const app = express();

    function angularRouter(req, res) {
        res.render('index', { req, res });
    }

    app.get('/', angularRouter);
    app.use(express.static(`${__dirname}/dist/ng-on-gae`));
    app.engine('html', ngUniversal.ngExpressEngine({
        bootstrap: appServer.AppServerModuleNgFactory
    }));
    app.set('view engine', 'html');
    app.set('views', 'dist/ng-on-gae');
    app.get('*', angularRouter);

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
    EOD

Add dependencies

    yarn add @nguniversal/express-engine express

## Define the start command

Change in `package.json` section `scripts` eg.

    "start:dev": "ng serve",
    "start": "node server.js",

## Build JS bundles

    ng build --prod
    ng run ng-on-gae:server

You can now run the server locally, eg.

    PORT=5000 yarn start

## Google App Engine

Create project, setup billing and enable necessary APIs

    gcloud projects create some-very-descriptive-name
    gcloud config set project some-very-descriptive-name
    gcloud beta billing accounts list  ## locate the ID
    gcloud beta billing projects link some-very-descriptive-name --billing-account=ID
    gcloud services enable cloudbuild.googleapis.com

Define GAE runtime

    echo 'runtime: nodejs8' >app.yaml

Deploy to GAE

    gcloud app deploy

Now you can see the SSR content

    curl https://some-very-descriptive-name.appspot.com
