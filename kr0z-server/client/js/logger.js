function Logger(elem) {
    if ( !(this instanceof Logger) )
        return new Logger(elem);
    this.logElem = elem;
};

Logger.prototype.logItem = function(prefix, item, className) {
    this.logElem.innerHTML += '<p class="logitem ' + className + '">[' + prefix + '] ' + item + '</p>';
    this.logElem.scrollTop = this.logElem.scrollHeight;
}

Logger.prototype.info = function(item) {
    this.logItem('INFO', item, 'INFO');
}

Logger.prototype.warn = function(item) {
    this.logItem('WARN', item, 'WARN');
}

Logger.prototype.error = function(item) {
    this.logItem('ERR!!', item, 'ERROR');
}
