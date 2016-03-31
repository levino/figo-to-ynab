"use strict";
var Converter = require('../index.js');
var moment = require('moment');
var converter = new Converter(process.env.API_KEY, process.env.API_SECRET, process.env.USERNAME, process.env.PASSWORD);

describe('Simple Tests', () => {
    it('should get all transactions', (done) => {
        converter.saveYNABtoDisk('./reports', moment("2016-03-30").toDate(), null, (err) => {
            if (err) {
                return done(err);
            }
            done();
        })
    })
});