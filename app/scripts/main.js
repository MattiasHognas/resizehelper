(function () {

    'use strict';

    var initialDevices = [
        { name: 'Desktop', width: 1920, density: 1, flagged: true },
        { name: 'iPhone4 - standing', width: 320, density: 2, flagged: true },
        { name: 'iPhone4 - landscape', width: 480, density: 2 },
        { name: 'iPhone5 - standing', width: 320, density: 2 },
        { name: 'iPhone5 - landscape', width: 568, density: 2 },
        { name: 'iPhone6 - standing', width: 375, density: 2, flagged: true },
        { name: 'iPhone6 - landscape', width: 627, density: 2 },
        { name: 'iPhone6+ - standing', width: 414, density: 3, flagged: true },
        { name: 'iPhone6+ - landscape', width: 736, density: 3 },
        { name: 'iPad - standing', width: 768, density: 2, flagged: true },
        { name: 'iPad - landscape', width: 1024, density: 2, flagged: true },
        { name: 'Nexus10 - standing', width: 800, density: 2 },
        { name: 'Nexus10 - landscape', width: 1280, density: 2 },
        { name: 'Nexus4 - standing', width: 384, density: 2 },
        { name: 'Nexus4 - landscape', width: 567, density: 2 },
        { name: 'Nexus5 - standing', width: 360, density: 3 },
        { name: 'Nexus5 - landscape', width: 567, density: 3 },
        { name: 'Nexus6 - standing', width: 412, density: 3.5 },
        { name: 'Nexus6 - landscape', width: 659, density: 3.5 },
        { name: 'Nexus7 - standing', width: 600, density: 2 },
        { name: 'Nexus7 - landscape', width: 960, density: 2 },
        { name: 'Laptop HiDPI', width: 1440, density: 2 },
        { name: 'Laptop', width: 1280, density: 1, flagged: true },
        { name: 'Lumia 520 - standing', width: 320, density: 1.4 },
        { name: 'Lumia 520 - landscape', width: 533, density: 1.4 },
        { name: 'Nokia N9 - standing', width: 360, density: 1 },
        { name: 'Nokia N9 - landscape', width: 640, density: 1 },
        { name: 'iPad Pro - standing', width: 2732, density: 2 },
        { name: 'iPad Pro - landscape', width: 2048, density: 2 },
    ];

    // Default values for classes
    var defaults = {
        image: {
            name: 'image',
            active: false,
            editMode: false,
            showProperties: false
        },
        size: {
            name: 'size',
            width: '100'
        },
        breakpoint: {
            type: 'max-width',
            breakWidth: 0,
            displayWidth: 50,
            unit: 'vw'
        },
        device: {
            name: 'device',
            width: 0,
            density: 1,
            flagged: false
        }
    }


    // Helpers
    function genUniqueProperty(array, property) { // <-- only handles integers
        var newProperty = -1;
        for (var key in array) {
            var item = array[key];
            var itemProperty = typeof item[property] === 'function' ? item[property]() : item[property]; // <-- if property is a function (observable ect.) excecute it to get value
            
            if (newProperty < itemProperty) {
                newProperty = itemProperty;
            }
        }
        return newProperty+=1;
    }
    function spaces(quantity) {
        var string = '';
        for (var i = quantity; i != 0; i--) {
            string += '&nbsp;';
        }    
        return string;
    }

    
    // Classes
    function Image(options) {
        var self = this;
        var set = $.extend({}, defaults.image, options);

        self.id = set.id;
        self.name = ko.observable(set.name);
        self.editMode = ko.observable(set.editMode);
        self.sizes = ko.observableArray(set.sizes);
        self.breakpoints = ko.observableArray(set.breakpoints);
        self.active = ko.observable(set.active);
        self.showProperties = ko.observable(set.showProperties);

        self.edit = function() {
            self.editMode(true);
        };

        ko.computed(function() {
            if(!self.showProperties() && !self.editMode()) {
                self.showProperties(true);
            }
        });

        // there's some problem with this where it doesnt change
        // even though data has been added or removed.
        self.output = ko.computed(function() {
            var outputHtml = '&lt;img ';
            var sizes = self.sizes();
            var breakpoints = self.breakpoints();
            var name = self.name();

            if (sizes.length > 0) {
                outputHtml += 'srcset="';
                for (var key in sizes) {
                    var size = sizes[key];
                    var sizeWidth = size.width();
                    var iteration = parseInt(key) + 1;

                    outputHtml += 'http://placehold.it/' + sizeWidth + 'x' + sizeWidth + ' ' + sizeWidth + 'w';

                    if (iteration != sizes.length) {
                        outputHtml += ',&NewLine;';
                        outputHtml += spaces(13);   
                    } else {
                        outputHtml += '"';
                    }
                }
                outputHtml += '&NewLine;';
                outputHtml += spaces(5);
            }

            outputHtml += 'sizes="';

            if (breakpoints.length > 0) {
                for (var key in breakpoints) {
                    var breakpoint = breakpoints[key];

                    outputHtml += '(' + breakpoint.type() + ': ' + breakpoint.breakWidth() + 'px) ' + breakpoint.displayWidth() + breakpoint.unit() + ',';
                    outputHtml += '&NewLine;' + spaces(12);
                }
            }

            outputHtml += '&NewLine;' + spaces(5);
            outputHtml += 'alt="' + name + '" /&gt;';

            return outputHtml;
        });
    }
    function Size(options) {
        var self = this;
        var set = $.extend({}, defaults.size, options);

        self.id = set.id;
        self.name = set.name;
        self.width = ko.observable(set.width);
    }
    function Breakpoint(options) {
        var self = this;
        var set = $.extend({}, defaults.breakpoint, options);

        self.id = set.id;
        self.sort = ko.observable(set.sort);
        self.type = ko.observable(set.type);
        self.breakWidth = ko.observable(set.breakWidth);
        self.displayWidth = ko.observable(set.displayWidth);
        self.unit = ko.observable(set.unit);

        self.verboseType = function() {
            if(self.type() === 'min-width') return 'larger than';
            if(self.type() === 'max-width') return 'less than';
        }

        // Test will check if the parameter displayWidth fits inside the breakpoint,
        // so if the breakpoint is 'min-width': 1600 px, then the displayWidth needs
        // to be 1600px or larger.
        // It also takes into account how large the image should be viewed at that 
        // browser width, so in the above example, if the self.displayWidth would be
        // 50%, then the image needs to be 800px or larger.
        self.test = function(displayWidth) {
            if (self.type() === 'min-width' && displayWidth >= self.breakWidth() || self.type() === 'max-width' && displayWidth <= self.breakWidth()) {
                if (self.unit() === 'px') {
                    return displayWidth > self.displayWidth() ? self.displayWidth() : displayWidth;
                } else if (self.unit() === 'vw') {
                    return displayWidth * self.displayWidth() / 100;
                } // add more units here if needed
            } else {
                return false;
            }
        };
    }
    function Device(options) {
        var self = this;
        var set = $.extend({}, defaults.device, options);

        self.id = set.id;
        self.name = set.name;
        self.width = set.width;
        self.density = set.density;
        self.flagged = ko.observable(set.flagged);
        self.usingSize = ko.observable('-');

        self.loss = ko.computed(function () {
            var loss;
            var sizeFound = false;

            if(!$.isEmptyObject(viewmodel.activeImage()) && viewmodel.activeImage().sizes().length > 0) { // <-- check if there are sizes to calculate with
                var displayWidth;

                for (var key1 in viewmodel.activeImage().sizes()) {
                    var size = viewmodel.activeImage().sizes()[key1];

                    for (var key2 in viewmodel.activeImage().breakpoints()) {
                        var breakpoint = viewmodel.activeImage().breakpoints()[key2];
                        var breakpointTest = breakpoint.test(self.width);
                        if (breakpointTest) {
                            displayWidth = breakpointTest;
                            break;
                        }
                    }

                    var deviceLoss = Math.round((size.width() - self.density * displayWidth) / size.width() * 100);

                    if (deviceLoss >= 0 && (deviceLoss < loss || typeof loss === 'undefined')) {
                        loss = deviceLoss;
                        self.usingSize(size.width());
                        sizeFound = true;
                    }
                }
            }

            if (!sizeFound) {
                self.usingSize('-');
            }
            return sizeFound ? loss + '%' : '-';
        });
    }


    // Viewmodel
    function DevicesViewModel() {
        var self = this;

        self.images = ko.observableArray();
        self.activeImage = ko.observable({});
        self.devices = ko.observableArray();

        self.addImage = function(options) {
            // generate unique id
            var newId = genUniqueProperty(self.images(), 'id');
            
            // merge id to the options
            options = $.extend({}, options, { id: newId });

            // create the new image
            self.images.push(new Image(options));

            // set image as active if it's the first created
            if(self.images().length === 1) {
                self.setActiveImage(newId);
            }
        }
        self.removeImage = function(id) {
            var image = ko.utils.arrayFirst(self.images(), function(image) { return image.id === id });
            
            if(image.active()) {
                self.clearActiveImage();
            }

            self.images.remove(image);
        }
        self.setActiveImage = function(id) {
            var image = ko.utils.arrayFirst(self.images(), function(image) { return image.id === id });
            
            // early escape if the selected image is already active
            if(image.active()) return;

            // remove active from the already active image
            if(self.activeImage().active) {
                self.activeImage().active(false);
            }

            // set the new item as active
            image.active(true);
            self.activeImage(image);
        }
        self.clearActiveImage = function() {
            self.activeImage({});
        }
        self.addSize = function(options) {
            // generate unique id
            var newId = genUniqueProperty(self.activeImage().sizes(), 'id');
            options = $.extend({}, options, { id: newId });

            // create the new size
            self.activeImage().sizes.push(new Size(options));
        }
        self.removeSize = function(id) {
            self.activeImage().sizes.remove( function(size) { return size.id == id });
        }
        self.addBreakpoint = function(options) {
            // generate unique id and sort
            var newId = genUniqueProperty(self.activeImage().breakpoints(), 'id');
            var newSort = genUniqueProperty(self.activeImage().breakpoints(), 'sort');
            options = $.extend({}, options, { 
                id: newId,
                sort: newSort
            });

            // create the new breakpoint
            self.activeImage().breakpoints.push(new Breakpoint(options));
        }
        self.removeBreakpoint = function(id) {
            var breakpoint = ko.utils.arrayFirst(self.activeImage().breakpoints(), function(item) { return item.id === id });
            var removedPosition = breakpoint.sort();
            self.activeImage().breakpoints.remove(breakpoint);

            for (var key in self.activeImage().breakpoints()) {
                var item = self.activeImage().breakpoints()[key];

                if (item.sort() > removedPosition) {
                    item.sort(item.sort() - 1);
                }
            }
        }
        self.addDevice = function(options) {
            var newId = genUniqueProperty(self.devices(), 'id');

            options = $.extend({}, options, { id: newId });

            self.devices.push(new Device(options));
        }
        self.removeDevice = function(id) {

        }

        self.breakpointSort = function(pos, delta) {
            var me = ko.utils.arrayFirst(self.activeImage().breakpoints(), function(item) { return item.sort() === pos });
            var sibling = ko.utils.arrayFirst(self.activeImage().breakpoints(), function(item) { return item.sort() === pos + delta });

            me.sort(me.sort() + delta);
            sibling.sort(sibling.sort() + delta * -1);

            self.activeImage().breakpoints.sort(function (left, right) {
                return left.sort() > right.sort() ? 1 : -1;
            });
        }

        self.updateOuput = ko.computed(function() {
            if(!$.isEmptyObject(self.activeImage())) {
                $('#js-output').html(self.activeImage().output());
            }  
        });

    }

    var viewmodel = new DevicesViewModel();

    // setting up some initial data, this will be moved once local storage is implemented.
    // also, intitial data might be removed once the 'intro' is in place.
    viewmodel.addImage({ name: 'Example image' });
    viewmodel.addSize({ width: 1600 });
    viewmodel.addSize({ width: 1200 });
    viewmodel.addSize({ width: 2000 });

    $.map(initialDevices, function (item) { viewmodel.addDevice(item); });


    ko.applyBindings(viewmodel);

})();