const __alreadyReturned = {};
function __extract(returnCount) {

    return new Promise(resolve => {
        __extractInternal(returnCount, resolve);
    });
}

function __extractInternal(returnCount, resolve) {

        const minImageWidth = 200;
        const minImageHeight = 200;
        const includeVideos = true;

        if (typeof __minImageWidth !== 'undefined')
            minImageWidth = __minImageWidth;

        if (typeof __minImageHeight !== 'undefined')
            minImageHeight = __minImageHeight;

        if (typeof __includeVideos !== 'undefined')
            includeVideos = __includeVideos;

        let toReturn = [];

        let accept = (el) => {
            return (el.tagName == 'VIDEO' && includeVideos) || (el.clientWidth > minImageWidth
                 && el.clientHeight > minImageHeight && el.naturalWidth > minImageWidth && el.naturalHeight > minImageHeight);
        }

        let findElements = (elements) => {
            for (var i = 0; i < elements.length; ++i) {

                const el = elements[i];

                if (typeof __alreadyReturned[el.currentSrc] !== 'undefined')
                    continue;

                if(toReturn.length >= returnCount) {
                    break;
                }

                if(accept(el)) {
                    toReturn.push({ payload: el.currentSrc });
                }
            }
        }

        findElements(document.getElementsByTagName("img"));
        findElements(document.getElementsByTagName("video"));

       // if(toReturn.length >= returnCount) {

            for(var i = 0; i < toReturn.length; ++i) {
                __alreadyReturned[toReturn[i].url] = true;
            }
            resolve(JSON.stringify(toReturn));
      //  }
}

           /* window.scrollTo(0,document.body.scrollHeight);
            setTimeout(() => {
                if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                    resolve(JSON.stringify([]));
                } else {
                    __extract(returnCount, resolve);
                }
            }, 1000)*/

/*
let currentPos = 0;

window.addEventListener("scroll", function (e) {
    currentPos = window.scrollY || window.pageYOffset;
});

function __scrollALittle() {

    console.log('scrolling');
    window.scrollTo(0, currentPos);
}



var fps = 100;
var speedFactor = 0.001;
var minDelta = 0.5;
var autoScrollSpeed = 10;
var autoScrollTimer = null;
var isScrolling = false;
var prevPos = 0, currentPos = 0;
var currentTime, prevTime, timeDiff;

window.addEventListener("scroll", function (e) {
    currentPos = window.scrollY || window.pageYOffset;
});

function __setAutoScroll(newValue) {
    if (newValue) {
        autoScrollSpeed = speedFactor * newValue;
    }
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
    }
    autoScrollTimer = setInterval(function(){
        currentTime = Date.now();
        if (prevTime) {
            if (!isScrolling) {
                timeDiff = currentTime - prevTime;
                currentPos += autoScrollSpeed * timeDiff;
                if (Math.abs(currentPos - prevPos) >= minDelta) {
                    isScrolling = true;
                    window.scrollTo(0, currentPos);
                    isScrolling = false;
                    prevPos = currentPos;
                    prevTime = currentTime;
                }
            }
        } else {
            prevTime = currentTime;
        }
    }, 1000 / fps);
}  

const __alreadyPushed = {};

function __getMetadataForElement(element) {

    let el = element;
    do {

        let metadata = el.innerText.split('\n').filter(e => e.trim() != '');

        if (metadata.length > 3) {

            el.querySelectorAll('A').forEach(l => {

                let href = l.getAttribute('href');
                if (href != null && href != '#' && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                    if (metadata.indexOf(href) == -1) {
                        metadata.push(href);
                    }
                }
            });
            console.log(metadata);
            return metadata;
        }
        el = el.parentNode;
    } while (el.parentNode && el.tagName != 'body');
    console.log('-------------');
    return [];
}


function __extractLinks() {

    let links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; ++i) {

        if (typeof __alreadyPushed[links[i].href] !== 'undefined') {
            continue;
        }

        if (RegExp(__crawlerFollow).exec(links[i].href)) {

            __pushResourceUrl(links[i].href);
            __alreadyPushed[links[i].href] = true;
        }
    }
}

function __extract(count) {

    return new Promise((resolve, reject) => {

        if (typeof __crawlerFollow !== 'undefined') {

            if (!(new RegExp(__crawlerFollow).exec(window.location.href))) {
                return __extractLinks();
            }
        }

        const minWidth = 200;
        const minHeight = 200;

        if (typeof __crawlerMinImageWidth !== 'undefined')
            minWidth = __crawlerMinImageWidth;

        if (typeof __crawlerMinImageHeight !== 'undefined')
            minHeight = __crawlerMinImageHeight;

        let scrapped = [];

        let process = (elements, videos) => {
            for (var i = 0; i < elements.length; ++i) {
                const img = elements[i];

                if (typeof __alreadyPushed[img.currentSrc] !== 'undefined')
                    continue;

                if (videos || (img.clientWidth > minWidth && img.clientHeight > minHeight && img.naturalWidth > minWidth && img.naturalHeight > minHeight)) {

                    if (img.currentSrc.startsWith('blob:')) {
                        console.log('BLOB NOT SUPPORTED');
                        continue;
                    }

                    console.log(img.currentSrc);

                    scrapped.push({
                        url: img.currentSrc
                      //  metadata: __getMetadataForElement(img)
                    })
                    __alreadyPushed[img.currentSrc] = true;
                }
            }
        }
        process(document.getElementsByTagName("img"), false);
        process(document.getElementsByTagName("video"), true);

        if (scrapped.length != 0) {
            resolve(JSON.stringify(scrapped));
        } else {
            resolve("need to scroll m8");
        }
    });
}*/