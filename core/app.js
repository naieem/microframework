(function(window, observable) {
    "use strict";
    window.appConfig = null;
    var httpRequest;

    /**
     * function to load applications js files
     */
    function afterLibLoad() {
        for (var i = 0; i < appConfig.navigation.length; i++) {
            debugger;
            loadFile('../apps/' + appConfig.navigation[i].appName + '/' + appConfig.navigation[i].appName + '.js');
        }
    }
    /**
     * Initial functions call
     */
    function init() {
        observable.subscribe('afterLibLoad', afterLibLoad);
        observable.subscribe('afterDomLoad', loadLibFiles);
        ajaxCall('app.json', getAppConfig);
    }
    /**
     * Creating ajax calls for files and libraries
     * @param {*} file 
     * @param {*} callback
     */
    function ajaxCall(file, callback) {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = callback;
        httpRequest.open('GET', file);
        httpRequest.send();
    }
    /**
     * Reading app.json config file to load library
     * and other necesary application files
     */
    function getAppConfig() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                appConfig = JSON.parse(httpRequest.responseText);
                ajaxCall('./core/template/' + appConfig.appTemplate + '.html', loadTemplateIntoDom);
                debugger;
            } else {
                alert('There was a problem with the request.');
            }
        }
    }

    function loadTemplateIntoDom() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                document.getElementById('app').innerHTML = httpRequest.responseText;
                observable.execute('afterDomLoad');
                debugger;
            } else {
                alert('There was a problem with the request.');
            }
        }
    }
    /**
     * loading library files before any other scripts
     * @param {*} files 
     */
    function loadLibFiles() {
        debugger;
        for (var i = 0; i < appConfig.libs.length; i++) {
            debugger;
            loadFile(appConfig.libs[i], i, libFileLoaded);
        }
    }
    /**
     * calls after library files are uploaded
     * @param {*} counter 
     */
    function libFileLoaded(counter) {
        debugger;
        if (appConfig.libs.length == counter) {
            observable.execute('afterLibLoad');
        }
    }

    /**
     * load script files at the end of body
     * @param {*} file 
     * @param {*} filecounter 
     * @param {*} callback 
     */
    function loadFile(file, filecounter, callback) {
        debugger;
        var d = window.document,
            b = d.body,
            /* appends at end of body, but you could use other methods to put where you want */
            e = d.createElement("script");

        e.async = true;
        e.src = file;
        b.appendChild(e);
        if (callback) {
            callback(filecounter + 1);
        }
    }
    init();
})(window, window.observable);