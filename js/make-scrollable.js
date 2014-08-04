/*
 * this library creates a vertical scrollbar inside the container div
 * for the content div inside the container div
 *
 * new _makeVScrollable(options);
 * new _makeVScrollable(container, options)
 * new _makeVScrollable(container, content, options)
 */
var _makeVScrollable = function () {
    var options;
    var container;
    var content;

    if(arguments.length === 1) {
        options = arguments[0];
    }
    else if(arguments.length === 2) {
        container = arguments[0];
        options = arguments[1];
    }
    else if(arguments.length > 2) {
        container = arguments[0];
        content = arguments[1];
        options = arguments[2];
    }

    options = options ? options : {};
    options.top = options.hasOwnProperty('top') ? options.top : 11;
    options.bottom = options.hasOwnProperty('bottom') ? options.bottom : 11;
    options.right = options.hasOwnProperty('right') ? options.right : 1;

    // calculates the total offsetTop from the element up to 
    // document.body
    var _calcOffsetTop = function (el) {
        return el.getBoundingClientRect().top + window.pageYOffset;
    };

    var _screenDims = function () {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return {
            x: x,
            y: y
        };
    };

    if(container) {
        if(typeof(container) === 'string') {
            container = document.querySelector(container);
        }
    }
    else {
        container = document.querySelector('.v-scrollable');
    }

    if(!container) {
        console.log('No Container Specified');
        return;
    }

    if(content) {
        if(typeof(content) === 'string') {
            content = container.querySelector(content);
        }
    }
    else {
        content = container.querySelector('div');
    }

    if(!content) {
        console.log('No Content Specified');
        return;
    }

    if(!container.style.position || container.style.position.trim() === '') {
        container.style.position = 'relative';
    }
    content.style.position = 'relative';

    var vscroll = document.createElement('div');
    vscroll.classList.add('vscroll');
    container.appendChild(vscroll);
    vscroll.style.height = (container.offsetHeight - options.top - options.bottom) + 'px';
    vscroll.style.top = options.top + 'px';
    vscroll.style.bottom = options.bottom + 'px';
    vscroll.style.right = options.right + 'px';

    var thumb = document.createElement('div');
    thumb.classList.add('thumb');
    vscroll.appendChild(thumb);

    var containerHeight = container.offsetHeight;
    var contentHeight = content.offsetHeight;
    var contentEffectiveHeight = contentHeight;
    var scrollbarHeight = (container.offsetHeight - options.top - options.bottom);
    var ratio = 1;

    if(contentHeight > containerHeight) {
        thumb.style.height = (containerHeight * containerHeight / contentHeight) + 'px';
        contentEffectiveHeight = scrollbarHeight - (containerHeight * containerHeight / contentHeight);
        ratio = (contentHeight - containerHeight) / (contentEffectiveHeight);
    }
    else {
        vscroll.style.display = 'none';
    }

    var prevY;
    var mousePressed = false;
    thumb.addEventListener('mousedown', function (e) {
        prevY = e.clientY;
        mousePressed = true;
        e.stopPropagation();
    }, false);
    thumb.addEventListener('mousemove', function (e) {
        if(mousePressed) {
            var currentTop = thumb.style.top ? parseInt(thumb.style.top.substring(0, thumb.style.top.length - 1), 10) : 0;
            var calculatedTop = (currentTop + e.clientY - prevY);
            calculatedTop = Math.min(Math.max(0, calculatedTop), contentEffectiveHeight);
            thumb.style.top = calculatedTop + 'px';
            prevY = e.clientY;

            content.style.top = '-' + Math.floor(calculatedTop * ratio) + 'px';
        }
    }, false);
    thumb.addEventListener('mouseup', function () {
        mousePressed = false;
    }, false);
    thumb.addEventListener('mouseout', function (e) {
        mousePressed = false;
    }, false);
    thumb.addEventListener('click', function (e) {
        e.stopPropagation();
    }, false);

    vscroll.addEventListener('click', function (e) {
        var currentTop = thumb.style.top ? parseInt(thumb.style.top.substring(0, thumb.style.top.length - 2), 10) : 0;
        console.log(e.clientY, _calcOffsetTop(thumb));
        var calculatedTop = currentTop + (e.clientY > _calcOffsetTop(thumb) ? 5 : -5);
        calculatedTop = Math.min(Math.max(0, calculatedTop), contentEffectiveHeight);
        thumb.style.top = calculatedTop + 'px';

        content.style.top = '-' + Math.floor(calculatedTop * ratio) + 'px';
    });

    vscroll.addEventListener('mousewheel', function (e) {
        var currentTop = thumb.style.top ? parseInt(thumb.style.top.substring(0, thumb.style.top.length - 1), 10) : 0;
        var calculatedTop = (currentTop + (e.deltaY > 0 ? 5 : -5));
        calculatedTop = Math.min(Math.max(0, calculatedTop), contentEffectiveHeight);
        thumb.style.top = calculatedTop + 'px';

        content.style.top = '-' + Math.floor(calculatedTop * ratio) + 'px';

        e.stopPropagation();
    }, false);
    
    /*
        scrollbar is fully transparent when mouse is somewhere other than the container div
        when mouse is on the div, mouse is made opaque a little bit to give a visual clue that it exists.
        when mousewheel is moved, or mouse hovers on the scrollbar the scrollbar is fully opaque.

        deferOpacity variable is used to track when mousewheel actions truly ends.
        setTimeout schedules to remove the css class after 500 seconds, unless a new mousewheel
        event cancels the setTimeout function before it gets to execute.
     */
    var deferOpacity;
    container.addEventListener('mousewheel', function (e) {
        var currentTop = content.style.top ? parseInt(content.style.top.substring(0, content.style.top.length - 1), 10) : 0;
        var calculatedTop = (currentTop + (e.deltaY < 0 ? 5 : -5));
        calculatedTop = Math.max(Math.min(0, calculatedTop), -1 * (contentHeight-containerHeight));
        content.style.top = calculatedTop + 'px';

        thumb.style.top = Math.floor(-1 * calculatedTop / ratio) + 'px';
        vscroll.classList.add('opaque');

        // show thumbnail as the mousewheel is active.
        if(deferOpacity) {
            clearTimeout(deferOpacity);
        }
        deferOpacity = setTimeout(function () {
            vscroll.classList.remove('opaque');
            deferOpacity = null;
        }, 500);
    }, false);

    container.addEventListener('resize', function () {
        console.log('resized');
    }, false);

    // until I find out another way to detect changes in the height of the content div
    // I will simply run this method when I know that a change occurred.
    this.recalculate = function() {
        thumb.style.top = '0px';

        containerHeight = container.offsetHeight;
        contentHeight = content.offsetHeight;
        contentEffectiveHeight = contentHeight;
        scrollbarHeight = containerHeight - options.top - options.bottom;
        vscroll.style.height = scrollbarHeight + 'px';
        ratio = 1;

        if(contentHeight > containerHeight) {
            thumb.style.height = (containerHeight * containerHeight / contentHeight) + 'px';
            contentEffectiveHeight = scrollbarHeight - (containerHeight * containerHeight / contentHeight);
            ratio = (contentHeight - containerHeight) / (contentEffectiveHeight);
            vscroll.style.display = 'block';

        }
        else {
            vscroll.style.display = 'none';
        }
    };
};

/***
 * Finds all the divs to be made scrollable and converts them
 * _makeVScrollable.all();
 * _makeVScrollable.all(containers);
 * _makeVScrollable.all(containers, options)
 */
_makeVScrollable.all = function () {
    var containers = '.v-scrollable';
    var options;

    if(arguments.length === 1) {
        containers = arguments[0];
    }
    else if(arguments.length > 1) {
        containers = arguments[0];
        options = arguments[1];
    }

    var scrollables = [];
    containers = document.querySelectorAll(containers);

    for(var i = 0; i < containers.length; i += 1) {
        scrollables.push(new _makeVScrollable(containers[i], options));
    }

    return scrollables;
};