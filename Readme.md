## What's this and why?

Often event emitters are used not for sending signals to the outside world but
as a general purpose hooking API. The difference is that handlers for hooks are
known in advance, they are not specific to the concrete instance. The natural
thing to do in such cases is:

```
Widget.prototype.on('show', function() {
  // do something before showing
})
```

Obviously traditional event emitters do not allow that. They force you to do
all subscriptions in constructor, which is

  * slow
  * inflexible (I think `Super.call(this)` is a smell)

[hooks-emitter](hooks-emitter) implemented differently. It allows you to add
subscriptions on prototype and generally you should not think about clobbering
and `Emitter.call(this)` calls. At the moment of writing it can be used as a
drop in replacement for (component/emitter).

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

// second time only `proto` handler should be called
calls.should.eql(['proto', 'emitter', 'proto'])
```

Funky things like

```javascript
var proto = new Emitter
var instance = Object.create(proto)

proto.on('foo', listener) // handler added after child was already created

instance.emit('foo')
```

are not supported. For such case behaiviour is undefined.

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
