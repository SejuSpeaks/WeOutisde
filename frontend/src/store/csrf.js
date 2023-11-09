import Cookies from 'js-cookie'


export const csrfFetch = async (url, options = {}) => {
    const headers = options.headers
    const methods = options.method
    if (!headers) options.headers = {}
    if (!methods) options.method = "GET"

    if (options.method.toUpperCase() !== "GET") {
        options.headers["Content-Type"] = options.headers["Content-Type"] || 'application/json'
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    const res = await window.fetch(url, options);

    if (res.status >= 400) throw res;

    return res;

}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}
