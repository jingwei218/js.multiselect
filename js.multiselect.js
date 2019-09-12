(function ($) {

    $.fn.multiSelect = function (options) {

        var opts = $.extend({}, $.fn.multiSelect.defaults, options);

        var choiceList = $(this).find('.multi-select-choice-list');
        var itemContainer = $(this).find('.multi-select-item-container');
        var itemsArrInput = $(this).find('.multi-select-items-json');

        var attrs = opts.attrs.replace(/ /g, '').split(',');
        var itemsArr = {
            'id': [],
            'obj': []
        };
        var choice;

        choiceList.on('click', function (e) {
            var itemCount = itemContainer.find('.multi-select-item').length;
            if (itemCount < opts.maximumItems) {
                if (e.target.nodeName == 'LI') {
                    choice = $(e.target).find('.multi-select-choice');
                } else {
                    choice = $(e.target);
                }
                moveChoice(choice);
                itemsArrInput.val(JSON.stringify(itemsArr));
            }
        });

        itemContainer.on('click', function (e) {
            var el = e.target;
            itemsArr = JSON.parse(itemsArrInput.val());
            if (e.target.nodeName == 'I') {
                var item = $(el).parents('.multi-select-item');
                moveItem(item);
                itemsArrInput.val(JSON.stringify(itemsArr));
            }
        });

        function moveChoice(choice) {
            var i = $('<i class="fas fa-times fa-fw ml-2"></i>');
            choice.removeClass('multi-select-choice')
                .append(i)
                .addClass('multi-select-item')
                .appendTo(itemContainer);
            itemsArr['id'].push(choice.data('uid'));
            itemsArr['obj'].push({});
            var index = itemsArr['obj'].length - 1
            for (var i = 0; i < attrs.length; i++) {
                itemsArr['obj'][index][attrs[i]] = choice.data(attrs[i]);
            }
        }

        function moveItem(item) {
            var id = item.attr('id');
            var index = itemsArr['id'].indexOf(id);
            item.find('i').remove();
            item.removeClass('multi-select-item').addClass('multi-select-choice');
            choiceList.find('li#' + id).append(item);
            itemsArr['id'].splice(index, 1);
            itemsArr['obj'].splice(index, 1);
        }

        return {
            clearItemContainer: function () {
                var items = $(itemContainer).find('.multi-select-item');
                items.each(function (i, el) {
                    moveItem($(el));
                });
                itemData = {};
                itemsArr['id'] = [];
                itemsArr['obj'] = [];
                itemsArrInput.val('');
            },
            initialiseItems: function () {
                var json = itemsArrInput.val();
                if (json) {
                    var arr = JSON.parse(json);
                    var choices = choiceList.find('.multi-select-choice');
                    choices.each(function (i, e) {
                        var choice_id = $(e).attr('id');
                        if (arr['id'].indexOf(choice_id) > -1) {
                            moveChoice($(e));
                        }
                    });
                }
            }
        };

    };


    $.fn.multiSelect.defaults = {
        maximumItems: 10,
        attrs: '',
    };

}(jQuery));