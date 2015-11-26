NODE.JS wrapper for OoyalaAPI client API

##Usage
```
var Ooyala = require("nodejs-ooyala-sdk");

var _api_secret_key = 'foo';
var _api_key = 'foo secret';

ooyala = new Ooyala(_api_secret_key, _api_key);

path = "/v2/assets";
params = {"where": "asset_type='remote_asset'", "limit": 500};
body = {};
onSuccess = function(data){console.log(data)};
onError = function(error){console.log(error)};

ooyala.get(path, params, body, onSuccess, onError)

```
