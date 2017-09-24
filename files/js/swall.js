!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Sweetalert2 = t()
}(this, function() {
    "use strict";
    var e = {
        title: "",
        titleText: "",
        text: "",
        html: "",
        type: null,
        customClass: "",
        target: "body",
        animation: !0,
        allowOutsideClick: !0,
        allowEscapeKey: !0,
        allowEnterKey: !0,
        showConfirmButton: !0,
        showCancelButton: !1,
        preConfirm: null,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        confirmButtonClass: null,
        cancelButtonText: "Cancel",
        cancelButtonColor: "#aaa",
        cancelButtonClass: null,
        buttonsStyling: !0,
        reverseButtons: !1,
        focusCancel: !1,
        showCloseButton: !1,
        showLoaderOnConfirm: !1,
        imageUrl: null,
        imageWidth: null,
        imageHeight: null,
        imageClass: null,
        timer: null,
        width: 500,
        padding: 20,
        background: "#fff",
        input: null,
        inputPlaceholder: "",
        inputValue: "",
        inputOptions: {},
        inputAutoTrim: !0,
        inputClass: null,
        inputAttributes: {},
        inputValidator: null,
        progressSteps: [],
        currentProgressStep: null,
        progressStepsDistance: "40px",
        onOpen: null,
        onClose: null
    }
        , t = function(e) {
        var t = {};
        for (var n in e)
            t[e[n]] = "swal2-" + e[n];
        return t
    }
        , n = t(["container", "shown", "iosfix", "modal", "overlay", "fade", "show", "hide", "noanimation", "close", "title", "content", "spacer", "confirm", "cancel", "icon", "image", "input", "file", "range", "select", "radio", "checkbox", "textarea", "inputerror", "validationerror", "progresssteps", "activeprogressstep", "progresscircle", "progressline", "loading", "styled"])
        , o = t(["success", "warning", "info", "question", "error"])
        , r = function(e, t) {
        e = String(e).replace(/[^0-9a-f]/gi, ""),
        e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]),
            t = t || 0;
        for (var n = "#", o = 0; o < 3; o++) {
            var r = parseInt(e.substr(2 * o, 2), 16);
            r = Math.round(Math.min(Math.max(0, r + r * t), 255)).toString(16),
                n += ("00" + r).substr(r.length)
        }
        return n
    }
        , i = {
        previousWindowKeyDown: null,
        previousActiveElement: null,
        previousBodyPadding: null
    }
        , a = function(e) {
        if ("undefined" == typeof document)
            return void console.error("SweetAlert2 requires document to initialize");
        var t = document.createElement("div");
        t.className = n.container,
            t.innerHTML = l;
        var o = document.querySelector(e.target);
        o || (console.warn("SweetAlert2: Can't find the target \"" + e.target + '"'),
            o = document.body),
            o.appendChild(t);
        var r = u()
            , i = B(r, n.input)
            , a = B(r, n.file)
            , s = r.querySelector("." + n.range + " input")
            , c = r.querySelector("." + n.range + " output")
            , d = B(r, n.select)
            , p = r.querySelector("." + n.checkbox + " input")
            , f = B(r, n.textarea);
        return i.oninput = function() {
            $.resetValidationError()
        }
            ,
            i.onkeydown = function(t) {
                setTimeout(function() {
                    13 === t.keyCode && e.allowEnterKey && (t.stopPropagation(),
                        $.clickConfirm())
                }, 0)
            }
            ,
            a.onchange = function() {
                $.resetValidationError()
            }
            ,
            s.oninput = function() {
                $.resetValidationError(),
                    c.value = s.value
            }
            ,
            s.onchange = function() {
                $.resetValidationError(),
                    s.previousSibling.value = s.value
            }
            ,
            d.onchange = function() {
                $.resetValidationError()
            }
            ,
            p.onchange = function() {
                $.resetValidationError()
            }
            ,
            f.oninput = function() {
                $.resetValidationError()
            }
            ,
            r
    }
        , l = ('\n <div  role="dialog" aria-labelledby="modalTitleId" aria-describedby="modalContentId" class="' + n.modal + '" tabIndex="-1" >\n   <ul class="' + n.progresssteps + '"></ul>\n   <div class="' + n.icon + " " + o.error + '">\n     <span class="x-mark"><span class="line left"></span><span class="line right"></span></span>\n   </div>\n   <div class="' + n.icon + " " + o.question + '">?</div>\n   <div class="' + n.icon + " " + o.warning + '">!</div>\n   <div class="' + n.icon + " " + o.info + '">i</div>\n   <div class="' + n.icon + " " + o.success + '">\n     <span class="line tip"></span> <span class="line long"></span>\n     <div class="placeholder"></div> <div class="fix"></div>\n   </div>\n   <img class="' + n.image + '">\n   <h2 class="' + n.title + '" id="modalTitleId"></h2>\n   <div id="modalContentId" class="' + n.content + '"></div>\n   <input class="' + n.input + '">\n   <input type="file" class="' + n.file + '">\n   <div class="' + n.range + '">\n     <output></output>\n     <input type="range">\n   </div>\n   <select class="' + n.select + '"></select>\n   <div class="' + n.radio + '"></div>\n   <label for="' + n.checkbox + '" class="' + n.checkbox + '">\n     <input type="checkbox">\n   </label>\n   <textarea class="' + n.textarea + '"></textarea>\n   <div class="' + n.validationerror + '"></div>\n   <hr class="' + n.spacer + '">\n   <button type="button" role="button" tabIndex="0" class="' + n.confirm + '">OK</button>\n   <button type="button" role="button" tabIndex="0" class="' + n.cancel + '">Cancel</button>\n   <span class="' + n.close + '">&times;</span>\n </div>\n').replace(/(^|\n)\s*/g, "")
        , s = function() {
        return document.body.querySelector("." + n.container)
    }
        , u = function() {
        return s() ? s().querySelector("." + n.modal) : null
    }
        , c = function() {
        return u().querySelectorAll("." + n.icon)
    }
        , d = function(e) {
        return s() ? s().querySelector("." + e) : null
    }
        , p = function() {
        return d(n.title)
    }
        , f = function() {
        return d(n.content)
    }
        , m = function() {
        return d(n.image)
    }
        , v = function() {
        return d(n.spacer)
    }
        , h = function() {
        return d(n.progresssteps)
    }
        , y = function() {
        return d(n.validationerror)
    }
        , g = function() {
        return d(n.confirm)
    }
        , b = function() {
        return d(n.cancel)
    }
        , w = function() {
        return d(n.close)
    }
        , C = function(e) {
        var t = [g(), b()];
        return e && t.reverse(),
            t.concat(Array.prototype.slice.call(u().querySelectorAll("button:not([class^=swal2-]), input:not([type=hidden]), textarea, select")))
    }
        , k = function(e, t) {
        return !!e.classList && e.classList.contains(t)
    }
        , x = function(e) {
        if (e.focus(),
            "file" !== e.type) {
            var t = e.value;
            e.value = "",
                e.value = t
        }
    }
        , S = function(e, t) {
        if (e && t) {
            t.split(/\s+/).filter(Boolean).forEach(function(t) {
                e.classList.add(t)
            })
        }
    }
        , E = function(e, t) {
        if (e && t) {
            t.split(/\s+/).filter(Boolean).forEach(function(t) {
                e.classList.remove(t)
            })
        }
    }
        , B = function(e, t) {
        for (var n = 0; n < e.childNodes.length; n++)
            if (k(e.childNodes[n], t))
                return e.childNodes[n]
    }
        , A = function(e, t) {
        t || (t = "block"),
            e.style.opacity = "",
            e.style.display = t
    }
        , P = function(e) {
        e.style.opacity = "",
            e.style.display = "none"
    }
        , T = function(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
        , L = function(e) {
        return e.offsetWidth || e.offsetHeight || e.getClientRects().length
    }
        , M = function(e, t) {
        e.style.removeProperty ? e.style.removeProperty(t) : e.style.removeAttribute(t)
    }
        , q = function(e) {
        if (!L(e))
            return !1;
        if ("function" == typeof MouseEvent) {
            var t = new MouseEvent("click",{
                view: window,
                bubbles: !1,
                cancelable: !0
            });
            e.dispatchEvent(t)
        } else if (document.createEvent) {
            var n = document.createEvent("MouseEvents");
            n.initEvent("click", !1, !1),
                e.dispatchEvent(n)
        } else
            document.createEventObject ? e.fireEvent("onclick") : "function" == typeof e.onclick && e.onclick()
    }
        , V = function() {
        var e = document.createElement("div")
            , t = {
            WebkitAnimation: "webkitAnimationEnd",
            OAnimation: "oAnimationEnd oanimationend",
            msAnimation: "MSAnimationEnd",
            animation: "animationend"
        };
        for (var n in t)
            if (t.hasOwnProperty(n) && void 0 !== e.style[n])
                return t[n];
        return !1
    }()
        , O = function() {
        if (window.onkeydown = i.previousWindowKeyDown,
            i.previousActiveElement && i.previousActiveElement.focus) {
            var e = window.scrollX
                , t = window.scrollY;
            i.previousActiveElement.focus(),
            e && t && window.scrollTo(e, t)
        }
    }
        , H = function() {
        if ("ontouchstart"in window || navigator.msMaxTouchPoints)
            return 0;
        var e = document.createElement("div");
        e.style.width = "50px",
            e.style.height = "50px",
            e.style.overflow = "scroll",
            document.body.appendChild(e);
        var t = e.offsetWidth - e.clientWidth;
        return document.body.removeChild(e),
            t
    }
        , I = function(e, t) {
        var n = void 0;
        return function() {
            var o = function() {
                n = null,
                    e()
            };
            clearTimeout(n),
                n = setTimeout(o, t)
        }
    }
        , N = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        , j = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n)
                Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
        }
        return e
    }
        , K = j({}, e)
        , D = []
        , U = void 0
        , W = function(t) {
        var r = u() || a(t);
        for (var i in t)
            e.hasOwnProperty(i) || "extraParams" === i || console.warn('SweetAlert2: Unknown parameter "' + i + '"');
        r.style.width = "number" == typeof t.width ? t.width + "px" : t.width,
            r.style.padding = t.padding + "px",
            r.style.background = t.background;
        var l = p()
            , s = f()
            , d = g()
            , y = b()
            , C = w();
        if (t.titleText ? l.innerText = t.titleText : l.innerHTML = t.title.split("\n").join("<br>"),
            t.text || t.html) {
            if ("object" === N(t.html))
                if (s.innerHTML = "",
                    0 in t.html)
                    for (var k = 0; k in t.html; k++)
                        s.appendChild(t.html[k].cloneNode(!0));
                else
                    s.appendChild(t.html.cloneNode(!0));
            else
                t.html ? s.innerHTML = t.html : t.text && (s.textContent = t.text);
            A(s)
        } else
            P(s);
        t.showCloseButton ? A(C) : P(C),
            r.className = n.modal,
        t.customClass && S(r, t.customClass);
        var x = h()
            , B = parseInt(null === t.currentProgressStep ? $.getQueueStep() : t.currentProgressStep, 10);
        t.progressSteps.length ? (A(x),
            T(x),
        B >= t.progressSteps.length && console.warn("SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),
            t.progressSteps.forEach(function(e, o) {
                var r = document.createElement("li");
                if (S(r, n.progresscircle),
                        r.innerHTML = e,
                    o === B && S(r, n.activeprogressstep),
                        x.appendChild(r),
                    o !== t.progressSteps.length - 1) {
                    var i = document.createElement("li");
                    S(i, n.progressline),
                        i.style.width = t.progressStepsDistance,
                        x.appendChild(i)
                }
            })) : P(x);
        for (var L = c(), q = 0; q < L.length; q++)
            P(L[q]);
        if (t.type) {
            var V = !1;
            for (var O in o)
                if (t.type === O) {
                    V = !0;
                    break
                }
            if (!V)
                return console.error("SweetAlert2: Unknown alert type: " + t.type),
                    !1;
            var H = r.querySelector("." + n.icon + "." + o[t.type]);
            switch (A(H),
                t.type) {
                case "success":
                    S(H, "animate"),
                        S(H.querySelector(".tip"), "animate-success-tip"),
                        S(H.querySelector(".long"), "animate-success-long");
                    break;
                case "error":
                    S(H, "animate-error-icon"),
                        S(H.querySelector(".x-mark"), "animate-x-mark");
                    break;
                case "warning":
                    S(H, "pulse-warning")
            }
        }
        var I = m();
        t.imageUrl ? (I.setAttribute("src", t.imageUrl),
            A(I),
            t.imageWidth ? I.setAttribute("width", t.imageWidth) : I.removeAttribute("width"),
            t.imageHeight ? I.setAttribute("height", t.imageHeight) : I.removeAttribute("height"),
            I.className = n.image,
        t.imageClass && S(I, t.imageClass)) : P(I),
            t.showCancelButton ? y.style.display = "inline-block" : P(y),
            t.showConfirmButton ? M(d, "display") : P(d);
        var j = v();
        t.showConfirmButton || t.showCancelButton ? A(j) : P(j),
            d.innerHTML = t.confirmButtonText,
            y.innerHTML = t.cancelButtonText,
        t.buttonsStyling && (d.style.backgroundColor = t.confirmButtonColor,
            y.style.backgroundColor = t.cancelButtonColor),
            d.className = n.confirm,
            S(d, t.confirmButtonClass),
            y.className = n.cancel,
            S(y, t.cancelButtonClass),
            t.buttonsStyling ? (S(d, n.styled),
                S(y, n.styled)) : (E(d, n.styled),
                E(y, n.styled),
                d.style.backgroundColor = d.style.borderLeftColor = d.style.borderRightColor = "",
                y.style.backgroundColor = y.style.borderLeftColor = y.style.borderRightColor = ""),
            t.animation === !0 ? E(r, n.noanimation) : S(r, n.noanimation)
    }
        , R = function(e, t) {
        var o = s()
            , r = u();
        e ? (S(r, n.show),
            S(o, n.fade),
            E(r, n.hide)) : E(r, n.fade),
            A(r),
            o.style.overflowY = "hidden",
            V && !k(r, n.noanimation) ? r.addEventListener(V, function e() {
                r.removeEventListener(V, e),
                    o.style.overflowY = "auto"
            }) : o.style.overflowY = "auto",
            S(document.documentElement, n.shown),
            S(document.body, n.shown),
            S(o, n.shown),
            z(),
            Y(),
            i.previousActiveElement = document.activeElement,
        null !== t && "function" == typeof t && setTimeout(function() {
            t(r)
        })
    }
        , z = function() {
        null === i.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (i.previousBodyPadding = document.body.style.paddingRight,
            document.body.style.paddingRight = H() + "px")
    }
        , Q = function() {
        null !== i.previousBodyPadding && (document.body.style.paddingRight = i.previousBodyPadding,
            i.previousBodyPadding = null)
    }
        , Y = function() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !k(document.body, n.iosfix)) {
            var e = document.body.scrollTop;
            document.body.style.top = e * -1 + "px",
                S(document.body, n.iosfix)
        }
    }
        , Z = function() {
        if (k(document.body, n.iosfix)) {
            var e = parseInt(document.body.style.top, 10);
            E(document.body, n.iosfix),
                document.body.style.top = "",
                document.body.scrollTop = e * -1
        }
    }
        , $ = function e() {
        for (var t = arguments.length, o = Array(t), a = 0; a < t; a++)
            o[a] = arguments[a];
        if (void 0 === o[0])
            return console.error("SweetAlert2 expects at least 1 attribute!"),
                !1;
        var l = j({}, K);
        switch (N(o[0])) {
            case "string":
                l.title = o[0],
                    l.html = o[1],
                    l.type = o[2];
                break;
            case "object":
                j(l, o[0]),
                    l.extraParams = o[0].extraParams,
                "email" === l.input && null === l.inputValidator && (l.inputValidator = function(e) {
                        return new Promise(function(t, n) {
                                /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(e) ? t() : n("Invalid email address")
                            }
                        )
                    }
                ),
                "url" === l.input && null === l.inputValidator && (l.inputValidator = function(e) {
                        return new Promise(function(t, n) {
                                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(e) ? t() : n("Invalid URL")
                            }
                        )
                    }
                );
                break;
            default:
                return console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + N(o[0])),
                    !1
        }
        W(l);
        var c = s()
            , d = u();
        return new Promise(function(t, o) {
                l.timer && (d.timeout = setTimeout(function() {
                    e.closeModal(l.onClose),
                        o("timer")
                }, l.timer));
                var a = function(e) {
                    if (!(e = e || l.input))
                        return null;
                    switch (e) {
                        case "select":
                        case "textarea":
                        case "file":
                            return B(d, n[e]);
                        case "checkbox":
                            return d.querySelector("." + n.checkbox + " input");
                        case "radio":
                            return d.querySelector("." + n.radio + " input:checked") || d.querySelector("." + n.radio + " input:first-child");
                        case "range":
                            return d.querySelector("." + n.range + " input");
                        default:
                            return B(d, n.input)
                    }
                }
                    , k = function() {
                    var e = a();
                    if (!e)
                        return null;
                    switch (l.input) {
                        case "checkbox":
                            return e.checked ? 1 : 0;
                        case "radio":
                            return e.checked ? e.value : null;
                        case "file":
                            return e.files.length ? e.files[0] : null;
                        default:
                            return l.inputAutoTrim ? e.value.trim() : e.value
                    }
                };
                l.input && setTimeout(function() {
                    var e = a();
                    e && x(e)
                }, 0);
                for (var T = function(n) {
                    l.showLoaderOnConfirm && e.showLoading(),
                        l.preConfirm ? l.preConfirm(n, l.extraParams).then(function(o) {
                            e.closeModal(l.onClose),
                                t(o || n)
                        }, function(t) {
                            e.hideLoading(),
                            t && e.showValidationError(t)
                        }) : (e.closeModal(l.onClose),
                            t(n))
                }, M = function(t) {
                    var n = t || window.event
                        , i = n.target || n.srcElement
                        , a = g()
                        , s = b()
                        , u = a === i || a.contains(i)
                        , c = s === i || s.contains(i);
                    switch (n.type) {
                        case "mouseover":
                        case "mouseup":
                            l.buttonsStyling && (u ? a.style.backgroundColor = r(l.confirmButtonColor, -.1) : c && (s.style.backgroundColor = r(l.cancelButtonColor, -.1)));
                            break;
                        case "mouseout":
                            l.buttonsStyling && (u ? a.style.backgroundColor = l.confirmButtonColor : c && (s.style.backgroundColor = l.cancelButtonColor));
                            break;
                        case "mousedown":
                            l.buttonsStyling && (u ? a.style.backgroundColor = r(l.confirmButtonColor, -.2) : c && (s.style.backgroundColor = r(l.cancelButtonColor, -.2)));
                            break;
                        case "click":
                            if (u && e.isVisible())
                                if (e.disableButtons(),
                                        l.input) {
                                    var d = k();
                                    l.inputValidator ? (e.disableInput(),
                                        l.inputValidator(d, l.extraParams).then(function() {
                                            e.enableButtons(),
                                                e.enableInput(),
                                                T(d)
                                        }, function(t) {
                                            e.enableButtons(),
                                                e.enableInput(),
                                            t && e.showValidationError(t)
                                        })) : T(d)
                                } else
                                    T(!0);
                            else
                                c && e.isVisible() && (e.disableButtons(),
                                    e.closeModal(l.onClose),
                                    o("cancel"))
                    }
                }, V = d.querySelectorAll("button"), O = 0; O < V.length; O++)
                    V[O].onclick = M,
                        V[O].onmouseover = M,
                        V[O].onmouseout = M,
                        V[O].onmousedown = M;
                w().onclick = function() {
                    e.closeModal(l.onClose),
                        o("close")
                }
                    ,
                    c.onclick = function(t) {
                        t.target === c && l.allowOutsideClick && (e.closeModal(l.onClose),
                            o("overlay"))
                    }
                ;
                var H = g()
                    , j = b();
                l.reverseButtons ? H.parentNode.insertBefore(j, H) : H.parentNode.insertBefore(H, j);
                var K = function(e, t) {
                    for (var n = C(l.focusCancel), o = 0; o < n.length; o++) {
                        e += t,
                            e === n.length ? e = 0 : e === -1 && (e = n.length - 1);
                        var r = n[e];
                        if (L(r))
                            return r.focus()
                    }
                }
                    , D = function(t) {
                    var n = t || window.event
                        , r = n.keyCode || n.which;
                    if ([9, 13, 32, 27].indexOf(r) !== -1) {
                        for (var i = n.target || n.srcElement, a = C(l.focusCancel), s = -1, u = 0; u < a.length; u++)
                            if (i === a[u]) {
                                s = u;
                                break
                            }
                        9 === r ? (n.shiftKey ? K(s, -1) : K(s, 1),
                            n.stopPropagation(),
                            n.preventDefault()) : 13 === r || 32 === r ? s === -1 && l.allowEnterKey && q(l.focusCancel ? j : H) : 27 === r && l.allowEscapeKey === !0 && (e.closeModal(l.onClose),
                            o("esc"))
                    }
                };
                i.previousWindowKeyDown = window.onkeydown,
                    window.onkeydown = D,
                l.buttonsStyling && (H.style.borderLeftColor = l.confirmButtonColor,
                    H.style.borderRightColor = l.confirmButtonColor),
                    e.showLoading = e.enableLoading = function() {
                        A(v()),
                            A(H, "inline-block"),
                            S(H, n.loading),
                            S(d, n.loading),
                            H.disabled = !0,
                            j.disabled = !0
                    }
                    ,
                    e.hideLoading = e.disableLoading = function() {
                        l.showConfirmButton || (P(H),
                        l.showCancelButton || P(v())),
                            E(H, n.loading),
                            E(d, n.loading),
                            H.disabled = !1,
                            j.disabled = !1
                    }
                    ,
                    e.getTitle = function() {
                        return p()
                    }
                    ,
                    e.getContent = function() {
                        return f()
                    }
                    ,
                    e.getInput = function() {
                        return a()
                    }
                    ,
                    e.getImage = function() {
                        return m()
                    }
                    ,
                    e.getConfirmButton = function() {
                        return g()
                    }
                    ,
                    e.getCancelButton = function() {
                        return b()
                    }
                    ,
                    e.enableButtons = function() {
                        H.disabled = !1,
                            j.disabled = !1
                    }
                    ,
                    e.disableButtons = function() {
                        H.disabled = !0,
                            j.disabled = !0
                    }
                    ,
                    e.enableConfirmButton = function() {
                        H.disabled = !1
                    }
                    ,
                    e.disableConfirmButton = function() {
                        H.disabled = !0
                    }
                    ,
                    e.enableInput = function() {
                        var e = a();
                        if (!e)
                            return !1;
                        if ("radio" === e.type)
                            for (var t = e.parentNode.parentNode, n = t.querySelectorAll("input"), o = 0; o < n.length; o++)
                                n[o].disabled = !1;
                        else
                            e.disabled = !1
                    }
                    ,
                    e.disableInput = function() {
                        var e = a();
                        if (!e)
                            return !1;
                        if (e && "radio" === e.type)
                            for (var t = e.parentNode.parentNode, n = t.querySelectorAll("input"), o = 0; o < n.length; o++)
                                n[o].disabled = !0;
                        else
                            e.disabled = !0
                    }
                    ,
                    e.recalculateHeight = I(function() {
                        var e = u();
                        if (e) {
                            var t = e.style.display;
                            e.style.minHeight = "",
                                A(e),
                                e.style.minHeight = e.scrollHeight + 1 + "px",
                                e.style.display = t
                        }
                    }, 50),
                    e.showValidationError = function(e) {
                        var t = y();
                        t.innerHTML = e,
                            A(t);
                        var o = a();
                        o && (x(o),
                            S(o, n.inputerror))
                    }
                    ,
                    e.resetValidationError = function() {
                        P(y()),
                            e.recalculateHeight();
                        var t = a();
                        t && E(t, n.inputerror)
                    }
                    ,
                    e.getProgressSteps = function() {
                        return l.progressSteps
                    }
                    ,
                    e.setProgressSteps = function(e) {
                        l.progressSteps = e,
                            W(l)
                    }
                    ,
                    e.showProgressSteps = function() {
                        A(h())
                    }
                    ,
                    e.hideProgressSteps = function() {
                        P(h())
                    }
                    ,
                    e.enableButtons(),
                    e.hideLoading(),
                    e.resetValidationError();
                for (var z = ["input", "file", "range", "select", "radio", "checkbox", "textarea"], Q = void 0, Y = 0; Y < z.length; Y++) {
                    var Z = n[z[Y]]
                        , $ = B(d, Z);
                    if (Q = a(z[Y])) {
                        for (var J in Q.attributes)
                            if (Q.attributes.hasOwnProperty(J)) {
                                var X = Q.attributes[J].name;
                                "type" !== X && "value" !== X && Q.removeAttribute(X)
                            }
                        for (var _ in l.inputAttributes)
                            Q.setAttribute(_, l.inputAttributes[_])
                    }
                    $.className = Z,
                    l.inputClass && S($, l.inputClass),
                        P($)
                }
                var F = void 0;
                switch (l.input) {
                    case "text":
                    case "email":
                    case "password":
                    case "number":
                    case "tel":
                    case "url":
                        Q = B(d, n.input),
                            Q.value = l.inputValue,
                            Q.placeholder = l.inputPlaceholder,
                            Q.type = l.input,
                            A(Q);
                        break;
                    case "file":
                        Q = B(d, n.file),
                            Q.placeholder = l.inputPlaceholder,
                            Q.type = l.input,
                            A(Q);
                        break;
                    case "range":
                        var G = B(d, n.range)
                            , ee = G.querySelector("input")
                            , te = G.querySelector("output");
                        ee.value = l.inputValue,
                            ee.type = l.input,
                            te.value = l.inputValue,
                            A(G);
                        break;
                    case "select":
                        var ne = B(d, n.select);
                        if (ne.innerHTML = "",
                                l.inputPlaceholder) {
                            var oe = document.createElement("option");
                            oe.innerHTML = l.inputPlaceholder,
                                oe.value = "",
                                oe.disabled = !0,
                                oe.selected = !0,
                                ne.appendChild(oe)
                        }
                        F = function(e) {
                            for (var t in e) {
                                var n = document.createElement("option");
                                n.value = t,
                                    n.innerHTML = e[t],
                                l.inputValue === t && (n.selected = !0),
                                    ne.appendChild(n)
                            }
                            A(ne),
                                ne.focus()
                        }
                        ;
                        break;
                    case "radio":
                        var re = B(d, n.radio);
                        re.innerHTML = "",
                            F = function(e) {
                                for (var t in e) {
                                    var o = document.createElement("input")
                                        , r = document.createElement("label")
                                        , i = document.createElement("span");
                                    o.type = "radio",
                                        o.name = n.radio,
                                        o.value = t,
                                    l.inputValue === t && (o.checked = !0),
                                        i.innerHTML = e[t],
                                        r.appendChild(o),
                                        r.appendChild(i),
                                        r.for = o.id,
                                        re.appendChild(r)
                                }
                                A(re);
                                var a = re.querySelectorAll("input");
                                a.length && a[0].focus()
                            }
                        ;
                        break;
                    case "checkbox":
                        var ie = B(d, n.checkbox)
                            , ae = a("checkbox");
                        ae.type = "checkbox",
                            ae.value = 1,
                            ae.id = n.checkbox,
                            ae.checked = Boolean(l.inputValue);
                        var le = ie.getElementsByTagName("span");
                        le.length && ie.removeChild(le[0]),
                            le = document.createElement("span"),
                            le.innerHTML = l.inputPlaceholder,
                            ie.appendChild(le),
                            A(ie);
                        break;
                    case "textarea":
                        var se = B(d, n.textarea);
                        se.value = l.inputValue,
                            se.placeholder = l.inputPlaceholder,
                            A(se);
                        break;
                    case null:
                        break;
                    default:
                        console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "' + l.input + '"')
                }
                "select" !== l.input && "radio" !== l.input || (l.inputOptions instanceof Promise ? (e.showLoading(),
                    l.inputOptions.then(function(t) {
                        e.hideLoading(),
                            F(t)
                    })) : "object" === N(l.inputOptions) ? F(l.inputOptions) : console.error("SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " + N(l.inputOptions))),
                    R(l.animation, l.onOpen),
                    l.allowEnterKey ? K(-1, 1) : document.activeElement && document.activeElement.blur(),
                    s().scrollTop = 0,
                "undefined" == typeof MutationObserver || U || (U = new MutationObserver(e.recalculateHeight),
                    U.observe(d, {
                        childList: !0,
                        characterData: !0,
                        subtree: !0
                    }))
            }
        )
    };
    return $.isVisible = function() {
        return !!u()
    }
        ,
        $.queue = function(e) {
            D = e;
            var t = function() {
                D = [],
                    document.body.removeAttribute("data-swal2-queue-step")
            }
                , n = [];
            return new Promise(function(e, o) {
                    !function r(i, a) {
                        i < D.length ? (document.body.setAttribute("data-swal2-queue-step", i),
                            $(D[i]).then(function(e) {
                                n.push(e),
                                    r(i + 1, a)
                            }, function(e) {
                                t(),
                                    o(e)
                            })) : (t(),
                            e(n))
                    }(0)
                }
            )
        }
        ,
        $.getQueueStep = function() {
            return document.body.getAttribute("data-swal2-queue-step")
        }
        ,
        $.insertQueueStep = function(e, t) {
            return t && t < D.length ? D.splice(t, 0, e) : D.push(e)
        }
        ,
        $.deleteQueueStep = function(e) {
            void 0 !== D[e] && D.splice(e, 1)
        }
        ,
        $.close = $.closeModal = function(e) {
            var t = s()
                , o = u();
            if (o) {
                E(o, n.show),
                    S(o, n.hide),
                    clearTimeout(o.timeout),
                    O();
                var r = function() {
                    t.parentNode.removeChild(t),
                        E(document.documentElement, n.shown),
                        E(document.body, n.shown),
                        Q(),
                        Z()
                };
                V && !k(o, n.noanimation) ? o.addEventListener(V, function e() {
                    o.removeEventListener(V, e),
                    k(o, n.hide) && r()
                }) : r(),
                null !== e && "function" == typeof e && setTimeout(function() {
                    e(o)
                })
            }
        }
        ,
        $.clickConfirm = function() {
            return g().click()
        }
        ,
        $.clickCancel = function() {
            return b().click()
        }
        ,
        $.setDefaults = function(t) {
            if (!t || "object" !== (void 0 === t ? "undefined" : N(t)))
                return console.error("SweetAlert2: the argument for setDefaults() is required and has to be a object");
            for (var n in t)
                e.hasOwnProperty(n) || "extraParams" === n || (console.warn('SweetAlert2: Unknown parameter "' + n + '"'),
                    delete t[n]);
            j(K, t)
        }
        ,
        $.resetDefaults = function() {
            K = j({}, e)
        }
        ,
        $.noop = function() {}
        ,
        $.version = "6.4.4",
        $.default = $,
        $
}),
window.Sweetalert2 && (window.sweetAlert = window.swal = window.Sweetalert2);
