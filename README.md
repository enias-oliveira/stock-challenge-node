---
title: Jobsity - Node Challenge v1.0
language_tabs:
  - shell: Shell
language_clients:
  - shell: ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="jobsity-node-challenge">Jobsity - Node Challenge v1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

The Node Challenge API description for Jobsity

Base URLs:

<h1 id="jobsity-node-challenge-default">Default</h1>

## AppController_register

<a id="opIdAppController_register"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /register`

> Body parameter

```json
{
  "email": "string",
  "role": "admin"
}
```

<h3 id="appcontroller_register-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[RegisterDto](#schemaregisterdto)|true|none|

> Example responses

> 201 Response

```json
{
  "email": "string",
  "password": "string"
}
```

<h3 id="appcontroller_register-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User successfully created|[RegisterResponseDto](#schemaregisterresponsedto)|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_login

<a id="opIdAppController_login"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /login`

> Body parameter

```json
{
  "email": "string",
  "password": "string"
}
```

<h3 id="appcontroller_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[LoginDto](#schemalogindto)|true|none|

> Example responses

> 201 Response

```json
{
  "access_token": "string"
}
```

<h3 id="appcontroller_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Returns access token that expires in 1 hour|[LoginResponseDto](#schemaloginresponsedto)|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_getProfile

<a id="opIdAppController_getProfile"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /profile \
  -H 'Accept: application/json' \
  -H 'Authorization: string'

```

`GET /profile`

<h3 id="appcontroller_getprofile-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|true|Bearer with JWT Token|

> Example responses

> 200 Response

```json
{
  "id": 1,
  "email": "string",
  "role": "admin"
}
```

<h3 id="appcontroller_getprofile-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns profile data enconded in JWT token|[ProfileResponseDto](#schemaprofileresponsedto)|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_updatePassword

<a id="opIdAppController_updatePassword"></a>

> Code samples

```shell
# You can also use wget
curl -X PUT /password?email=string

```

`PUT /password`

<h3 id="appcontroller_updatepassword-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|email|query|string|true|none|

<h3 id="appcontroller_updatepassword-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User was found and new password will be sent to registered e-mail|None|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_getStock

<a id="opIdAppController_getStock"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /stock?q=aapl.us \
  -H 'Accept: application/json' \
  -H 'Authorization: string'

```

`GET /stock`

<h3 id="appcontroller_getstock-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|q|query|string|true|none|
|Authorization|header|string|true|Bearer with JWT Token|

> Example responses

> 200 Response

```json
{
  "date": "2022-06-14T10:32:10.201Z",
  "name": "ALLIANCEBERNSTEIN HOLDING\r",
  "symbol": "AB.US",
  "open": 41.36,
  "high": 41.94,
  "low": 40.05,
  "close": 40.55
}
```

<h3 id="appcontroller_getstock-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns data of requested stock quote|[StockResponseDto](#schemastockresponsedto)|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_getHistory

<a id="opIdAppController_getHistory"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /history \
  -H 'Accept: application/json' \
  -H 'Authorization: string'

```

`GET /history`

<h3 id="appcontroller_gethistory-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|true|Bearer with JWT Token|

> Example responses

> 200 Response

```json
[
  {
    "date": "2022-06-14T10:32:10.201Z",
    "name": "ALLIANCEBERNSTEIN HOLDING\r",
    "symbol": "AB.US",
    "open": 41.36,
    "high": 41.94,
    "low": 40.05,
    "close": 40.55
  }
]
```

<h3 id="appcontroller_gethistory-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns all Stock request by user in JWT Token|Inline|

<h3 id="appcontroller_gethistory-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[StockResponseDto](#schemastockresponsedto)]|false|none|none|
|» date|string|true|none|Date of Quote request formatted in ISO timestamp|
|» name|string|true|none|none|
|» symbol|string|true|none|none|
|» open|number|true|none|none|
|» high|number|true|none|none|
|» low|number|true|none|none|
|» close|number|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## AppController_getStat

<a id="opIdAppController_getStat"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /stat \
  -H 'Accept: application/json' \
  -H 'Authorization: string'

```

`GET /stat`

<h3 id="appcontroller_getstat-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string|true|Bearer with JWT Token that contains the admin role|

> Example responses

> 200 Response

```json
[
  {
    "stock": "aaa.us",
    "times_requested": 3
  }
]
```

<h3 id="appcontroller_getstat-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the five most requested stocks|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|User associated to token does not contain admin role|None|

<h3 id="appcontroller_getstat-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[StockStatDto](#schemastockstatdto)]|false|none|none|
|» stock|string|true|none|none|
|» times_requested|number|true|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_RegisterDto">RegisterDto</h2>
<!-- backwards compatibility -->
<a id="schemaregisterdto"></a>
<a id="schema_RegisterDto"></a>
<a id="tocSregisterdto"></a>
<a id="tocsregisterdto"></a>

```json
{
  "email": "string",
  "role": "admin"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|role|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|role|admin|
|role|user|

<h2 id="tocS_RegisterResponseDto">RegisterResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaregisterresponsedto"></a>
<a id="schema_RegisterResponseDto"></a>
<a id="tocSregisterresponsedto"></a>
<a id="tocsregisterresponsedto"></a>

```json
{
  "email": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

<h2 id="tocS_LoginDto">LoginDto</h2>
<!-- backwards compatibility -->
<a id="schemalogindto"></a>
<a id="schema_LoginDto"></a>
<a id="tocSlogindto"></a>
<a id="tocslogindto"></a>

```json
{
  "email": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string|true|none|none|
|password|string|true|none|none|

<h2 id="tocS_LoginResponseDto">LoginResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaloginresponsedto"></a>
<a id="schema_LoginResponseDto"></a>
<a id="tocSloginresponsedto"></a>
<a id="tocsloginresponsedto"></a>

```json
{
  "access_token": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|access_token|string|true|none|none|

<h2 id="tocS_ProfileResponseDto">ProfileResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemaprofileresponsedto"></a>
<a id="schema_ProfileResponseDto"></a>
<a id="tocSprofileresponsedto"></a>
<a id="tocsprofileresponsedto"></a>

```json
{
  "id": 1,
  "email": "string",
  "role": "admin"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|number|true|none|none|
|email|string|true|none|none|
|role|string|true|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|role|admin|
|role|user|

<h2 id="tocS_StockResponseDto">StockResponseDto</h2>
<!-- backwards compatibility -->
<a id="schemastockresponsedto"></a>
<a id="schema_StockResponseDto"></a>
<a id="tocSstockresponsedto"></a>
<a id="tocsstockresponsedto"></a>

```json
{
  "date": "2022-06-14T10:32:10.201Z",
  "name": "ALLIANCEBERNSTEIN HOLDING\r",
  "symbol": "AB.US",
  "open": 41.36,
  "high": 41.94,
  "low": 40.05,
  "close": 40.55
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|date|string|true|none|Date of Quote request formatted in ISO timestamp|
|name|string|true|none|none|
|symbol|string|true|none|none|
|open|number|true|none|none|
|high|number|true|none|none|
|low|number|true|none|none|
|close|number|true|none|none|

<h2 id="tocS_StockStatDto">StockStatDto</h2>
<!-- backwards compatibility -->
<a id="schemastockstatdto"></a>
<a id="schema_StockStatDto"></a>
<a id="tocSstockstatdto"></a>
<a id="tocsstockstatdto"></a>

```json
{
  "stock": "aaa.us",
  "times_requested": 3
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|stock|string|true|none|none|
|times_requested|number|true|none|none|

