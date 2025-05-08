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

Introduction

The Events API allows you to subscribe to real-time updates and event notifications from Kick. With webhooks, you can receive instant data about actions like follows, subscriptions, gifted subscriptions, and chat messages directly to your application. This section guides you through setting up your webhook URL to start receiving these events.

To configure your webhook, head to your Kick Developer tab located in your Account Settings. For an existing application, click "Edit" to access its settings. You’ll find a section labeled "Enable Webhooks" with a switch and a textbox below it:

    Switch: Toggle this to "On" to activate webhook event delivery.

    Webhook URL: Enter a publicly accessible URL in the textbox. This is where Kick will send POST requests containing event payloads.

Important: Your webhook URL must be accessible over the public internet. Localhost URLs (e.g. http://localhost:3000) won’t work unless you expose them using tools like Cloudflare Tunnel, ngrok, or similar services. For production, use your Render URL (e.g. https://kick-tool-app-latest.onrender.com/webhook).

Once your webhook is enabled, you’re ready to receive events. Continue to the next section to learn how to verify event payloads using the public key, ensuring they come directly from Kick. Full payload structures and available events are detailed on the Webhook Payloads page.

Webhooks

App Access Tokens and User Access Tokens can access this.
Headers
Header
Type
Short Description

Kick-Event-Message-Id

ULID

Unique message ID, idempotent key

Kick-Event-Subscription-Id

ULID

Subscription ID associated with event

Kick-Event-Signature

Base64 Encode String

Signature to verify the sender

Kick-Event-Message-Timestamp

RFC3339 Date-time

Timestamp of when the message was sent

Kick-Event-Type

string

e.g. channel:write

Kick-Event-Version

string

e.g. 1
Webhook Sender Validation

Kick-Event-Signature header is used to validate if a request has come from the Kick servers. This is to prevent anyone who finds an app's webhook endpoint from sending fake events.
Kick Public Key

This is the Kick public key. Any request that is sent from our servers will have a signature signed by our Private Key, which can be decrypted using this Public Key.

-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/+l1WnlRrGSolDMA+A8
6rAhMbQGmQ2SapVcGM3zq8ANXjnhDWocMqfWcTd95btDydITa10kDvHzw9WQOqp2
MZI7ZyrfzJuz5nhTPCiJwTwnEtWft7nV14BYRDHvlfqPUaZ+1KR4OCaO/wWIk/rQ
L/TjY0M70gse8rlBkbo2a8rKhu69RQTRsoaf4DVhDPEeSeI5jVrRDGAMGL3cGuyY
6CLKGdjVEM78g3JfYOvDU/RvfqD7L89TZ3iN94jrmWdGz34JNlEI5hqK8dd7C5EF
BEbZ5jgB8s8ReQV8H+MkuffjdAj3ajDDX3DOJMIut1lBrUVD1AaSrGCKHooWoL2e
twIDAQAB
-----END PUBLIC KEY-----

The public key can also be fetched from this endpoint.

https://api.kick.com/public/v1/public-key

Public Key
Signature Creation

The signature is created through the concatenation of the following values into a single string, separated by a .:

    Kick-Event-Message-Id

    Kick-Event-Message-Timestamp

    The raw body of the request

signature := []byte(fmt.Sprintf("%s.%s.%s", messageID, timestamp, body))

Once concatenated, the body will be signed with the Kick Private Key.

Subscribe to Events
Get Events Subscriptions
get

Get events subscriptions
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

GET /public/v1/events/subscriptions HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": [
    {
      "app_id": "text",
      "broadcaster_user_id": 1,
      "created_at": "text",
      "event": "text",
      "id": "text",
      "method": "text",
      "updated_at": "text",
      "version": 1
    }
  ],
  "message": "text"
}

Note: The events.name field corresponds to the Kick-Event-Type header defined in Event types
Post Events Subscriptions
post

Subscribe to events via webhooks
Header parameters
Authorizationstring

Bearer
Body
broadcaster_user_idinteger
eventsobject[]
methodstring · enumPossible values:
Responses
200
OK
application/json
Response
object
400
Bad Request
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
post

POST /public/v1/events/subscriptions HTTP/1.1
Host: api.kick.com
Authorization: text
Content-Type: application/json
Accept: */*
Content-Length: 83

{
  "broadcaster_user_id": 1,
  "events": [
    {
      "name": "text",
      "version": 1
    }
  ],
  "method": "webhook"
}

{
  "data": [
    {
      "error": "text",
      "name": "text",
      "subscription_id": "text",
      "version": 1
    }
  ],
  "message": "text"
}

Delete Events Subscriptions
delete

Delete events subscriptions
Query parameters
idstring[]

Event subscription IDs
Header parameters
Authorizationstring

Bearer
Responses
204
No Content
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
delete

DELETE /public/v1/events/subscriptions HTTP/1.1
Host: api.kick.com
Authorization: text
Accept: */*

{
  "data": {},
  "message": "text"
}

Webhook Payloads

Request body payloads for Webhook API requests
Chat Message

Headers
- Kick-Event-Type: “chat.message.sent”
- Kick-Event-Version: “1”

{
  "message_id": "unique_message_id_123",
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null // no identity for broadcasters at the moment
  },
  "sender": {
    "is_anonymous": false,
    "user_id": 987654321,
    "username": "sender_name",
    "is_verified": false,
    "profile_picture": "https://example.com/sender_avatar.jpg",
    "channel_slug": "sender_channel",
    "identity": {
      "username_color": "#FF5733",
      "badges": [
        {
          "text": "Moderator",
          "type": "moderator",
        },
        {
          "text": "Sub Gifter",
          "type": "sub_gifter",
          "count": 5,
        },
        {
          "text": "Subscriber",
          "type": "subscriber",
          "count": 3,
        }
      ]
    }
  },
  "content": "This is a test message with emotes!",
  "emotes": [
    {
      "emote_id": "12345",
      "positions": [
        { "s": 0, "e": 7 }
      ]
    },
    {
      "emote_id": "67890",
      "positions": [
        { "s": 20, "e": 25 }
      ]
    }
  ]
}

Channel Follow

Headers
- Kick-Event-Type: “channel.followed”
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "follower": {
    "is_anonymous": false,
    "user_id": 987654321,
    "username": "follower_name",
    "is_verified": false,
    "profile_picture": "https://example.com/sender_avatar.jpg",
    "channel_slug": "follower_channel",
    "identity": null
  }
}

Channel Subscription Renewal

Headers
- Kick-Event-Type: “channel.subscription.renewal”
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "subscriber": {
    "is_anonymous": false,
    "user_id": 987654321,
    "username": "subscriber_name",
    "is_verified": false,
    "profile_picture": "https://example.com/sender_avatar.jpg",
    "channel_slug": "subscriber_channel",
    "identity": null
  },
  "duration": 3,
  "created_at": "2025-01-14T16:08:06Z",
  "expires_at": "2025-02-14T16:08:06Z"
}

Channel Subscription Gifts

Headers
- Kick-Event-Type: “channel.subscription.gifts”
- Kick-Event-Version: “1”

Public Gift Structure
{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "gifter": {
    "is_anonymous": false,
    "user_id": 987654321, // null if is_anonymous=true
    "username": "gifter_name", // null if is_anonymous=true
    "is_verified": false, // null if is_anonymous=true
    "profile_picture": "https://example.com/sender_avatar.jpg", // null if is_anonymous=true
    "channel_slug": "gifter_channel", // null if is_anonymous=true
    "identity": null // null if is_anonymous=true
  },
  "giftees":
  [
    {
      "is_anonymous": false,
      "user_id": 561654654,
      "username": "giftee_name",
      "is_verified": true,
      "profile_picture": "https://example.com/broadcaster_avatar.jpg",
      "channel_slug": "giftee_channel",
      "identity": null
    }
  ],
  "created_at": "2025-01-14T16:08:06Z",
  "expires_at": "2025-02-14T16:08:06Z"
}

Channel Subscription Created

Headers
- Kick-Event-Type: “channel.subscription.new”
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "subscriber": {
    "is_anonymous": false,
    "user_id": 987654321,
    "username": "subscriber_name",
    "is_verified": false,
    "profile_picture": "https://example.com/sender_avatar.jpg",
    "channel_slug": "subscriber_channel",
    "identity": null
  },
  "duration": 1,
  "created_at": "2025-01-14T16:08:06Z",
  "expires_at": "2025-02-14T16:08:06Z"
}

Livestream Status Updated
Livestream Status Updated - Stream started

Headers
- Kick-Event-Type: "livestream.status.updated"
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "is_live": true,
  "title": "Stream Title",
  "started_at": "2025-01-01T11:00:00+11:00",
  "ended_at": null
}

Livestream Status Updated - Stream ended

Headers
- Kick-Event-Type: "livestream.status.updated"
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "is_live": false,
  "title": "Stream Title",
  "started_at": "2025-01-01T11:00:00+11:00",
  "ended_at": "2025-01-01T15:00:00+11:00"
}

Livestream Metadata Updated

Headers
- Kick-Event-Type: "livestream.metadata.updated"
- Kick-Event-Version: “1”

{
  "broadcaster": {
    "is_anonymous": false,
    "user_id": 123456789,
    "username": "broadcaster_name",
    "is_verified": true,
    "profile_picture": "https://example.com/broadcaster_avatar.jpg",
    "channel_slug": "broadcaster_channel",
    "identity": null
  },
  "metadata": {
    "title": "Stream Title",
    "language": "en",
    "has_mature_content": true,
    "category": {
      "id": 123,
      "name": "Category name",
      "thumbnail": "http://example.com/image123"
    }
  }
}

