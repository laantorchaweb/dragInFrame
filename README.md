Drag In Frame
=============

A jQuery plugin for drag an image within a container, much like the facebook profile image effect.

You have a container with an image inside, you can set the size for the container in the options or it will take wathever css width/height you put to the container element. By default you'll able to drag the image in any direction you can choose the direction by setting the fit option to horizontal or vertical.

You have several callbacks, when the image is loaded, when the user start draggin, while is dragging the image and when it stops. You also have a destroy method.

This is a work in progress, I have to work on the returned object with the coordinates and maybe a zooming functionality, and saving directly as a string with the png data from a canvas to the server.

The HTML:

```html
<div class="image">
    <img src="img/bansky.jpg" />
</div>
```

The Javascript:

```javascript
$('.image').dragInFrame({
    // width: 80,
    // height: 160,
    // fits: 'vertical',
    onImageLoad: function(d) {
      console.log('loaded image');
    },
    onStart: function(d) {
        console.log('started dragging ', d);
    },

    onChange: function(d) {
        // console.log('dragging ', d);
    },

    onStop: function(d) {
        console.log('stopped dragging', d);
    }
});

$('#destroy').on('click', function() {

    $('.image').dragInFrame('destroy');

});
```
