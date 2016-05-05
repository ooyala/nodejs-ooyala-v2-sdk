#NODE.JS wrapper for OoyalaAPI client API V2


##Usage
This sdk can be used with normal callbacks pattern or with a promise pattern.

###Callback pattern:

```
var Ooyala = require("nodejs-ooyala-sdk");

var _api_secret_key = 'foo secret';
var _api_key = 'foo';

var ooyala = new Ooyala(_api_key, _api_secret_key);

var path = "/v2/assets";
var params = {"where": "asset_type='remote_asset'", "limit": 500};
var body = {};
var onSuccess = function(data){console.log(data)};
var onError = function(error){console.log(error)};

ooyala.get(path, params, body, onSuccess, onError)

```

###Promises pattern

```
var Ooyala = require("nodejs-ooyala-sdk");

var _api_secret_key = 'foo secret';
var _api_key = 'foo';

var ooyala = new Ooyala(_api_key, _api_secret_key);

var path = "/v2/assets";
var params = {};
var body = {};

var onSuccess = function(data){console.log(data)};
var onError = function(error){console.log(error)};

ooyala.get(path, params, body).then(onSuccess, onError);
```
