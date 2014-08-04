# make-scrollable

a javascript library to add a custom vertical scroll bar for overflowing divs. custom scrollbars are useful for a more consistent look across operation systems.

Currently only vertical scrollbar is implemented.

### Usage
* add references to the css and js files for this library
```html
<link rel="stylesheet" href="css/make-scrollable.css">
<script type="text/javascript" src="js/make-scrollable.js"></script>
```
* create a div around the content you would like to add a scrollbar to. Add the class name ```v-scrollable``` to the container div.
```html
<div class="container v-scrollable">
    <div id="content">
    </div>
</div>
```
* initialize the library with one of the functions below. if container is not define the library looks for the ```v-scrollable``` class to determine the container. Similarly, the content is the direct descendant div of the container div. container and content could either be query strings or html elements.
```js
var scrollable = new _makeVScrollable();
```
```js
 * new _makeVScrollable(options);
 * new _makeVScrollable(container, options)
 * new _makeVScrollable(container, content, options)
```
options can specify top, right and bottom margin values. Default values are:
```js
{
    top: 11,
    bottom: 11,
    right: 1
}
```
* If the dom changed, or the size of the screen changed, you can recalculate the height of the scrollbar with the recalculate method.
```js
    scrollable.recalculate();
```
* if you have more than one scrollable divs in the document, you can initialize all of them.
```js
    _makeVScrollable.all();
```

### Examples
There are some examples bundled with the repository. You can checkout [index.html](https://github.com/artsince/make-scrollable.js/blob/master/index.html), [index2.html](https://github.com/artsince/make-scrollable.js/blob/master/index2.html) and [index3.html](https://github.com/artsince/make-scrollable.js/blob/master/index3.html) for various examples.


### Issues
I still seem to have issues with getting the height right in some cases. Make sure that you set a definite height for the container div in your class definition. I might also be making some mistakes with the position style property. feel free to tweak them if the code does not work the way you hoped in the first place. and of course, feel free to suggest corrections.
