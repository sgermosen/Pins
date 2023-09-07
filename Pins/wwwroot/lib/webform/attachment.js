var FILE_STATUS_COMPLETED = '1';
var FILE_STATUS_INPROGRESS = '-1';
var FILE_STATUS_NOTFILE = '0';

function initDragDrop() {
    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });
}

function dragEnterHandler(e, row) {

    var dt = e.originalEvent ? e.originalEvent.dataTransfer : e.dataTransfer;
    var isFile = (dt.types != null && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('application/x-moz-file')));
    if (isFile || $telerik.isSafari5 || $telerik.isIE10Mode || $telerik.isOpera)
        row.style.backgroundColor = "#E6E6DA";
}

function dragLeaveHandler(e, row) {
    var ev = e.originalEvent ? e.originalEvent : e;
    if (!$telerik.isMouseOverElementEx(row, ev))
        row.style.backgroundColor = "#FFFFFF";
}

function dropHandler(e, row) {

    row.style.backgroundColor = "#FFFFFF";
}
/*
function onClientProgressBarUpdating(progressArea, args) {
    progressArea.updateHorizontalProgressBar(args.get_progressBarElement(), args.get_progressValue());
    args.set_cancel(true);
}
*/

function disableDefaultDropZone(sender, args) {
    //$ = $telerik.$;

    $telerik.$('.ruInputs').off('dragenter');
    $telerik.$('.ruInputs').children().off('dragenter');
    $telerik.$('.ruDropZone').off('dragenter');
    $telerik.$('.ruDropZone').off('dragleave');
    $telerik.$('.ruDropZone').off('drop');
    $telerik.$('.ruDropZone').off('dragover');
    //debugger;
}

/*
function startUploads() {
    var uploaders = document.getElementsByClassName("reqDocumentUpload");
    for (var i = 0; i < uploaders.length; i++) {
        var rau = $find(uploaders[i].id);
        if (rau._selectedFilesCount > 0) {
            rau.startUpload();
        }
    }
}
*/

function OnClientValidationFailed(sender, args) {
    //debugger;
    //var rowNum = sender._element.id.substring(sender._element.id.lastIndexOf('_') + 1, sender._element.id.length);
    var FILE_ERROR = '';
    var fileExtention = args.get_fileName().substring(args.get_fileName().lastIndexOf('.') + 1, args.get_fileName().length);
    
    if (args.get_fileName().lastIndexOf('.') != -1) {//this checks if the extension is correct
        if (sender.get_allowedFileExtensions().indexOf(fileExtention) == -1) {
            FILE_ERROR = 'Tipo de archivo incorrecto. Se aceptan archivos solo de tipo PDF.';
        }
        else {
            FILE_ERROR = "Tamaño de archivo invalido. Se aceptan archivos con un tamaño de hasta " + sender._maxFileSize / (1024 * 1024) + "MB.";
        }
    }
    else {
        FILE_ERROR = 'No se pudo determinar el tipo de archivo. Por favor revise la extension del archivo al final de su nombre.';
    }
    $('[id$=cusvalAttacmentFileExtension]')[0].innerHTML = FILE_ERROR;


    var divProgressbar = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar-container');

    $(divProgressbar).hide();
    $(divContainer).hide();
    //debugger;
}

function OnClientFileSelected(sender, args) {
    //debugger;
    var upload = $find(sender._element.id);      

    

    if (sender.isExtensionValid(args.get_fileName()) && sender.getUploadedFiles().length == 0) {
        //var divFilename = sender._element.parentElement.parentElement.parentElement.querySelector('div .divFilename');
        //divFilename.innerText = args.get_fileName();

        var divProgressbar = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar');
        var divContainer = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar-container');
        
        $(".ruUploadProgress").attr('data-toggle', 'tooltip');
        $(".ruUploadProgress").attr('title', $(".ruUploadProgress").text());
        //$(".ruUploadProgress").attr('data-placement', 'top');

        //$('.ruUploadProgress').tooltip();

       // $(".ruUploadProgress").addClass("fileNameStyle");
       // $(".ruUploadProgress").addClass("showTip");
      

        $(divProgressbar).width(0);
        $(divProgressbar).show();
        $(divContainer).show();
    }
    $(".ruUploadProgress").addClass("fileNameStyle");
}

function gvwDocuments_OnClientFileSelected(sender, args) {
    //debugger;
    
    //var upload = $find(sender._element.id);

    if (sender.isExtensionValid(args.get_fileName()) && sender.getUploadedFiles().length == 0) {
        //var divFilename = sender._element.parentElement.parentElement.parentElement.querySelector('div .divFilename');
        //divFilename.innerText = args.get_fileName();
        //debugger;
        var divProgressbar = sender._element.parentElement.querySelector('div .progressbar');
        var divContainer = sender._element.parentElement.querySelector('div .progressbar-container');

        $(divProgressbar).width(0);
        $(divProgressbar).show();
        $(divContainer).show();
    }
}


function gvwDocuments_OnClientProgressUpdating(sender, args) {
    //debugger;
    var divProgressbar = sender._element.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.querySelector('div .progressbar-container');
    var divFileStatus = sender._element.parentElement.querySelector('div .divFileStatus');

    var data = args.get_data();
    var percents = data.percent;
    var fileSize = data.fileSize;
    var fileName = data.fileName;
    var uploadedBytes = data.uploadedBytes;

    if (percents > 100)
        percents = 100;

    var progressBarWidth = percents * $(divContainer).width() / 100;
    $(divProgressbar).width(progressBarWidth).html(parseInt(percents).toString() + "% ");

    divFileStatus.innerText = FILE_STATUS_INPROGRESS; //Set file download status in Progress

    //set the save button disabled;
    //$(document).find('input[id*=btnSaveDocuments]').prop('disabled', true);

}

function gvwOptionalDocument_OnClientProgressUpdating(sender, args) {
    //debugger;
    var divProgressbar = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar-container');
    var divFileStatus = sender._element.parentElement.parentElement.parentElement.querySelector('div .divFileStatus');

    var data = args.get_data();
    var percents = data.percent;
    var fileSize = data.fileSize;
    var fileName = data.fileName;
    var uploadedBytes = data.uploadedBytes;

    if (percents > 100)
        percents = 100;

    var progressBarWidth = percents * $(divContainer).width() / 100;
    $(divProgressbar).width(progressBarWidth).html(parseInt(percents).toString() + "% ");

    divFileStatus.innerText = FILE_STATUS_INPROGRESS; //File in Download Progress

    //set the save button disabled;
    $(document).find('input[id*=btnSaveDocument]').prop('disabled', true);
}

function isFileDownloadProcessCompleted(rauFileUpload) {
    //debugger;
    var bProcessCompleted = false;
    var bprocessCompleted = false;

    //Get all the field divFileStatus to evaluate the files estatuses
    $(rauFileUpload._element.parentElement.parentElement.parentElement.parentElement).
            find('[id*="divFileStatus"]').each(function () {
                if ($(this).text().length > 0 && bprocessCompleted == false) {
                    //if file status is completed
                    if ($(this).text() == FILE_STATUS_COMPLETED)
                        bProcessCompleted = true;
                        //if file status is in progress
                    else if ($(this).text() == FILE_STATUS_INPROGRESS) {
                        bProcessCompleted = false;
                        bprocessCompleted = true;
                        return;
                    }
                }
            })

    return bProcessCompleted;
}

function gvwDocuments_OnClientFileUploaded(sender, args) {
    //debugger;

    var divProgressbar = sender._element.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.querySelector('div .progressbar-container');
    var divFileStatus = sender._element.parentElement.querySelector('div .divFileStatus');

    $(divProgressbar).hide();
    $(divContainer).hide();
    divFileStatus.innerText = FILE_STATUS_COMPLETED; //File Completed

    //set the save button disabled or not;
    $(document).find('input[id*=btnSaveDocuments]').prop('disabled', !isFileDownloadProcessCompleted(sender));
}

function gvwOptionalDocument_OnClientFileUploaded(sender, args) {
    var divProgressbar = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar-container');
    var divFileStatus = sender._element.parentElement.parentElement.parentElement.querySelector('div .divFileStatus');

    $(divProgressbar).hide();
    $(divContainer).hide();
    divFileStatus.innerText = FILE_STATUS_COMPLETED; //File Completed

    //set the save button disabled or not;
    $(document).find('input[id*=btnSaveDocument]').prop('disabled', false);

    Page_ClientValidate("Attachment");
}

function gvwDocuments_OnClientFileRemoved(sender, args) {
    //Set the file status no file to download
    var divFileStatus = sender._element.parentElement.querySelector('div .divFileStatus');
    divFileStatus.innerText = FILE_STATUS_NOTFILE

    //Hide the progress bar.
    var divProgressbar = sender._element.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.querySelector('div .progressbar-container');
    $(divProgressbar).width(0);
    $(divProgressbar).hide();
    $(divContainer).hide();
}

function gvwOptionalDocument_OnClientFileRemoved(sender, args) {
    //Set the file status no file to download
    var divFileStatus = sender._element.parentElement.parentElement.parentElement.querySelector('div .divFileStatus');
    divFileStatus.innerText = FILE_STATUS_NOTFILE

    //Hide the progress bar.
    var divProgressbar = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar');
    var divContainer = sender._element.parentElement.parentElement.parentElement.querySelector('div .progressbar-container');
    $(divProgressbar).width(0);
    $(divProgressbar).hide();
    $(divContainer).hide();
}


function OnClientFilesSelected(sender, args) {
    //debugger;
}

function OnClientFileUploading(sender, args) {
    //debugger;
    if (sender.getUploadedFiles().length > 0) {
        args.get_row().style.display = 'none';
        args.set_cancel(true);
    }
}


