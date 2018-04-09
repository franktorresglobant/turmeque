'use strict';

class ErrorService {
    constructor() { }

    /**
     * @function buildErrorMessage
     * @param {String} param The param which generate the error.
     * @param {String} msg Message to show.
     */
    static buildErrorMessage(param, msg) {
        var errObj = {param: '', msg: ''};
        errObj.param = param;
        errObj.msg = msg;
        return errObj;
    }

    /**
     * @function buildErrorResponse
     * @param {Array} errors The errors to show.
     * @param {Int} code Code of the error.
     */
    static buildErrorResponse(errors, code) {
        var errObj = {errors: [], code: ''};
        errObj.errors = errors;
        errObj.code = code;
        return errObj;
    }

}

module.exports = ErrorService;