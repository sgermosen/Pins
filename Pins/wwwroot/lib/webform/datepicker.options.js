window.datepicker_observer = window.datepicker_observer || new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        const parentElement = document.mutation.target.parentElement;

        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            if (mutation.target.disabled) {
                $(mutation.target).datepicker({ showRightIcon: false });

                if (parentElement.setAttribute.contains('input-group')) {
                    parentElement.classList.remove('input-group');
                }
                break;
            }
            $(mutation.target).datepicker({ showRightIcon: true });
            if (!parentElement.classList.contains('input-group')) {
                parentElement.classList.add('input-group');
            }
            break;
        }
    }
});

window._datepicker = window._datepicker || function(namespace, inputRoot, opts, format, defaultEnabled, beforePostBackfn, minDate, maxDate) {

    this.options = {
        maxDate: maxDate ? new Date(maxDate) : undefined,
        minDate: minDate ? new Date(minDate) : undefined,
        uiLibrary: 'bootstrap',
        locale: 'es-es'
    };

    this.getDateMnt = function(value) {
        return moment(value, [this.options.format.toUpperCase()], 'es', true);
    }.bind(this);

    this.beforePostBack = function(cb) {
        var returned = { result: false, hasInvalidDate: false };

        if (typeof cb === 'undefined') {
            throw msg;
            return returned;
        }

        if (typeof beforePostBackfn === 'function') {
            const compareDates = function(from, comparer, to) {
                const fromMnt = this.getDateMnt(from);
                const toMnt = this.getDateMnt(to);

                const comparerList = ['isBefore', 'isSame', 'isAfter', 'isSameOrBefore', 'isSameOrAfter', 'isBetween'];
                if (!comparerList.some((el) => el === comparer)) {
                    const msg = "Programador, debes utilizar un comparador valido...";
                    console.error(msg);
                    throw msg;
                    return returned;
                }
                if (fromMnt.isValid() && toMnt.isValid()) {
                    const result = fromMnt[comparer](toMnt);
                    returned.result = result;
                    return returned;
                }
                returned.hasInvalidDate = true;
                return returned;
            }.bind(this);

            return beforePostBackfn(compareDates, cb);
        }

        returned.result = true;
        return cb.call(this, returned);
    }.bind(this);

    if (typeof opts === 'function') this.options = {...this.options, ...opts() };
    else if (typeof opts === 'object') this.options = {...this.options, ...opts };

    if (typeof this.options.format === 'undefined' && format) this.options.format = format;
    if (typeof this.options.minDate === 'undefined') this.options.minDate = new Date(2016, 0, 1);

    if (this.options.showRightIcon === undefined && typeof defaultEnabled !== 'undefined')
        this.options.showRightIcon = defaultEnabled;

    this.validateFormat = function(src, args) {
        const format = this.options.format.toUpperCase();
        const mmntDate = moment(args.Value, [format, 'DD/MM/YYYY'], 'es', true);
        args.IsValid = mmntDate.isValid();

        return args.IsValid;
    }.bind(this);

    this.capitalizeMonth = function(value) {
        const indexMonth = value.indexOf('/') + 1;
        const dateStr = value;

        const result = dateStr.slice(0, indexMonth) +
            dateStr.charAt(indexMonth).toUpperCase() +
            dateStr.slice(indexMonth + 1);
        return result;
    }.bind(this);

    this.input_onInput = function(arg, isFiredManually) {
        const input = arg.target || arg;
        var isValid = this.validateFormat(null, { IsValid: false, Value: input.value, format: this.options.format });

        if (isValid) {
            const mmtmp = moment(input.value, ['DD/MM/YYYY'], 'es', true);
            if (mmtmp.isValid()) {
                input.value = mmtmp.format(this.options.format.toUpperCase()).replace('.', '');
            }
            input.value = this.capitalizeMonth(input.value);
        }

        return isValid;
    }.bind(this);

    this.input_onChange = function(arg) {
        const input = arg.target || arg;
        //$("div[role='calendar']").remove();
        if (!input.hasAttribute('data-focusfired'))
            return input.onfocus(function() { return this.processOnChange(input); }.bind(this));
        return this.processOnChange(input);

    }.bind(this);

    this.processOnChange = function(input) {
        const oldValue = input.getAttribute('data-oldvalue');
        let result = false;
        if (oldValue !== input.value && this.input_onInput(input, true)) {
            const format = this.options.format.toUpperCase();
            const postValue = this.capitalizeMonth(this.getDateMnt(input.value).format(format));
            result = this.beforePostBack(function(returned) {
                if (returned.result || returned.hasInvalidDate) { __doPostBack(input.id, postValue); return true; }
                return false;
            }.bind(this));
        }
        input.setAttribute("data-oldvalue", input.value);
        return result;
    }.bind(this);

    this.input_onfocus = function(arg, cb) {
        var input = arg.target || arg;
        input.setAttribute("data-oldvalue", input.value);
        input.setAttribute("data-focusfired", "");
        if (cb)
            return cb();
    };

    inputRoot.setAttribute('onfocus', namespace + '.input_onfocus(this)');
    inputRoot.setAttribute('oninput', namespace + '.input_onInput(this)');
    inputRoot.setAttribute('onchange', namespace + '.input_onChange(this)');

    const $input = $(inputRoot);
    $input.datepicker({...this.options });

    if (!defaultEnabled) {
        inputRoot.parentElement.classList.remove('input-group');
    }

    const observer = window.datepicker_observer;
    if (observer) {
        observer.observe(inputRoot, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['disabled'],
            subtree: false
        });
    }

    console.log(namespace, ', datepicker has been loaded');
}