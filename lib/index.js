'use strict';

var figo = require('figo');
var log = require('./logger');
var json2csv = require('json2csv');
var moment = require('moment');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var fields = [
    "Date",
    "Payee",
    "Category",
    "Memo",
    "Outflow",
    "Inflow"
];

var figoToYnab = (figoJson) => {
    return _.map(figoJson, function (figoTx) {
        return {
            "Date": moment(figoTx.value_date).format('DD/MM/YYYY'),
            "Payee": figoTx.name,
            "Category": "",
            "Memo": figoTx.purpose,
            "Inflow": figoTx.amount,
            "Outflow": ""
        }
    })
};


class Converter {
    constructor(apiKey, apiSecret, username, password) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.username = username;
        this.password = password;
        this.figoConnection = new figo.Connection(apiKey, apiSecret);
    }

    YNABcsvs(from, to, callback) {
        log.debug('Logging in.');
        this.figoConnection.credential_login(this.username, this.password, null, null, null, null, (err, token) => {
            log.debug('Login attempt completed');
            if (err) {
                return callback(err);
            }
            var accessToken = token.access_token;
            var session = new figo.Session(accessToken);
            log.debug('Getting transactions.');
            session.get_accounts((err, accounts) => {
                if (err) {
                    return callback(err);
                }
                accounts = _.map(accounts, (account) => {
                    return {
                        name: account.name,
                        id: account.account_id
                    }
                });
                log.debug({
                    accounts: accounts
                });
                async.mapSeries(accounts, (account, callback) => {
                    var options = {
                        since: from,
                        account_id: account.id
                    };
                    session.get_transactions(options, (error, transactions) => {
                        if (err) {
                            return callback(err);
                        }
                        transactions = figoToYnab(transactions);
                        json2csv({data: transactions, fields: fields}, (err, csv) => {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null,
                                {
                                    name: account.name,
                                    csv: csv
                                });
                        });
                    });
                }, callback);
            });
        });
    }
    
    saveYNABtoDisk(destination, from, to, callback) {
            this.YNABcsvs(from, to, (err, accounts) => {
                async.each(accounts, (account, callback) => {
                    fs.writeFile(destination + '/' + account.name + '.csv', account.csv, callback);  
                }, callback);
            });
    }
}

module.exports = Converter;