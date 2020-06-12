'use strict';

const Discord = require('discord.js');
const { DefaultOptions } = require('../util/Constants');
const EventLoader = require('./events/EventLoader');
const Loader = require('./loader/Loader');
const Managers = require('../managers/Managers');

class Client {

    /**
     * @param {Object} options - Options for the client
     */
    constructor(options = {}) {

        this.bot = new Discord.Client();

        /**
         * Sets default properties on an object that aren't already specified.
         * @type {Object}
         */
        this.options = Discord.Util.mergeDefault(DefaultOptions, options);

        this.managers = new Managers();

        /**
         * Load all listeners.
         */
        EventLoader(this);

    }

    start() {
        this.bot
            .login(this.options.token)
            .catch(console.error);
    }

    /**
     * @param {string} action
     * @param {string} filename
     * @return {Promise<Error|void>}
     */
    load(action, filename) {
        return new Promise((resolve, reject) => {

            const res = Loader.load(this, action, filename);

            if (res instanceof Error) reject(res);
            else resolve();

        });
    }

}

module.exports = Client;
