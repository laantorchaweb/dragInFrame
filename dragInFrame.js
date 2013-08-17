;(function ( $, window, undefined ) {

    var pluginName = 'dragInFrame',
        document  = window.document,
        $document = $(document),
        defaults = {
          width: null,
          height: null,
          fits: false,
          onImageLoad: function() {},
          onStart: function() {},
          onChange: function() {},
          onStop: function() {}
        };


    function Plugin( element, options ) {

        this.element = element;
        this.$element = $(element);

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        if( !this.options.width || !this.options.height ) {
            this.options.width  = this.$element.width();
            this.options.height = this.$element.height();
        }

        this.init();

    }

    Plugin.prototype.init = function () {
        this.$image = this.$element.find('img');

        this.$image
            .css({ display: 'none' })
            .wrap('<div class="draggable_area" />')
            .parent()
                .css({
                    position: 'relative',
                    overflow: 'hidden',
                    width: this.options.width,
                    height: this.options.height
                })
                .end()
            .css({
                position: 'absolute',
                top: 0,
                left: 0
            });

        if( this.options.fits ) {

            if( this.options.fits === "horizontal")  {

                this.$image.css({ width: this.options.width, height: 'auto' });

            } else if ( this.options.fits === "vertical" ) {

                this.$image.css({ height: this.options.height, width: 'auto' });

            }

        }

        this.handleEvents();

    };

    Plugin.prototype.handleEvents = function() {
        var _this = this;

        this.$image.on('load.' + _this._name, function(e) {

            _this.$image.fadeIn('fast');

            _this.options.onImageLoad.call( _this.$image[0], this );

        });

        this.$image.on('mousedown.' + _this._name, function(e) {
            e.preventDefault();

            _this.$image.css('cursor', 'move');

            _this.dragging = true;

            _this.mouseCoords = {
                x: e.pageX,
                y: e.pageY
            };

            _this.originalImageCoords = {
                x: parseInt( _this.$image.css('left') ),
                y: parseInt( _this.$image.css('top') )
            }

            _this.options.onStart.call(_this.$image[0], _this.$element );

        });

        $document.on('mouseup.' + _this._name, function() {

            _this.$image.css('cursor', 'default');

            _this.dragging = false;

            _this.options.onStop.call(_this.$image[0], _this.result );

        }).on('mousemove.' + _this._name, function(e) {

            if( _this.dragging ) {

                _this.mousemove(e);

            }

        });

    };

    Plugin.prototype.mousemove = function (ev) {
        var top  = checkContainerBounds( ( this.originalImageCoords.y + ( ev.pageY - this.mouseCoords.y ) ), this.$image.height(), this.options.height ),
            left = checkContainerBounds( ( this.originalImageCoords.x + ( ev.pageX - this.mouseCoords.x ) ), this.$image.width(), this.options.width );

        this.$image.css({
            top : top,
            left: left
        });

        this.returnCoords();

    };

    Plugin.prototype.returnCoords = function () {
        var fromX = Math.floor( parseInt( this.$image.css('left') ) * - 1 ),
            fromY = Math.floor( parseInt( this.$image.css('top') ) * - 1 )
            toX   = fromX - this.options.width * - 1,
            toY   = fromY - this.options.height * - 1;;

        this.result = { fromX: fromX, fromY: fromY, toX: toX, toY: toY, width: this.options.width, height: this.options.height };

        this.options.onChange.call( this.image, this.result );

    };

    Plugin.prototype.destroy = function() {

        this.$element.removeData('plugin_' + this._name);

        this.$image.off('mousedown.' + this._name).off('load.' + this._name).unwrap().removeAttr('style');

        $document.off('mousemove.' + this._name).off('mouseup.' + this._name);

    };

    function checkContainerBounds(value, imageLength, elementLength) {

        if( value + imageLength < elementLength ) {

            value = elementLength - imageLength;

        }

        if ( value > 0 ) {

            value = 0;

        }

        return value;
    }


    $.fn[pluginName] = function ( options ) {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {

            $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));

        } else if ($.data(this, 'plugin_' + pluginName) && options === 'destroy' ) {

            $.data(this, 'plugin_' + pluginName).destroy();

        }
      });
    };



}(jQuery, window));
