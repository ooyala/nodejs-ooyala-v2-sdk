#NODE.JS wrapper for OoyalaAPI client API V2


##Usage
This sdk can be used with normal callbacks pattern or with a promise pattern.

###Callback pattern:

```
var Ooyala = require("nodejs-ooyala-sdk");

var _api_secret_key = 'foo secret';
var _api_key = 'foo';

ooyala = new Ooyala(_api_key, _api_secret_key);

path = "/v2/assets";
params = {"where": "asset_type='remote_asset'", "limit": 500};
body = {};
onSuccess = function(data){console.log(data)};
onError = function(error){console.log(error)};

ooyala.get(path, params, body, onSuccess, onError)

```

###Promises pattern

```
var Ooyala = require("nodejs-ooyala-sdk");

var _api_secret_key = 'foo secret';
var _api_key = 'foo';

ooyala = new Ooyala(_api_key, _api_secret_key);

path = "/v2/assets";
params = {};
body = {};

onSuccess = function(data){console.log(data)};
onError = function(error){console.log(error)};

promise = ooyala.get(path, params, body);

promise.then(onSuccess, onError);
```
