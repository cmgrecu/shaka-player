/**
 * @license
 * Copyright 2016 Google Inc.
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

goog.provide('shaka.util.Error');



/**
 * @param {shaka.util.Error.Category} category
 * @param {shaka.util.Error.Code} code
 * @param {...*} var_args
 * @constructor
 * @struct
 * @export
 */
shaka.util.Error = function(category, code, var_args) {
  /**
   * @const {shaka.util.Error.Category}
   * @expose
   */
  this.category = category;

  /**
   * @const {shaka.util.Error.Code}
   * @expose
   */
  this.code = code;

  /**
   * @const {!Array.<*>}
   * @expose
   */
  this.data = Array.prototype.slice.call(arguments, 2);

  // This improves formatting of Errors in failure messages in the tests.
  if (!COMPILED) {
    var categoryName = 'UNKNOWN';
    var codeName = 'UNKNOWN';

    for (var k in shaka.util.Error.Category) {
      if (shaka.util.Error.Category[k] == this.category)
        categoryName = k;
    }
    for (var k in shaka.util.Error.Code) {
      if (shaka.util.Error.Code[k] == this.code)
        codeName = k;
    }

    /**
     * A human-readable version of the category and code.
     * <i>(Only available in uncompiled mode.)</i>
     *
     * @const {string}
     * @exportDoc
     */
    this.message = 'Shaka Error ' + categoryName + '.' + codeName +
                   ' (' + this.data.toString() + ')';
    try {
      throw new Error(this.message);
    } catch (e) {
      /**
       * A stack-trace showing where the error occurred.
       * <i>(Only available in uncompiled mode.)</i>
       *
       * @const {string}
       * @exportDoc
       */
      this.stack = e.stack;
    }
  }
};


/** @return {string} */
shaka.util.Error.prototype.toString = function() {
  return 'shaka.util.Error ' + JSON.stringify(this, null, '  ');
};


/**
 * @enum {number}
 * @export
 */
shaka.util.Error.Category = {
  /** Errors from the network stack. */
  'NETWORK': 1,

  /** Errors parsing text streams. */
  'TEXT': 2,

  /** Errors parsing or processing audio or video streams. */
  'MEDIA': 3,

  /** Errors parsing the Manifest. */
  'MANIFEST': 4,

  /** Errors related to streaming. */
  'STREAMING': 5,

  /** Errors related to DRM. */
  'DRM': 6
};


/**
 * @enum {number}
 * @export
 */
shaka.util.Error.Code = {
  /**
   * A network request was made using an unsupported URI scheme.
   * <br> error.data[0] is the URI.
   */
  'UNSUPPORTED_SCHEME': 1000,

  /**
   * An HTTP network request returned an HTTP status that indicated a failure.
   * <br> error.data[0] is the URI.
   * <br> error.data[1] is the status code.
   */
  'BAD_HTTP_STATUS': 1001,

  /**
   * An HTTP network request failed with an error, but not from the server.
   * <br> error.data[0] is the URI.
   */
  'HTTP_ERROR': 1002,

  /**
   * A network request timed out.
   * <br> error.data[0] is the URI.
   */
  'TIMEOUT': 1003,

  /**
   * A network request was made with a malformed data URI.
   * <br> error.data[0] is the URI.
   */
  'MALFORMED_DATA_URI': 1004,

  /**
   * A network request was made with a data URI using an unknown encoding.
   * <br> error.data[0] is the URI.
   */
  'UNKNOWN_DATA_URI_ENCODING': 1005,


  /** The text parser failed to parse a text stream due to an invalid header. */
  'INVALID_TEXT_HEADER': 2000,

  /** The text parser failed to parse a text stream due to an invalid cue. */
  'INVALID_TEXT_CUE': 2001,

  /**
   * The text parser failed to parse a text stream due to invalid cue settings.
   */
  'INVALID_TEXT_SETTINGS': 2002,

  /**
   * Was unable to detect the encoding of the response text.  Suggest adding
   * byte-order-markings to the response data.
   */
  'UNABLE_TO_DETECT_ENCODING': 2003,

  /** The response data contains invalid Unicode character encoding. */
  'BAD_ENCODING': 2004,


  /**
   * Some component tried to read past the end of a buffer.  The segment index,
   * init segment, or PSSH may be malformed.
   */
  'BUFFER_READ_OUT_OF_BOUNDS': 3000,

  /**
   * Some component tried to parse an integer that was too large to fit in a
   * JavaScript number without rounding error.  JavaScript can only natively
   * represent integers up to 53 bits.
   */
  'JS_INTEGER_OVERFLOW': 3001,

  /**
   * The EBML parser used to parse the WebM container encountered an integer,
   * ID, or other field larger than the maximum supported by the parser.
   */
  'EBML_OVERFLOW': 3002,

  /**
   * The EBML parser used to parse the WebM container encountered a floating-
   * point field of a size not supported by the parser.
   */
  'EBML_BAD_FLOATING_POINT_SIZE': 3003,

  /**
   * The MP4 SIDX parser found the wrong box type.
   * Either the segment index range is incorrect or the data is corrupt.
   */
  'MP4_SIDX_WRONG_BOX_TYPE': 3004,

  /**
   * The MP4 SIDX parser encountered an invalid timescale.
   * The segment index data may be corrupt.
   */
  'MP4_SIDX_INVALID_TIMESCALE': 3005,

  /** The MP4 SIDX parser encountered a type of SIDX that is not supported. */
  'MP4_SIDX_TYPE_NOT_SUPPORTED': 3006,

  /**
   * The WebM Cues parser was unable to locate the Cues element.
   * The segment index data may be corrupt.
   */
  'WEBM_CUES_ELEMENT_MISSING': 3007,

  /**
   * The WebM header parser was unable to locate the Ebml element.
   * The init segment data may be corrupt.
   */
  'WEBM_EBML_HEADER_ELEMENT_MISSING': 3008,

  /**
   * The WebM header parser was unable to locate the Segment element.
   * The init segment data may be corrupt.
   */
  'WEBM_SEGMENT_ELEMENT_MISSING': 3009,

  /**
   * The WebM header parser was unable to locate the Info element.
   * The init segment data may be corrupt.
   */
  'WEBM_INFO_ELEMENT_MISSING': 3010,

  /**
   * The WebM header parser was unable to locate the Duration element.
   * The init segment data may be corrupt or may have been incorrectly encoded.
   * Shaka requires a duration in WebM DASH content.
   */
  'WEBM_DURATION_ELEMENT_MISSING': 3011,

  /**
   * The WebM Cues parser was unable to locate the Cue Track Positions element.
   * The segment index data may be corrupt.
   */
  'WEBM_CUE_TRACK_POSITIONS_ELEMENT_MISSING': 3012,

  /**
   * The WebM Cues parser was unable to locate the Cue Time element.
   * The segment index data may be corrupt.
   */
  'WEBM_CUE_TIME_ELEMENT_MISSING': 3013,

  /**
   * A MediaSource operation failed.
   * <br> error.data[0] is a MediaError code from the video element.
   */
  'MEDIA_SOURCE_OPERATION_FAILED': 3014,

  /**
   * A MediaSource operation threw an exception.
   * <br> error.data[0] is the exception that was thrown.
   */
  'MEDIA_SOURCE_OPERATION_THREW': 3015,

  /**
   * The video element reported an error.
   * <br> error.data[0] is a MediaError code from the video element.
   * <br> On Edge & IE, error.data[1] is a Microsoft extended error code in hex.
   */
  'VIDEO_ERROR': 3016,


  /**
   * The Player was unable to guess the manifest type based on file extension
   * or MIME type.  To fix, try one of the following:
   * <br><ul>
   *   <li>Rename the manifest so that the URI ends in a well-known extension.
   *   <li>Configure the server to send a recognizable Content-Type header.
   *   <li>Configure the server to accept a HEAD request for the manifest.
   * </ul>
   * <br> error.data[0] is the manifest URI.
   */
  'UNABLE_TO_GUESS_MANIFEST_TYPE': 4000,

  /** The DASH Manifest contained invalid XML markup. */
  'DASH_INVALID_XML': 4001,

  /**
   * The DASH Manifest contained a representation with no Segment info.  This
   * can occur if there are no Segment* in a Representation or if one of the
   * Segment* elements do not contain enough Segment information.
   */
  'DASH_NO_SEGMENT_INFO': 4002,

  /** The DASH Manifest contained an AdaptationSet with no Representations. */
  'DASH_EMPTY_ADAPTATION_SET': 4003,

  /** The DASH Manifest contained an Period with no AdaptationSets. */
  'DASH_EMPTY_PERIOD': 4004,

  /**
   * The DASH Manifest does not specify an init segment with a WebM container.
   */
  'DASH_WEBM_MISSING_INIT': 4005,

  /** The DASH Manifest contained an unsupported container format. */
  'DASH_UNSUPPORTED_CONTAINER': 4006,

  /** The embedded PSSH data has invalid encoding. */
  'DASH_PSSH_BAD_ENCODING': 4007,

  /**
   * There is an AdaptationSet whose Representations do not have any common
   * key-systems.
   */
  'DASH_NO_COMMON_KEY_SYSTEM': 4008,

  /** Having multiple key IDs per Representation is not supported. */
  'DASH_MULTIPLE_KEY_IDS_NOT_SUPPORTED': 4009,

  /** The DASH Manifest specifies conflicting key IDs. */
  'DASH_CONFLICTING_KEY_IDS': 4010,

  /**
   * The manifest contains a period with no playable streams.
   * Either the period was originally empty, or the streams within cannot be
   * played on this browser or platform.
   */
  'UNPLAYABLE_PERIOD': 4011,


  /**
   * The StreamingEngine appended a segment but the SourceBuffer is empty, or
   * the StreamingEngine removed all segments and the SourceBuffer is
   * non-empty.
   *
   * This is an unrecoverable error.
   *
   * <br> error.data[0] is the type of content which caused the error.
   */
  'INCONSISTENT_BUFFER_STATE': 5000,

  /**
   * The StreamingEngine cannot append the next segment because the segment's
   * corresponding SegmentReference does not exist (i.e., findSegmentPosition()
   * succeeded but getSegmentReference() failed) or the segment's corresponding
   * SegmentReference has an invalid time range.
   *
   * This is a non-recoverable error.
   *
   * <br> error.data[0] is the type of content which caused the error.
   * <br> error.data[1] is the index of the Period.
   * <br> error.data[2] is the position of the segment.
   */
  'INVALID_SEGMENT_INDEX': 5001,

  /**
   * The StreamingEngine cannot append the next segment because the next
   * segment does not exist (i.e., findSegmentPosition() failed). This can
   * occur for three reasons:
   *   1. there is positive drift (the segments' timestamps are ahead of
   *      the manifest's timestamps) and the playhead is outside the drifted
   *      segment availability window.
   *   2. the manifest is not updating fast enough for live presentations; or
   *   3. the manifest is not complete.
   * The first case is a recoverable error; recovery may be attempted by
   * repositioning the playhead under a segment.
   *
   * <br> error.data[0] is the type of content which caused the error.
   * <br> error.data[1] is the index of the Period.
   * <br> error.data[2] is the timestamp needed.
   */
  'SEGMENT_DOES_NOT_EXIST': 5002,

  /**
   * The StreamingEngine inserted a media segment, but the segment did not
   * contain any actual media content.
   *
   * This is likely a non-recoverable error; however, recovery may be attempted
   * by seeking forwards or backwards (e.g., nudging the playhead).
   *
   * <br> error.data[0] is the type of content which caused the error.
   */
  'BAD_SEGMENT': 5004,

  /**
   * The StreamingEngine called onChooseStreams() but the callback receiver
   * did not return the correct number or type of Streams.
   */
  'INVALID_STREAMS_CHOSEN': 5005,

  /**
   * The manifest indicated protected content, but the manifest parser was
   * unable to determine what key systems should be used.
   */
  'NO_RECOGNIZED_KEY_SYSTEMS': 6000,

  /**
   * None of the requested key systems are available.  A license server URI is
   * required; so this may also happen if the key systems do not have a license
   * server URI.
   */
  'REQUESTED_KEY_SYSTEMS_UNAVAILABLE': 6001,

  /**
   * The browser found one of the requested key systems, but it failed to
   * create an instance of the CDM for some unknown reason.
   * <br> error.data[0] is an error message string from the browser.
   */
  'FAILED_TO_CREATE_CDM': 6002,

  /**
   * The browser found one of the requested key systems and created an instance
   * of the CDM, but it failed to attach the CDM to the video for some unknown
   * reason.
   * <br> error.data[0] is an error message string from the browser.
   */
  'FAILED_TO_ATTACH_TO_VIDEO': 6003,

  /**
   * The CDM rejected the server certificate supplied by the application.
   * The certificate may be malformed or in an unsupported format.
   * <br> error.data[0] is an error message string from the browser.
   */
  'INVALID_SERVER_CERTIFICATE': 6004,

  /**
   * The CDM refused to create a session for some unknown reason.
   * <br> error.data[0] is an error message string from the browser.
   */
  'FAILED_TO_CREATE_SESSION': 6005,

  /**
   * The CDM was unable to generate a license request for the init data it was
   * given.  The init data may be malformed or in an unsupported format.
   * <br> error.data[0] is an error message string from the browser.
   */
  'FAILED_TO_GENERATE_LICENSE_REQUEST': 6006,

  /**
   * The license request failed.  This could be a timeout, a network failure, or
   * a rejection by the server.
   * <br> error.data[0] is a shaka.util.Error from the networking engine.
   */
  'LICENSE_REQUEST_FAILED': 6007,

  /**
   * The license response was rejected by the CDM.  The server's response may be
   * invalid or malformed for this CDM.
   * <br> error.data[0] is an error message string from the browser.
   */
  'LICENSE_RESPONSE_REJECTED': 6008,

  /**
   * The manifest does not specify any DRM info, but the content is encrypted.
   * Either the manifest or the manifest parser are broken.
   */
  'ENCRYPTED_CONTENT_WITHOUT_DRM_INFO': 6010
};
