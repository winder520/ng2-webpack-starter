/**
* Created by winder on 2017/4/5.
*/
export class IrregularShape {
  static e = Math.PI / 180
  static t = 180 / Math.PI
  static r = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi
  static n = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi
  static o = /(^[#\.]|[a-y][a-z])/gi
  static i = /[achlmqstvz]/gi
  static a = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi;

  private static getElementPath(e, t, r?): any {
    var i, a, h = "string" == typeof e;
    if (typeof e !== 'object')
      e = document.querySelector(e);
    e = e.getAttribute('d');
    return e;
  }

  private static createSvgElement(e, t) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", "path")
      , n = Array.prototype.slice.call(e.attributes)
      , o = n.length;
    for (t = "," + t + ","; --o > -1;)
      -1 === t.indexOf("," + n[o].nodeName + ",") && element.setAttributeNS(null, n[o].nodeName, n[o].nodeValue);
    return element
  }

  private static V(e, t) {
    var r, o, i, a, s, h, l, f, g, u, c, p, d, m, v, b, M, C, S, A, y, x = e.tagName.toLowerCase(), w = .552284749831;
    return "path" !== x && e.getBBox ? (h = IrregularShape.createSvgElement(e, "x,y,width,height,cx,cy,rx,ry,r,x1,x2,y1,y2,points"),
      "rect" === x ? (a = +e.getAttribute("rx") || 0,
        s = +e.getAttribute("ry") || 0,
        o = +e.getAttribute("x") || 0,
        i = +e.getAttribute("y") || 0,
        u = (+e.getAttribute("width") || 0) - 2 * a,
        c = (+e.getAttribute("height") || 0) - 2 * s,
        a || s ? (p = o + a * (1 - w),
          d = o + a,
          m = d + u,
          v = m + a * w,
          b = m + a,
          M = i + s * (1 - w),
          C = i + s,
          S = C + c,
          A = S + s * w,
          y = S + s,
          r = "M" + b + "," + C + " V" + S + " C" + [b, A, v, y, m, y, m - (m - d) / 3, y, d + (m - d) / 3, y, d, y, p, y, o, A, o, S, o, S - (S - C) / 3, o, C + (S - C) / 3, o, C, o, M, p, i, d, i, d + (m - d) / 3, i, m - (m - d) / 3, i, m, i, v, i, b, M, b, C].join(",") + "z") : r = "M" + (o + u) + "," + i + " v" + c + " h" + -u + " v" + -c + " h" + u + "z") : "circle" === x || "ellipse" === x ? ("circle" === x ? (a = s = +e.getAttribute("r") || 0,
            f = a * w) : (a = +e.getAttribute("rx") || 0,
              s = +e.getAttribute("ry") || 0,
              f = s * w),
            o = +e.getAttribute("cx") || 0,
            i = +e.getAttribute("cy") || 0,
            l = a * w,
            r = "M" + (o + a) + "," + i + " C" + [o + a, i + f, o + l, i + s, o, i + s, o - l, i + s, o - a, i + f, o - a, i, o - a, i - f, o - l, i - s, o, i - s, o + l, i - s, o + a, i - f, o + a, i].join(",") + "z") : "line" === x ? r = "M" + e.getAttribute("x1") + "," + e.getAttribute("y1") + " L" + e.getAttribute("x2") + "," + e.getAttribute("y2") : ("polyline" === x || "polygon" === x) && (g = (e.getAttribute("points") + "").match(IrregularShape.n) || [],
              o = g.shift(),
              i = g.shift(),
              r = "M" + o + "," + i + " L" + g.join(","),
              "polygon" === x && (r += "," + o + "," + i + "z")),
      h.setAttribute("d", r),
      t && e.parentNode && (e.parentNode.insertBefore(h, e),
        e.parentNode.removeChild(e)),
      h) : e
  }
  private static p(t, r) {
    var n, o, i, a, s, h, l = Math.ceil(Math.abs(r) / 90), f = 0, g = [];
    t *= IrregularShape.e;
    r *= IrregularShape.e;
    n = r / l;
    o = 4 / 3 * Math.sin(n / 2) / (1 + Math.cos(n / 2));
    for (h = 0; l > h; h++) {
      i = t + h * n;
      a = Math.cos(i);
      s = Math.sin(i);
      g[f++] = a - o * s;
      g[f++] = s + o * a;
      i += n;
      a = Math.cos(i);
      s = Math.sin(i);
      g[f++] = a + o * s;
      g[f++] = s - o * a;
      g[f++] = a;
      g[f++] = s;
    }
    return g
  }
  private static d(r, n, o, i, a, s, h, l, f) {
    if (r !== l || n !== f) {
      o = Math.abs(o),
        i = Math.abs(i);
      var g = a % 360 * IrregularShape.e
        , u = Math.cos(g)
        , c = Math.sin(g)
        , d = (r - l) / 2
        , m = (n - f) / 2
        , v = u * d + c * m
        , b = -c * d + u * m
        , M = o * o
        , C = i * i
        , S = v * v
        , A = b * b
        , y = S / M + A / C;
      y > 1 && (o = Math.sqrt(y) * o,
        i = Math.sqrt(y) * i,
        M = o * o,
        C = i * i);
      var x = s === h ? -1 : 1
        , w = (M * C - M * A - C * S) / (M * A + C * S);
      0 > w && (w = 0);
      var N = x * Math.sqrt(w)
        , z = N * (o * b / i)
        , _ = N * -(i * v / o)
        , P = (r + l) / 2
        , T = (n + f) / 2
        , L = P + (u * z - c * _)
        , G = T + (c * z + u * _)
        , q = (v - z) / o
        , I = (b - _) / i
        , Y = (-v - z) / o
        , B = (-b - _) / i
        , X = Math.sqrt(q * q + I * I)
        , V = q;
      x = 0 > I ? -1 : 1;
      var R = x * Math.acos(V / X) * IrregularShape.t;
      X = Math.sqrt((q * q + I * I) * (Y * Y + B * B)),
        V = q * Y + I * B,
        x = 0 > q * B - I * Y ? -1 : 1;
      var O = x * Math.acos(V / X) * IrregularShape.t;
      !h && O > 0 ? O -= 360 : h && 0 > O && (O += 360),
        O %= 360,
        R %= 360;
      var F, j, H, D = IrregularShape.p(R, O), Q = u * o, E = c * o, U = c * -i, W = u * i, Z = D.length - 2;
      for (F = 0; Z > F; F += 2) {
        j = D[F];
        H = D[F + 1];
        D[F] = j * Q + H * U + L;
        D[F + 1] = j * E + H * W + G;
      }
      D[D.length - 2] = l;
      D[D.length - 1] = f;
      return D
    }
  }

  private static convertCoordinate(e) {
    // console.log(e)
    var t, n, o, i, s, h, l, f, g, u, p, m, v,
      b: Array<any> = (e + "").replace(IrregularShape.a, (e: string): any => {
        var t = +e;
        return 1e-4 > t && t > -1e-4 ? 0 : t
      }).match(IrregularShape.r) || [],
      M: any = [],
      C = 0,
      S = 0,
      A = b.length,
      y = 2,
      x = 0;
    if (!e || !isNaN(b[0]) || isNaN(b[1])) {
      console.log("ERROR: malformed path data: " + e);
      return M;
    }
    for (t = 0; A > t; t++) {
      v = s;
      if (isNaN(b[t])) {
        s = b[t].toUpperCase();
        h = s !== b[t];
      } else {
        t--;
      }

      o = +b[t + 1];
      i = +b[t + 2];
      if (h) {
        o += C;
        i += S;
      }
      if (0 === t) {
        f = o;
        g = i;
      }
      if ("M" === s) {
        if (l && l.length < 8) {
          M.length -= 1;
          y = 0
        }
        C = f = o;
        S = g = i;
        l = [o, i];
        x += y;
        y = 2;
        M.push(l);
        t += 2;
        s = "L";
      }
      else if ("C" === s) {
        l || (l = [0, 0]),
          l[y++] = o,
          l[y++] = i,
          h || (C = S = 0),
          l[y++] = C + 1 * b[t + 3],
          l[y++] = S + 1 * b[t + 4],
          l[y++] = C += 1 * b[t + 5],
          l[y++] = S += 1 * b[t + 6],
          t += 6;
      }
      else if ("S" === s) {
        "C" === v || "S" === v ? (u = C - l[y - 4],
          p = S - l[y - 3],
          l[y++] = C + u,
          l[y++] = S + p) : (l[y++] = C,
            l[y++] = S);
        l[y++] = o;
        l[y++] = i;
        h || (C = S = 0);
        l[y++] = C += 1 * b[t + 3];
        l[y++] = S += 1 * b[t + 4];
        t += 4;
      }
      else if ("Q" === s) {
        u = o - C,
          p = i - S,
          l[y++] = C + 2 * u / 3,
          l[y++] = S + 2 * p / 3,
          h || (C = S = 0),
          C += 1 * b[t + 3],
          S += 1 * b[t + 4],
          u = o - C,
          p = i - S,
          l[y++] = C + 2 * u / 3,
          l[y++] = S + 2 * p / 3,
          l[y++] = C,
          l[y++] = S,
          t += 4;
      }
      else if ("T" === s) {
        u = C - l[y - 4],
          p = S - l[y - 3],
          l[y++] = C + u,
          l[y++] = S + p,
          u = C + 1.5 * u - o,
          p = S + 1.5 * p - i,
          l[y++] = o + 2 * u / 3,
          l[y++] = i + 2 * p / 3,
          l[y++] = C = o,
          l[y++] = S = i,
          t += 2;
      }
      else if ("H" === s) {
        i = S,
          l[y++] = C + (o - C) / 3,
          l[y++] = S + (i - S) / 3,
          l[y++] = C + 2 * (o - C) / 3,
          l[y++] = S + 2 * (i - S) / 3,
          l[y++] = C = o,
          l[y++] = i,
          t += 1;
      }
      else if ("V" === s) {
        i = o;
        o = C;
        h && (i += S - C);
        l[y++] = o;
        l[y++] = S + (i - S) / 3;
        l[y++] = o;
        l[y++] = S + 2 * (i - S) / 3;
        l[y++] = o;
        l[y++] = S = i;
        t += 1;
      }
      else if ("L" === s || "Z" === s) {
        if ("Z" === s) {
          o = f;
          i = g;
          l.closed = true
        }
        if ("L" === s || Math.abs(C - o) > .5 || Math.abs(S - i) > .5) {
          // l[y++] = C + (o - C) / 3;
          // l[y++] = S + (i - S) / 3;
          // l[y++] = C + 2 * (o - C) / 3;
          // l[y++] = S + 2 * (i - S) / 3;
          // l[y++] = o;
          // l[y++] = i;

          // l[y++] = C;
          // l[y++] = S;
          // l[y++] = o;
          // l[y++] = i;

          var k = (i - S) / (o - C),
            x1, y1, x2, y2,
            dist = Math.sqrt(Math.pow(C - o, 2) + Math.pow(S - i, 2));
          l[y++] = C;
          l[y++] = S;
          var di, index;
          for (index = 1; index < dist; index += 5) {
            //j=
            var xSqrt = Math.sqrt(4 * index * index * k * k + 4 * index * index);
            var ySqrt = Math.sqrt(4 * index * index + (4 * index * index) / (k * k));
            x1 = (2 * C * k * k + xSqrt + 2 * C) / (2 * k * k + 2);
            y1 = (ySqrt * k * k + 2 * S * k * k + 2 * S) / (2 * k * k + 2);

            x2 = -(-2 * C * k * k + xSqrt - 2 * C) / (2 * k * k + 2);
            y2 = (ySqrt * k * k - 2 * S * k * k - 2 * S) / (2 * k * k + 2);
            di = Math.sqrt(Math.pow(o - x1, 2) + Math.pow(i - y1, 2));
            di = di.toFixed();
            // console.log(dist, index, (dist - index).toFixed(), x1, y1, x2, y2,k, '======================',
            //     Math.sqrt(Math.pow(o - x1, 2) + Math.pow(i - y1, 2)).toFixed(),
            //     Math.sqrt(Math.pow(o - x1, 2) + Math.pow(i - y2, 2)).toFixed(),
            //     Math.sqrt(Math.pow(o - x2, 2) + Math.pow(i - y2, 2)).toFixed(),
            //     Math.sqrt(Math.pow(o - x2, 2) + Math.pow(i - y1, 2)).toFixed());
            //  di = Math.sqrt(Math.pow(o - x2, 2) + Math.pow(i - y2, 2));

            if ((dist - index).toFixed() === di) {
              // console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
              l[y++] = x1;
              l[y++] = y1;
              continue;
            }

          }

          l[y++] = o;
          l[y++] = i;
        }
        if ("L" === s) {
          t += 2;
        }
        C = o;
        S = i;
      }
      else if ("A" === s) {
        m = IrregularShape.d(C, S, 1 * b[t + 1], 1 * b[t + 2], 1 * b[t + 3], 1 * b[t + 4], 1 * b[t + 5], (h ? C : 0) + 1 * b[t + 6], (h ? S : 0) + 1 * b[t + 7])
        if (m) {
          for (n = 0; n < m.length; n++) {
            l[y++] = m[n];
          }
        }
        C = l[y - 2],
          S = l[y - 1],
          t += 7
      } else {
        console.log("Error: malformed path data: " + e);
      }
    }
    M.totalPoints = x + y;
    return M;
  }

  private static pathDataToBezier(e, t?): any {
    var r, n, o, i, a, h, l, f, g, u: any = 0;
    var path: any = e;
    if (e instanceof SVGElement) {
      path = IrregularShape.getElementPath(e, !0);
    }
    g = IrregularShape.convertCoordinate(path)[0] || [];
    t = t || {};
    f = t.align || t.relative;
    i = t.matrix || [1, 0, 0, 1, 0, 0];
    a = t.offsetX || 0;
    h = t.offsetY || 0;
    if ("relative" === f || f === !0) {
      a -= g[0] * i[0] + g[1] * i[2];
      h -= g[0] * i[1] + g[1] * i[3];
      u = "+=";
    } else {
      a += i[4];
      h += i[5];
      if (f) {
        f = "string" == typeof f ? document.querySelector(f) : f && f[0] ? f : [f];
        if (f && f[0]) {
          l = f[0].getBBox() || {
            x: 0,
            y: 0
          };
          a -= l.x;
          h -= l.y;
        }
      }
    }
    r = [];
    o = g.length;
    if (i) {
      for (n = 0; o > n; n += 2) {
        r.push({
          x: u + (g[n] * i[0] + g[n + 1] * i[2] + a),
          y: u + (g[n] * i[1] + g[n + 1] * i[3] + h)
        });
      }
    }
    else {
      for (n = 0; o > n; n += 2) {
        r.push({
          x: u + (g[n] + a),
          y: u + (g[n + 1] + h)
        });
      }
    }
    // console.log(g, r, '--------------------------------------')
    return r
  }

  private static hitTest(points, point) {

    var total = points.length - 1;

    var res = {
      edge: 0,
      point: {},
      dist: Infinity,
      distSq: Infinity
    };

    for (var i = 0; i < total; i++) {

      var p1 = points[i];
      var p2 = points[i + 1] || points[0];

      IrregularShape.pointDist(point, p1, p2, i, res);
    }

    var e1 = points[res.edge];
    var e2 = points[res.edge + 1];
    return res.point;
  }

  private static pointDist(point, p1, p2, edge, res) {

    var x = point.x;
    var y = point.y;
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dotProd = A * C + B * D;
    var distSq = C * C + D * D;
    var determ = dotProd / distSq;

    var xx, yy;

    if (determ < 0 || (x1 === x2 && y1 === y2)) {
      xx = x1;
      yy = y1;

    } else if (determ > 1) {
      xx = x2;
      yy = y2;

    } else {
      xx = x1 + determ * C;
      yy = y1 + determ * D;
    }

    var dx = x - xx;
    var dy = y - yy;

    distSq = dx * dx + dy * dy;


    if (distSq < res.distSq) {

      res.edge = edge;
      res.dist = Math.sqrt(distSq);
      res.distSq = distSq;
      res.point.x = xx;
      res.point.y = yy;
    }
  }

  private static getContour(bezier, tolerance) {

    var points = [bezier[0]];
    var total = bezier.length;

    for (var i = 1; i < total;) {
      var p1 = bezier[i - 1];
      var p2 = bezier[i++];
      var p3 = bezier[i++];
      var p4 = bezier[i++];
      addPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    }

    points.push(bezier[total - 1]);

    return points;

    function addPoint(x1, y1, x2, y2, x3, y3, x4, y4) {

      // Calculate all the mid-points of the line segments
      //----------------------
      var x12 = (x1 + x2) / 2;
      var y12 = (y1 + y2) / 2;
      var x23 = (x2 + x3) / 2;
      var y23 = (y2 + y3) / 2;
      var x34 = (x3 + x4) / 2;
      var y34 = (y3 + y4) / 2;

      var x123 = (x12 + x23) / 2;
      var y123 = (y12 + y23) / 2;
      var x234 = (x23 + x34) / 2;
      var y234 = (y23 + y34) / 2;
      var x1234 = (x123 + x234) / 2;
      var y1234 = (y123 + y234) / 2;

      // Try to approximate the full cubic curve by a single straight line
      //------------------
      var dx = x4 - x1;
      var dy = y4 - y1;

      var d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx));
      var d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx));

      if ((d2 + d3) * (d2 + d3) < tolerance * (dx * dx + dy * dy)) {
        points.push({ x: x1234, y: y1234 });
        return;
      }

      // Continue subdivision
      //----------------------
      addPoint(x1, y1, x12, y12, x123, y123, x1234, y1234);
      addPoint(x1234, y1234, x234, y234, x34, y34, x4, y4);
    }
  }

  static calculateLinkPoint(path, point) {
    var values = IrregularShape.pathDataToBezier(path);
    var tolerance = 1;
    var points = IrregularShape.getContour(values, tolerance);
    var result = IrregularShape.hitTest(points, point);

    return result;
  }
}