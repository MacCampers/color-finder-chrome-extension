document.addEventListener('DOMContentLoaded', function () {
    bindDomListeners();
    requestImagesFromSelectedTab();
    console.log(Config());
});

function bindDomListeners() {
    $('.js-resize-select').on('change', handleResizeSelectChanged);
}

function handleResizeSelectChanged(selectChangeEvent) {
    var bounds = $('.js-resize-select').val();

    if (bounds === 'original') {
        $('.js-found-image-wrapper, .js-found-image').each(function (index, el) {
            $(el).removeAttr('style');
        });
    } else {
        $('.js-found-image-wrapper').each(function (index, wrapperEl) {
            $(wrapperEl).height(parseInt(bounds) + 100);
            resizeImage($(wrapperEl).find('.js-found-image'), bounds);
        });
    }
}

function requestImagesFromSelectedTab() {
    console.log('requesting images');

    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, 'getAllImagesOnPage', function (response) {
            displayImages(response);
        });
    });
}

function displayImages(images) {
    var imagesUl = $('.js-found-images');
    var imageListElement;
    var i = 1;
    _.each(images, function (image) {        
        imageListElement = buildImageListElement(image.srcUrl, image.altText, i);
        imagesUl.append(imageListElement);
        var box1 = document.getElementById('box' + i * 1 + '');
	    var box2 = document.getElementById('box' + i + 1 + '');
        var box3 = document.getElementById('box' + i + 2 + '');
        RGBaster.colors(image.srcUrl, {
            exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
            success: function (payload) {
                box1.style.backgroundColor = payload.dominant;
                box2.style.backgroundColor = payload.secondary;
                box3.style.backgroundColor = payload.palette;
            }
        });
        i = i + 3;
    });
}

function buildImageListElement(srcUrl, altText, i) {
    var imageListElement;
    var divElement = $('<div class="found-image-wrapper js-found-image-wrapper">' + altText + '</div>');
    var imgElement = $('<img class="found-image js-found-image"></img>')
        .attr('src', srcUrl)
        .attr('alt', altText);
    var buttonElement = $('<button class="js-get-button found-image-button">Download</button>');
    divElement.append(imgElement);
    imageListElement = divElement.append(buttonElement);

    var box1 = $('<div id="box' + i * 1 + '" style="width:100px; height:100px; outline: 1px solid #999;"></div>');
    var box2 = $('<div id="box' + i + 1 + '" style="width:100px; height:100px; outline: 1px solid #999;"></div>');
    var box3 = $('<div id="box' + i + 2 + '" style="width:100px; height:100px; outline: 1px solid #999;"></div>');
    divElement.append(box1);
    divElement.append(box2);
    divElement.append(box3);

    return imageListElement;
}


function resizeImage(img, bounds) {
    var $img = $(img);
    var oHeight = $img.height();
    var oWidth = $img.width();
    var newHeight;
    var newWidth;
    var taller = oHeight > oWidth;
    var wider = !taller;

    newHeight = taller ? bounds : oHeight * (bounds / oWidth);
    newWidth = wider ? bounds : oWidth * (bounds / oHeight);

    $img.height(newHeight).width(newWidth);
}
