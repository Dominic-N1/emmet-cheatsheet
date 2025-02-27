(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = "MODULE_NOT_FOUND"), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function (require, module, exports) {
        "use strict";
        function renderSectionData(e) {
          return e
            .map(function (e) {
              return Array.isArray(e.value)
                ? renderSubsectionData(e)
                : snippetTemplate(
                    extend({}, e, { value: formatSnippetValue(e) })
                  );
            })
            .join("");
        }
        function renderSubsectionData(e) {
          return subsectionTemplate(
            extend({ content: renderSectionData(e.value) }, e)
          );
        }
        function snippetItem(e, t, n, a) {
          var i = "snippet";
          return (
            "abbreviations" === n &&
              (i = "<" == t.charAt(0) ? "abbreviation" : "alias"),
            { name: e, value: t, type: i, syntax: a }
          );
        }
        function formatSnippetValue(e) {
          var t = "",
            n = e.value;
          return (
            ("alias" !== e.type && "abbreviation" !== e.type) ||
              ("alias" === e.type &&
                (t =
                  '<p class="cn-snippet__alias">Alias of <span class="cn-snippet__alias-abbr">' +
                  escape(n) +
                  "</span></p>"),
              (n = emmet.expandAbbreviation(
                e.name.split(",")[0],
                e.syntax,
                "xhtml"
              ))),
            t +
              emmet.tabStops
                .processText(escape(n), {
                  tabstop: function (e) {
                    return e.placeholder
                      ? '<span class="ch-tabstop" title="Tabstop">' +
                          e.placeholder +
                          "</span>"
                      : caretMarker;
                  },
                })
                .replace("|", caretMarker)
                .replace(/\t/g, "    ")
          );
        }
        function sectionList() {
          var e = emmet.resources.getVocabulary("system");
          return Object.keys(e).filter(function (t) {
            return "snippets" in e[t] || "abbreviations" in e[t];
          });
        }
        function generateSection(e, t) {
          var n = [],
            a = {};
          return (
            ["abbreviations", "snippets"].forEach(function (i) {
              i in e &&
                Object.keys(e[i]).forEach(function (s) {
                  var o = e[i][s];
                  if (o in a) a[o].name += ", " + s;
                  else {
                    var r = snippetItem(s, o, i, t);
                    (a[o] = r), n.push(r);
                  }
                });
            }),
            n
          );
        }
        function sectionData(e) {
          var t = emmet.resources.getVocabulary("system"),
            n = generateSection(t[e], e);
          return "css" === e && (n = generateCSSSection(n)), n;
        }
        function generateCheatsheet() {
          var e = ["syntax"].concat(sectionList()).map(function (e) {
            return extend({ id: e, title: e, order: 99 }, sections[e]);
          });
          return sortBy(e, "order")
            .map(function (e) {
              return sectionTemplate(
                extend(
                  {
                    description: "",
                    content: renderSectionData(
                      "syntax" == e.id ? syntaxSection : sectionData(e.id)
                    ),
                  },
                  e
                )
              );
            })
            .join("");
        }
        var _interopRequire = function (e) {
            return e && e.__esModule ? e.default : e;
          },
          syntaxSection = _interopRequire(
            require("./cheatsheet/syntax-section")
          ),
          generateCSSSection = _interopRequire(
            require("./cheatsheet/css-section")
          ),
          _libUtils = require("./lib/utils"),
          template = _libUtils.template,
          escape = _libUtils.escape,
          extend = _libUtils.extend,
          sortBy = _libUtils.sortBy,
          sections = {
            syntax: { title: "Syntax", order: 0 },
            html: {
              order: 1,
              title: "HTML",
              description:
                "<p>All unknown abbreviations will be transformed to tag, e.g. <code>foo</code> → <code>&lt;foo&gt;&lt;/foo&gt;</code>.</p>",
            },
            css: {
              order: 2,
              title: "CSS",
              description:
                "<p>CSS module uses fuzzy search to find unknown abbreviations, e.g. <code>ov:h</code> == <code>ov-h</code> == <code>ovh</code> == <code>oh</code>.</p>\n\t\t<p>If abbreviation wasn’t found, it is transformed into property name: <code>foo-bar</code> → <code>foo-bar: |;</code></p>\n\t\t<p>You can prefix abbreviations with hyphen to produce vendor-prefixed properties: <code>-foo</code></p>",
            },
            xsl: { order: 3, title: "XSL" },
          },
          caretMarker = '<span class="ch-caret" title="Caret position"></span>',
          snippetTemplate = template(
            '<dl class="ch-snippet">\n\t<dt class="ch-snippet__name"><%- name %></dt>\n\t<dd class="ch-snippet__value ch-snippet__value_<%= type %>"><%= value %></dd>\n\t</dl>'
          ),
          sectionTemplate = template(
            '<section class="ch-section ch-section_<%= id %>">\n\t<h2 class="ch-section__title"><%= title %></h2>\n\t<div class="ch-section__desc"><%= description %></div>\n\t<div class="ch-section__content"><%= content %></div>\n\t</section>'
          ),
          subsectionTemplate = template(
            '<section class="ch-subsection">\n\t<h3 class="ch-subsection__title"><%= name %></h3>\n\t<%= content %>\n\t</section>'
          );
        document.getElementById("cheatsheet").innerHTML += generateCheatsheet();
      },
      {
        "./cheatsheet/css-section": 2,
        "./cheatsheet/syntax-section": 3,
        "./lib/utils": 4,
      },
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        function createIndex() {
          var t = {},
            e = {};
          return (
            cssSections.forEach(function (r, o) {
              (t[r.title] = { order: o }),
                r.props.split(" ").forEach(function (t, o) {
                  e[t] = { section: r.title, order: o };
                });
            }),
            (t.Others = { order: 999 }),
            { sections: t, properties: e }
          );
        }
        function isValidSnippet(t) {
          return (
            (t = t.trim(t)),
            !~t.indexOf("/*") &&
              !/[\n\r]/.test(t) &&
              !!reCSSPropertyName.test(t) &&
              ((t = emmet.tabStops.processText(t, {
                replaceCarets: !0,
                tabstop: function () {
                  return "value";
                },
              })),
              2 === t.split(":").length)
          );
        }
        var _libUtils = require("../lib/utils"),
          extend = _libUtils.extend,
          sortBy = _libUtils.sortBy,
          cssSections = [
            {
              title: "Visual Formatting",
              props:
                "position top right bottom left z-index float clear display visibility overflow overflow-x overflow-y overflow-style zoom clip resize cursor",
            },
            {
              title: "Margin & Padding",
              props:
                "margin margin-top margin-right margin-bottom margin-left padding padding-top padding-right padding-bottom padding-left",
            },
            {
              title: "Box Sizing",
              props:
                "box-sizing box-shadow width height max-width max-height min-width min-height",
            },
            {
              title: "Font",
              props:
                "font font-weight font-style font-variant font-size font-size-adjust font-family font-effect font-emphasize font-emphasize-position font-emphasize-style font-smooth font-stretch",
            },
            {
              title: "Text",
              props:
                "vertical-align text-align text-align-last text-decoration text-emphasis text-height text-indent text-justify text-outline text-replace text-transform text-wrap text-shadow line-height letter-spacing white-space white-space-collapse word-break word-spacing word-wrap",
            },
            {
              title: "Background",
              props:
                "background background-color background-image background-repeat background-attachment background-position background-position-x background-position-y background-break background-clip background-origin background-size border-radius",
            },
            { title: "Color", props: "color opacity" },
            {
              title: "Generated content",
              props: "content quotes counter-increment counter-reset",
            },
            {
              title: "Outline",
              props:
                "outline outline-offset outline-width outline-style outline-color",
            },
            { title: "Tables", props: "table-layout caption-side empty-cells" },
            {
              title: "Border",
              props:
                "border border-break border-collapse border-color border-image border-top-image border-right-image border-bottom-image border-left-image border-corner-image border-top-left-image border-top-right-image border-bottom-right-image border-bottom-left-image border-fit border-length border-spacing border-style border-width border-top border-top-width border-top-style border-top-color border-right border-right-width border-right-style border-right-color border-bottom border-bottom-width border-bottom-style border-bottom-color border-left border-left-width border-left-style border-left-color border-radius border-top-right-radius border-top-left-radius border-bottom-right-radius border-bottom-left-radius",
            },
            {
              title: "Lists",
              props:
                "list-style list-style-position list-style-type list-style-image",
            },
            {
              title: "Print",
              props:
                "page-break-before page-break-inside page-break-after orphans widows",
            },
          ],
          reCSSPropertyName = /^([a-z0-9\-]+)\s*\:/i;
        module.exports = function (t) {
          var e = createIndex(),
            r = {};
          t.forEach(function (t) {
            var o = "Others";
            if ("snippet" === t.type) {
              var i = isValidSnippet(t.value)
                  ? t.value.match(reCSSPropertyName)[1].toLowerCase()
                  : t.name,
                a = e.properties[i];
              a && (o = a.section),
                o in r ||
                  (r[o] = extend(
                    { name: o, value: [], type: "section" },
                    e.sections[o]
                  )),
                r[o].value.push(extend({}, t, a || {}));
            }
          });
          var o = Object.keys(r).map(function (t) {
            var e = r[t];
            return (
              (e.value = sortBy(
                e.value,
                "Others" === e.name ? "name" : "order"
              )),
              e
            );
          });
          return sortBy(o, "order");
        };
      },
      { "../lib/utils": 4 },
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        var syntaxSection = [
          {
            name: "Child: >",
            value: [
              {
                name: "nav>ul>li",
                value: "<nav>\n\t<ul>\n\t\t<li></li>\n\t</ul>\n</nav>",
              },
            ],
          },
          {
            name: "Sibling: +",
            value: [
              {
                name: "div+p+bq",
                value: "<div></div>\n<p></p>\n<blockquote></blockquote>",
              },
            ],
          },
          {
            name: "Climb-up: ^",
            value: [
              {
                name: "div+div>p>span+em^bq",
                value:
                  "<div></div>\n<div>\n\t<p><span></span><em></em></p>\n\t<blockquote></blockquote>\n</div>",
              },
              {
                name: "div+div>p>span+em^^bq",
                value:
                  "<div></div>\n<div>\n\t<p><span></span><em></em></p>\n</div>\n<blockquote></blockquote>",
              },
            ],
          },
          {
            name: "Grouping: ()",
            value: [
              {
                name: "div>(header>ul>li*2>a)+footer>p",
                value:
                  '<div>\n\t<header>\n\t\t<ul>\n\t\t\t<li><a href=""></a></li>\n\t\t\t<li><a href=""></a></li>\n\t\t</ul>\n\t</header>\n\t<footer>\n\t\t<p></p>\n\t</footer>\n</div>',
              },
              {
                name: "(div>dl>(dt+dd)*3)+footer>p",
                value:
                  "<div>\n\t<dl>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t\t<dt></dt>\n\t\t<dd></dd>\n\t</dl>\n</div>\n<footer>\n\t<p></p>\n</footer>",
              },
            ],
          },
          {
            name: "Multiplication: *",
            value: [
              {
                name: "ul>li*5",
                value:
                  "<ul>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n</ul>",
              },
            ],
          },
          {
            name: "Item numbering: $",
            value: [
              {
                name: "ul>li.item$*5",
                value:
                  '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n\t<li class="item3"></li>\n\t<li class="item4"></li>\n\t<li class="item5"></li>\n</ul>',
              },
              {
                name: "h$[title=item$]{Header $}*3",
                value:
                  '<h1 title="item1">Header 1</h1>\n<h2 title="item2">Header 2</h2>\n<h3 title="item3">Header 3</h3>',
              },
              {
                name: "ul>li.item$$$*5",
                value:
                  '<ul>\n\t<li class="item001"></li>\n\t<li class="item002"></li>\n\t<li class="item003"></li>\n\t<li class="item004"></li>\n\t<li class="item005"></li>\n</ul>',
              },
              {
                name: "ul>li.item$@-*5",
                value:
                  '<ul>\n\t<li class="item5"></li>\n\t<li class="item4"></li>\n\t<li class="item3"></li>\n\t<li class="item2"></li>\n\t<li class="item1"></li>\n</ul>',
              },
              {
                name: "ul>li.item$@3*5",
                value:
                  '<ul>\n\t<li class="item3"></li>\n\t<li class="item4"></li>\n\t<li class="item5"></li>\n\t<li class="item6"></li>\n\t<li class="item7"></li>\n</ul>',
              },
            ],
          },
          {
            name: "ID and CLASS attributes",
            value: [
              { name: "#header", value: '<div id="header"></div>' },
              { name: ".title", value: '<div class="title"></div>' },
              {
                name: "form#search.wide",
                value: '<form id="search" class="wide"></form>',
              },
              {
                name: "p.class1.class2.class3",
                value: '<p class="class1 class2 class3"></p>',
              },
            ],
          },
          {
            name: "Custom attributes",
            value: [
              {
                name: 'p[title="Hello world"]',
                value: '<p title="Hello world"></p>',
              },
              {
                name: "td[rowspan=2 colspan=3 title]",
                value: '<td rowspan="2" colspan="3" title=""></td>',
              },
              {
                name: "[a='value1' b=\"value2\"]",
                value: '<div a="value1" b="value2"></div>',
              },
            ],
          },
          {
            name: "Text: {}",
            value: [
              { name: "a{Click me}", value: '<a href="">Click me</a>' },
              {
                name: "p>{Click }+a{here}+{ to continue}",
                value: '<p>Click <a href="">here</a> to continue</p>',
              },
            ],
          },
          {
            name: "Implicit tag names",
            value: [
              { name: ".class", value: '<div class="class"></div>' },
              {
                name: "em>.class",
                value: '<em><span class="class"></span></em>',
              },
              {
                name: "ul>.class",
                value: '<ul>\n\t<li class="class"></li>\n</ul>',
              },
              {
                name: "table>.row>.col",
                value:
                  '<table>\n\t<tr class="row">\n\t\t<td class="col"></td>\n\t</tr>\n</table>',
              },
            ],
          },
        ];
        module.exports = syntaxSection;
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        function extend(e) {
          for (
            var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), o = 1;
            o < t;
            o++
          )
            r[o - 1] = arguments[o];
          return (
            r.forEach(function (t) {
              t &&
                Object.keys(t).forEach(function (r) {
                  return (e[r] = t[r]);
                });
            }),
            e
          );
        }
        function removeElem(e) {
          e && e.parentNode && e.parentNode.removeChild(e);
        }
        function toArray(e) {
          var t = void 0 === arguments[1] ? 0 : arguments[1];
          return Array.prototype.slice.call(e, t);
        }
        function querySelectorAll(e) {
          return toArray(
            (void 0 === arguments[1]
              ? document
              : arguments[1]
            ).querySelectorAll(e)
          );
        }
        function toDom(e) {
          var t = document.createElement("div");
          t.innerHTML = e;
          for (var r = document.createDocumentFragment(); t.firstChild; )
            r.appendChild(t.firstChild);
          return r.childNodes.length > 1 ? r : r.removeChild(r.firstChild);
        }
        function template(e, t) {
          var r = function (t) {
            return e.replace(/<%([-=])?\s*([\w\-]+)\s*%>/g, function (e, r, o) {
              return t[o.trim()];
            });
          };
          return t ? r(t) : r;
        }
        function delegate(e, t, r, o) {
          e.addEventListener(t, function (e) {
            var t = closest(e.target, r);
            t && o.call(t, e);
          });
        }
        function closest(e, t) {
          for (; e && e !== document; ) {
            if (matchesSelector(e, t)) return e;
            e = e.parentNode;
          }
        }
        function matchesSelector(e, t) {
          var r = null;
          if (
            ([
              "matches",
              "webkitMatchesSelector",
              "mozMatchesSelector",
              "msMatchesSelector",
              "oMatchesSelector",
            ].some(function (o) {
              if (o in e) return (r = e[o](t)), !0;
            }),
            null === r)
          ) {
            for (
              var o = (e.document || e.ownerDocument).querySelectorAll(t),
                n = 0;
              o[n] && o[n] !== e;

            )
              n++;
            r = !!o[n];
          }
          return r;
        }
        function sortBy(e, t) {
          return e
            .map(function (e, r) {
              return { value: e, index: r, criteria: e[t] };
            })
            .sort(function (e, t) {
              var r = e.criteria,
                o = t.criteria;
              if (r !== o) {
                if (r > o || void 0 === r) return 1;
                if (r < o || void 0 === o) return -1;
              }
              return e.index - t.index;
            })
            .map(function (e) {
              return e.value;
            });
        }
        (exports.extend = extend),
          (exports.removeElem = removeElem),
          (exports.toArray = toArray),
          (exports.querySelectorAll = querySelectorAll),
          (exports.toDom = toDom),
          (exports.template = template),
          (exports.delegate = delegate),
          (exports.closest = closest),
          (exports.matchesSelector = matchesSelector),
          (exports.sortBy = sortBy),
          Object.defineProperty(exports, "__esModule", { value: !0 });
        var escapeMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;",
          },
          createEscaper = function (e) {
            var t = function (t) {
                return e[t];
              },
              r = "(?:" + Object.keys(e).join("|") + ")",
              o = RegExp(r),
              n = RegExp(r, "g");
            return function (e) {
              return (
                (e = null == e ? "" : "" + e), o.test(e) ? e.replace(n, t) : e
              );
            };
          },
          escape = createEscaper(escapeMap);
        exports.escape = escape;
      },
      {},
    ],
  },
  {},
  [1]
);
