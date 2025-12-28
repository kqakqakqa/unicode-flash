// preset/file ←(主动导出|主动导入)→ config
// edit ←(|触发updateConfig)→ config
// config (主动/自动applyConfig)→ scene/flash

const flashConfig = { updateScene: updateScene };
const sceneConfig = {};

const customTemplate = {
  html: `<!-- 在这里编写HTML代码 -->

<!-- 设置了元素的data-custom-func属性之后，元素的内容会被替换成对应函数的执行结果 -->
<div data-custom-func="unicodeBlockBackground"></div>
<div id="char" data-custom-func="char"></div>
<div class="description" data-custom-func="codePoint"></div>
<div class="description" data-custom-func="unicodeBlock"></div>
<div id="自定义id" data-custom-func="自定义函数"></div>

<style>
  /* 样式设定 */

  body {
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #char {
    align-self: center;
    font-size: 30rem;
    height: 45rem;
    font-family: 自定义字体1, 自定义字体2, 思源黑体, sans-serif;
  }

  .description {
    font-size: 3rem;
    margin-left: 5%;
    font-family: 'Press Start 2P', monospace
  }

  #自定义id {
    font-size: 3rem;
    margin-left: 5%;
  }

  /* 自定义字体 */

  @font-face {
    /* 字体名称 */
    font-family: "自定义字体1";
    /* 要加载的字体文件 */
    src: url(font1.ttf);
  }

  @font-face {
    font-family: "自定义字体2";
    src: url(font2.woff2);
  }
</style>`,
  js: `return {
  // 在这里编写JavaScript代码

  "自定义函数": function (码位) {
    if (码位 === 0x4f8b) {
      return '这个字符是“例”'
    } else {
      return '这个字符不是“例”'
    }
  },

  // 可以添加更多自定义函数，函数应当满足：输入一个number，输出一个string

}`,
  systemJs: `function codePoint(cp) {
  return \`U+\${cp?.toString(16)?.toUpperCase()?.padStart(4, "0")}\`;
}

function char(cp) {
  return (cp <= 0x10ffff) ? \`\${String.fromCodePoint(cp)}\` : "";
}

const unicodeBlocks = [
  ["Basic Latin", 0x0000, 0x007f],
  ["Latin-1 Supplement", 0x0080, 0x00ff],
  ["Latin Extended-A", 0x0100, 0x017f],
  ["Latin Extended-B", 0x0180, 0x024f],
  ["IPA Extensions", 0x0250, 0x02af],
  ["Spacing Modifier Letters", 0x02b0, 0x02ff],
  ["Combining Diacritical Marks", 0x0300, 0x036f],
  ["Greek and Coptic", 0x0370, 0x03ff],
  ["Cyrillic", 0x0400, 0x04ff],
  ["Cyrillic Supplement", 0x0500, 0x052f],
  ["Armenian", 0x0530, 0x058f],
  ["Hebrew", 0x0590, 0x05ff],
  ["Arabic", 0x0600, 0x06ff],
  ["Syriac", 0x0700, 0x074f],
  ["Arabic Supplement", 0x0750, 0x077f],
  ["Thaana", 0x0780, 0x07bf],
  ["NKo", 0x07c0, 0x07ff],
  ["Samaritan", 0x0800, 0x083f],
  ["Mandaic", 0x0840, 0x085f],
  ["Syriac Supplement", 0x0860, 0x086f],
  ["Arabic Extended-B", 0x0870, 0x089f],
  ["Arabic Extended-A", 0x08a0, 0x08ff],
  ["Devanagari", 0x0900, 0x097f],
  ["Bengali", 0x0980, 0x09ff],
  ["Gurmukhi", 0x0a00, 0x0a7f],
  ["Gujarati", 0x0a80, 0x0aff],
  ["Oriya", 0x0b00, 0x0b7f],
  ["Tamil", 0x0b80, 0x0bff],
  ["Telugu", 0x0c00, 0x0c7f],
  ["Kannada", 0x0c80, 0x0cff],
  ["Malayalam", 0x0d00, 0x0d7f],
  ["Sinhala", 0x0d80, 0x0dff],
  ["Thai", 0x0e00, 0x0e7f],
  ["Lao", 0x0e80, 0x0eff],
  ["Tibetan", 0x0f00, 0x0fff],
  ["Myanmar", 0x1000, 0x109f],
  ["Georgian", 0x10a0, 0x10ff],
  ["Hangul Jamo", 0x1100, 0x11ff],
  ["Ethiopic", 0x1200, 0x137f],
  ["Ethiopic Supplement", 0x1380, 0x139f],
  ["Cherokee", 0x13a0, 0x13ff],
  ["Unified Canadian Aboriginal Syllabics", 0x1400, 0x167f],
  ["Ogham", 0x1680, 0x169f],
  ["Runic", 0x16a0, 0x16ff],
  ["Tagalog", 0x1700, 0x171f],
  ["Hanunoo", 0x1720, 0x173f],
  ["Buhid", 0x1740, 0x175f],
  ["Tagbanwa", 0x1760, 0x177f],
  ["Khmer", 0x1780, 0x17ff],
  ["Mongolian", 0x1800, 0x18af],
  ["Unified Canadian Aboriginal Syllabics Extended", 0x18b0, 0x18ff],
  ["Limbu", 0x1900, 0x194f],
  ["Tai Le", 0x1950, 0x197f],
  ["New Tai Lue", 0x1980, 0x19df],
  ["Khmer Symbols", 0x19e0, 0x19ff],
  ["Buginese", 0x1a00, 0x1a1f],
  ["Tai Tham", 0x1a20, 0x1aaf],
  ["Combining Diacritical Marks Extended", 0x1ab0, 0x1aff],
  ["Balinese", 0x1b00, 0x1b7f],
  ["Sundanese", 0x1b80, 0x1bbf],
  ["Batak", 0x1bc0, 0x1bff],
  ["Lepcha", 0x1c00, 0x1c4f],
  ["Ol Chiki", 0x1c50, 0x1c7f],
  ["Cyrillic Extended-C", 0x1c80, 0x1c8f],
  ["Georgian Extended", 0x1c90, 0x1cbf],
  ["Sundanese Supplement", 0x1cc0, 0x1ccf],
  ["Vedic Extensions", 0x1cd0, 0x1cff],
  ["Phonetic Extensions", 0x1d00, 0x1d7f],
  ["Phonetic Extensions Supplement", 0x1d80, 0x1dbf],
  ["Combining Diacritical Marks Supplement", 0x1dc0, 0x1dff],
  ["Latin Extended Additional", 0x1e00, 0x1eff],
  ["Greek Extended", 0x1f00, 0x1fff],
  ["General Punctuation", 0x2000, 0x206f],
  ["Superscripts and Subscripts", 0x2070, 0x209f],
  ["Currency Symbols", 0x20a0, 0x20cf],
  ["Combining Diacritical Marks for Symbols", 0x20d0, 0x20ff],
  ["Letterlike Symbols", 0x2100, 0x214f],
  ["Number Forms", 0x2150, 0x218f],
  ["Arrows", 0x2190, 0x21ff],
  ["Mathematical Operators", 0x2200, 0x22ff],
  ["Miscellaneous Technical", 0x2300, 0x23ff],
  ["Control Pictures", 0x2400, 0x243f],
  ["Optical Character Recognition", 0x2440, 0x245f],
  ["Enclosed Alphanumerics", 0x2460, 0x24ff],
  ["Box Drawing", 0x2500, 0x257f],
  ["Block Elements", 0x2580, 0x259f],
  ["Geometric Shapes", 0x25a0, 0x25ff],
  ["Miscellaneous Symbols", 0x2600, 0x26ff],
  ["Dingbats", 0x2700, 0x27bf],
  ["Miscellaneous Mathematical Symbols-A", 0x27c0, 0x27ef],
  ["Supplemental Arrows-A", 0x27f0, 0x27ff],
  ["Braille Patterns", 0x2800, 0x28ff],
  ["Supplemental Arrows-B", 0x2900, 0x297f],
  ["Miscellaneous Mathematical Symbols-B", 0x2980, 0x29ff],
  ["Supplemental Mathematical Operators", 0x2a00, 0x2aff],
  ["Miscellaneous Symbols and Arrows", 0x2b00, 0x2bff],
  ["Glagolitic", 0x2c00, 0x2c5f],
  ["Latin Extended-C", 0x2c60, 0x2c7f],
  ["Coptic", 0x2c80, 0x2cff],
  ["Georgian Supplement", 0x2d00, 0x2d2f],
  ["Tifinagh", 0x2d30, 0x2d7f],
  ["Ethiopic Extended", 0x2d80, 0x2ddf],
  ["Cyrillic Extended-A", 0x2de0, 0x2dff],
  ["Supplemental Punctuation", 0x2e00, 0x2e7f],
  ["CJK Radicals Supplement", 0x2e80, 0x2eff],
  ["Kangxi Radicals", 0x2f00, 0x2fdf],
  ["Ideographic Description Characters", 0x2ff0, 0x2fff],
  ["CJK Symbols and Punctuation", 0x3000, 0x303f],
  ["Hiragana", 0x3040, 0x309f],
  ["Katakana", 0x30a0, 0x30ff],
  ["Bopomofo", 0x3100, 0x312f],
  ["Hangul Compatibility Jamo", 0x3130, 0x318f],
  ["Kanbun", 0x3190, 0x319f],
  ["Bopomofo Extended", 0x31a0, 0x31bf],
  ["CJK Strokes", 0x31c0, 0x31ef],
  ["Katakana Phonetic Extensions", 0x31f0, 0x31ff],
  ["Enclosed CJK Letters and Months", 0x3200, 0x32ff],
  ["CJK Compatibility", 0x3300, 0x33ff],
  ["CJK Unified Ideographs Extension A", 0x3400, 0x4dbf],
  ["Yijing Hexagram Symbols", 0x4dc0, 0x4dff],
  ["CJK Unified Ideographs", 0x4e00, 0x9fff],
  ["Yi Syllables", 0xa000, 0xa48f],
  ["Yi Radicals", 0xa490, 0xa4cf],
  ["Lisu", 0xa4d0, 0xa4ff],
  ["Vai", 0xa500, 0xa63f],
  ["Cyrillic Extended-B", 0xa640, 0xa69f],
  ["Bamum", 0xa6a0, 0xa6ff],
  ["Modifier Tone Letters", 0xa700, 0xa71f],
  ["Latin Extended-D", 0xa720, 0xa7ff],
  ["Syloti Nagri", 0xa800, 0xa82f],
  ["Common Indic Number Forms", 0xa830, 0xa83f],
  ["Phags-pa", 0xa840, 0xa87f],
  ["Saurashtra", 0xa880, 0xa8df],
  ["Devanagari Extended", 0xa8e0, 0xa8ff],
  ["Kayah Li", 0xa900, 0xa92f],
  ["Rejang", 0xa930, 0xa95f],
  ["Hangul Jamo Extended-A", 0xa960, 0xa97f],
  ["Javanese", 0xa980, 0xa9df],
  ["Myanmar Extended-B", 0xa9e0, 0xa9ff],
  ["Cham", 0xaa00, 0xaa5f],
  ["Myanmar Extended-A", 0xaa60, 0xaa7f],
  ["Tai Viet", 0xaa80, 0xaadf],
  ["Meetei Mayek Extensions", 0xaae0, 0xaaff],
  ["Ethiopic Extended-A", 0xab00, 0xab2f],
  ["Latin Extended-E", 0xab30, 0xab6f],
  ["Cherokee Supplement", 0xab70, 0xabbf],
  ["Meetei Mayek", 0xabc0, 0xabff],
  ["Hangul Syllables", 0xac00, 0xd7af],
  ["Hangul Jamo Extended-B", 0xd7b0, 0xd7ff],
  ["High Surrogates", 0xd800, 0xdb7f],
  ["High Private Use Surrogates", 0xdb80, 0xdbff],
  ["Low Surrogates", 0xdc00, 0xdfff],
  ["Private Use Area", 0xe000, 0xf8ff],
  ["CJK Compatibility Ideographs", 0xf900, 0xfaff],
  ["Alphabetic Presentation Forms", 0xfb00, 0xfb4f],
  ["Arabic Presentation Forms-A", 0xfb50, 0xfdff],
  ["Variation Selectors", 0xfe00, 0xfe0f],
  ["Vertical Forms", 0xfe10, 0xfe1f],
  ["Combining Half Marks", 0xfe20, 0xfe2f],
  ["CJK Compatibility Forms", 0xfe30, 0xfe4f],
  ["Small Form Variants", 0xfe50, 0xfe6f],
  ["Arabic Presentation Forms-B", 0xfe70, 0xfeff],
  ["Halfwidth and Fullwidth Forms", 0xff00, 0xffef],
  ["Specials", 0xfff0, 0xffff],
  ["Linear B Syllabary", 0x10000, 0x1007f],
  ["Linear B Ideograms", 0x10080, 0x100ff],
  ["Aegean Numbers", 0x10100, 0x1013f],
  ["Ancient Greek Numbers", 0x10140, 0x1018f],
  ["Ancient Symbols", 0x10190, 0x101cf],
  ["Phaistos Disc", 0x101d0, 0x101ff],
  ["Lycian", 0x10280, 0x1029f],
  ["Carian", 0x102a0, 0x102df],
  ["Coptic Epact Numbers", 0x102e0, 0x102ff],
  ["Old Italic", 0x10300, 0x1032f],
  ["Gothic", 0x10330, 0x1034f],
  ["Old Permic", 0x10350, 0x1037f],
  ["Ugaritic", 0x10380, 0x1039f],
  ["Old Persian", 0x103a0, 0x103df],
  ["Deseret", 0x10400, 0x1044f],
  ["Shavian", 0x10450, 0x1047f],
  ["Osmanya", 0x10480, 0x104af],
  ["Osage", 0x104b0, 0x104ff],
  ["Elbasan", 0x10500, 0x1052f],
  ["Caucasian Albanian", 0x10530, 0x1056f],
  ["Vithkuqi", 0x10570, 0x105bf],
  ["Todhri", 0x105c0, 0x105ff],
  ["Linear A", 0x10600, 0x1077f],
  ["Latin Extended-F", 0x10780, 0x107bf],
  ["Cypriot Syllabary", 0x10800, 0x1083f],
  ["Imperial Aramaic", 0x10840, 0x1085f],
  ["Palmyrene", 0x10860, 0x1087f],
  ["Nabataean", 0x10880, 0x108af],
  ["Hatran", 0x108e0, 0x108ff],
  ["Phoenician", 0x10900, 0x1091f],
  ["Lydian", 0x10920, 0x1093f],
  ["Meroitic Hieroglyphs", 0x10980, 0x1099f],
  ["Meroitic Cursive", 0x109a0, 0x109ff],
  ["Kharoshthi", 0x10a00, 0x10a5f],
  ["Old South Arabian", 0x10a60, 0x10a7f],
  ["Old North Arabian", 0x10a80, 0x10a9f],
  ["Manichaean", 0x10ac0, 0x10aff],
  ["Avestan", 0x10b00, 0x10b3f],
  ["Inscriptional Parthian", 0x10b40, 0x10b5f],
  ["Inscriptional Pahlavi", 0x10b60, 0x10b7f],
  ["Psalter Pahlavi", 0x10b80, 0x10baf],
  ["Old Turkic", 0x10c00, 0x10c4f],
  ["Old Hungarian", 0x10c80, 0x10cff],
  ["Hanifi Rohingya", 0x10d00, 0x10d3f],
  ["Garay", 0x10d40, 0x10d8f],
  ["Rumi Numeral Symbols", 0x10e60, 0x10e7f],
  ["Yezidi", 0x10e80, 0x10ebf],
  ["Arabic Extended-C", 0x10ec0, 0x10eff],
  ["Old Sogdian", 0x10f00, 0x10f2f],
  ["Sogdian", 0x10f30, 0x10f6f],
  ["Old Uyghur", 0x10f70, 0x10faf],
  ["Chorasmian", 0x10fb0, 0x10fdf],
  ["Elymaic", 0x10fe0, 0x10fff],
  ["Brahmi", 0x11000, 0x1107f],
  ["Kaithi", 0x11080, 0x110cf],
  ["Sora Sompeng", 0x110d0, 0x110ff],
  ["Chakma", 0x11100, 0x1114f],
  ["Mahajani", 0x11150, 0x1117f],
  ["Sharada", 0x11180, 0x111df],
  ["Sinhala Archaic Numbers", 0x111e0, 0x111ff],
  ["Khojki", 0x11200, 0x1124f],
  ["Multani", 0x11280, 0x112af],
  ["Khudawadi", 0x112b0, 0x112ff],
  ["Grantha", 0x11300, 0x1137f],
  ["Tulu-Tigalari", 0x11380, 0x113ff],
  ["Newa", 0x11400, 0x1147f],
  ["Tirhuta", 0x11480, 0x114df],
  ["Siddham", 0x11580, 0x115ff],
  ["Modi", 0x11600, 0x1165f],
  ["Mongolian Supplement", 0x11660, 0x1167f],
  ["Takri", 0x11680, 0x116cf],
  ["Myanmar Extended-C", 0x116d0, 0x116ff],
  ["Ahom", 0x11700, 0x1174f],
  ["Dogra", 0x11800, 0x1184f],
  ["Warang Citi", 0x118a0, 0x118ff],
  ["Dives Akuru", 0x11900, 0x1195f],
  ["Nandinagari", 0x119a0, 0x119ff],
  ["Zanabazar Square", 0x11a00, 0x11a4f],
  ["Soyombo", 0x11a50, 0x11aaf],
  ["Unified Canadian Aboriginal Syllabics Extended-A", 0x11ab0, 0x11abf],
  ["Pau Cin Hau", 0x11ac0, 0x11aff],
  ["Devanagari Extended-A", 0x11b00, 0x11b5f],
  ["Sunuwar", 0x11bc0, 0x11bff],
  ["Bhaiksuki", 0x11c00, 0x11c6f],
  ["Marchen", 0x11c70, 0x11cbf],
  ["Masaram Gondi", 0x11d00, 0x11d5f],
  ["Gunjala Gondi", 0x11d60, 0x11daf],
  ["Makasar", 0x11ee0, 0x11eff],
  ["Kawi", 0x11f00, 0x11f5f],
  ["Lisu Supplement", 0x11fb0, 0x11fbf],
  ["Tamil Supplement", 0x11fc0, 0x11fff],
  ["Cuneiform", 0x12000, 0x123ff],
  ["Cuneiform Numbers and Punctuation", 0x12400, 0x1247f],
  ["Early Dynastic Cuneiform", 0x12480, 0x1254f],
  ["Cypro-Minoan", 0x12f90, 0x12fff],
  ["Egyptian Hieroglyphs", 0x13000, 0x1342f],
  ["Egyptian Hieroglyph Format Controls", 0x13430, 0x1345f],
  ["Egyptian Hieroglyphs Extended-A", 0x13460, 0x143ff],
  ["Anatolian Hieroglyphs", 0x14400, 0x1467f],
  ["Gurung Khema", 0x16100, 0x1613f],
  ["Bamum Supplement", 0x16800, 0x16a3f],
  ["Mro", 0x16a40, 0x16a6f],
  ["Tangsa", 0x16a70, 0x16acf],
  ["Bassa Vah", 0x16ad0, 0x16aff],
  ["Pahawh Hmong", 0x16b00, 0x16b8f],
  ["Kirat Rai", 0x16d40, 0x16d7f],
  ["Medefaidrin", 0x16e40, 0x16e9f],
  ["Miao", 0x16f00, 0x16f9f],
  ["Ideographic Symbols and Punctuation", 0x16fe0, 0x16fff],
  ["Tangut", 0x17000, 0x187ff],
  ["Tangut Components", 0x18800, 0x18aff],
  ["Khitan Small Script", 0x18b00, 0x18cff],
  ["Tangut Supplement", 0x18d00, 0x18d7f],
  ["Kana Extended-B", 0x1aff0, 0x1afff],
  ["Kana Supplement", 0x1b000, 0x1b0ff],
  ["Kana Extended-A", 0x1b100, 0x1b12f],
  ["Small Kana Extension", 0x1b130, 0x1b16f],
  ["Nushu", 0x1b170, 0x1b2ff],
  ["Duployan", 0x1bc00, 0x1bc9f],
  ["Shorthand Format Controls", 0x1bca0, 0x1bcaf],
  ["Symbols for Legacy Computing Supplement", 0x1cc00, 0x1cebf],
  ["Znamenny Musical Notation", 0x1cf00, 0x1cfcf],
  ["Byzantine Musical Symbols", 0x1d000, 0x1d0ff],
  ["Musical Symbols", 0x1d100, 0x1d1ff],
  ["Ancient Greek Musical Notation", 0x1d200, 0x1d24f],
  ["Kaktovik Numerals", 0x1d2c0, 0x1d2df],
  ["Mayan Numerals", 0x1d2e0, 0x1d2ff],
  ["Tai Xuan Jing Symbols", 0x1d300, 0x1d35f],
  ["Counting Rod Numerals", 0x1d360, 0x1d37f],
  ["Mathematical Alphanumeric Symbols", 0x1d400, 0x1d7ff],
  ["Sutton SignWriting", 0x1d800, 0x1daaf],
  ["Latin Extended-G", 0x1df00, 0x1dfff],
  ["Glagolitic Supplement", 0x1e000, 0x1e02f],
  ["Cyrillic Extended-D", 0x1e030, 0x1e08f],
  ["Nyiakeng Puachue Hmong", 0x1e100, 0x1e14f],
  ["Toto", 0x1e290, 0x1e2bf],
  ["Wancho", 0x1e2c0, 0x1e2ff],
  ["Nag Mundari", 0x1e4d0, 0x1e4ff],
  ["Ol Onal", 0x1e5d0, 0x1e5ff],
  ["Ethiopic Extended-B", 0x1e7e0, 0x1e7ff],
  ["Mende Kikakui", 0x1e800, 0x1e8df],
  ["Adlam", 0x1e900, 0x1e95f],
  ["Indic Siyaq Numbers", 0x1ec70, 0x1ecbf],
  ["Ottoman Siyaq Numbers", 0x1ed00, 0x1ed4f],
  ["Arabic Mathematical Alphabetic Symbols", 0x1ee00, 0x1eeff],
  ["Mahjong Tiles", 0x1f000, 0x1f02f],
  ["Domino Tiles", 0x1f030, 0x1f09f],
  ["Playing Cards", 0x1f0a0, 0x1f0ff],
  ["Enclosed Alphanumeric Supplement", 0x1f100, 0x1f1ff],
  ["Enclosed Ideographic Supplement", 0x1f200, 0x1f2ff],
  ["Miscellaneous Symbols and Pictographs", 0x1f300, 0x1f5ff],
  ["Emoticons", 0x1f600, 0x1f64f],
  ["Ornamental Dingbats", 0x1f650, 0x1f67f],
  ["Transport and Map Symbols", 0x1f680, 0x1f6ff],
  ["Alchemical Symbols", 0x1f700, 0x1f77f],
  ["Geometric Shapes Extended", 0x1f780, 0x1f7ff],
  ["Supplemental Arrows-C", 0x1f800, 0x1f8ff],
  ["Supplemental Symbols and Pictographs", 0x1f900, 0x1f9ff],
  ["Chess Symbols", 0x1fa00, 0x1fa6f],
  ["Symbols and Pictographs Extended-A", 0x1fa70, 0x1faff],
  ["Symbols for Legacy Computing", 0x1fb00, 0x1fbff],
  ["CJK Unified Ideographs Extension B", 0x20000, 0x2a6df],
  ["CJK Unified Ideographs Extension C", 0x2a700, 0x2b73f],
  ["CJK Unified Ideographs Extension D", 0x2b740, 0x2b81f],
  ["CJK Unified Ideographs Extension E", 0x2b820, 0x2ceaf],
  ["CJK Unified Ideographs Extension F", 0x2ceb0, 0x2ebef],
  ["CJK Unified Ideographs Extension I", 0x2ebf0, 0x2ee5f],
  ["CJK Compatibility Ideographs Supplement", 0x2f800, 0x2fa1f],
  ["CJK Unified Ideographs Extension G", 0x30000, 0x3134f],
  ["CJK Unified Ideographs Extension H", 0x31350, 0x323af],
  ["Tags", 0xe0000, 0xe007f],
  ["Variation Selectors Supplement", 0xe0100, 0xe01ef],
  ["Supplementary Private Use Area-A", 0xf0000, 0xfffff],
  ["Supplementary Private Use Area-B", 0x100000, 0x10ffff],
];

function unicodeBlock(cp) {
  let lo = 0, hi = unicodeBlocks.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [block, start, end] = unicodeBlocks[mid];
    if (cp < start) hi = mid - 1;
    else if (cp > end) lo = mid + 1;
    else return block;
  }
  return "unknown";
}

function unicodeBlockBackground(cp) {
  function stringToSeed(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h >>> 0;
  }
  function seededRandom(seed) {
    const m = 0x80000000; // 2^31
    const a = 1103515245;
    const c = 12345;
    seed = (a * seed + c) % m;
    return seed / m;
  }
  const seed = stringToSeed(unicodeBlock(cp));
  const h = Math.floor(seededRandom(seed) * 360);
  const s = Math.floor(50 + seededRandom(seed + 1) * 30);
  const l = Math.floor(90 + seededRandom(seed + 2) * 5);
  return \`<div class="unicodeBlockBackground" style="background-color: hsl(\${h}, \${s}%, \${l}%); position: absolute; left: 0; top: 0; z-index: -1; width: 100%; height: 100%;"></div>\`;
}

return {
  codePoint: codePoint,
  char: char,
  unicodeBlock: unicodeBlock,
  unicodeBlockBackground: unicodeBlockBackground,
}`,
}

// const defaultFlashConfig = {
//   startCodePoint: 0x4f8b,
//   endCodePoint: 0x3ffff,
//   fps: 30,
// };

window.onload = () => {
  applySceneConfig();
  applyFlashConfig();
  flash.reset(flashConfig);
  updateScene(flash.currentCodePoint);

  new ResizeObserver(entry => {
    scaleSceneToWrapper();
  }).observe(document.querySelector("#scene-wrapper"));
};

window.onbeforeunload = e => {
  e.preventDefault();
  e.returnValue = "";
}

// scene

function applySceneConfig() {
  const customJs = getMonacoEditorByElement(document.querySelector('#monaco-editor-js'))?.getValue() ?? customTemplate.js;
  const customFuncs = new Function(customJs)();
  const systemJs = customTemplate.systemJs;
  const systemFuncs = new Function(systemJs)();
  sceneConfig.funcs = Object.assign({}, systemFuncs, isPlainObject(customFuncs) ? customFuncs : {});

  const iframe = document.querySelector('#scene-wrapper > iframe');
  sceneConfig.width = document.querySelector("#input_width").value;
  sceneConfig.height = document.querySelector("#input_height").value;
  iframe.style.width = sceneConfig.width + "px";
  iframe.style.height = sceneConfig.height + "px";
  scaleSceneToWrapper();

  const html = getMonacoEditorByElement(document.querySelector('#monaco-editor-html'))?.getValue() ?? customTemplate.html;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
}

function applyAndUpdateScene() {
  applySceneConfig();
  updateScene(flash.currentCodePoint);
}

function isPlainObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

function scaleSceneToWrapper() {
  const wrapper = document.querySelector("#scene-wrapper");
  const iframe = document.querySelector("#scene-wrapper > iframe");

  const scaleX = wrapper.clientWidth / sceneConfig.width;
  const scaleY = wrapper.clientHeight / sceneConfig.height;
  const scale = Math.min(scaleX, scaleY); // 保持比例铺满

  iframe.style.transform = `scale(${scale})`;
}

function updateScene(codePoint) {
  const iframe = document.querySelector("#scene-wrapper > iframe");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const elements = iframeDoc.querySelectorAll('[data-custom-func]');
  elements.forEach(e => {
    const funcName = e.dataset.customFunc;
    const func = sceneConfig.funcs[funcName];

    if (typeof func === 'function') {
      try {
        e.innerHTML = func(codePoint);
      } catch (err) {
        console.error(`执行函数 ${funcName} 时出错：`, err);
      }
    } else {
      console.error(`未找到函数 ${funcName}`);
    }
  });
}

// flash

let flash = {
  reset({ startCodePoint, endCodePoint, fps, updateScene }) {
    this.stop?.();

    flash = {
      startCodePoint: startCodePoint,
      endCodePoint: endCodePoint,
      fps: fps,
      updateScene: updateScene,
      reset: this.reset,
      currentCodePoint: startCodePoint,

      play() {
        this.interval = setInterval(() => {
          this.updateScene(this.currentCodePoint);
          if (this.currentCodePoint >= this.endCodePoint) this.stop();
          else this.currentCodePoint += 1;
        }, 1000 / this.fps);
      },

      pause() {
        clearInterval(this.interval);
        this.interval = undefined;
      },

      stop() {
        clearInterval(this.interval);
        this.interval = undefined;
      },

    };
  },
};

function playPauseFlash() {
  // if (!flash) initializeFlash();
  if (!flash.interval) flash.play();
  else flash.pause();
  // sceneNotUpToDate();
}

function applyFlashConfig() {
  let startCodePoint = codePointStrTocodePoint(document.querySelector("#input_startCodePoint").value);
  let endCodePoint = codePointStrTocodePoint(document.querySelector("#input_endCodePoint").value);
  let fps = parseInt(document.querySelector("#input_fps").value);
  if (!fps > 0) fps = 1E-8;

  flashConfig.startCodePoint = startCodePoint;
  flashConfig.endCodePoint = endCodePoint;
  flashConfig.fps = fps;

  // sceneNotUpToDate();
}

function applyAndResetFlash() {
  applyFlashConfig();
  flash.reset(flashConfig);
  updateScene(flash.currentCodePoint);
}

function codePointStrTocodePoint(cpStr) {
  let cp = 0;
  if (new RegExp("^[0-9a-fA-F]{1,}$").test(cpStr)) cp = parseInt(`0x${cpStr}`);
  return cp;
}