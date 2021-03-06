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


/** @externs */


/**
 * @typedef {{
 *   id: number,
 *   active: boolean,
 *
 *   type: string,
 *   bandwidth: number,
 *
 *   language: string,
 *   kind: ?string,
 *   width: ?number,
 *   height: ?number
 * }}
 *
 * @description
 * An object describing a media track.  This object should be treated as
 * read-only as changing any values does not have any effect.  This is the
 * public view of the Stream type.
 *
 * @property {number} id
 *   The unique ID of the track.
 * @property {boolean} active
 *   If true, this is the track is being streamed (another track may be
 *   visible/audible in the buffer).
 *
 * @property {string} type
 *   The type of track, one of 'audio', 'text', or 'video'.
 * @property {number} bandwidth
 *   The bandwidth required to play the track, in bits/sec.
 *
 * @property {string} language
 *   The language of the track, or '' for video tracks.  This is the exact
 *   value provided in the manifest; it may need to be normalized.
 * @property {?string} kind
 *   (only for text tracks) The kind of text track, either 'captions' or
 *   'subtitles'.
 * @property {?number} width
 *   (only for video tracks) The width of the track in pixels.
 * @property {?number} height
 *   (only for video tracks) The height of the track in pixels.
 */
shakaExtern.Track;


/**
 * @typedef {{
 *   manifest: Object.<string, boolean>,
 *   media: Object.<string, boolean>,
 *   drm: Object.<string, boolean>,
 *   supported: boolean
 * }}
 *
 * @description
 * An object detailing browser support for various features.
 *
 * @property {Object.<string, boolean>} manifest
 *   A map of supported manifest types.
 *   The keys are manifest MIME types and file extensions.
 * @property {Object.<string, boolean>} media
 *   A map of supported media types.
 *   The keys are media MIME types.
 * @property {Object.<string, boolean>} drm
 *   A map of DRM support.
 *   The keys are well-known key system IDs.
 * @property {boolean} supported
 *   True if the library is usable at all.
 *
 * @exportDoc
 */
shakaExtern.SupportType;


/**
 * @typedef {function(!Element):Array.<shakaExtern.DrmInfo>}
 * @see shakaExtern.DashManifestConfiguration
 * @exportDoc
 */
shakaExtern.DashContentProtectionCallback;


/**
 * @typedef {{
 *   distinctiveIdentifierRequired: boolean,
 *   persistentStateRequired: boolean,
 *   videoRobustness: string,
 *   audioRobustness: string,
 *   serverCertificate: Uint8Array
 * }}
 *
 * @property {boolean} distinctiveIdentifierRequired
 *   <i>Defaults to false.</i> <br>
 *   True if the application requires the key system to support distinctive
 *   identifiers.
 * @property {boolean} persistentStateRequired
 *   <i>Defaults to false.</i> <br>
 *   True if the application requires the key system to support persistent
 *   state, e.g., for persistent license storage.
 * @property {string} videoRobustness
 *   A key-system-specific string that specifies a required security level for
 *   video.
 *   <i>Defaults to '', i.e., no specific robustness required.</i> <br>
 * @property {string} audioRobustness
 *   A key-system-specific string that specifies a required security level for
 *   audio.
 *   <i>Defaults to '', i.e., no specific robustness required.</i> <br>
 * @property {Uint8Array} serverCertificate
 *   <i>Defaults to null, i.e., certificate will be requested from the license
 *   server if required.</i> <br>
 *   A key-system-specific server certificate used to encrypt license requests.
 *   Its use is optional and is meant as an optimization to avoid a round-trip
 *   to request a certificate.
 *
 * @exportDoc
 */
shakaExtern.AdvancedDrmConfiguration;


/**
 * @typedef {{
 *   retryParameters: shakaExtern.RetryParameters,
 *   servers: !Object.<string, string>,
 *   clearKeys: !Object.<string, string>,
 *   advanced: Object.<string, shakaExtern.AdvancedDrmConfiguration>
 * }}
 *
 * @property {shakaExtern.RetryParameters} retryParameters
 *   Retry parameters for license requests.
 * @property {!Object.<string, string>} servers
 *   <i>Required for all but the clear key CDM.</i> <br>
 *   A dictionary which maps key system IDs to their license servers.
 *   For example, {'com.widevine.alpha': 'http://example.com/drm'}.
 * @property {!Object.<string, string>} clearKeys
 *   <i>Only usable by the clear key CDM.</i> <br>
 *   A map of key IDs (hex) to keys (hex).
 * @property {Object.<string, shakaExtern.AdvancedDrmConfiguration>} advanced
 *   <i>Optional.</i> <br>
 *   A dictionary which maps key system IDs to advanced DRM configuration for
 *   those key systems.
 *
 * @exportDoc
 */
shakaExtern.DrmConfiguration;


/**
 * @typedef {{
 *   customScheme: shakaExtern.DashContentProtectionCallback
 * }}
 *
 * @property {shakaExtern.DashContentProtectionCallback} customScheme
 *   If given, invoked by a DASH manifest parser to interpret custom or
 *   non-standard DRM schemes found in the manifest.  The argument is a
 *   ContentProtection node.  Return null if not recognized.
 *
 * @exportDoc
 */
shakaExtern.DashManifestConfiguration;


/**
 * @typedef {{
 *   retryParameters: shakaExtern.RetryParameters,
 *   dash: shakaExtern.DashManifestConfiguration
 * }}
 *
 * @property {shakaExtern.RetryParameters} retryParameters
 *   Retry parameters for manifest requests.
 * @property {shakaExtern.DashManifestConfiguration} dash
 *   Advanced parameters used by the DASH manifest parser.
 *
 * @exportDoc
 */
shakaExtern.ManifestConfiguration;


/**
 * @typedef {{
 *   retryParameters: shakaExtern.RetryParameters,
 *   rebufferingGoal: number,
 *   bufferingGoal: number,
 *   bufferBehind: number
 * }}
 *
 * @description
 * The StreamingEngine's configuration options.
 *
 * @property {shakaExtern.RetryParameters} retryParameters
 *   Retry parameters for segment requests.
 * @property {number} rebufferingGoal
 *   The minimum number of seconds of content that the StreamingEngine must
 *   buffer before it can begin playback or can continue playback after it has
 *   entered into a buffering state (i.e., after it has depleted one more
 *   more of its buffers).
 * @property {number} bufferingGoal
 *   The number of seconds of content that the StreamingEngine will attempt to
 *   buffer ahead of the playhead. This value must be greater than or equal to
 *   the rebuffering goal.
 * @property {number} bufferBehind
 *   The maximum number of seconds of content that the StreamingEngine will keep
 *   in buffer behind the playhead when it appends a new media segment.
 *   The StreamingEngine will evict content to meet this limit.
 *
 * @exportDoc
 */
shakaExtern.StreamingConfiguration;


/**
 * @typedef {{
 *   drm: shakaExtern.DrmConfiguration,
 *   manifest: shakaExtern.ManifestConfiguration,
 *   streaming: shakaExtern.StreamingConfiguration,
 *   abrManager: shakaExtern.AbrManager,
 *   enableAdaptation: boolean,
 *   preferredAudioLanguage: string,
 *   preferredTextLanguage: string
 * }}
 *
 * @property {shakaExtern.DrmConfiguration} drm
 *   DRM configuration and settings.
 * @property {shakaExtern.ManifestConfiguration} manifest
 *   Manifest configuration and settings.
 * @property {shakaExtern.StreamingConfiguration} streaming
 *   Streaming configuration and settings.
 * @property {shakaExtern.AbrManager} abrManager
 *   The AbrManager instance.
 * @property {boolean} enableAdaptation
 *   If true, enable adaptation by the current AbrManager.  Defaults to true.
 * @property {string} preferredAudioLanguage
 *   The preferred language to use for audio tracks.  If not given it will use
 *   the 'main' track.
 * @property {string} preferredTextLanguage
 *   The preferred language to use for text tracks.  If the audio and text
 *   tracks have different languages, the text track will be enabled.
 *
 * @exportDoc
 */
shakaExtern.PlayerConfiguration;
