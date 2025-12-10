function throttle(this: any, ele: HTMLElement, eventName: string, callback: Function) {
    if (!this) {
        throw Error('Use new operator or use call/bind/apply to call this function')
    }

    if (!eventName || typeof eventName !== "string") {
        throw Error("eventName is not passed or it is not string")
    }

    if (!ele) {
        throw Error("Ele parameter is not defined")
    }

    if (!callback || typeof callback !== 'function') {
        throw Error('Either callback is not null or it is not function')
    }

    this.ele = ele;
    this.eventName = eventName;
    this.handler = this.wrapperCallback();
    this.callback = callback;

    this.ele.addEventListener(this.eventName, this.handler)
    this.isCallbackExecuting = false;
}

throttle.prototype.updateIsCallbackExecutingStatus = function () {
    this.isCallbackExecuting = false;
}

throttle.prototype.wrapperCallback = function () {
    if (this.isCallbackExecuting) {
        return;
    }

    this.isCallbackExecuting = true;
    return (ev: any) => {
        this.callback(ev)
    }
}

throttle.prototype.destroy = function () {
    this.ele.removeEventListener(this.eventName, this.handler)
    this.updateIsCallbackExecutingStatus();
}

export default throttle;