const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const oHost = '192.168.10.14';
const oPort = '7579'
const bodytype = 'json';
const ofarmPath = '/-----/gateway/catm1';         
var req_cnt = 0;

const onem2m_send = function (oPath, content) {
    var results_ci = {};
    results_ci['m2m:cin'] = {};
    results_ci['m2m:cin'].con = content.toString();
    //bodyString = cbor.encode(results_ci).toString('hex');   // CBOR Encoding
    
	bodyString = JSON.stringify(results_ci);
	console.log(bodyString);
    req_cnt++;
    http_request(oPath, 'post', '4', bodyString, function (res, res_body) {        
        console.log('## res_body : ', res_body);
    });
}

function http_request(path, method, ty, bodyString, callback) {
    var options = {
        hostname: oHost,
        port: oPort,
        path: path,
        method: method,
        headers: {
            'X-M2M-RI': '12345',
            'Accept': 'application/' + bodytype,
            'X-M2M-Origin': 'SOrigin',
            'Locale': 'en'
        }
    };

    if(bodyString.length > 0) {
        options.headers['Content-Length'] = bodyString.length;
    }

    if(method === 'post') {
        var a = (ty==='') ? '': ('; ty='+ty);
        options.headers['Content-Type'] = 'application/vnd.onem2m-res+' + bodytype + a;
    }
    else if(method === 'put') {
        options.headers['Content-Type'] = 'application/vnd.onem2m-res+' + bodytype;
    }
    
    var http = require('http');
    var res_body = '';
    var req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            res_body += chunk;
        });

        res.on('end', function () {
            if(bodytype == 'xml') {
                var parser = new xml2js.Parser({explicitArray: false});
                parser.parseString(res_body, function (err, jsonObj) {
                    if (err) {
                        console.log('[http_adn] xml parse error]');
                        var jsonObj = {};
                        jsonObj.dbg = res_body;
                        callback(res, jsonObj);
                    }
                    else {
                        callback(res, jsonObj);
                    }
                });
            }
            else if(bodytype == 'cbor') {
                cbor.decodeFirst(res_body, function(err, jsonObj) {
                    if (err) {
                        console.log('[http_adn] cbor parse error]');
                        var jsonObj = {};
                        jsonObj.dbg = res_body;
                        callback(res, jsonObj);
                    }
                    else {
                        callback(res, jsonObj);
                    }
                });
            }
            else {
                try {
                    var jsonObj = JSON.parse(res_body);
                    callback(res, jsonObj);
                }
                catch (e) {
                    console.log('[http_adn] json parse error]');
                    var jsonObj = {};
                    jsonObj.dbg = res_body;
                    callback(res, jsonObj);
                }
            }
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    //console.log(bodyString);

    console.log(path);
    req.write(bodyString);

    //req.write(bodyString);
    req.end();
}

onem2m_send(ofarmPath, req_cnt);  

