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
