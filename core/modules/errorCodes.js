// Export the module.
module.exports = {
    BAD_REQUEST: 400, // This response means that server could not understand the request due to invalid syntax.
    UNAUTHORIZED: 401, // Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
    FORBIDDEN: 403, // The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
    NOT_FOUND: 404, // The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
    METHOD_NOT_ALLOWED: 405, // The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
    NOT_ACCEPTABLE: 406, // This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
    PROXY_AUTH_REQUIRED: 407, // This is similar to 401 but authentication is needed to be done by a proxy.
    REQUEST_TIMEOUT: 408, // This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
    CONFLCIT: 409, // This response is sent when a request conflicts with the current state of the server.
    GONE: 410, // This response would be sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
    LENGTH_REQUIRED: 411, // Server rejected the request because the Content-Length header field is not defined and the server requires it.
    PRECONDITION_FAILED: 412, // The client has indicated preconditions in its headers which the server does not meet.
    PAYLOAD_TOO_LARGE: 413, // Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.
    URI_TOO_LONG: 414, // The URI requested by the client is longer than the server is willing to interpret.
    UNSUPPORTED_MEDIA_TYPE: 415, // The media format of the requested data is not supported by the server, so the server is rejecting the request.
    REQUEST_RANGE_NOT_SATISFIABLE: 416, // The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
    EXPECTATION_FAILED: 417, //This response code means the expectation indicated by the Expect request header field can't be met by the server.
    TOO_MANY_REQUESTS: 429, // The user has sent too many requests in a given amount of time ("rate limiting").
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
    UNAVAILBLE_ILLEGAL: 451, // The user requests an illegal resource, such as a web page censored by a government.
    UNKNOWN: 599
};