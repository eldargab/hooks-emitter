module.exports = Emitter

function Emitter(obj) {
  if (obj) return mixin(obj)
}

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key]
  }
  return obj
}

/**
 * Event handler's storage
 *
 * @api private
 */

Emitter.prototype.callbacks = {__owner: Emitter.prototype}

/**
 * Get callbacks object for current instance
 *
 * @api private
 */

Emitter.prototype.thisCallbacks = function() {
  if (this.callbacks.__owner === this) return this.callbacks
  this.callbacks = objectCreate(this.callbacks)
  this.callbacks.__owner = this
  return this.callbacks
}

/**
 * Get handlers of `event` for current instance
 *
 * @api private
 */

Emitter.prototype.thisHandlers = function(event) {
  var cbs = this.thisCallbacks()
  var h = cbs[event]
  if (!h) {
    h = cbs[event] = []
    h.__owner = this
  } else if (h.__owner !== this){
    h = cbs[event] = h.slice()
    h.__owner = this
  }
  return h
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn) {
  this.thisHandlers(event).push(fn)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn) {
  var self = this

  function on() {
    self.off(event, on)
    fn.apply(this, arguments)
  }

  fn._off = on
  this.on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = function(event, fn) {
  // remove all handlers
  if (1 == arguments.length) {
    this.thisCallbacks()[event] = null
    return this
  }

  // remove specific handler
  var h = this.thisHandlers(event)
  var i = h.indexOf(fn._off || fn)
  if (~i) h.splice(i, 1)
  return this
}

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.emit = function(event) {
  var h = this.callbacks[event]

  if (h) {
    var args = Array.prototype.slice.call(arguments, 1)
    h = h.slice()
    for (var i = 0; i < h.length; i++) {
      h[i].apply(this, args)
    }
  }

  return this
}

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event) {
  return this.callbacks[event] || []
}

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event) {
  return !!this.listeners(event).length
}

var objectCreate = Object.create || function(proto) {
  function Klass() {}
  Klass.prototype = proto
  return new Klass
}
