/*!
* Pixelchild PX DropDown v1.0.x beta
* pixelchild.com.au/
*
* Copyright 2011, Byron Salau
* Released under the MIT and GPL Licenses.
*
* Stable With: jQuery V1.4.4
*
* Date: Sat 22 Jan 15:55:04 2011 +1100
*/
(function ($) {

    // here we go!
    $.pxDropdown = function (element, options) {

        //private default options
        var defaults = {
            easing: 'linear',
            speed: 400,
            onDrop: function () { },
            onComplete: function () { },
            debug: false
        }

        //reference the current instance of the object
        var plugin = this;

        //plugin's properties
        plugin.settings = {}

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
             element = element;     // reference to the actual DOM element

        // the "constructor" method
        plugin.init = function () {

            //merge properties
            plugin.settings = $.extend({}, defaults, options);

            //Create Unique Id if needed
            if (!$element.attr('id')) {
                $element.attr('id', newUniqueId());
            }

            //init
            plugin.selected = $('option:selected', $element);
            plugin.items = $("option", $element);

            //set replacement
            $element.after('<dl id="pxReplaced_' + $element.attr('id') + '" class="pxDropdown"></dl>');
            plugin.target = $('#pxReplaced_' + $element.attr('id'));
            plugin.target.append('<dt><a href="#">' + plugin.selected.text() + '</a></dt><dd><ul></ul></dd>');
            if (!plugin.settings.debug) { $element.hide(); }

            //set items
            var str = "";
            plugin.items.each(function (i) {

                str += '<li';

                if (plugin.selected.text() == $(this).text()) {
                    str += ' class="selected"';
                }

                str += '><a href="#"><span class="text">' +
                            $(this).text() + '</span><span class="value">' +
                            $(this).val() + '</span></a></li>';
            });

            //insert into dom
            $("dd ul", plugin.target).append(str);

            //bind dropdown click
            $('dt a', plugin.target).bind('click', function () {
                $('ul', plugin.target).slideDown(plugin.settings.speed, plugin.settings.easing).trigger('focus');
                return false;
            });

            //bind auto hide
            $(plugin.target).bind('mouseleave', function () {
                plugin.timeoutTarget = $('ul', plugin.target);
                plugin.timeoutTargetSrc = $('dt a', this);
                plugin.dropDowntimer = setTimeout(function () {
                    plugin.timeoutTarget.slideUp(plugin.settings.speed, plugin.settings.easing);
                }, 200);
            });
            $('ul', plugin.target).bind('mouseenter', function () {
                if (typeof plugin.dropDowntimer != 'undefined')
                    clearTimeout(plugin.dropDowntimer);
            });

            //bind select item
            $("dd ul li a", plugin.target).bind('click', function () {
                var text = $('.text', this).html();
                $("dt a", plugin.target).html(text);
                $("dd ul", plugin.target).fadeOut(200);
                $('dd ul li.selected', plugin.target).removeClass('selected');
                $(this).parent().addClass('selected');
                $element.val($(this).find("span.value").html());
                $element.change();
                return false;
            });

        }

        //private
        var newUniqueId = function () {
            var pluginId = "x0143";
            var newDate = new Date;
            return 'px' + newDate.getTime() + pluginId;
        }

        // call the "constructor" method
        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.pxDropdown = function (options) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function () {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('pxDropdown')) {

                // create a new instance of the plugin
                var plugin = new $.pxDropdown(this, options);

                // store a reference to the plugin object
                $(this).data('pxDropdown', plugin);

            }

        });

    }

})(jQuery);