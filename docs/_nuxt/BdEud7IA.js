var Yt=Object.defineProperty;var Gt=(t,n,o)=>n in t?Yt(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o;var St=(t,n,o)=>(Gt(t,typeof n!="symbol"?n+"":n,o),o);import{h as Lt,i as Rt,v as Kt,o as J,c as it,j as $t,f as jt,r as dt,g as Ht,k as Ut,a as b,b as ut,w as st,u as K,l as gt,m as _t,d as W,t as ct,n as Ft,F as Wt}from"./U3-ZX0SS.js";import{_ as Ot}from"./CTGTP2KQ.js";import{u as qt}from"./ErMchg64.js";import{u as q}from"./B-WDjgS2.js";import{s as H,d as Zt,c as wt,T as xt,e as vt,m as Tt,l as It,b as Qt,a as Jt}from"./B7PevS6S.js";function te(t){let n;for(;n=t.sourceEvent;)t=n;return t}function Q(t,n){if(t=te(t),n===void 0&&(n=t.currentTarget),n){var o=n.ownerSVGElement||n;if(o.createSVGPoint){var a=o.createSVGPoint();return a.x=t.clientX,a.y=t.clientY,a=a.matrixTransform(n.getScreenCTM().inverse()),[a.x,a.y]}if(n.getBoundingClientRect){var r=n.getBoundingClientRect();return[t.clientX-r.left-n.clientLeft,t.clientY-r.top-n.clientTop]}}return[t.pageX,t.pageY]}const bt={capture:!0,passive:!1};function zt(t){t.preventDefault(),t.stopImmediatePropagation()}function ee(t){var n=t.document.documentElement,o=H(t).on("dragstart.drag",zt,bt);"onselectstart"in n?o.on("selectstart.drag",zt,bt):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")}function ne(t,n){var o=t.document.documentElement,a=H(t).on("dragstart.drag",null);n&&(a.on("click.drag",zt,bt),setTimeout(function(){a.on("click.drag",null)},0)),"onselectstart"in o?a.on("selectstart.drag",null):(o.style.MozUserSelect=o.__noselect,delete o.__noselect)}var oe=1e-12;function Pt(t){return((t=Math.exp(t))+1/t)/2}function ae(t){return((t=Math.exp(t))-1/t)/2}function se(t){return((t=Math.exp(2*t))-1)/(t+1)}const ie=function t(n,o,a){function r(i,d){var m=i[0],h=i[1],u=i[2],g=d[0],z=d[1],x=d[2],T=g-m,C=z-h,P=T*T+C*C,B,_;if(P<oe)_=Math.log(x/u)/n,B=function(A){return[m+A*T,h+A*C,u*Math.exp(n*A*_)]};else{var N=Math.sqrt(P),w=(x*x-u*u+a*P)/(2*u*o*N),X=(x*x-u*u-a*P)/(2*x*o*N),D=Math.log(Math.sqrt(w*w+1)-w),I=Math.log(Math.sqrt(X*X+1)-X);_=(I-D)/n,B=function(A){var tt=A*_,et=Pt(D),F=u/(o*N)*(et*se(n*tt+D)-ae(D));return[m+F*T,h+F*C,u*et/Pt(n*tt+D)]}}return B.duration=_*1e3*n/Math.SQRT2,B}return r.rho=function(i){var d=Math.max(.001,+i),m=d*d,h=m*m;return t(d,m,h)},r}(Math.SQRT2,2,4),mt=t=>()=>t;function re(t,{sourceEvent:n,target:o,transform:a,dispatch:r}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:n,enumerable:!0,configurable:!0},target:{value:o,enumerable:!0,configurable:!0},transform:{value:a,enumerable:!0,configurable:!0},_:{value:r}})}function yt(t){t.stopImmediatePropagation()}function ht(t){t.preventDefault(),t.stopImmediatePropagation()}function le(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function ue(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function Vt(){return this.__zoom||wt}function ce(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function he(){return navigator.maxTouchPoints||"ontouchstart"in this}function fe(t,n,o){var a=t.invertX(n[0][0])-o[0][0],r=t.invertX(n[1][0])-o[1][0],i=t.invertY(n[0][1])-o[0][1],d=t.invertY(n[1][1])-o[1][1];return t.translate(r>a?(a+r)/2:Math.min(0,a)||Math.max(0,r),d>i?(i+d)/2:Math.min(0,i)||Math.max(0,d))}function de(){var t=le,n=ue,o=fe,a=ce,r=he,i=[0,1/0],d=[[-1/0,-1/0],[1/0,1/0]],m=250,h=ie,u=Zt("start","zoom","end"),g,z,x,T=500,C=150,P=0,B=10;function _(e){e.property("__zoom",Vt).on("wheel.zoom",tt,{passive:!1}).on("mousedown.zoom",et).on("dblclick.zoom",F).filter(r).on("touchstart.zoom",rt).on("touchmove.zoom",nt).on("touchend.zoom touchcancel.zoom",ot).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}_.transform=function(e,l,s,p){var f=e.selection?e.selection():e;f.property("__zoom",Vt),e!==f?D(e,l,s,p):f.interrupt().each(function(){I(this,arguments).event(p).start().zoom(null,typeof l=="function"?l.apply(this,arguments):l).end()})},_.scaleBy=function(e,l,s,p){_.scaleTo(e,function(){var f=this.__zoom.k,v=typeof l=="function"?l.apply(this,arguments):l;return f*v},s,p)},_.scaleTo=function(e,l,s,p){_.transform(e,function(){var f=n.apply(this,arguments),v=this.__zoom,y=s==null?X(f):typeof s=="function"?s.apply(this,arguments):s,k=v.invert(y),V=typeof l=="function"?l.apply(this,arguments):l;return o(w(N(v,V),y,k),f,d)},s,p)},_.translateBy=function(e,l,s,p){_.transform(e,function(){return o(this.__zoom.translate(typeof l=="function"?l.apply(this,arguments):l,typeof s=="function"?s.apply(this,arguments):s),n.apply(this,arguments),d)},null,p)},_.translateTo=function(e,l,s,p,f){_.transform(e,function(){var v=n.apply(this,arguments),y=this.__zoom,k=p==null?X(v):typeof p=="function"?p.apply(this,arguments):p;return o(wt.translate(k[0],k[1]).scale(y.k).translate(typeof l=="function"?-l.apply(this,arguments):-l,typeof s=="function"?-s.apply(this,arguments):-s),v,d)},p,f)};function N(e,l){return l=Math.max(i[0],Math.min(i[1],l)),l===e.k?e:new xt(l,e.x,e.y)}function w(e,l,s){var p=l[0]-s[0]*e.k,f=l[1]-s[1]*e.k;return p===e.x&&f===e.y?e:new xt(e.k,p,f)}function X(e){return[(+e[0][0]+ +e[1][0])/2,(+e[0][1]+ +e[1][1])/2]}function D(e,l,s,p){e.on("start.zoom",function(){I(this,arguments).event(p).start()}).on("interrupt.zoom end.zoom",function(){I(this,arguments).event(p).end()}).tween("zoom",function(){var f=this,v=arguments,y=I(f,v).event(p),k=n.apply(f,v),V=s==null?X(k):typeof s=="function"?s.apply(f,v):s,R=Math.max(k[1][0]-k[0][0],k[1][1]-k[0][1]),E=f.__zoom,Y=typeof l=="function"?l.apply(f,v):l,$=h(E.invert(V).concat(R/E.k),Y.invert(V).concat(R/Y.k));return function(L){if(L===1)L=Y;else{var j=$(L),lt=R/j[2];L=new xt(lt,V[0]-j[0]*lt,V[1]-j[1]*lt)}y.zoom(null,L)}})}function I(e,l,s){return!s&&e.__zooming||new A(e,l)}function A(e,l){this.that=e,this.args=l,this.active=0,this.sourceEvent=null,this.extent=n.apply(e,l),this.taps=0}A.prototype={event:function(e){return e&&(this.sourceEvent=e),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(e,l){return this.mouse&&e!=="mouse"&&(this.mouse[1]=l.invert(this.mouse[0])),this.touch0&&e!=="touch"&&(this.touch0[1]=l.invert(this.touch0[0])),this.touch1&&e!=="touch"&&(this.touch1[1]=l.invert(this.touch1[0])),this.that.__zoom=l,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(e){var l=H(this.that).datum();u.call(e,this.that,new re(e,{sourceEvent:this.sourceEvent,target:_,type:e,transform:this.that.__zoom,dispatch:u}),l)}};function tt(e,...l){if(!t.apply(this,arguments))return;var s=I(this,l).event(e),p=this.__zoom,f=Math.max(i[0],Math.min(i[1],p.k*Math.pow(2,a.apply(this,arguments)))),v=Q(e);if(s.wheel)(s.mouse[0][0]!==v[0]||s.mouse[0][1]!==v[1])&&(s.mouse[1]=p.invert(s.mouse[0]=v)),clearTimeout(s.wheel);else{if(p.k===f)return;s.mouse=[v,p.invert(v)],vt(this),s.start()}ht(e),s.wheel=setTimeout(y,C),s.zoom("mouse",o(w(N(p,f),s.mouse[0],s.mouse[1]),s.extent,d));function y(){s.wheel=null,s.end()}}function et(e,...l){if(x||!t.apply(this,arguments))return;var s=e.currentTarget,p=I(this,l,!0).event(e),f=H(e.view).on("mousemove.zoom",V,!0).on("mouseup.zoom",R,!0),v=Q(e,s),y=e.clientX,k=e.clientY;ee(e.view),yt(e),p.mouse=[v,this.__zoom.invert(v)],vt(this),p.start();function V(E){if(ht(E),!p.moved){var Y=E.clientX-y,$=E.clientY-k;p.moved=Y*Y+$*$>P}p.event(E).zoom("mouse",o(w(p.that.__zoom,p.mouse[0]=Q(E,s),p.mouse[1]),p.extent,d))}function R(E){f.on("mousemove.zoom mouseup.zoom",null),ne(E.view,p.moved),ht(E),p.event(E).end()}}function F(e,...l){if(t.apply(this,arguments)){var s=this.__zoom,p=Q(e.changedTouches?e.changedTouches[0]:e,this),f=s.invert(p),v=s.k*(e.shiftKey?.5:2),y=o(w(N(s,v),p,f),n.apply(this,l),d);ht(e),m>0?H(this).transition().duration(m).call(D,y,p,e):H(this).call(_.transform,y,p,e)}}function rt(e,...l){if(t.apply(this,arguments)){var s=e.touches,p=s.length,f=I(this,l,e.changedTouches.length===p).event(e),v,y,k,V;for(yt(e),y=0;y<p;++y)k=s[y],V=Q(k,this),V=[V,this.__zoom.invert(V),k.identifier],f.touch0?!f.touch1&&f.touch0[2]!==V[2]&&(f.touch1=V,f.taps=0):(f.touch0=V,v=!0,f.taps=1+!!g);g&&(g=clearTimeout(g)),v&&(f.taps<2&&(z=V[0],g=setTimeout(function(){g=null},T)),vt(this),f.start())}}function nt(e,...l){if(this.__zooming){var s=I(this,l).event(e),p=e.changedTouches,f=p.length,v,y,k,V;for(ht(e),v=0;v<f;++v)y=p[v],k=Q(y,this),s.touch0&&s.touch0[2]===y.identifier?s.touch0[0]=k:s.touch1&&s.touch1[2]===y.identifier&&(s.touch1[0]=k);if(y=s.that.__zoom,s.touch1){var R=s.touch0[0],E=s.touch0[1],Y=s.touch1[0],$=s.touch1[1],L=(L=Y[0]-R[0])*L+(L=Y[1]-R[1])*L,j=(j=$[0]-E[0])*j+(j=$[1]-E[1])*j;y=N(y,Math.sqrt(L/j)),k=[(R[0]+Y[0])/2,(R[1]+Y[1])/2],V=[(E[0]+$[0])/2,(E[1]+$[1])/2]}else if(s.touch0)k=s.touch0[0],V=s.touch0[1];else return;s.zoom("touch",o(w(y,k,V),s.extent,d))}}function ot(e,...l){if(this.__zooming){var s=I(this,l).event(e),p=e.changedTouches,f=p.length,v,y;for(yt(e),x&&clearTimeout(x),x=setTimeout(function(){x=null},T),v=0;v<f;++v)y=p[v],s.touch0&&s.touch0[2]===y.identifier?delete s.touch0:s.touch1&&s.touch1[2]===y.identifier&&delete s.touch1;if(s.touch1&&!s.touch0&&(s.touch0=s.touch1,delete s.touch1),s.touch0)s.touch0[1]=this.__zoom.invert(s.touch0[0]);else if(s.end(),s.taps===2&&(y=Q(y,this),Math.hypot(z[0]-y[0],z[1]-y[1])<B)){var k=H(this).on("dblclick.zoom");k&&k.apply(this,arguments)}}}return _.wheelDelta=function(e){return arguments.length?(a=typeof e=="function"?e:mt(+e),_):a},_.filter=function(e){return arguments.length?(t=typeof e=="function"?e:mt(!!e),_):t},_.touchable=function(e){return arguments.length?(r=typeof e=="function"?e:mt(!!e),_):r},_.extent=function(e){return arguments.length?(n=typeof e=="function"?e:mt([[+e[0][0],+e[0][1]],[+e[1][0],+e[1][1]]]),_):n},_.scaleExtent=function(e){return arguments.length?(i[0]=+e[0],i[1]=+e[1],_):[i[0],i[1]]},_.translateExtent=function(e){return arguments.length?(d[0][0]=+e[0][0],d[1][0]=+e[1][0],d[0][1]=+e[0][1],d[1][1]=+e[1][1],_):[[d[0][0],d[0][1]],[d[1][0],d[1][1]]]},_.constrain=function(e){return arguments.length?(o=e,_):o},_.duration=function(e){return arguments.length?(m=+e,_):m},_.interpolate=function(e){return arguments.length?(h=e,_):h},_.on=function(){var e=u.on.apply(u,arguments);return e===u?_:e},_.clickDistance=function(e){return arguments.length?(P=(e=+e)*e,_):Math.sqrt(P)},_.tapDistance=function(e){return arguments.length?(B=+e,_):B},_}const me={__name:"Select",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(t){const n=Lt(t,"modelValue");return(o,a)=>Rt((J(),it("select",{"onUpdate:modelValue":a[1]||(a[1]=r=>n.value=r),class:"mt-3 rounded-sm bg-primary text-background w-full font-bold outline-none select-none"},[$t(o.$slots,"default",{onChange:a[0]||(a[0]=r=>o.$emit("update:modelValue"))})],512)),[[Kt,n.value]])}};function O(t,n){const o=t.x-n.x,a=t.z-n.z,r=Math.abs(o),i=Math.abs(a);let d,m;const h=a>=0?-1:1,u=o>=0?-1:1;return r>=i?(d=t.x+u*i,m=t.z+h*i):(d=t.x+u*r,m=t.z+h*r),{x:d,z:m}}const U=(t,n)=>Math.max(Math.abs(t.x-n.x),Math.abs(t.z-n.z));function pe(t){let n=0,o=0;return t.bolts.forEach(a=>{o+=a.length,a.directed===!1&&(n+=a.length)}),n+=o,[n,o]}function ge(t){const n=t.stations,o=t.bolts,a=n.length,r=Number.POSITIVE_INFINITY,i=Array.from({length:a},()=>Array(a).fill(r));for(let h=0;h<a;h++)i[h][h]=0;for(const h of o){const u=n.find(z=>z.name===h.station_a.name),g=n.find(z=>z.name===h.station_b.name);if(u&&g){const z=n.indexOf(u),x=n.indexOf(g);i[z][x]=h.length,i[x][z]=h.length}}for(let h=0;h<a;h++)for(let u=0;u<a;u++)for(let g=0;g<a;g++)i[u][h]!==r&&i[h][g]!==r&&(i[u][g]=Math.min(i[u][g],i[u][h]+i[h][g]));let d=0,m=0;for(let h=0;h<a;h++)for(let u=0;u<a;u++)h!==u&&i[h][u]!==r&&(d+=i[h][u],m++);return _e(i,n),d/m/20}function _e(t,n){const o=[];for(let r=0;r<n.length;r++){const d={station_name:n[r].name,values:[]};for(let m=0;m<n.length;m++)d.values.push(t[r][m]);o.push(d)}const a=JSON.stringify(o);localStorage.setItem("distance-matrix",a)}function Bt(t,n,o,a,r){t.bolts=[];const i=t.stations,d=i.length;let m=0,h=0;if(o==="track"&&a!==void 0&&r!==void 0)m=a,h=r;else if(o==="median"){const g=i.map(x=>x.x),z=i.map(x=>x.z);m=Math.round(Et(g)),h=Math.round(Et(z))}else if(o==="average"){const g=i.reduce((x,T)=>x+T.x,0),z=i.reduce((x,T)=>x+T.z,0);m=Math.round(g/d),h=Math.round(z/d)}else o==="spawn"&&(m=-80,h=-176);const u={name:"Mergeing point",description:"",colour:"",x:m,z:h};for(let g=0;g<d;++g){const z=i[g];let x;const T=Math.abs(z.x-u.x)/Math.abs(z.z-u.z);n==8&&T>.57735&&T<1.7321?x=O(u,z):x=O(z,u),t.bolts.push({directed:!1,station_a:z,turn:x,station_b:u,length:U(z,u),colour:"#8f7f10"})}return t}function Et(t){if(t.length===0)throw new Error("Input array is empty");t=[...t].sort((o,a)=>o-a);const n=Math.floor(t.length/2);return t.length%2?t[n]:(t[n-1]+t[n])/2}function Ct(t){t.bolts=[];const n=t.stations,o=n.length;for(let a=0;a<o;++a)for(let r=a+1;r<o;++r){const i=n[a],d=n[r];t.bolts.push({directed:!1,station_a:i,turn:O(i,d),station_b:d,length:U(i,d),colour:"#8f7f10"})}return t}function xe(t){t.bolts=[];const n=t.stations,o=n.length;let a={stations:[],bolts:[]},r=1/0;for(let i=0;i<o;++i){let d=function(x){let T=1/0,C=null;for(let P=0;P<o;++P)if(!m[P]){const B=n[P],_=U(x,B);_<T&&(T=_,C=B)}return C};const m=new Array(o).fill(!1);let h=n[i];m[i]=!0;const u=[];let g;for(;(g=d(h))!==null;)u.push({directed:!1,station_a:h,turn:O(h,g),station_b:g,length:U(h,g),colour:"#8f7f10"}),m[n.indexOf(g)]=!0,h=g;u.push({directed:!1,station_a:h,turn:O(h,n[i]),station_b:n[i],length:U(h,n[i]),colour:"#8f7f10"});const z=u.reduce((x,T)=>x+T.length,0);z<r&&(a={stations:n.slice(),bolts:u.slice()},r=z)}return a}function ve(t){t.bolts=[];const n=t.stations,o=n.length;let a={stations:[],bolts:[]},r=1/0;for(let i=0;i<o;++i){let d=function(x){let T=1/0,C=null;for(let P=0;P<o;++P)if(!m[P]){const B=n[P],_=U(x,B);_<T&&(T=_,C=B)}return C};const m=new Array(o).fill(!1);let h=n[i];m[i]=!0;const u=[];let g;for(;(g=d(h))!==null;)u.push({directed:!1,station_a:h,turn:O(h,g),station_b:g,length:U(h,g),colour:"#8f7f10"}),m[n.indexOf(g)]=!0,h=g;const z=u.reduce((x,T)=>x+T.length,0);z<r&&(a={stations:n.slice(),bolts:u.slice()},r=z)}return a}q("scatter-plot",{});function ye(t){const n=t.stations,o=n.length,a=new Array(o).fill(!1),r=new Array(o).fill(-1),i=new Array(o).fill(1/0);i[0]=0;for(let m=0;m<o-1;++m){const h=be(i,a);a[h]=!0;for(let u=0;u<o;++u){const g=U(n[h],n[u]);g!==0&&!a[u]&&g<i[u]&&(r[u]=h,i[u]=g)}}const d=[];for(let m=1;m<o;++m)d.push({directed:!1,station_a:{name:n[r[m]].name,x:n[r[m]].x,z:n[r[m]].z},turn:O(n[r[m]],n[m]),station_b:{name:n[m].name,x:n[m].x,z:n[m].z},length:U(n[r[m]],n[m]),colour:"#8f7f10"});return{stations:n.slice(),bolts:d}}function be(t,n){let o=1/0,a=-1;for(let r=0;r<t.length;r++)!n[r]&&t[r]<o&&(o=t[r],a=r);return a}class ze{constructor(n){St(this,"parent");this.parent=Array(n).fill(-1)}find(n){let o=n;for(;this.parent[o]!==-1;)o=this.parent[o];let a=n;for(;a!==o;){const r=this.parent[a];if(r===a)break;this.parent[a]=o,a=r}return o}union(n,o){const a=this.find(n),r=this.find(o);a!==r&&(this.parent[a]=r)}}function we(t){const n=t.stations,o=t.bolts;o.sort((i,d)=>i.length-d.length);const a=new ze(n.length),r=[];return o.forEach(i=>{const d=n.findIndex(g=>g.name===i.station_a.name),m=n.findIndex(g=>g.name===i.station_b.name),h=a.find(d),u=a.find(m);h!==u&&(r.push(i),a.union(h,u))}),t.bolts=r,t}const Me={class:"fixed top-0 right-0 w-48 backdrop-blur p-5"},ke=b("p",{class:"text-center text-accent"},[b("a",{href:"https://github.com/KK-mp4/Bolt-Routing-Problem-V2",target:"_blank",rel:"noopener noreferrer",title:"GitHub"}," Piston Bolt Network Builder "),b("span",{class:"text-[10px] text-text"},"*early alpha build by kk")],-1),Se=b("option",{value:"None"},"None",-1),Te=b("option",{value:"Star graph"},"Star graph (WIP)",-1),Ie=b("option",{value:"Complete graph"},"Complete graph",-1),Pe=b("option",{value:"Nearest neighbor"},"Nearest neighbor (WIP)",-1),Ve=b("option",{value:"Hamiltonian cycle"},"Hamiltonian cycle (WIP)",-1),Be=b("option",{value:"Prim's algorithm"},"Prim's algorithm (WIP)",-1),Ee=b("option",{value:"Kruskal's algorithm"},"Kruskal's algorithm (WIP)",-1),Ce={key:0},De=b("option",{value:"4"},[W("S"),b("sub",null,"4")],-1),Ae=b("option",{value:"8"},[W("S"),b("sub",null,"8")],-1),Ne=b("option",{value:"median"},"Median",-1),Xe=b("option",{value:"average"},"Average",-1),Ye=b("option",{value:""},"0, 0",-1),Ge=b("option",{value:"spawn"},"Spawn",-1),Le=b("option",{value:"track"},"Track mouse",-1),Re={class:"fixed top-0 left-0 backdrop-blur p-5 pb-1"},Ke={class:"text-xs"},$e=b("br",null,null,-1),je={key:0,class:"text-accent"},He={key:1,class:"text-accent"},Ue={class:"text-xs mt-1"},Fe=b("br",null,null,-1),We={class:"text-accent"},Oe={class:"text-xs mt-1"},qe=b("br",null,null,-1),Ze={class:"text-accent"},Qe={key:0,class:"text-xs mt-1 mb-2"},Je=b("br",null,null,-1),tn={class:"text-accent"},en=b("br",null,null,-1),nn=b("br",null,null,-1),on={class:"fixed bottom-0 left-0 text-sm select-none"},an=b("div",{class:"fixed bottom-0 right-0 text-[10px] select-none"},[b("p",null,"pan: drag mouse1 / zoom: scroll mouse3 / connect: drag mouse3")],-1),sn=b("div",{id:"network_map",class:"p-0 h-full w-full"},null,-1),dn=jt({__name:"index",setup(t){qt({title:"Bolt Routing Problem V2"});const n=dt(""),o=q("piston-bolt-network",{});let a={},r=[],i=!1;const d=dt(0),m=dt(0),h=dt(0),u=q("graph-type",""),g=q("star-graph-s",8),z=q("star-graph-merge-pos","median");let x=wt;const T=q("show-labels",!1);q("colour-graph",!1);const C=q("calculate-stats",!0);Ht(async()=>{if(window.addEventListener("resize",P),!o.value.stations){const w=await(await fetch("/data/network.json")).json();o.value=w}B()});function P(){let N=document.getElementById("network_map");N!==null&&(N.innerHTML="");const w={top:-1,right:0,bottom:50,left:75},X=window.innerWidth,D=window.innerHeight,I=X-w.right-w.left,A=D-w.top-w.bottom,tt=Tt(o.value.stations,c=>Math.abs(c.x)),et=Tt(o.value.stations,c=>Math.abs(c.z)),F=Math.max(tt,et)*1.01,rt=I/A;let nt,ot;rt>1?(nt=F*rt,ot=F):(nt=F,ot=F/rt);const e=It().domain([-ot,ot]).range([w.top,A]),l=It().domain([-nt,nt]).range([w.right,I]),s=Qt(e),p=Jt(l),f=H("#network_map").append("svg").attr("width",X).attr("height",D);f.append("g").attr("id","y_axis").attr("transform","translate(75, 0)").call(s).style("font-family","Fira Code").style("font-size","10px"),f.append("g").attr("id","x_axis").attr("transform",`translate(${w.left}, ${D-w.bottom-w.top})`).call(p).style("font-family","Fira Code").style("font-size","10px");const v=Math.round(Math.min(I,A)/64),y=Math.round(Math.min(I,A)/64*(A/I));f.select("#x_axis").call(p.scale(l).ticks(v).tickSize(-A)),f.select("#y_axis").call(s.scale(e).ticks(y).tickSize(-I)),f.selectAll(".tick line").style("stroke","#422B25");const k=f.append("g").attr("id","edges_a").attr("transform","translate(75, 0)").selectAll("line").data(o.value.bolts).enter().append("line").attr("x1",c=>l(c.station_a.x)).attr("y1",c=>e(c.station_a.z)).attr("x2",c=>l(c.turn.x)).attr("y2",c=>e(c.turn.z)).style("stroke",c=>c.colour).style("stroke-width",1),V=f.append("g").attr("id","edges_b").attr("transform","translate(75, 0)").selectAll("line").data(o.value.bolts).enter().append("line").attr("x1",c=>l(c.turn.x)).attr("y1",c=>e(c.turn.z)).attr("x2",c=>l(c.station_b.x)).attr("y2",c=>e(c.station_b.z)).style("stroke",c=>c.colour).style("stroke-width",1),R=f.append("g").attr("id","vertices").attr("transform","translate(75, 0)").selectAll("circle").data(o.value.stations).enter().append("circle").attr("r",4).attr("cx",c=>l(c.x)).attr("cy",c=>e(c.z)).style("fill",c=>c.colour).on("click",(c,M)=>L(M)).on("mousedown",(c,M)=>{c.button===1&&j(c,M)}).on("mouseup",(c,M)=>{c.button===1&&lt(c,M)}),E=f.append("g").attr("id","lables").style("font-family","Fira Code").style("fill","#fbdfd8").style("font-size","10px").selectAll("text").data(o.value.stations).join("text").attr("dy","0.35em").attr("x",c=>l(c.x)).attr("y",c=>e(c.z)-14).text(c=>c.name).style("visibility",T.value?"visible":"hidden"),Y=de().on("zoom",$);f.call(Y),x!==void 0&&f.call(Y.transform,x),f.on("mousemove",c=>{if(u.value==="Star graph"&&z.value==="track"){const M=f.node(),G=M.createSVGPoint();G.x=c.offsetX,G.y=c.offsetY;const S=M.getScreenCTM(),at=G.matrixTransform(S.inverse()),pt=at.x-w.left,ft=at.y-w.top;o.value=Bt(o.value,g.value,z.value,Math.round(l.invert(pt)),Math.round(e.invert(ft))),P(),_()}i&&a.name!==void 0&&(r=[c.offsetX,c.offsetY],Dt(f,a,r))}),f.on("mousedown",c=>{c.button===1&&(i=!0)}),f.on("mouseup",c=>{c.button===1&&(i=!1,f.select("#temp-line").remove())});function $({transform:c}){x=c,H("#y_axis").transition().duration(50).call(s.scale(c.rescaleY(e))),H("#x_axis").transition().duration(50).call(p.scale(c.rescaleX(l)));const M=c.rescaleX(l),G=c.rescaleY(e);f.select("#x_axis").call(p.scale(M).ticks(v).tickSize(-A)),f.select("#y_axis").call(s.scale(G).ticks(y).tickSize(-I)),f.selectAll(".tick line").style("stroke","#422B25"),R.data(o.value.stations).attr("cx",S=>M(S.x)).attr("cy",S=>G(S.z)),E.data(o.value.stations).attr("x",S=>M(S.x)).attr("y",S=>G(S.z)-14),k.data(o.value.bolts).attr("x1",S=>M(S.station_a.x)).attr("y1",S=>G(S.station_a.z)).attr("x2",S=>M(S.turn.x)).attr("y2",S=>G(S.turn.z)),V.data(o.value.bolts).attr("x1",S=>M(S.turn.x)).attr("y1",S=>G(S.turn.z)).attr("x2",S=>M(S.station_b.x)).attr("y2",S=>G(S.station_b.z)),a.name}function L(c){n.value=c.name+" { X: "+c.x+" , Z: "+c.z+" }"}function j(c,M){a={name:M.name,description:"",colour:"",x:M.x,z:M.z},n.value="Draw bolt from "+a.name}function lt(c,M){!a.name||M.name===a.name||(o.value.bolts.push({directed:!1,station_a:a,turn:O(a,M),station_b:M,length:U(a,M),colour:"#8f7f10"}),P(),_(),n.value+=" to "+M.name)}function Dt(c,M,G){c.select("#temp-line").remove();const S=c.node(),at=S.createSVGPoint();at.x=G[0]+1,at.y=G[1];const pt=S.getScreenCTM(),ft=at.matrixTransform(pt.inverse()),At=ft.x-w.left,Nt=ft.y-w.top,Mt={name:"",colour:"",description:"",x:l.invert(At),z:e.invert(Nt)},kt=O(M,Mt),Xt=[{start:M,end:kt},{start:kt,end:Mt}];c.append("g").attr("id","temp-line").attr("transform",`translate(${w.left}, ${w.top})`).selectAll("line").data(Xt).enter().append("line").attr("x1",Z=>l(Z.start.x)).attr("y1",Z=>e(Z.start.z)).attr("x2",Z=>l(Z.end.x)).attr("y2",Z=>e(Z.end.z)).style("stroke","gray").style("stroke-width",2).style("stroke-dasharray","5 5")}}function B(){const N=Date.now();switch(u.value){case"None":{o.value.bolts=[];break}case"Star graph":{o.value=Bt(o.value,g.value,z.value);break}case"Complete graph":{o.value=Ct(o.value);break}case"Nearest neighbor":{o.value=ve(o.value);break}case"Hamiltonian cycle":{o.value=xe(o.value);break}case"Prim's algorithm":{o.value=ye(o.value);break}case"Kruskal's algorithm":{o.value=we(Ct(o.value));break}}n.value="Processing time: "+(Date.now()-N)+"ms",P(),_()}function _(){[d.value,m.value]=pe(o.value),C.value&&(h.value=ge(o.value))}return Ut(()=>{window.removeEventListener("resize",P)}),(N,w)=>{const X=me,D=Ot;return J(),it(Wt,null,[b("div",Me,[ke,ut(X,{modelValue:K(u),"onUpdate:modelValue":w[0]||(w[0]=I=>gt(u)?u.value=I:null),onChange:B},{default:st(()=>[Se,Te,Ie,Pe,Ve,Be,Ee]),_:1},8,["modelValue"]),K(u)==="Star graph"?(J(),it("div",Ce,[ut(X,{modelValue:K(g),"onUpdate:modelValue":w[1]||(w[1]=I=>gt(g)?g.value=I:null),onChange:B},{default:st(()=>[De,Ae]),_:1},8,["modelValue"]),ut(X,{modelValue:K(z),"onUpdate:modelValue":w[2]||(w[2]=I=>gt(z)?z.value=I:null),onChange:B},{default:st(()=>[Ne,Xe,Ye,Ge,Le]),_:1},8,["modelValue"])])):_t("",!0)]),b("div",Re,[b("p",Ke,[W("Stations:"),$e,K(o).stations?(J(),it("span",je,ct(K(o).stations.length),1)):(J(),it("span",He,"0"))]),b("p",Ue,[W("Bolt length:"),Fe,b("span",We,ct(K(d))+" blocks",1)]),b("p",Oe,[W("Tunnel length:"),qe,b("span",Ze,ct(K(m))+" blocks",1)]),K(C)?(J(),it("p",Qe,[W("Average travel time:"),Je,b("span",tn,ct(Math.round(K(h)*100)/100)+" s",1)])):_t("",!0),ut(D,{to:"/settings",title:"Setting page",class:"text-xs"},{default:st(()=>[W("Settings ->"),en]),_:1}),K(C)?(J(),Ft(D,{key:1,to:"/heatmap",title:"Distance matrix heatmap",class:"text-xs"},{default:st(()=>[W("Heatmap ->"),nn]),_:1})):_t("",!0),ut(D,{to:"/scatterplot",title:"Scatter plot",class:"text-xs"},{default:st(()=>[W("Scatter plot ->")]),_:1})]),b("p",on,ct(K(n)),1),an,sn],64)}}});export{dn as default};