Scopes

Scopes enable an app to request a level of access to Kick and define the specific actions an application can perform.

These scopes are for apps using OAuth 2.1 authorization code grants for authorization. The title is displayed to the user on the consent screen during the authorization flow.
Scope
Summary
Description

user:read

Read user info

View user information in Kick including username, streamer ID, etc.

channel:read

Read channel info

View channel information in Kick including channel description, category, etc.

channel:write

Update channel info

Update livestream metadata for a channel based on the channel ID

chat:write

Write to chat

Send chat messages and allow chat bots to post in your chat

streamkey:read

Read stream key

Read a user's stream URL and stream key

events:subscribe

Subscribe to events

Subscribe to all channel events on Kick e.g. chat messages, follows, subscriptions

Categories

Categories APIs allow you to use and interact with the categories that are available on the Kick website.
Get Categories
get

Get Categories based on the search word. Returns up to 100 results at a time; use the page parameter to get more results.
Query parameters
qstring

Search query
pageinteger

Page (defaults to 1 if not provided)
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
500
Internal Server Error
application/json
get

GET /public/v1/categories HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": [
    {
      "id": 1,
      "name": "text",
      "thumbnail": "text"
    }
  ],
  "message": "text"
}

Get Category
get

Get Category based on the id.
Path parameters
categoryIDinteger
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
get

GET /public/v1/categories/:category_id HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": {
    "id": 1,
    "name": "text",
    "thumbnail": "text"
  },
  "message": "text"
}
Users

User APIs allow apps to interact with user information. Scopes will vary and sensitive data will be available to User Access Tokens with the required scopes.
Token Introspect
post

Get information about the token that is passed in via the Authorization header. This function is implements part of the on the OAuth 2.0 spec for token introspection. Find the full spec here: https://datatracker.ietf.org/doc/html/rfc7662 When active=false there is no additional information added in the response.
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
500
Internal Server Error
application/json
post

POST /public/v1/token/introspect HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": {
    "active": true,
    "client_id": "text",
    "exp": 1,
    "scope": "text",
    "token_type": "text"
  },
  "message": "text"
}

Get Users
get

Retrieve user information based on provided user IDs. If no user IDs are specified, the information for the currently authorised user will be returned by default.
Query parameters
idinteger[]

User IDs
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
get

GET /public/v1/users HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": [
    {
      "email": "text",
      "name": "text",
      "profile_picture": "text",
      "user_id": 1
    }
  ],
  "message": "text"
}

Channels

Channels APIs allow an app to interact with channels in the Kick website. Available data will depend on the scopes attached to the authorization token used.
Get Channels
get

Retrieve channel information based on provided broadcaster user IDs or channel slugs. You can either:

    Provide no parameters (returns information for the currently authenticated user)
    Provide only broadcaster_user_id parameters (up to 50)
    Provide only slug parameters (up to 50, each max 25 characters) Note: You cannot mix broadcaster_user_id and slug parameters in the same request.

Query parameters
broadcaster_user_idinteger[]

Broadcaster User IDs (cannot be used with slug)
slugstring[]

Channel slugs (cannot be used with broadcaster_user_id)
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
400
Invalid parameters or mixed parameter types
application/json
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
get

GET /public/v1/channels HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": [
    {
      "banner_picture": "text",
      "broadcaster_user_id": 1,
      "category": {
        "id": 1,
        "name": "text",
        "thumbnail": "text"
      },
      "channel_description": "text",
      "slug": "text",
      "stream": {
        "is_live": true,
        "is_mature": true,
        "key": "text",
        "language": "text",
        "start_time": "text",
        "thumbnail": "text",
        "url": "text",
        "viewer_count": 1
      },
      "stream_title": "text"
    }
  ],
  "message": "text"
}

Patch Channels
patch

Updates livestream metadata for a channel bassed on the channel ID.
Header parameters
Authorizationstring

Bearer
Body
category_idinteger
stream_titlestring
Responses
204
No Content
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
patch

PATCH /public/v1/channels HTTP/1.1
Host: api.kick.com
Authorization: text
Content-Type: application/json
Accept: */*
Content-Length: 39

{
  "category_id": 1,
  "stream_title": "text"
}

No content

Chat

Chat APIs allow you to use and interact with the chat that is available on the Kick website. You can send a message as a Bot account or your User account.
Post Chat Message
post

Post a chat message to a channel as a user or a bot. When sending as a user, the broadcaster_user_id is required. Whereas when sending as a bot, the broadcaster_user_id is not required and is ignored. As a bot, the message will always be sent to the channel attached to your token.
Header parameters
Authorizationstring

Bearer
Body
broadcaster_user_idinteger
contentstring · max: 500
reply_to_message_idstring
typestring · enumPossible values:
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
post

POST /public/v1/chat HTTP/1.1
Host: api.kick.com
Authorization: text
Content-Type: application/json
Accept: */*
Content-Length: 85

{
  "broadcaster_user_id": 1,
  "content": "text",
  "reply_to_message_id": "text",
  "type": "user"
}

{
  "data": {
    "is_sent": true,
    "message_id": "text"
  },
  "message": "text"
}

Livestreams

Livestreams APIs allow an app to interact with livestreams in the Kick website. Available data will depend on the scopes attached to the authorization token used.
Get Livestreams
get

Get Livestreams based on broadcaster_user_id, category_id, language, limit, and sort.
Query parameters
broadcaster_user_idinteger

User ID of the broadcaster
category_idinteger

Category ID
languagestring

Language of the livestream
limitinteger · min: 1 · max: 100

Limit the number of results
sortstring · enum

Sort by viewer_count or started_at
Possible values:
Header parameters
Authorizationstring

Bearer
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
403
Forbidden
application/json
500
Internal Server Error
application/json
get

GET /public/v1/livestreams HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": [
    {
      "broadcaster_user_id": 1,
      "category": {
        "id": 1,
        "name": "text",
        "thumbnail": "text"
      },
      "channel_id": 1,
      "has_mature_content": true,
      "language": "text",
      "slug": "text",
      "started_at": "text",
      "stream_title": "text",
      "thumbnail": "text",
      "viewer_count": 1
    }
  ],
  "message": "text"
}

Public Key

The Public Key API allows you to retrieve the public key used for verifying signatures.
Get Public Key
get

Retrieve the public key used for verifying signatures.
Responses
200
OK
application/json
Response
object
401
Unauthorized
application/json
500
Internal Server Error
application/json
get

GET /public/v1/public-key HTTP/1.1
Host: api.kick.com
Accept: */*

{
  "data": {
    "public_key": "text"
  },
  "message": "text"
}