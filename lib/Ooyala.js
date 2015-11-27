var crypto = require('crypto');
var http = require('http');
var _ = require("underscore");

var OO = Ooyala.prototype;

function Ooyala (api_secret_key, api_key) {
  this._api_secret_key = api_secret_key;
  this._api_key = api_key;
  this._api_url = 'api.ooyala.com';
}

OO.get = function(path, params, body, onSuccess, onError){
  if(onSuccess != null){
    this._curl("GET", this._buildPath("GET", path, params, body), body, onSuccess, onError);
  }else{
    return new Promise(function(resolve, reject){ 
      this._curl("GET", this._buildPath("GET", path, params, body), body, resolve, reject);
    }.bind(this));
  }
}

OO.post = function(path, params, body, onSuccess, onError) {
  if(onSuccess != null){
    this._curl("POST", this._buildPath("POST", path, params, body), body, onSuccess, onError);
  }else{
    return new Promise(function(resolve, reject){ 
      this._curl("POST", this._buildPath("POST", path, params, body), body, resolve, reject);
    }.bind(this));
  }
}

OO.patch = function(path, params, body, onSuccess, onError) {
  if(onSuccess != null){
    this._curl("PATCH", this._buildPath("PATCH", path, params, body), body, onSuccess, onError);
  }else{
    return new Promise(function(resolve, reject){ 
      this._curl("PATCH", this._buildPath("PATCH", path, params, body), body, resolve, reject);
    }.bind(this));
  }
}

OO.delete = function(path, params, body, onSuccess, onError) {
  if(onSuccess != null){
    this._curl("DELETE", this._buildPath("DELETE", path, params, body), body, onSuccess, onError);
  }else{
    return new Promise(function(resolve, reject){ 
      this._curl("DELETE", this._buildPath("DELETE", path, params, body), body, resolve, reject);
    }.bind(this));
  }
}

OO._buildPath = function(method, path, params, body){
  var expires = (new Date).getTime() + (2*60*60*1000);

  params["api_key"] = this._api_key;
  params["expires"] = expires;

  var signature = this._generateSignature(method.toUpperCase(), path, params, body);
  var url = path + '?'+ this._objectToUrlParams(params) + '&signature=' + signature;

  return url;
}

OO._objectToUrlParams = function(o){
  var str = "";

  for (var key in o) {
    if (str != "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(o[key]);
  }

  return str;
}

OO._curl = function(method, path, body, onSuccess, onError){
  headers = {};
  body = _.isEmpty(body) ? null : body;
  headers['Content-length'] = body ? JSON.stringify(body).length : 0;

  var options = {
    host: this._api_url,
    path: path,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      if(res.statusCode !== 200){
        error = {};
        error.statusCode = res.statusCode;
        error.body = data
        onError(error)
      }else{
        onSuccess(data);
      }
    });
  });

  req.on('error', function(error) {
    onError(error);
  });

  req.write(JSON.stringify(body));
  req.end();
}

OO._generateSignature = function(httpMethod, requestPath, queryParams, requestBody){
  requestBody = _.isEmpty(requestBody) ? null : requestBody;

  string_to_sign  = this._api_secret_key;
  string_to_sign += httpMethod.toUpperCase() + requestPath;
  sorted_params   = this._sortObject(queryParams);
  string_to_sign += this._arrayToString(sorted_params);
  string_to_sign += requestBody ? JSON.stringify(requestBody) : '';

  return encodeURIComponent(crypto.createHash('sha256').update(
    string_to_sign).digest('base64').substring(0, 43));
}

OO._sortObject = function(o) {
  var a = [],i;
  for(i in o){ 
    if(o.hasOwnProperty(i)){
      a.push([i,o[i]]);
    }
  }
  a.sort(function(a,b){ return a[0]>b[0]?1:-1; })
  return a;
}

OO._arrayToString = function(a) {
  var r = "";
  for (var i = 0; i < a.length; i++) {
    r += a[i][0] + "=" + a[i][1]
  }
  return r;
}

module.exports = Ooyala;
