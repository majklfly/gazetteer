Array.isArray ||
    (Array.isArray = function(a) {
        return "[object Array]" === Object.prototype.toString.call(a);
    }),
    String.prototype.trim ||
    (String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    }),
    Array.prototype.forEach ||
    (Array.prototype.forEach = function(a, b) {
        var c, d;
        if (null == this) throw new TypeError(" this is null or not defined");
        var e = Object(this),
            f = e.length >>> 0;
        if ("function" != typeof a) throw new TypeError(a + " is not a function");
        for (arguments.length > 1 && (c = b), d = 0; f > d;) {
            var g;
            d in e && ((g = e[d]), a.call(c, g, d, e)), d++;
        }
    }),
    (function(a, b) {
        "use strict";
        var c = function() {
            return (
                (this.version = "1.0.0"),
                (this.url = "https://source.unsplash.com"),
                (this.dimensions = {}),
                (this.scope = "featured"),
                (this.randomizationInterval = "perRequest"),
                this
            );
        };
        (c.prototype.find = function(a) {
            return (this.id = a), this;
        }),
        (c.prototype.width = function(a) {
            return (this.dimensions.width = a), this;
        }),
        (c.prototype.height = function(a) {
            return (this.dimensions.height = a), this;
        }),
        (c.prototype.size = function(a, b) {
            return (this.dimensions = { width: a, height: b || a }), this;
        }),
        (c.prototype.randomize = function(a) {
            return (
                "daily" == a || "weekly" == a ?
                (this.randomizationInterval = a) :
                (this.randomizationInterval = "perRequest"),
                this
            );
        }),
        (c.prototype.all = function() {
            return (this.scope = "all"), this;
        }),
        (c.prototype.of = function(a) {
            var b = [];
            return (
                Array.isArray(a) || (a = a.split(",")),
                a.forEach(function(a) {
                    b.push(a.trim());
                }),
                (this.keywords = b.join(",")),
                (this.keywords = encodeURI(this.keywords)),
                this
            );
        }),
        (c.prototype.fromUser = function(a) {
            return (this.username = a), this;
        }),
        (c.prototype.fromCategory = function(a) {
            return (this.category = a), this;
        }),
        (c.prototype.fromCollection = function(a) {
            return (this.collection = a), this;
        }),
        (c.prototype._hasDimensions = function() {
            return !!this.dimensions.width && !!this.dimensions.height;
        }),
        (c.prototype._appendDimensions = function() {
            return (
                this._hasDimensions() &&
                (this.url +=
                    "/" + this.dimensions.width + "x" + this.dimensions.height),
                this.url
            );
        }),
        (c.prototype._appendScope = function() {
            return "all" == this.scope && (this.url += "/all"), this.url;
        }),
        (c.prototype._appendKeywords = function() {
            return this.keywords && (this.url += "?" + this.keywords), this.url;
        }),
        (c.prototype._appendRandomization = function(a) {
            return (
                a && "perRequest" == this.randomizationInterval ?
                (this.url += "/random") :
                "daily" == this.randomizationInterval ?
                (this.url += "/daily") :
                "weekly" == this.randomizationInterval && (this.url += "/weekly"),
                this.url
            );
        }),
        (c.prototype.fetch = function() {
            return this.id ?
                ((this.url += "/" + this.id), this._appendDimensions(), this.url) :
                this.username ?
                ((this.url += "/user/" + this.username),
                    this._appendScope(),
                    this._appendDimensions(),
                    this._appendRandomization(!1),
                    this._appendKeywords(),
                    this.url) :
                this.category ?
                ((this.url += "/category/" + this.category),
                    this._appendScope(),
                    this._appendDimensions(),
                    this._appendRandomization(!1),
                    this._appendKeywords(),
                    this.url) :
                this.collection ?
                ((this.url += "/collection/" + this.category),
                    this._appendScope(),
                    this._appendDimensions(),
                    this._appendRandomization(!1),
                    this._appendKeywords(),
                    this.url) :
                (this._appendScope(),
                    this._appendDimensions(),
                    this._appendRandomization(!0),
                    this._appendKeywords(),
                    this.url);
        }),
        (a.UnsplashPhoto = c);
    })(this);