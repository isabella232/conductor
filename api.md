<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [create][1]
    -   [Parameters][2]
-   [Conductor][3]
    -   [Parameters][4]
    -   [name][5]
-   [getHandlers][6]
    -   [Parameters][7]
-   [getHandlerKeys][8]
-   [getProps][9]
    -   [Parameters][10]
-   [getProps][11]
    -   [Parameters][12]
-   [createModels][13]
    -   [Parameters][14]
-   [getDebugHandlerStack][15]
-   [buildModelsWrapper][16]
    -   [Parameters][17]
-   [initWrapper][18]
    -   [Parameters][19]
-   [runHandlersWrapper][20]
-   [createConductor][21]
    -   [Parameters][22]
-   [createConductor][23]
    -   [Parameters][24]
-   [createConductorHandlers][25]
    -   [Parameters][26]
-   [methodInstaller][27]
    -   [Parameters][28]
-   [getDefault][29]
-   [child][30]
    -   [Parameters][31]
-   [addSerializers][32]
    -   [Parameters][33]
-   [Model][34]
    -   [Parameters][35]
    -   [props][36]
    -   [data][37]
    -   [errors][38]
    -   [log][39]
    -   [client][40]
    -   [type][41]
    -   [name][42]
    -   [async][43]
-   [before][44]
    -   [Parameters][45]
-   [after][46]
    -   [Parameters][47]
-   [isValid][48]
    -   [Parameters][49]
-   [fallback][50]
-   [get][51]
    -   [Parameters][52]
-   [get][53]
    -   [Parameters][54]
-   [preConfigure][55]
    -   [Parameters][56]
-   [postConfigure][57]
    -   [Parameters][58]
-   [RestModel][59]
    -   [Parameters][60]
    -   [type][61]
    -   [async][62]
    -   [method][63]
    -   [secure][64]
    -   [host][65]
    -   [port][66]
    -   [baseUrl][67]
    -   [url][68]
    -   [qs][69]
    -   [postBody][70]
    -   [postType][71]
    -   [headers][72]
    -   [resourceType][73]
    -   [rawResponseData][74]
    -   [fallbackMode][75]
-   [getConductor][76]
    -   [Parameters][77]
-   [getClient][78]
    -   [Parameters][79]
-   [getModels][80]
    -   [Parameters][81]
-   [getReqTimerPrefix][82]
    -   [Parameters][83]
-   [setReqTimerPrefix][84]
    -   [Parameters][85]
-   [setModel][86]
    -   [Parameters][87]
-   [shardConductor][88]
    -   [Parameters][89]

## create

create a new restify json client. a new one is
created for each outbound API request (i.e., one per model).
TODO: this is potentially expensive, need to investigate
        creating a single client per incoming request (i.e., per user, per remote host)
        crux of the problem is allowing customization on a per request basis (headers),
        which currently requires creating a new client per model.

### Parameters

-   `model` **[Object][90]** a restify model

Returns **[Object][90]** a restify JsonClient

## Conductor

Class definition

### Parameters

-   `config` **[Object][90]** user configuration object.
    -   `config.name` **[String][91]** a name for your conductor
    -   `config.deps` **[Array][92]?** an array of dependencies to be mixed in
    -   `config.props` **[Object][90]?** props to create for this conductor.
    -   `config.handlers` **[Object][90]?** an object or array of handlers

### name

name of the conductor

Type: [String][91]

## getHandlers

retrieves a handler block for a given key.

### Parameters

-   `key` **[String][91]** the key of the handler block

Returns **[Array][92]** an array of function handlers

## getHandlerKeys

retrieves the sorted handler keys for the conductor.

Returns **[Array][92]** an array of strings

## getProps

retrieves an immutable property.
if no name passed in, return all props.

### Parameters

-   `name` **[String][91]?** optional name of the prop to retrieve.

Returns **[Object][90]** the copy of the prop

## getProps

retrieve an immutable prop off the conductor object

### Parameters

-   `req` **[Object][90]** the request object
-   `propName` **[String][91]** the name of the prop to retrieve

Returns **[Object][90]** a prop value

## createModels

iterates through a specific model bucket, invoking each function in the array
to create a new instance of a model. does not change any state.

### Parameters

-   `req` **[Object][90]** the request object
-   `res` **[Object][90]** the response object
-   `bucketName` **[String][91]** the name of the model bucket to create.

Returns **[Array][92]** an array of models

## getDebugHandlerStack

returns a flattened list of handler stacks.
for debug use only.

Returns **[Array][92]** an array of function names and the index of their blocks

## buildModelsWrapper

a handler to build any models defined on the conductor.

### Parameters

-   `modelBucket` **[Array][92]** a key we can use to look up a bucket
                                      of models defined on the conductor
-   `modelFetcher` **[Function][93]** function to run for fetching / creating
                                      models. The function should accept req
                                      as the first parameter, req as the
                                      second, a models array as the third, and
                                      a callback as the fourth.

Returns **[undefined][94]** 

## initWrapper

a handler to initialize the restify conductor namespaces on the request
and response objects.

### Parameters

-   `conductor` **[Object][90]** an instance of restify conductor

Returns **void** 

## runHandlersWrapper

a handler to run the wrapped conductor handlers.
no options at the moment.

Returns **[undefined][94]** 

## createConductor

wrapper function for creating conductors

### Parameters

-   `options` **[Object][90]** an options object

Returns **[Conductor][95]** a Conductor instance

## createConductor

wrapper function for creating models.
we MUST return a closure, this is necessary to provide
req res to the lifecycle methods, and allow us to return a new model for
each new incoming request.

### Parameters

-   `options` **[Object][90]** an options object

Returns **[Function][93]** 

## createConductorHandlers

Create a middleware chain that executes a specific conductor

### Parameters

-   `conductor` **[Object][90]** a Conductor instance

Returns **[Array][92]&lt;[Function][93]>** 

## methodInstaller

programatically create wrapperis for Restify's server[method]

### Parameters

-   `opts` **([String][91] \| [Object][90])** the url of REST resource or
                                     opts to pass to Restify
-   `conductor` **[Conductor][95]** a conductor instance
-   `server` **[Object][90]** a restify server

Returns **[undefined][94]** 

## getDefault

retrieves default restify-conductor logger

Returns **[Object][90]** bunyan logger

## child

creates a child logger from default restify-conductor logger

### Parameters

-   `name` **[String][91]** name of child logger

Returns **[Object][90]** bunyan logger

## addSerializers

add the restify-conductor specific serializers

### Parameters

-   `log` **[Object][90]** bunyan instance

Returns **void** 

## Model

Model class.
abstraction for restify-conductor models.

### Parameters

-   `config` **[Object][90]** model configuration object

### props

arbitrary model props

Type: [Object][90]

### data

the model data

Type: [Object][90]

### errors

collected errors that may have occurred
through the lifecycle methods.

Type: [Array][92]

### log

a bunyan instance for loggin

Type: [Object][90]

### client

a remote client that implements a get() method
for fetching remote data

Type: [Object][90]

### type

model type for debugging purposes

Type: [String][91]

### name

model name

Type: [String][91]

### async

flag used to help debug.
true if the model is async.

Type: [Boolean][96]

## before

default noop for all models.
gives users a hook to modify the model
before requesting it.

### Parameters

-   `req` **[Object][90]** the request object
-   `res` **[Object][90]** the response object

Returns **[undefined][94]** 

## after

default noop for all models.
gives users a hook to modify the model
after getting a return value.

### Parameters

-   `req` **[Object][90]** the request object
-   `res` **[Object][90]** the response object

Returns **[undefined][94]** 

## isValid

lifecycle method for validating returned data.

### Parameters

-   `data` **[Object][90]** the data to validate

Returns **[Boolean][96]** 

## fallback

default noop for all models.
gives users a hook to handle validation errors.

Returns **[Object][90]** 

## get

public method to invoke the get of the model data.

### Parameters

-   `cb` **[Function][93]** callback function

Returns **[undefined][94]** 

## get

retrieves the remote resource.

### Parameters

-   `callback` **[Function][93]** a callback function to invoke when complete

Returns **[Object][90]** the parsed JSON response

## preConfigure

public method to invoke the before chain of lifecycle events.

### Parameters

-   `req` **[Object][90]** the request object
-   `res` **[Object][90]** the response object
-   `options` **[Object][90]** an options object

Returns **[undefined][94]** 

## postConfigure

public method to invoke the after chain of lifecycle events.

### Parameters

-   `req` **[Object][90]** the request object
-   `res` **[Object][90]** the response object

Returns **[undefined][94]** 

## RestModel

RestModel class.
abstraction for restify-conductor models.

### Parameters

-   `config` **[Object][90]** model configuration object

### type

model type for debugging purposes

Type: [String][91]

### async

flag used to help debug.
true if the model is async.

Type: [Boolean][96]

### method

the type of http request. defaults to GET.

Type: [String][91]

### secure

whether or not the request should be made over https.

Type: [Boolean][96]

### host

the hostname for the request

Type: [String][91]

### port

port number for remote host

Type: [Number][97]

### baseUrl

the base url of the request:
[http://{hostname}/{baseurl}][98]

Type: [String][91]

### url

the specific url of the request:
[http://{hostname}/{baseurl}/{url}][99]

Type: [String][91]

### qs

a query string object

Type: [Object][90]

### postBody

a post body object

Type: [Object][90]

### postType

if a post request, the post type.
defafult is json, can also be 'form'.

Type: [String][91]

### headers

specific headers set for this model

Type: [Object][90]

### resourceType

the format of the returned payload.
defaults to JSON, but can be XML or other.

Type: [String][91]

### rawResponseData

some cherry picked debug about the external
resource call.

Type: [Object][90]

### fallbackMode

whether or not model is operating in fallback mode.

Type: [Boolean][96]

## getConductor

returns the conductor for a given request.

### Parameters

-   `req` **[Object][90]** the request object

Returns **[undefined][94]** 

## getClient

returns a restify JSON client if one exists for this host for this incoming request.
otherwise, creates one.

### Parameters

-   `req` **[Object][90]** the request object
-   `model` **[Object][90]** a restify model

Returns **[Object][90]** a restify JSON client

## getModels

gets all the saved models off the request

### Parameters

-   `req` **[Object][90]** the request object
-   `modelName` **[String][91]?** name of the model to retrieve. returns all models if not specified.

Returns **([Object][90] \| [Array][92])** returns an array of models, or just one model.

## getReqTimerPrefix

gets the current request timer prefix name.
useful for using it to prefix other request timers.

### Parameters

-   `req` **[Object][90]** the request object

Returns **[String][91]** 

## setReqTimerPrefix

sets the current timer name prefix.

### Parameters

-   `req` **[Object][90]** the request object
-   `prefix` **[String][91]** the timer name prefix

Returns **[undefined][94]** 

## setModel

saves a model onto the request

### Parameters

-   `req` **[Object][90]** the request object
-   `model` **[Object][90]** an instance of a Model or RestModel.

Returns **[undefined][94]** 

## shardConductor

replace an conductor midstream with a .createAction

### Parameters

-   `req` **[Object][90]** the request object
-   `newConductor` **[Object][90]** a Conductor

Returns **[undefined][94]** 

[1]: #create

[2]: #parameters

[3]: #conductor

[4]: #parameters-1

[5]: #name

[6]: #gethandlers

[7]: #parameters-2

[8]: #gethandlerkeys

[9]: #getprops

[10]: #parameters-3

[11]: #getprops-1

[12]: #parameters-4

[13]: #createmodels

[14]: #parameters-5

[15]: #getdebughandlerstack

[16]: #buildmodelswrapper

[17]: #parameters-6

[18]: #initwrapper

[19]: #parameters-7

[20]: #runhandlerswrapper

[21]: #createconductor

[22]: #parameters-8

[23]: #createconductor-1

[24]: #parameters-9

[25]: #createconductorhandlers

[26]: #parameters-10

[27]: #methodinstaller

[28]: #parameters-11

[29]: #getdefault

[30]: #child

[31]: #parameters-12

[32]: #addserializers

[33]: #parameters-13

[34]: #model

[35]: #parameters-14

[36]: #props

[37]: #data

[38]: #errors

[39]: #log

[40]: #client

[41]: #type

[42]: #name-1

[43]: #async

[44]: #before

[45]: #parameters-15

[46]: #after

[47]: #parameters-16

[48]: #isvalid

[49]: #parameters-17

[50]: #fallback

[51]: #get

[52]: #parameters-18

[53]: #get-1

[54]: #parameters-19

[55]: #preconfigure

[56]: #parameters-20

[57]: #postconfigure

[58]: #parameters-21

[59]: #restmodel

[60]: #parameters-22

[61]: #type-1

[62]: #async-1

[63]: #method

[64]: #secure

[65]: #host

[66]: #port

[67]: #baseurl

[68]: #url

[69]: #qs

[70]: #postbody

[71]: #posttype

[72]: #headers

[73]: #resourcetype

[74]: #rawresponsedata

[75]: #fallbackmode

[76]: #getconductor

[77]: #parameters-23

[78]: #getclient

[79]: #parameters-24

[80]: #getmodels

[81]: #parameters-25

[82]: #getreqtimerprefix

[83]: #parameters-26

[84]: #setreqtimerprefix

[85]: #parameters-27

[86]: #setmodel

[87]: #parameters-28

[88]: #shardconductor

[89]: #parameters-29

[90]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[91]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[92]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[93]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[94]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined

[95]: #conductor

[96]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[97]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[98]: http://{hostname}/{baseurl}

[99]: http://{hostname}/{baseurl}/{url}
