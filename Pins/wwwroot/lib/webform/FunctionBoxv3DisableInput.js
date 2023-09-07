// disables the button specified and sets its style to a disabled "look".
function disableInput(causeValidation, validationGroup) {
    var elements = document.querySelectorAll('.functionButton');

    //Check causeValidation and if validations function is found
    if (causeValidation == 'True' && typeof (Page_ClientValidate) == 'function') {
        if (validationGroup.length > 0) {
            if (Page_ClientValidate(validationGroup)) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].disabled = true;
                }
            }
        }
        else {

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

        setTimeout(function () { reEnableInput() }, 10000);
    }

    return true;
}

function reEnableInput() {
    var elements = document.querySelectorAll('.functionButton');
    for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
}
