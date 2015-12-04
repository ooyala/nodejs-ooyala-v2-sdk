var crypto = require('crypto');
var http = require('http');
var url = require('url');

var OO;

function Ooyala (apiKey, apiSecretKey, expireInMinutes) {
  this._apiSecretKey = apiSecretKey;
  this._apiKey = apiKey;
  this._apiUrl = 'api.ooyala.com';
  this._expireInMinutes = expireInMinutes || 120;
}

OO = Ooyala.prototype;

OO.get = function(path, params, body, onSuccess, onError) {
  return this._request('GET', this._buildPath('GET', path, params, body), body, onSuccess, onError);
}

OO.post = function(path, params, body, onSuccess, onError) {
  return this._request('POST', this._buildPath('POST', path, params, body), body, onSuccess, onError);
}

OO.patch = function(path, params, body, onSuccess, onError) {
  return this._request('PATCH', this._buildPath('PATCH', path, params, body), body, onSuccess, onError);
}

OO.put = function(path, params, body, onSuccess, onError) {
  return this._request('PUT', this._buildPath('PUT', path, params, body), body, onSuccess, onError);
}

OO.delete = function(path, params, body, onSuccess, onError) {
  return this._request('DELETE', this._buildPath('DELETE', path, params, body), body, onSuccess, onError);
}

OO.uploadFile = function(method, url, file, onSuccess, onError) {
  if (onSuccess != null) {
    this._sendBytes(method, url, file, onSuccess, onError);
  } else {
    return new Promise(function(resolve, reject) { 
      this._sendBytes(method, url, file, resolve, reject);
    }.bind(this));
  }
}

OO._request = function(method, url, body, onSuccess, onError) {
  if (onSuccess != null) {
    this._curl(method, url, body, onSuccess, onError);
  } else {
    return new Promise(function(resolve, reject) { 
      this._curl(method, url, body, resolve, reject);
    }.bind(this));
  }
}

OO._sendBytes = function(method, urlToUpload, file, onSuccess, onError) {
  var headers= {
    'Content-Type': 'multipart/mixed',
    'Content-Length': file.length
  }

  var urlInfo = url.parse(urlToUpload);

  var options = {
    host: urlInfo.hostname,
    path: urlInfo.path,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('binary');
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      if (res.statusCode === 200 || res.statusCode === 204) {
        onSuccess(data);
      } else {
        var error = {
          statusCode : res.statusCode,
          body : data
        };
        onError(error)
      }
    });
  });

  req.on('error', function(error) {
    onError(error);
  });

  req.write(file);
  req.end();
}

OO._buildPath = function(method, path, params, body) {
  var expires = (new Date()).getTime() + (this._expireInMinutes * 60 * 1000);

  params.api_key = this._apiKey;
  params.expires = expires;

  var signature = this._generateSignature(method.toUpperCase(), path, params, body);
  var url = path + '?'+ this._objectToUrlParams(params) + '&signature=' + signature;

  return url;
}

OO._objectToUrlParams = function(o) {
  var str = '';

  for (var key in o) {
    if (str != '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(o[key]);
  }

  return str;
}

OO._curl = function(method, path, body, onSuccess, onError) {
  var headers = {};
  body = _isEmpty(body) ? null : body;
  headers['Content-length'] = body ? JSON.stringify(body).length : 0;

  var options = {
    host: this._apiUrl,
    path: path,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      if (res.statusCode === 200 || res.statusCode === 204) {
        onSuccess(data);
      } else {
        var error = {
          statusCode : res.statusCode,
          body : data
        };
        onError(error)
      }
    });
  });

  req.on('error', function(error) {
    onError(error);
  });

  req.write(JSON.stringify(body));
  req.end();
}

OO._generateSignature = function(httpMethod, requestPath, queryParams, requestBody) {
  requestBody = _isEmpty(requestBody) ? null : requestBody;

  stringToSign = this._apiSecretKey;
  stringToSign += httpMethod.toUpperCase() + requestPath;
  sortedParams = _sortObject(queryParams);
  stringToSign += _arrayToString(sortedParams);
  stringToSign += requestBody ? JSON.stringify(requestBody) : '';

  return encodeURIComponent(crypto.createHash('sha256').update(
    stringToSign).digest('base64').substring(0, 43));
}

function _isEmpty(object) {
  return Object.keys(object).length === 0
}

function _sortObject(object) {
  var arraySorted = [];
  var i;
  for(i in object) { 
    if (object.hasOwnProperty(i)) {
      arraySorted.push([i,object[i]]);
    }
  }
  arraySorted.sort(function(a,b) { return a[0]>b[0]?1:-1; })
  return arraySorted;
}

function _arrayToString(array) {
  var response = "";
  for (var i = 0; i < array.length; i++) {
    response += array[i][0] + "=" + array[i][1]
  }
  return response;
}

module.exports = Ooyala;
