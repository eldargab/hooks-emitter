# hooks-emitter

## What's this and why?

Often event emitters are used not for sending signals to the outside world but
as a general purpose hooking API. The difference is that handlers for hooks are
known in advance, they are not specific to the concrete instance. The natural
thing to do in such cases is:

```javascript
Widget.prototype.on('show', function() {
  // do something
})
```

Obviously traditional event emitters do not allow that. They force you to do
all subscriptions in constructor, which is

  * slow
  * inflexible (I think `Super.call(this)` is a smell)

This project implements emitter in a different way. It allows you to add
subscriptions on prototype and generally you should not think about clobbering
or `Emitter.call(this)` calls. At the moment of writing it can be used as a
drop in replacement for [component/emitter](https://github.com/component/emitter).

## Examples

```javascript
var Emitter = require('hooks-emitter')
var calls = []

var proto = new Emitter

proto.on('foo', function () {
  calls.push('proto')
})

var instance = Object.create(proto)

instance.on('foo', function () {
  calls.push('emitter')
})

instance.emit('foo')

calls.should.eql(['proto', 'emitter'])

proto.emit('foo')

calls.should.eql(['proto', 'emitter', 'proto'])
```

Addition of handlers to prototype when child instance was already created is not supported.
For such case behaviour is undefined.

```javascript
var proto = new Emitter
var instance = Object.create(proto)
proto.on('foo', listener) // that's a bit funky
instance.emit('foo')
```

## Installation

Via npm

```
npm install hooks-emitter
```

Via component

```
component install eldargab/hooks-emitter
```

## API

### Emitter(obj)

As an `Emitter` instance:

```js
var Emitter = require('emitter');
var emitter = new Emitter;
emitter.emit('something');
```

As a mixin:

```js
var Emitter = require('emitter');
var user = { name: 'tobi' };
Emitter(user);

user.emit('im a user');
```

### Emitter#on(event, fn)

Register an `event` handler `fn`.

### Emitter#once(event, fn)

Register a single-shot `event` handler `fn`,
removed immediately after it is invoked the
first time.

### Emitter#off(event, fn)

Remove `event` handler `fn`, or pass only the `event`
name to remove all handlers for `event`.

### Emitter#emit(event, ...)

Emit an `event` with variable option args.

### Emitter#listeners(event)

Return an array of callbacks, or an empty array.

### Emitter#hasListeners(event)

Check if this emitter has `event` handlers.

## License

MIT
