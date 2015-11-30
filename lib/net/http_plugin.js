/**
 * @license
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('shaka.net.HttpPlugin');

goog.require('shaka.asserts');
goog.require('shaka.net.NetworkingEngine');


/**
 * A plugin that makes HTTP requests using XHR.  This plugin is auto-registered
 * with the networking engine.
 *
 * @param {string} uri
 * @param {shaka.net.NetworkingEngine.Request} request
 * @return {!Promise.<shaka.net.NetworkingEngine.Response>}
 */
shaka.net.HttpPlugin = function(uri, request) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open(request.method || 'GET', uri, true);
    xhr.responseType = 'arraybuffer';
    if (request.retryParameters && request.retryParameters.timeout) {
      xhr.timeout = request.retryParameters.timeout;
    }
    xhr.withCredentials = request.allowCrossSiteCredentials;

    // TODO: Change to the new Error object.
    xhr.onload = function(event) {
      var target = event.target;
      shaka.asserts.assert(target);
      if (target.status >= 200 && target.status <= 299) {
        // All 2xx HTTP codes are success cases.
        var headers = target.getAllResponseHeaders().split('\r\n').reduce(
            function(all, part) {
              var header = part.split(': ');
              all[header[0]] = header.slice(1).join(': ');
              return all;
            },
            {});
        var response = {data: target.response, headers: headers};
        resolve(response);
      } else {
        reject(target.status);
      }
    };
    xhr.onerror = function(event) {
      reject('Network error.');
    };
    xhr.ontimeout = function(event) {
      reject('Network timeout.');
    };

    for (var k in request.headers) {
      xhr.setRequestHeader(k, request.headers[k]);
    }
    xhr.send(request.body);
  });
};


shaka.net.NetworkingEngine.registerScheme('http', shaka.net.HttpPlugin);
shaka.net.NetworkingEngine.registerScheme('https', shaka.net.HttpPlugin);
