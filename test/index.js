'use_strict';

(async function() {

    const path = require('path');

    const { token } = require('./auth.js');
    const Noob = require('../src');

    const noob = new Noob.Client({
        token: token,
        prefix: '!',
        activity: {
            name: 'des grenouilles.',
            type: 'WATCHING'
        },
        scripts: './scripts/',
        checks: './checks/'
    });

    await noob.load('command', './cmdtest.yml');
    await noob.load('ready', './actiontest.yml');

    noob.start();

})();
