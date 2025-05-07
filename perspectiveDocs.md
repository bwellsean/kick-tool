You can generate API client libraries using the Google API Client Libraries. There are some examples below of how to set up your API library with some of the most common languages.


Make an AnalyzeComment request

Run one of the sample API calls below to get scores directly from Perspective API.



The AnalyzeComment method issues an API request to analyze the comment.text field for the requestedAttributes, in this case the TOXICITY model. Use the API key you generated as the key parameter. (If you prefer, you can leverage the doNotStore flag to ensure that all submitted comments are automatically deleted after scores are returned.)



Read the API reference documentation for details on all of the request and response fields, as well as the available values for requestedAttributes. There are experimental attributes, such as "obscene", "attack on a commenter", "spam", etc., that you may also use.

 Node.js

Here is a sample request and response using the Node.js version of the Google API Client Libraries.



    Install the Node.js client library or install the npm package googleapis.
    Run the following commands:



    Node.js

Docs > Sample Requests > Node.js
const {google} = require('googleapis');

API_KEY = 'copy-your-api-key-here';
DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

google.discoverAPI(DISCOVERY_URL)
    .then(client => {
      const analyzeRequest = {
        comment: {
          text: 'Jiminy cricket! Well gosh durned it! Oh damn it all!',
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      client.comments.analyze(
          {
            key: API_KEY,
            resource: analyzeRequest,
          },
          (err, response) => {
            if (err) throw err;
            console.log(JSON.stringify(response.data, null, 2));
          });
    })
    .catch(err => {
      throw err;
    });

 const {google} = require('googleapis');



API_KEY = 'copy-your-api-key-here';

DISCOVERY_URL =

    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';



google.discoverAPI(DISCOVERY_URL)

    .then(client => {

      const analyzeRequest = {

        comment: {

          text: 'Jiminy cricket! Well gosh durned it! Oh damn it all!',

        },

        requestedAttributes: {

          TOXICITY: {},

        },

      };



      client.comments.analyze(

          {

            key: API_KEY,

            resource: analyzeRequest,

          },

          (err, response) => {

            if (err) throw err;

            console.log(JSON.stringify(response.data, null, 2));

          });

    })

    .catch(err => {

      throw err;

    });

You should see something like:



Docs > Sample Requests > Node.js 2
{
   "attributeScores":{
      "TOXICITY":{
         "spanScores":[
            {
               "score":{
                  "value":0.4445836,
                  "type":"PROBABILITY"
               }
            }
         ],
         "summaryScore":{
            "value":0.4445836,
            "type":"PROBABILITY"
         }
      }
   },
   "languages":[
      "en"
   ]
}

 {

   "attributeScores":{

      "TOXICITY":{

         "spanScores":[

            {

               "score":{

                  "value":0.4445836,

                  "type":"PROBABILITY"

               }

            }

         ],

         "summaryScore":{

            "value":0.4445836,

            "type":"PROBABILITY"

         }

      }

   },

   "languages":[

      "en"

   ]

}

Which shows that our old timey exclamations get lower toxicity scores.



There is also a ready-made Node.js client, which can be installed from NPM:

npm install perspective-api-client


See the docs on the project's GitHub page.
Overview

Perspective is an API that makes it easier to host better conversations. The following concepts will help you understand how the API uses machine learning models to score the perceived impact a comment might have on a conversation. The API is hosted on Google Cloud Platform, which means you can use it with any popular programming language.


To access the API, review the Get Started documentation.

Key Concepts

Important elements of the API to best understand the reference documentation

Score

A comprehensive overview of scores and how to interact with them

Attributes & Languages

Description of attributes and corresponding language coverage

Model Cards

Overview of machine learning model details and intended use should know

Training Data

Description of how the models are trained and annotations gathered

Methods

The methods available for Perspective API are AnalyzeComment and SuggestCommentScore

Limits & Errors

API limits and commons errors to help you troubleshoot issues

FAQs

The most frequently asked questions to help address your needs

Comment

A comment is the text to be scored. When you send a request to the API, you’ll send the text of a single comment and the response will contain predictions about the perceived impact that comment may have on the conversation. A comment could be a single post to a web page’s comments section, a forum post, a message to a mailing list, a chat message, etc.


Attribute

The Perspective API predicts the perceived impact a comment may have on a conversation by evaluating that comment across a range of emotional concepts, called attributes. When you send a request to the API, you’ll request the specific attributes you want to receive scores for. Perspective’s main attribute is TOXICITY, defined as “a rude, disrespectful, or unreasonable comment that is likely to make you leave a discussion”. Other attributes include PROFANITY, THREAT, SEXUALLY_EXPLICIT, and more (see all attribute types).


Score

The Perspective API predicts the perceived impact a comment may have on a conversation by evaluating that comment across a range of emotional concepts (attributes). When you send a request to the API, you’ll request the specific attributes you want to receive scores for. The score is returned within the API response. It indicates how likely it is that a reader would perceive the comment provided in the request as containing the given attribute. Learn more about the score here


Context (coming soon)

Context is a representation of the conversation context for the comment. This can include text, a URL, or an image, such as the article that is being commented on or another comment that is being replied to. In the future, we hope to use this to improve the analysis of the comment. Currently, our attributes are not making use of context, so sending context won’t change an attribute’s scores.

About the scores

The Perspective API predicts the perceived impact a comment may have on a conversation by evaluating that comment across a range of emotional concepts (attributes). When you send a request to the API, you’ll request the specific attributes you want to receive scores for. The score is returned within the API response.



The only score type currently offered is a probability score. It indicates how likely it is that a reader would perceive the comment provided in the request as containing the given attribute.  For each attribute, the scores provided represent a probability, with a value between 0 and 1. A higher score indicates a greater likelihood that a reader would perceive the comment as containing the given attribute. For example, a comment like “You are an idiot” may receive a probability score of 0.8 for attribute TOXICITY, indicating that 8 out of 10 people would perceive that comment as toxic.

See AnalyzeComment response for additional information.

How to use the scores

You can use this score to give feedback to commenters, help moderators review comments, allow readers to more easily find interesting or productive comments, and more. Case studies here provide some examples and inspiration. Note that Perspective is not intended for some use cases, for example fully automated moderation. See here for the Uses and Limits to learn more about how Perspective can best help you.


Choosing thresholds

Choosing an appropriate threshold depends on the specific use case and a number of additional factors. We suggest initial threshold values for different use cases in the following subsections. Note that these are intended as suggestions rather than as guidelines, and we encourage users to further experiment to determine which values work best for their use case. In general, decreasing the threshold for different decisions increases the likelihood that a given toxic content may be caught, but simultaneously may increase the number of incorrectly flagged comments (false positives). See here to learn more about Uses and Limits.



Supporting human moderators

When using Perspective to support human moderators, the decision on thresholds may depend on available capacity to perform manual reviews, and whether moderation decisions happen before or after the comment is published. For example, an online platform with only a few human moderators might choose to publish all comments scored below 0.9 and hold all comments scored as 0.9 or higher for moderator review, focusing their attention on comments that are most likely to be considered toxic by readers  (9 out of 10 people would consider this comment toxic). On the other hand, a large publisher with a large team of moderators might be able to review every comment, but spend additional time reviewing comments with scores between 0.3 and 0.7, comments about which the model is uncertain.



Providing feedback to comment authors

Thresholds applied in authorship feedback use cases will depend on the specific community guidelines and policies, and the actions to be triggered as a result. For example, a platform could use Perspective API to trigger a warning and invite the commenter to change their wording for comments with scores higher than 0.9 (as 9 out of 10 people would consider such a comment toxic), and send submitted comments scored higher than 0.9 to a moderation queue. See this case study for an example of this type of feedback.



Research

Researchers should consider which application of Perspective best matches their intent. For social science researchers using Perspective to study harassment, we recommend experimenting with thresholds of 0.7 or 0.9, similar to typical moderation use cases. By comparison, machine learning researchers using Perspective to filter potentially toxic content from their data should use higher thresholds, like 0.9 or 0.95, as low thresholds increase the potential for bias. Another researcher might analyze all comments with scores 0.7 or higher when researching false positives in machine learning models (see here for an example of such research).


Why the score might change

Perspective models are not automatically learning all the time, but we update our models regularly. Before updating, we thoroughly test to ensure models meet a high quality bar (see Model Cards for the results of these tests). We also use score normalization techniques to maintain consistent scoring across model versions. This means that if you select a particular score threshold to use in your system, you will not need to update that threshold when the models update. However you may see that a specific score changed as a result of an update. Note that we are not able to notify users each time an update is released.


How we get the scores

See this page to learn about how we get the scores and how our models are trained.


Span and summary scores

For longer comments, the API can return a score for each individual sentence of the comment sent with the request. This can help moderators to identify the specific part of a longer comment that contains toxicity. This score is only available for some attributes.



The summary score is the overall score for a particular attribute for the entire comment.


What if you disagree with the score?

The SuggestCommentScore endpoints lets you give the API feedback by allowing you to suggest a score that you think the API should have returned. You can use this method if you disagree with a score and would like to improve the attribute. All submissions to SuggestCommentScore are stored and may be used to improve the API and related services.



This method should not be used for private data (i.e., for data that is not accessible publicly), or if the data submitted contains content written by someone under 13 years old (or the relevant age determined by applicable law in your jurisdiction).

 Attributes

The Perspective API predicts the perceived impact a comment may have on a conversation by evaluating that comment across a range of emotional concepts, called attributes. When you send a request to the API, you’ll request the specific attributes you want to receive scores for. Perspective’s main attribute is TOXICITY, defined as “a rude, disrespectful, or unreasonable comment that is likely to make you leave a discussion”.



See all attributes, types (production or experimental), and available languages in the table below.



Join the perspective-announce email group to stay in the loop on important information about new attributes, updates to existing attributes, deprecations, and language releases.


Production attributes

Production attributes (prod.) have been tested across multiple domains and trained on significant amounts of human-annotated comments. We recommend using production attributes for your API requests.












Attribute name



Description



Available Languages






TOXICITY



A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.



Arabic (ar), Chinese (zh), Czech (cs), Dutch (nl), English (en), French (fr), German (de), Hindi (hi), Hinglish (hi-Latn), Indonesian (id), Italian (it), Japanese (ja), Korean (ko), Polish (pl), Portuguese (pt), Russian (ru), Spanish (es)






SEVERE_TOXICITY



A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.



de, en, es, fr, it, pt, ru






IDENTITY_ATTACK



Negative or hateful comments targeting someone because of their identity.



de, en, es, fr, it, pt, ru






INSULT



Insulting, inflammatory, or negative comment towards a person or a group of people.



de, en, es, fr, it, pt, ru






PROFANITY



Swear words, curse words, or other obscene or profane language.



de, en, es, fr, it, pt, ru






THREAT



Describes an intention to inflict pain, injury, or violence against an individual or group.



de, en, es, fr, it, pt, ru







Experimental attributes

Experimental attributes (exp.) have not been tested as thoroughly as production attributes. We recommend using experimental attributes only in non-production environments where a human is identifying and correcting errors. We’d also appreciate your feedback on these models!


Important notes on using experimental attributes:

    Once experimental attributes are deprecated and production attributes are created, the experimental attribute will stop working. When that happens, you will need to update the API call’s attribute name to the new production attribute name.
    Expect language availability to change over time as we test attribute performance and move attributes to production.


Toxic Attributes











Attribute name



Description






TOXICITY_EXPERIMENTAL



A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.






SEVERE_TOXICITY_EXPERIMENTAL



A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.






IDENTITY_ATTACK_EXPERIMENTAL



Negative or hateful comments targeting someone because of their identity.






INSULT_EXPERIMENTAL



Insulting, inflammatory, or negative comment towards a person or a group of people.






PROFANITY_EXPERIMENTAL



Swear words, curse words, or other obscene or profane language.






THREAT_EXPERIMENTAL



Describes an intention to inflict pain, injury, or violence against an individual or group.






SEXUALLY_EXPLICIT



Contains references to sexual acts, body parts, or other lewd content.






FLIRTATION



Pickup lines, complimenting appearance, subtle sexual innuendos, etc.






Bridging Attributes

Important notes on using experimental bridging attributes:

    These attributes are named after bridging systems, “systems which increase mutual understanding and trust across divides, creating space for productive conflict” (Ovadya & Thorburn, 2023). Learn more about how to use these classifiers.
    These attributes are only available in English (en), and our results for performance and bias evaluation are included in the English model cards.
    Some comments may be perceived as both bridging and toxic. Our scores can be used in combination to evaluate comments based on the desired impact (e.g. using PERSONAL_STORY_EXPERIMENTAL and PROFANITY in tandem to detect likely personal stories unlikely to contain profane language).






Attribute name


Description



AFFINITY_EXPERIMENTAL


References   shared interests, motivations or outlooks between the comment author and   another individual, group or entity



COMPASSION_EXPERIMENTAL


Identifies   with or shows concern, empathy, or support for the feelings/emotions of   others.



CURIOSITY_EXPERIMENTAL


Attempts   to clarify or ask follow-up questions to better understand another person or   idea.



NUANCE_EXPERIMENTAL


Incorporates   multiple points of view in an attempt to provide a full picture or contribute   useful detail and/or context.



PERSONAL_STORY_EXPERIMENTAL


Includes   a personal experience or story as a source of support for the statements made   in the comment.



REASONING_EXPERIMENTAL


Makes   specific or well-reasoned points to provide a fuller understanding of the   topic without disrespect or provocation.



RESPECT_EXPERIMENTAL


Shows   deference or appreciation to others, or acknowledges the validity of another   person.




New York Times attributes

These attributes are experimental because they are trained on a single source of comments—New York Times (NYT) data tagged by their moderation team—and therefore may not work well for every use case.












Attribute name



Description



Language






ATTACK_ON_AUTHOR



Attack on the author of an article or post.



en






ATTACK_ON_COMMENTER



Attack on fellow commenter.



en






INCOHERENT



Difficult to understand, nonsensical.



en






INFLAMMATORY



Intending to provoke or inflame.



en






LIKELY_TO_REJECT



Overall measure of the likelihood for the comment to be rejected according to the NYT's moderation.



en






OBSCENE



Obscene or vulgar language such as cursing.



en






SPAM



Irrelevant and unsolicited commercial content.



en






UNSUBSTANTIAL



Trivial or short comments



en







Model cards

For each production attribute, we are publishing an associated "Model card" that shares details about intended usage, attribute training processes, and evaluation results.

Replace this text with content of your own.
Overview

Perspective API uses machine learning models to score the perceived impact a comment might have on a conversation. The models evaluate comments across a range of emotional concepts, called attributes. For example, given a comment like “You are an idiot”, a model may “score” the comment as 0.8 for the TOXICITY attribute—indicating an 80% likelihood a reader would perceive the comment as toxic.
Input and output

Input: Text

Output: A probability score between 0 and 1. A higher score indicates a greater likelihood a reader would perceive the comment as containing the given attribute.
Attributes

Attributes describe emotional concepts that may impact a conversation. Perspective API’s primary attribute is TOXICITY, defined as “a rude, disrespectful, or unreasonable comment that is likely to make you leave a discussion”. Other attributes include SEVERE_TOXICITY, IDENTITY_ATTACK, INSULT, PROFANITY, THREAT, SEXUALLY_EXPLICIT, and FLIRTATION. Note that not all attributes are available for all languages. You can find an up-to-date list of attributes and their definitions here.
Training data

We train each model on millions of comments from a variety of sources, including comments from online forums such as Wikipedia (CC-BY-SA3 license) and The New York Times. For languages where less forum data is available, we use machine translation to translate labeled English-language comments into the target language.

﻿
Labeling

Each comment is tagged by 3-10 crowdsourced raters from Figure Eight, Appen and internal platforms. The raters tag whether or not a comment contains an attribute (e.g. TOXICITY). We then post-process the tags to obtain labels corresponding to the ratio of raters who tagged a comment as toxic. For example, we label a comment as 0.6 for TOXICITY if 6 out of 10 raters tagged a comment as toxic.
Architecture

We start by training multilingual BERT-based models on data from online forums. We then distill these models into single-language Convolutional Neural Networks (CNNs) for each language we support. Distillation ensures we can serve the models and produce scores within a reasonable amount of time.

We train each model on millions of comments from a variety of sources, including comments from online forums such as Wikipedia and The New York Times, across a range of languages. For each comment 3-10 raters who speak the relevant language annotate whether or not a comment contains an attribute (e.g. TOXICITY) following instructions below. We then post-process the annotations to obtain labels by calculating the ratio of raters who tagged a comment as each attribute. As a result, if 3 out of 10 raters tagged a comment as toxic, we train the API models to provide a score of 0.3 to this and similar comments.

Rater Instructions

Raters are given a list of online comments. For each comment, their job is to:

    Read the comment.
    If the comment is in a foreign language or not comprehensible for another reason (e.g. gibberish, different dialect, etc.), indicate that by selecting the checkbox.
    Choose the level of toxicity in the comment, selecting either “Very Toxic”, “Toxic”, “Maybe - I’m not sure” or “Not Toxic”.
    Answer a set of questions about the comment choosing from “Yes”, “Maybe - I’m not sure” or “No”. Example questions: “Does this comment contain identity based hate?”, “Does this comment contain insulting language?”, “Does this comment contain threatening language?”.

If in doubt, raters are asked to err on the side of “Yes” or “I'm not sure”. Raters have the opportunity to provide free-form additional details on their reasoning in tagging the comments.


To evaluate the toxicity of language in each comment, raters use the following definitions as a guide:



To answer the questions about each comment, raters use the following definitions as a guide:



Example Task

There are two methods available for Perspective API:

    AnalyzeComment, where a user sends a request for a comment to be analyzed, and a score is returned
    SuggestCommentScore, where a user can suggest a better score for a comment


Scoring comments: AnalyzeComment

To send a comment scoring request to the API, post a request object to this endpoint in your code: https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze



See example in Sample Requests.



    AnalyzeComment request

About the API > Methods > AnalyzeComment request
{
  "comment": {
    "text": string,
    "type": string
  },
  "context": {
    "entries": [{
      "text": string,
      "type": string
    }]
  },
  "requestedAttributes": {
    string: {
      "scoreType": string,
      "scoreThreshold": float
    },
  },
  "languages": [string],
  "doNotStore": bool,
  "clientToken": string,
  "sessionId": string,
}

 {

  "comment": {

    "text": string,

    "type": string

  },

  "context": {

    "entries": [{

      "text": string,

      "type": string

    }]

  },

  "requestedAttributes": {

    string: {

      "scoreType": string,

      "scoreThreshold": float

    },

  },

  "languages": [string],

  "doNotStore": bool,

  "clientToken": string,

  "sessionId": string,

}










Field



Description






comment.text



(required) The text to score. This is assumed to be utf8 raw text of the text to be checked. Emoji and other non-ascii characters can be included (HTML will probably result in lower performance).






comment.type



(optional) The text type of comment.text. Either "PLAIN_TEXT" or "HTML". Currently only "PLAIN_TEXT" is supported.






context.entries



(optional) A list of objects providing the context for comment. The API currently does not make use of this field, but it may influence API responses in the future.






context.entries[].text



(optional) The text of a context object. The maximum size of context entry is 1MB.






context.entries[].type



(optional) The text type of the corresponding context text. Same type as comment.text. Currently only "PLAIN TEXT" is supported.






requestedAttributes



(required) A map from attribute name to a configuration object. See the ‘Attributes and Languages’ page for a list of available attribute names. If no configuration options are specified, defaults are used, so the empty object {} is a valid (and common) choice. You can specify multiple attribute names here to get scores from multiple attributes in a single request.






requestedAttributes[name].scoreType



(optional) The score type returned for this attribute. Currently, only "PROBABILITY" is supported. Probability scores are in the range [0,1].






requestedAttributes[name].scoreThreshold



(optional) The API won't return scores that are below this threshold for this attribute. By default, all scores are returned.






spanAnnotations



(optional) A boolean value that indicates if the request should return spans that describe the scores for each part of the text (currently done at per-sentence level). Defaults to false.






languages



(optional) A list of ISO 631-1 two-letter language codes specifying the language(s) that comment is in (for example, "en", "es", "fr", "de", etc). If unspecified, the API will auto-detect the comment language. If language detection fails, the API returns an error. Note: See currently supported languages on the ‘Attributes and Languages’ page. There is no simple way to use the API across languages with production support and languages with experimental support only.






doNotStore



(optional) Whether the API is permitted to store comment and context from this request. Stored comments will be used for future research and community attribute building purposes to improve the API over time. Defaults to false (request data may be stored). Warning: This should be set to true if data being submitted is private (i.e. not publicly accessible), or if the data submitted contains content written by someone under 13 years old (or the relevant age determined by applicable law in my jurisdiction).






clientToken



(optional) An opaque token that is echoed back in the response.






sessionId



(optional) An opaque session ID. This should be set for authorship experiences by the client side so that groups of requests can be grouped together into a session. This should not be used for any user-specific id. This is intended for abuse protection and individual sessions of interaction.






communityId



(optional) An opaque identifier associating this comment with a particular community within your platform. If set, this field allows us to differentiate comments from different communities, as each community may have different norms.






Note that only comment.text and requestedAttributes are required.



    AnalyzeComment response

About the API > Methods > AnalyzeComment response
{
  "attributeScores": {
    string: {
      "summaryScore": {
        "value": float,
        "type": string
      }
      "spanScores": [{
        "begin": int,
        "end": int,
        "score": {
           "value": float,
           "type": string
        }
      }]
    }
  },
  "languages": [string],
  "clientToken": string
}

 {

  "attributeScores": {

    string: {

      "summaryScore": {

        "value": float,

        "type": string

      }

      "spanScores": [{

        "begin": int,

        "end": int,

        "score": {

           "value": float,

           "type": string

        }

      }]

    }

  },

  "languages": [string],

  "clientToken": string

}

Field


Description

attributeScores


A map from attribute name to per-attribute score objects. The attribute names will mirror the request's requestedAttributes.

attributeScores[name].summaryScore.value


The attribute summary score for the entire comment. All attributes will return a summaryScore (unless the request specified a scoreThreshold for the attribute that the summaryScore did not exceed).

attributeScores[name].summaryScore.type


This mirrors the requested scoreType for this attribute.

attributeScores[name].spanScores


A list of per-span scores for this attribute. These scores apply to different parts of the request's comment.text. Note: Some attributes may not return spanScores at all.

attributeScores[name].spanScores[].begin


Beginning character index of the text span in the request comment.

attributeScores[name].spanScores[].end


End of the text span in the request comment.

attributeScores[name].spanScores[].score.value


The attribute score for the span delimited by begin and end.

attributeScores[name].spanScores[].score.type


Same as summaryScore.type.

languages


Mirrors the request's languages. If no languages were specified, the API returns the auto-detected language.

clientToken


Mirrors the request's clientToken.



Here is a sample request for the TOXICITY and UNSUBSTANTIAL attributes for an English comment:

    AnalyzeComment example

About the API > Methods > AnalyzeComment example
{
  "comment": {
     "text": "What kind of idiot name is foo? Sorry, I like your name."
  },
  "languages": ["en"],
  "requestedAttributes": {
    "TOXICITY": {},
    "UNSUBSTANTIAL": {}
  }
}

 {

  "comment": {

     "text": "What kind of idiot name is foo? Sorry, I like your name."

  },

  "languages": ["en"],

  "requestedAttributes": {

    "TOXICITY": {},

    "UNSUBSTANTIAL": {}

  }

}

The sample response contains the TOXICITY and UNSUBSTANTIAL attribute scores. Each attribute has a single overall summaryScore as well as two spanScores.


Both attributes return the same spans in this case: the span [0,31) (corresponding to "What kind of idiot name is foo?") and the span [32,56) (corresponding to "Sorry, I like your name."); the span notation refers to string indices. However, attributes may not always return the same spans.

    Example response

About the API > Methods > Example response
// Response
{
  "attributeScores": {
    "TOXICITY": {
      "summaryScore": {
        "value": 0.8627961,
        "type": "PROBABILITY"
      }
    },
    "UNSUBSTANTIAL": {
      "spanScores": [
        {
          "begin": 0,
          "end": 31,
          "score": {
            "value": 0.52690625,
            "type": "PROBABILITY"
          }
        },
        {
          "begin": 32,
          "end": 55,
          "score": {
            "value": 0.9106685,
            "type": "PROBABILITY"
          }
        }
      ],
      "summaryScore": {
        "value": 0.69036055,
        "type": "PROBABILITY"
      }
    }
  },
  "languages": [
    "en"
  ]
}

 // Response

{

  "attributeScores": {

    "TOXICITY": {

      "summaryScore": {

        "value": 0.8627961,

        "type": "PROBABILITY"

      }

    },

    "UNSUBSTANTIAL": {

      "spanScores": [

        {

          "begin": 0,

          "end": 31,

          "score": {

            "value": 0.52690625,

            "type": "PROBABILITY"

          }

        },

        {

          "begin": 32,

          "end": 55,

          "score": {

            "value": 0.9106685,

            "type": "PROBABILITY"

          }

        }

      ],

      "summaryScore": {

        "value": 0.69036055,

        "type": "PROBABILITY"

      }

    }

  },

  "languages": [

    "en"

  ]

}

Sending feedback: SuggestCommentScore

The SuggestCommentScore endpoints lets you give the API feedback by allowing you to suggest a score that you think the API should have returned. You can use this method if you disagree with a score and would like to improve the attribute. All submissions to SuggestCommentScore are stored and used to improve the API and related services. This method should not be used for private data (i.e., for data that is not accessible publicly), or if the data submitted contains content written by someone under 13 years old (or the relevant age determined by applicable law in my jurisdiction).


To send a suggested score to the API, post a request object to this endpoint:

https://commentanalyzer.googleapis.com/v1alpha1/comments:suggestscore



    SuggestCommentScore request

About the API > Methods > SuggestCommentScore req
{
  "comment": {
    "text": string,
    "type": string
  },
  "context": {
    "entries": [{
      "text": string,
      "type": string
    }]
  },
  "attributeScores": {
    string: {
      "summaryScore": {
         "value": float,
         "type": string
      },
      "spanScores": [{
        "begin": int,
        "end": int,
        "score": {
           "value": float,
           "type": string
        }
      }]
    }
  },
  "languages": [string],
  "communityId": string,
  "clientToken": string
}

 {

  "comment": {

    "text": string,

    "type": string

  },

  "context": {

    "entries": [{

      "text": string,

      "type": string

    }]

  },

  "attributeScores": {

    string: {

      "summaryScore": {

         "value": float,

         "type": string

      },

      "spanScores": [{

        "begin": int,

        "end": int,

        "score": {

           "value": float,

           "type": string

        }

      }]

    }

  },

  "languages": [string],

  "communityId": string,

  "clientToken": string

}










Field



Description






comment



(required) Same as AnalyzeComment request.






context



(optional) Same as AnalyzeComment request.






attributeScores



(required) Similar to AnalyzeComment response. This holds the attribute scores that the client believes the comment should have. It has the same format as the attributeScores field in the AnalyzeComment response, as it's what the client believes is the correct "answer" for what this comment should be scored as. The client can specify just summary scores, just span scores, or both.






languages



(optional) Same as AnalyzeComment request.






communityId



(optional) Same as AnalyzeComment request.






clientToken



(optional) An opaque token that is echoed back in the response. (Note: This is not the clientId, which is automatically set through Google Cloud. This is a field users can set to help them keep track of their requests.)







    SuggestCommentScore response

About the API > Methods > SuggestCommentScore resp
{
  "clientToken": string
}

 {

  "clientToken": string

}










Field



Description






clientToken



Mirrors the request's clientToken.







    SuggestCommentScore example

About the API > Methods > SuggestCommentScore ex
// Request
{
  "comment": {
    "text": "I guess it comes down a simple choice: Get busy living, or get busy dying."
  },
  "attributeScores": {
    "TOXICITY": {
      "summaryScore": {
        "value": 0
      }
    },
  },
  "communityId": "/forum/movies",
  "clientToken": "comment-53922"
}
The response is not particularly interesting:
// Response
{
  "clientToken": "comment-53922"
}

Quota limit

By default, we set a quota limit to an average of 1 query per second (QPS) for all Perspective projects. This limit should be enough for testing the API and for working in developer environments.


Check your quota limits by going to your Google Cloud project's Perspective API page, and check your project's quota usage at the cloud console quota usage page.



If you're running a production website, you may need to request a quota increase.


Latency & Reliability

We aim to keep Perspective API fast enough to be used in real-time scenarios as comments are being written, with response times around 100ms. Different attributes will have different latencies. Perspective API operates on a "best effort" model, so we always recommend that you design your system to persist even if Perspective responses fail.


API Errors

There are several types of errors you may encounter while using the Perspective API.



The message and details fields will provide the information you need to understand the error.



Here are the types of errors you may encounter while using the Perspective API:












Error Type



Error Message



Description






Invalid API key



"API key not valid. Please pass a valid API key."





This means that there may be restrictions on your API Key that exclude Perspective API. It might also mean your API key is incorrect. Double check that you've copied your API key correctly.

You can also try to delete your API key (assuming it doesn't break other API calls you have set up), generate a new key, and insert the new API key in your script.






Quota exceeded



""



You have exceeded your QPS limit. Wait a bit before sending more traffic, or request increased quota from the ‘Contact Us’ page.






Comment empty



"Comment must be non-empty."



Perspective API requests must contain a non-empty comment, so the API has something to score.






Comment too long



"Comment text too long."



The maximum text size per request is 20 KB. One character does not necessarily equal one byte, as different characters have different encodings. Note that models are trained on online comments, so performance will be best on text around that length. Read the W3C guide on character encoding.






Missing or Unknown Attributes



"Missing requested_attributes" or "Unknown requested attribute: <attr_name>"



API requests need to specify one or more supported attributes. See available attributes on the ‘Attributes and Languages’ page.






Languages not supported



"Attribute <attr_name> does not support request languages: <lang1, lang2>"



The request for <attr_name> in <lang1> and <lang2> is not possible because we do not yet support it. Read more about the available languages on the ‘Attributes and Languages’ page.






Unknown language



"Unable to detect language"



We are unable to detect what language is being used in the comment. Read more about the available languages on the ‘Attributes and Languages’ page.






Invalid context



"Context can have either entries or article_and_parent_comment, but both fields were populated."



Context fields may contain only one of entries and article_and_parent_comment, but this request contained both.






Requests specifying unsupported comment formats



"Currently, only 'PLAIN_TEXT' comments are supported" or

"Unknown text type"



Perspective API only supports plain text.






Unsupported score type for attribute



"Requested score type <score_type> is not supported by attribute <attr_name>"



The score type is not currently available for the attribute.