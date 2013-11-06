define("eagle/charcount/1.0.0/charcount",["gallery/jquery/1.8.0/jquery"],function(e,t){var n=e("gallery/jquery/1.8.0/jquery"),a=navigator.userAgent.toLowerCase(),r=a.indexOf("msie")>0,l=r?a.match(/msie ([\d.]+)/)[1]:null,i=r&&"6.0"==l,c={allowed:140,warning:25,css:{normal:"counter",warning:"warning",exceeded:"exceeded"},tips:{counterElement:"span",normal:"还可以输入{available}字",exceeded:"已经超过{exceeded}字"},label:"",filter:{enable:!0,tagattr:"data-text"},half:!1,trim:!0,capture:!0,initKey:!1,closed:!1,callbacks:{common:function(){},crisis:function(){}}},o=function(e,t,a){function r(){var e=null,t=a.filter;if(b){if(t.enable){var r=v.clone(),l=t.tagattr;r.find("*").replaceWith(function(){return"string"==typeof l?n(this).attr(l)||"":""}),e=r.text(),r=null}else e=v.text();e=e.replace(/&nbsp;/g," ")}else e=v.val();if(""!=a.label){var i=RegExp("^"+a.label);i.test(e)&&(e=e.replace(i,""))}return a.trim?n.trim(e):e}function l(e){b?""==e?v.html(""):v.text(e):i&&"input"==y?(clearTimeout(x),x=setTimeout(function(){v.val(e)},10)):v.val(e)}function o(){var e=null;return b?(e=v.html(),e=e.replace(/&nbsp;/g," ")):e=v.val(),a.trim?n.trim(e):e}function u(e){if("string"!=typeof e||0==e.length)return 0;if(e.length>1){for(var t=0,n=0;e.length>n;n++)t+=u(e.charAt(n));return t}var a=e.charCodeAt(0);return a>=0&&128>=a?.5:1}function s(){var e=a.filter;if(b){var t=v.contents(),i=e.tagattr,c=0;if(e.enable){var o="";t.each(function(){if(1==this.nodeType&&"string"==typeof i&&n(this).is("["+i+'!=""]')){var e=n(this).attr(i);if(a.half)for(var t=0;e.length>t;t++)c+=u(e.charAt(t));else c+=e.length;if(c>a.allowed)return!1;o+=n("<div />").wrapInner(n(this).clone()).html()}else if(3==this.nodeType)for(var t=0;this.data.length>t;t++){if(c+=a.half?u(this.data.charAt(t)):1,c>a.allowed)return!1;o+=this.data.charAt(t)}}),v.html(o)}else{var s=n("<div />");t.each(function(){if(1==this.nodeType){var e=n(this).text(),t=(this.tagName||"").toLowerCase(),r=null;a.allowed>c&&(r=n("<"+t+" />"),s.append(r));for(var l=0;e.length>l;l++){if(c+=a.half?u(e.charAt(l)):1,c>a.allowed)return!1;r.append(e.charAt(l))}}else if(3==this.nodeType)for(var l=0;this.data.length>l;l++){if(c+=a.half?u(this.data.charAt(l)):1,c>a.allowed)return!1;s.append(this.data.charAt(l))}}),v.html(s.html())}}else{var f=r();if(a.half){for(var c=0,h="",d=0;f.length>d&&(c+=u(f.charAt(d)),!(c>a.allowed));d++)h+=f.substr(d,1);l(h)}else l(f.substring(0,a.allowed))}}function f(e){if(0==arguments.length)return null;var t=Array.prototype.slice.call(arguments,1);return e.replace(/\{(\d+)\}/g,function(e,n){return"function"==typeof t[n]?t[n]():t[n]})}function h(e,t,n,r){var l=a.tips[e]?a.tips[e]:a.tips.normal,i=[],c="";i.push("<"),i.push(a.tips.counterElement),i.push(' class="{0}"'),i.push(">"),i.push("{1}"),i.push("</"+a.tips.counterElement+">"),c=i.join(""),l=l.replace(/\{already\}/g,function(){return f(c,function(){return"warning"==e?a.css.normal+" "+a.css.warning:a.css.normal},t)}),l=l.replace(/\{available\}/g,function(){return f(c,function(){return"warning"==e?a.css.normal+" "+a.css.warning:a.css.normal},n)}),l=l.replace(/\{exceeded\}/g,function(){return f(c,function(){return"exceeded"==e?a.css.normal+" "+a.css.exceeded:a.css.normal},r)}),l=l.replace(/\{allowed\}/g,function(){return f(c,a.css.normal,a.allowed)}),m.html(l)}function d(){function e(){r=A.getAlready(),l=A.getAvailable(r),i=A.getExceeded(r)}if(!a.closed){var t=a.filter;b&&t.enable&&"string"==typeof t.tagattr&&v.children(":not(["+t.tagattr+"])").replaceWith(function(){return n(this).text()});var r=0,l=0,i=0;e(),g.call(v[0]),i>0?(a.capture?(s(),e(),h("warning",r,0,i)):h("exceeded",r,l,i),p.call(v[0])):a.warning>=l?h("warning",r,l,i):h("normal",r,l,i)}}var a=n.extend(!0,{},c,a||{}),g=a.callbacks.common,p=a.callbacks.crisis,v=n(e).eq(0),m=n(t||[]).eq(0),b=v.is('[contentEditable="true"]');if(0==v.length)return null;var w=v.data("data-charcount"),y=(v[0].tagName||"").toLowerCase(),x=0;if("object"==typeof w)return w;var A={options:a,getAlready:function(){var e=r(),t=a.half?u(e):e.length;return Math.ceil(t)},getAvailable:function(e){return e=e||this.getAlready(),a.allowed>e?a.allowed-e:0},getExceeded:function(e){return e=e||this.getAlready(),e>a.allowed?e-a.allowed:0},getval:function(){return r()},setval:function(e){l(e)},removelabel:function(){this.removeLabel()},removeLabel:function(){v.trigger("removelabel.cf")},checking:function(e){var t=this.getAvailable(null)>=0;return t&&e instanceof RegExp&&(t=e.test(this.getval())),t},calculate:function(){d()},open:function(){a.closed=!1,m.show(),this.calculate()},close:function(){a.closed=!0,m.hide()}};return a.initKey&&d(),""!=a.label&&""==o()&&l(a.label),v.off(".cc").on("propertychange.cc input.cc keydown.cc keyup.cc change.cc",d),v.off(".cf").on("removelabel.cf focus.cf paste.cf",function(){""!=a.label&&a.label==o()&&l("")}),v.off(".cb").on("blur.cb",function(){""!=a.label&&""==o()&&l(a.label)}),v.data("data-charcount",A),A},u=function(e,t,a){var r=n(e),l=n(t);return 0==r.length||r.length!=l.length?[]:n(e).map(function(e){return o(n(this),l.eq(e),a)}).get()};n.fn.extend({getCharCount:function(){return n(this).data("data-charcount")||null}}),t.init=o,t.initMulti=u});