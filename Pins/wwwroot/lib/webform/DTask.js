
function disableInput(causeValidation, validationGroup, querySelector) {
    var elements = document.querySelectorAll(querySelector);

    //Check causeValidation and if validations function is found
    if (causeValidation == 'True' && typeof (Page_ClientValidate) == 'function') {
        if (validationGroup.length > 0) {
            if (Page_ClientValidate(validationGroup)) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].disabled = true;
                }
            }
        } else {

            if (Page_ClientValidate()) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].disabled = true;
                }
            }
        }

    } else {
        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
        }

        setTimeout(function () { reEnableInput(querySelector); }, 10000);
    }

    return true;
}

function reEnableInput(querySelector) {
    var elements = document.querySelectorAll(querySelector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
}


function applyValidationStyles(triggerValidation) {
    if (triggerValidation === true) {
        Page_ClientValidate();
    }
    if (!Page_IsValid) {
        for (i = 0; i < Page_Validators.length; i++) {

            if (!Page_Validators[i].isvalid) {
                var elem = $("#" + Page_Validators[i].controltovalidate );
                if (elem.is("select")) {
                    elem.prev().prev().addClass('validation-fail');
                } else if (elem.is("input")) {
                    elem.addClass('validation-fail');
                }
            }
        }
        return false;
    }

}


function setInputMask(className) {
    $('input[input-mask].' + className).each(function (index) {
        $(this).mask($(this).attr("input-mask"), { placeholder:" " });
    });
}

function setIntialItemSearchPanelCollapseStatus(gridId) {
    var gridQuery = $(gridId);
    if (gridQuery.length === 0) {
        $('#iscollapse').addClass('in');
    } else if (gridQuery[0].rows.length > 1) {
        $('#iscollapse').removeClass('in');
    }
}

function openModalIS() {
    $('#ItemSearchModal').modal('show');
}

function showFsLoader(message) {
    $(document).ready(function () {
        $get('fsLoader').style.display = 'block';
        $get('fsLoaderMessage').innerText = message || 'Cargando';
    });
}

function hideFsLoader() {
    $(document).ready(function () {
        $get('fsLoader').style.display = 'none';
        $get('fsLoaderMessage').innerText = '';
    });
}

function validateBusinessId(sender, args) {
    args.IsValid = true;
    var re = new RegExp('[0-9]{8}-[0-9]{4}', 'g');
    if (re.exec(args.Value) == null) {
        args.IsValid = false;
    }
}

function validateTelephone(sender, args) {
    args.IsValid = true;
    //var re = new RegExp('\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}', 'g');
    var re = new RegExp('[0-9]{10}', 'g');

    if (re.exec(args.Value) == null) {
        args.IsValid = false;
    }
}

// Mejora Adicionada por Roy Morillo
function validateSocialSecurity(sender, args) {
    args.IsValid = true;
    var re = new RegExp('[0-9]{3}-[0-9]{6}', 'g');
    if (re.exec(args.Value) == null) {
        args.IsValid = false;
    }
}


$.fn.custom_select = function (callback) {
    $(this).each(function () {
        var $select = $(this);

        if ($select.hasClass('browser-default')) {
            return; // Continue to next (return false breaks out of entire loop)
        }

        var multiple = $select.attr('multiple') ? true : false,
            lastID = $select.data('select-id'); // Tear down structure if Select needs to be rebuilt

        if (lastID) {
            $select.parent().find('span.caret').remove();
            $select.parent().find('input').remove();

            $select.unwrap();
            $('ul#select-options-' + lastID).remove();
        }

        // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
        if (callback === 'destroy') {
            $select.data('select-id', null).removeClass('initialized');
            return;
        }

        var uniqueID = Materialize.guid();
        $select.data('select-id', uniqueID);
        var wrapper = $('<div class="select-wrapperCust"></div>');
        wrapper.addClass($select.attr('class'));
        var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdownCust ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
            selectChildren = $select.children('option, optgroup'),
            valuesSelected = [],
            optionsHover = false;

        var label = $select.find('option:selected').html() || $select.find('option:first').html() || "";

        // Function that renders and appends the option taking into
        // account type and possible image icon.
        var appendOptionWithIcon = function (select, option, type) {
            // Add disabled attr if disabled
            var disabledClass = (option.is(':disabled')) ? 'disabled ' : '';

            // add icons
            var icon_url = option.data('icon');
            var classes = option.attr('class');
            if (!!icon_url) {
                var classString = '';
                if (!!classes) classString = ' class="' + classes + '"';

                // Check for multiple type.
                if (type === 'multiple') {
                    options.append($('<li class="' + disabledClass + '"><img src="' + icon_url + '"' + classString + '><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
                } else {
                    options.append($('<li class="' + disabledClass + '"><img src="' + icon_url + '"' + classString + '><span>' + option.html() + '</span></li>'));
                }
                return true;
            }

            // Check for multiple type.
            if (type === 'multiple') {
                options.append($('<li class="' + disabledClass + '"><span><input type="checkbox"' + disabledClass + '/><label></label>' + option.html() + '</span></li>'));
            } else {
                options.append($('<li class="' + disabledClass + '"><span>' + option.html() + '</span></li>'));
            }
        };

        /* Create dropdown structure. */
        if (selectChildren.length) {
            selectChildren.each(function () {
                if ($(this).is('option')) {
                    // Direct descendant option.
                    if (multiple) {
                        appendOptionWithIcon($select, $(this), 'multiple');

                    } else {
                        appendOptionWithIcon($select, $(this));
                    }
                } else if ($(this).is('optgroup')) {
                    // Optgroup.
                    var selectOptions = $(this).children('option');
                    options.append($('<li class="optgroup"><span>' + $(this).attr('label') + '</span></li>'));

                    selectOptions.each(function () {
                        appendOptionWithIcon($select, $(this));
                    });
                }
            });
        }

        options.find('li:not(.optgroup)').each(function (i) {
            $(this).click(function (e) {
                // Check if option element is disabled
                if (!$(this).hasClass('disabled') && !$(this).hasClass('optgroup')) {
                    var selected = true;

                    if (multiple) {
                        $('input[type="checkbox"]', this).prop('checked', function (i, v) { return !v; });
                        selected = toggleEntryFromArray(valuesSelected, $(this).index(), $select);
                        $newSelect.trigger('focus');
                    } else {
                        options.find('li').removeClass('active');
                        $(this).toggleClass('active');
                        $newSelect.val($(this).text());
                    }

                    activateOption(options, $(this));
                    $select.find('option').eq(i).prop('selected', selected);
                    // Trigger onchange() event
                    $select.trigger('change');
                    if (typeof callback !== 'undefined') callback();
                }

                e.stopPropagation();
            });
        });

        // Wrap Elements
        $select.wrap(wrapper);
        // Add Select Display Element
        var dropdownIcon = $('<span class="caret"></span>');
        if ($select.is(':disabled'))
            dropdownIcon.addClass('disabled');

        // escape double quotes
        var sanitizedLabelHtml = label.replace(/"/g, '&quot;');

        var $newSelect = $('<input type="text" class="select-dropdownCust" readonly="true" ' + (($select.is(':disabled')) ? 'disabled' : '') + ' data-activates="select-options-' + uniqueID + '" value="' + sanitizedLabelHtml + '"/>');
        $select.before($newSelect);
        $newSelect.before(dropdownIcon);

        $newSelect.after(options);
        // Check if section element is disabled
        if (!$select.is(':disabled')) {
            $newSelect.dropdown({ 'hover': false, 'closeOnClick': false });
        }

        // Copy tabindex
        if ($select.attr('tabindex')) {
            $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
        }

        $select.addClass('initialized');

        $newSelect.on({
            'focus': function () {
                if ($('ul.select-dropdownCust').not(options[0]).is(':visible')) {
                    $('input.select-dropdownCust').trigger('close');
                }
                if (!options.is(':visible')) {
                    $(this).trigger('open', ['focus']);
                    var label = $(this).val();
                    var selectedOption = options.find('li').filter(function () {
                        return $(this).text().toLowerCase() === label.toLowerCase();
                    })[0];
                    activateOption(options, selectedOption);
                }
            },
            'click': function (e) {
                e.stopPropagation();
            }
        });

        $newSelect.on('blur', function () {
            if (!multiple) {
                $(this).trigger('close');
            }
            options.find('li.selected').removeClass('selected');
        });

        options.hover(function () {
            optionsHover = true;
        }, function () {
            optionsHover = false;
        });

        $(window).on({
            'click': function () {
                multiple && (optionsHover || $newSelect.trigger('close'));
            }
        });

        // Add initial multiple selections.
        if (multiple) {
            $select.find("option:selected:not(:disabled)").each(function () {
                var index = $(this).index();

                toggleEntryFromArray(valuesSelected, index, $select);
                options.find("li").eq(index).find(":checkbox").prop("checked", true);
            });
        }

        // Make option as selected and scroll to selected position
        activateOption = function (collection, newOption) {
            if (newOption) {
                collection.find('li.selected').removeClass('selected');
                var option = $(newOption);
                option.addClass('selected');
                options.scrollTo(option);
            }
        };

        // Allow user to search by typing
        // this array is cleared after 1 second
        var filterQuery = [],
            onKeyDown = function (e) {
                // TAB - switch to another input
                if (e.which == 9) {
                    $newSelect.trigger('close');
                    return;
                }

                // ARROW DOWN WHEN SELECT IS CLOSED - open select options
                if (e.which == 40 && !options.is(':visible')) {
                    $newSelect.trigger('open');
                    return;
                }

                // ENTER WHEN SELECT IS CLOSED - submit form
                if (e.which == 13 && !options.is(':visible')) {
                    return;
                }

                e.preventDefault();

                // CASE WHEN USER TYPE LETTERS
                var letter = String.fromCharCode(e.which).toLowerCase(),
                    nonLetters = [9, 13, 27, 38, 40];
                if (letter && (nonLetters.indexOf(e.which) === -1)) {
                    filterQuery.push(letter);

                    var string = filterQuery.join(''),
                        newOption = options.find('li').filter(function () {
                            return $(this).text().toLowerCase().indexOf(string) === 0;
                        })[0];

                    if (newOption) {
                        activateOption(options, newOption);
                    }
                }

                // ENTER - select option and close when select options are opened
                if (e.which == 13) {
                    var activeOption = options.find('li.selected:not(.disabled)')[0];
                    if (activeOption) {
                        $(activeOption).trigger('click');
                        if (!multiple) {
                            $newSelect.trigger('close');
                        }
                    }
                }

                // ARROW DOWN - move to next not disabled option
                if (e.which == 40) {
                    if (options.find('li.selected').length) {
                        newOption = options.find('li.selected').next('li:not(.disabled)')[0];
                    } else {
                        newOption = options.find('li:not(.disabled)')[0];
                    }
                    activateOption(options, newOption);
                }

                // ESC - close options
                if (e.which == 27) {
                    $newSelect.trigger('close');
                }

                // ARROW UP - move to previous not disabled option
                if (e.which == 38) {
                    newOption = options.find('li.selected').prev('li:not(.disabled)')[0];
                    if (newOption)
                        activateOption(options, newOption);
                }

                // Automaticaly clean filter query so user can search again by starting letters
                setTimeout(function () { filterQuery = []; }, 1000);
            };

        $newSelect.on('keydown', onKeyDown);
    });

    function toggleEntryFromArray(entriesArray, entryIndex, select) {
        var index = entriesArray.indexOf(entryIndex),
            notAdded = index === -1;

        if (notAdded) {
            entriesArray.push(entryIndex);
        } else {
            entriesArray.splice(index, 1);
        }

        select.siblings('ul.dropdown-content').find('li').eq(entryIndex).toggleClass('active');

        // use notAdded instead of true (to detect if the option is selected or not)
        select.find('option').eq(entryIndex).prop('selected', notAdded);
        setValueToInput(entriesArray, select);

        return notAdded;
    }

    function setValueToInput(entriesArray, select) {
        var value = '';

        for (var i = 0, count = entriesArray.length; i < count; i++) {
            var text = select.find('option').eq(entriesArray[i]).text();

            i === 0 ? value += text : value += ', ' + text;
        }

        if (value === '') {
            value = select.find('option:disabled').eq(0).text();
        }

        select.siblings('input.select-dropdownCust').val(value);
    }
};