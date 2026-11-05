// Compiles TSX -> plain JS with Babel standalone inside JavaScriptCore (osascript -l JavaScript).
// usage: osascript -l JavaScript tools/compile.js <babel.min.js> <in.tsx> <out.js>
ObjC.import('Foundation');
function read(p){ return ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError($(p), $.NSUTF8StringEncoding, null)); }
function write(p, s){ $(s).writeToFileAtomicallyEncodingError($(p), true, $.NSUTF8StringEncoding, null); }
function run(a){
  var self = this; var window = this; this.self = this; this.window = this;
  eval(read(a[0]));
  var B = this.Babel || Babel;
  var out = B.transform(read(a[1]), { filename: a[1], presets: [["typescript", { isTSX: true, allExtensions: true }], ["react", { runtime: "classic" }]], sourceType: "script", compact: false, comments: false }).code;
  write(a[2], out);
  return "ok " + out.length;
}
