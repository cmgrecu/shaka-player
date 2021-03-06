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

describe('StringUtils', function() {
  var StringUtils;

  beforeAll(function() {
    StringUtils = shaka.util.StringUtils;
  });

  it('parses fromUTF8', function() {
    // This is 4 Unicode characters, the last will be split into a surrogate
    // pair.
    var arr = [0x46, 0xe2, 0x82, 0xac, 0x20, 0xf0, 0x90, 0x8d, 0x88];
    var buffer = new Uint8Array(arr).buffer;
    expect(StringUtils.fromUTF8(buffer)).toBe('F\u20ac \ud800\udf48');
  });

  it('parses fromUTF16 big-endian', function() {
    // This is big-endian pairs of 16-bit numbers.  This translates into 3
    // Unicode characters where the last is split into a surrogate pair.
    var arr = [0x00, 0x46, 0x38, 0x01, 0xdc, 0x37, 0x5d, 0x00];
    var buffer = new Uint8Array(arr).buffer;
    expect(StringUtils.fromUTF16(buffer, false)).toBe('F\u3801\udc37\u5d00');
  });

  it('parses fromUTF16 little-endian', function() {
    // This is little-endian pairs of 16-bit numbers.  This translates into 3
    // Unicode characters where the last is split into a surrogate pair.
    var arr = [0x46, 0x00, 0x01, 0x38, 0x37, 0xdc, 0x00, 0x5d];
    var buffer = new Uint8Array(arr).buffer;
    expect(StringUtils.fromUTF16(buffer, true)).toBe('F\u3801\udc37\u5d00');
  });

  describe('fromBytesAutoDetect', function() {
    it('detects UTF-8 BOM', function() {
      var arr = [0xef, 0xbb, 0xbf, 0x46, 0x6f, 0x6f];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('detects UTF-16 BE BOM', function() {
      var arr = [0xfe, 0xff, 0x00, 0x46, 0x00, 0x6f, 0x00, 0x6f];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('detects UTF-16 LE BOM', function() {
      var arr = [0xff, 0xfe, 0x46, 0x00, 0x6f, 0x00, 0x6f, 0x00];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('guesses UTF-8', function() {
      var arr = [0x46, 0x6f, 0x6f];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('guesses UTF-16 BE', function() {
      var arr = [0x00, 0x46, 0x00, 0x6f, 0x00, 0x6f];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('guesses UTF-16 LE', function() {
      var arr = [0x46, 0x00, 0x6f, 0x00, 0x6f, 0x00];
      var buffer = new Uint8Array(arr).buffer;
      expect(StringUtils.fromBytesAutoDetect(buffer)).toBe('Foo');
    });

    it('fails if unable to guess', function() {
      try {
        var arr = [0x01, 0x02, 0x03, 0x04];
        var buffer = new Uint8Array(arr).buffer;
        StringUtils.fromBytesAutoDetect(buffer);
        fail('Should not be able to guess');
      } catch (e) {
        expect(e.category).toBe(shaka.util.Error.Category.TEXT);
        expect(e.code).toBe(shaka.util.Error.Code.UNABLE_TO_DETECT_ENCODING);
      }
    });
  });

  it('converts toUTF8', function() {
    var str = 'Xe\u4524\u1952';
    var arr = [0x58, 0x65, 0xe4, 0x94, 0xa4, 0xe1, 0xa5, 0x92];
    var buffer = StringUtils.toUTF8(str);
    expect(new Uint8Array(buffer)).toEqual(new Uint8Array(arr));
  });
});
