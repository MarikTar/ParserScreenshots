parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Focm":[function(require,module,exports) {
var e=document.getElementById("actionParse"),t=document.getElementById("actionTruAgain"),n=document.getElementById("inputField"),a=document.getElementById("resultField"),c=function(e,t){e.disabled=!1,t.disabled=!0},d=function(e,t){e.hidden=!1,t.hidden=!0},m=function(){for(var e=n.value.match(/https:.+\.png/g),t={},a=0;a<e.length;a+=1){var c=e[a].match(/test_screenshots\/(.+)\.ts/)[1],d=e[a].match(/\%3E+(.+)_page.+/)[1],m=e[a].match(/.+T(..\%3A..\%3A..).+/)[1],i=e[a].match(/time_(.+)T/)[1],l=e[a].match(/.+_page_(.+)_time.+/)[1];t[c]||(t[c]=[]),t[c].push({page:l,date:i,time:m.replace(/%3A/g,":"),description:decodeURI(d).replace(/%2C/g,","),url:e[a]})}return t},i=function(e){var t=function(){var t=document.createElement("details"),n=document.createElement("summary"),c=document.createElement("button"),d=e[key];t.className="details",n.className="summary",c.className="actionCollapse",n.innerHTML=key,c.innerHTML="Collapse",c.onclick=function(e){t.open=!1,document.getElementById(e.target.parentNode.id).scrollIntoView()},t.id=key,t.append(n);for(var m=0;m<d.length;m+=1){var i=document.createElement("div"),l=document.createElement("div"),r=document.createElement("span"),s=document.createElement("span"),o=document.createElement("span"),p=document.createElement("div"),u=document.createElement("div"),g=document.createElement("img");l.className="description_container",i.className="item",r.className="title",g.className="screenshot",s.className="date_container",o.className="page",p.className="date",u.className="time",r.innerHTML=d[m].description,p.innerHTML="Date: ".concat(d[m].date),u.innerHTML="Time: ".concat(d[m].time),o.innerHTML="Page: ".concat(d[m].page),s.append(p),s.append(u),l.append(r),l.append(o),l.append(s),i.append(l),g.setAttribute("src",d[m].url),i.append(g),t.append(i)}t.append(c),a.append(t)};for(key in e)t()};e.addEventListener("click",function(){c(t,e),d(a,n),i(m()),console.log(m())}),t.addEventListener("click",function(){c(e,t),d(n,a),n.value="",a.innerHTML=""});
},{}]},{},["Focm"], null)
//# sourceMappingURL=/ParserScreenshots/src.4e77ed22.js.map