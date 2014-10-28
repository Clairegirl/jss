## Dynamic stylesheets for web components.

Modern web applications need expressive language for styles description. This project takes a fresh look at the idea of writing stylesheets in javascript. It solves some major problems with css:

1. Cascading style sheets [do not scale](http://www.phase2technology.com/blog/used-and-abused-css-inheritance-and-our-misuse-of-the-cascade/). There are some solutions like [bem](http://bem.info/) which solve this problem, however they introduce an overhead of writing long class names. Here is how [true namespaces](http://kof.github.io/jss/examples/namespace/index.html) can look like in jss.

1. We often need to calculate layouts in javascript and we need to access properties defined in stylessheets. Jss allows us to do it easy and without DOM round trip by giving us a [direct access](http://kof.github.io/jss/examples/commonjs/index.html) to css values.

1. Its up to you whether to put some styles via style tag or to [apply them directly](http://kof.github.io/jss/examples/jquery/index.html) to the element.

1. Optimize your app performance by [detaching](http://kof.github.io/jss/examples/simple/index.html) unused stylesheets from render tree.

1. Use full power of expressive full featured language. Any features you might know from [stylus](http://learnboost.github.io/stylus/) or [sass](http://sass-lang.com/) and some more are already available.

1. Evil mixins are not a problem any more.

1. No need to precompile, but you can if you want to.

Take a look at [examples](http://kof.github.io/jss/examples/index.html) directory.

## Built in preprocessors

Jss styles are just plain javascript objects. They map 1:1 to css rules, except of those modified by preprocessors.

### Nested Rules

Put an ampersand before a selector within a rule and it will be converted to a separate rule with a [nested selector.](http://kof.github.io/jss/examples/nested/index.html)


```javascript
{
    '.container': {
        padding: '20px',
        // Will result in .container.clear
        '&.clear': {
            clear: 'both'
        },
        // Will result in .container .button
        '& .button': {
            background: 'red'
        }
    }
}
```
```css
.container {
    padding: 20px;
}
.container.clear {
    clear: both;
}
.container .button {
    background: red;
}
```

### Extend keyword

Add `extend` keyword to a rule and set any style or array of styles as value to extend some style definition with the current style object. [See example.](http://kof.github.io/jss/examples/extend/index.html)


```javascript
var rules = {}

var button1 = {
    padding: '20px',
    background: 'blue'
}

rules['.button-1'] = button1

rules['.button-2'] = {
    extend: button1, // can be an array of styles
    padding: '30px'
}
```
```css
.button-1 {
    padding: 20px;
    background: blue;
}

.button-2 {
    padding: 30px;
    background: blue;
}
```

## API

### Access the jss namespace

```javascript
// Pure js
var jss = window.jss

// Commonjs
var jss = require('jss')
```

### Create stylesheet

`jss.createStylesheet([rules], [generateClasses], [attributes])`

- `rules` is an object, where keys are selectors if `generateClasses` is not true
- `generateClasses` will cause auto generated class names for rules as selectors. It will also make class names accessible via `stylesheet.classes`.
- `attributes` allows to set any attributes on style element.


```javascript
var stylesheet = jss.createStylesheet({
    '.selector': {
        width: '100px'
    }
}, {media: 'print'}).attach()
```

```css
<style type="text/css" media="print" title="Generated by jss.">
    .selector {
        width: 100px;
    }
</style>
```

Create a stylesheet with namespaced rules.

```javascript
var stylesheet = jss.createStylesheet({
    myButton: {
        width: '100px',
        height: '100px'
    }
}, true).attach()

console.log(stylesheet.classes.myButton) // .jss-0
```

```css
<style type="text/css" media="screen" title="Generated by jss.">
    .jss-0 {
        width: 100px;
        height: 100px;
    }
</style>
```

### Attach stylesheet

`stylesheet.attach()`

Insert stylesheet into render tree.

```javascript
stylesheet.attach()
```

### Detach stylesheet

`stylesheet.detach()`

Remove stylesheet from render tree for performance optimization.

```javascript
stylesheet.detach()
```

### Add a rule

`stylesheet.addRule([selector], rule)`

#### You might want to add rules dynamically.

```javascript
var button = stylesheet.addRule('.my-button', {
    padding: '20px',
    background: 'blue'
})
```
#### Generated namespace.

In case you have an element reference or you create elements in javascript you might want to write styles and attach them later to the element using a generated class name.

```javascript
var button = stylesheet.addRule({
    padding: '20px',
    background: 'blue'
})

document.body.innerHTML = '<button class="' + button.className + '">Button</button>'
```

### Get a rule

`stylesheet.getRule(selector)`

```javascript
var rule = stylesheet.getRule('.my-button')
```

### Create a rule without a stylesheet.

`jss.createRule([selector], rule)`

```javascript
var rule = jss.createRule({
    padding: '20px',
    background: 'blue'
})

// Apply styles directly using jquery.
$('.container').css(rule.style)
```

## Run tests

    npm i
    open test/index.html

## License

MIT
