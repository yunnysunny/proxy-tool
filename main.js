/**
* Copyright (c) <2016-> <yunnysunny@gmail.com>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* @lisence MIT
* @author gaoyang  <yunnysunny@gmail.com>
*/
var fs = require('fs');
var path = require('path');
var request = require('request');
var async = require('async');
var params = require('commander');
var package = require('./package');

const TEST_URL = 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
const TIME_OUT = 10 * 1000;

function readLines(input, callback) {
    var remaining = '';
    var array = [];
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            array.push(line);
            index = remaining.indexOf('\n');
        }

    });

    input.on('end', function() {
        if (remaining.length > 0) {
            array.push(remaining);
        }
        callback(array);
    });
}

params.version(package.json)
  .option('-d, --data [file]', 'Data file','data.txt')
  .option('-u, --url [link]', 'Test url',TEST_URL)
  .option('-t, --timeout [seconds]', 'Request timeout seconds',TIME_OUT)
  .option('-c, --config [file]', 'All the config file')
  .parse(process.argv);


var testUrl = params.url;
var timeout =params.timeout;
var data = params.data;
if (params.config) {
    if (fs.existsSync(path.resolve(params.config))) {
        try {
            var config = require(params.config);
            data = config.data || data;
            testUrl = config.url || testUrl;
            timeout = config.timeout || timeout;
        } catch (e) {
            console.warn('Parse config file %s error',params.config,e);
        }
    } else {
        console.warn('The config file %s does not exists.',params.config);
    }

} 
var file =fs.createReadStream(path.resolve(data));
var success = [];


readLines(file,function(array) {
    if (array && array.length > 0) {
        var i = 0;
        async.each(array, function(line, callback) {
            var index = i++;
            console.log('Processing line ['+index+']:' + line);
            var data = line.split(':');
            if( data.length < 2 ) {
                console.error('Line ['+index+'] is dirty.');      
                return callback();          
            }
            
            var r = request.defaults({'proxy':'http://' + data[0] + ':' + data[1]});
            r.get({
                url:testUrl, timeout:timeout
            },function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    success.push(line);
                    console.info('Line ['+index+'] is ok');
                } else {
                    console.error('Line ['+index+'] is failed');
                }
                callback();
            });
            
        }, function(err) {
            console.info('total test num:' + array.length,'success num:'+success.length);
            if (success.length) {
                console.log(success);
            }
            
        });
    }
});