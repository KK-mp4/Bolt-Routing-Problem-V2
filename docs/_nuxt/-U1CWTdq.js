var Rt=Object.defineProperty;var Ut=(t,e,n)=>e in t?Rt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var St=(t,e,n)=>(Ut(t,typeof e!="symbol"?e+"":e,n),n);import{i as Kt,j as Ht,v as jt,o as tt,c as it,k as Ft,f as Wt,r as dt,g as Ot,h as qt,a as z,b as ct,w as st,u as K,l as xt,m as _t,d as O,t as ut,n as Zt,F as Qt}from"./CVDJT5Lo.js";import{_ as Jt}from"./D9lgkxCG.js";import{a as Z,u as te}from"./cIAnyDvI.js";import{s as F,d as ee,c as Mt,T as vt,e as yt,m as Tt,l as It,b as ne,a as oe}from"./B7PevS6S.js";import"./CD-QyIQ1.js";function ae(t){let e;for(;e=t.sourceEvent;)t=e;return t}function J(t,e){if(t=ae(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var s=n.createSVGPoint();return s.x=t.clientX,s.y=t.clientY,s=s.matrixTransform(e.getScreenCTM().inverse()),[s.x,s.y]}if(e.getBoundingClientRect){var i=e.getBoundingClientRect();return[t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop]}}return[t.pageX,t.pageY]}const zt={capture:!0,passive:!1};function wt(t){t.preventDefault(),t.stopImmediatePropagation()}function se(t){var e=t.document.documentElement,n=F(t).on("dragstart.drag",wt,zt);"onselectstart"in e?n.on("selectstart.drag",wt,zt):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function ie(t,e){var n=t.document.documentElement,s=F(t).on("dragstart.drag",null);e&&(s.on("click.drag",wt,zt),setTimeout(function(){s.on("click.drag",null)},0)),"onselectstart"in n?s.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}var re=1e-12;function Bt(t){return((t=Math.exp(t))+1/t)/2}function le(t){return((t=Math.exp(t))-1/t)/2}function ce(t){return((t=Math.exp(2*t))-1)/(t+1)}const ue=function t(e,n,s){function i(r,h){var d=r[0],c=r[1],l=r[2],p=h[0],b=h[1],v=h[2],w=p-d,A=b-c,C=w*w+A*A,B,x;if(C<re)x=Math.log(v/l)/e,B=function(Y){return[d+Y*w,c+Y*A,l*Math.exp(e*Y*x)]};else{var N=Math.sqrt(C),L=(v*v-l*l+s*C)/(2*l*n*N),G=(v*v-l*l-s*C)/(2*v*n*N),M=Math.log(Math.sqrt(L*L+1)-L),V=Math.log(Math.sqrt(G*G+1)-G);x=(V-M)/e,B=function(Y){var E=Y*x,R=Bt(M),et=l/(n*N)*(R*ce(e*E+M)-le(M));return[d+et*w,c+et*A,l*R/Bt(e*E+M)]}}return B.duration=x*1e3*e/Math.SQRT2,B}return i.rho=function(r){var h=Math.max(.001,+r),d=h*h,c=d*d;return t(h,d,c)},i}(Math.SQRT2,2,4),mt=t=>()=>t;function he(t,{sourceEvent:e,target:n,transform:s,dispatch:i}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:s,enumerable:!0,configurable:!0},_:{value:i}})}function bt(t){t.stopImmediatePropagation()}function ht(t){t.preventDefault(),t.stopImmediatePropagation()}function fe(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function de(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function Pt(){return this.__zoom||Mt}function me(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function pe(){return navigator.maxTouchPoints||"ontouchstart"in this}function ge(t,e,n){var s=t.invertX(e[0][0])-n[0][0],i=t.invertX(e[1][0])-n[1][0],r=t.invertY(e[0][1])-n[0][1],h=t.invertY(e[1][1])-n[1][1];return t.translate(i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i),h>r?(r+h)/2:Math.min(0,r)||Math.max(0,h))}function xe(){var t=fe,e=de,n=ge,s=me,i=pe,r=[0,1/0],h=[[-1/0,-1/0],[1/0,1/0]],d=250,c=ue,l=ee("start","zoom","end"),p,b,v,w=500,A=150,C=0,B=10;function x(o){o.property("__zoom",Pt).on("wheel.zoom",E,{passive:!1}).on("mousedown.zoom",R).on("dblclick.zoom",et).filter(i).on("touchstart.zoom",pt).on("touchmove.zoom",nt).on("touchend.zoom touchcancel.zoom",rt).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}x.transform=function(o,m,a,u){var _=o.selection?o.selection():o;_.property("__zoom",Pt),o!==_?M(o,m,a,u):_.interrupt().each(function(){V(this,arguments).event(u).start().zoom(null,typeof m=="function"?m.apply(this,arguments):m).end()})},x.scaleBy=function(o,m,a,u){x.scaleTo(o,function(){var _=this.__zoom.k,y=typeof m=="function"?m.apply(this,arguments):m;return _*y},a,u)},x.scaleTo=function(o,m,a,u){x.transform(o,function(){var _=e.apply(this,arguments),y=this.__zoom,g=a==null?G(_):typeof a=="function"?a.apply(this,arguments):a,T=y.invert(g),I=typeof m=="function"?m.apply(this,arguments):m;return n(L(N(y,I),g,T),_,h)},a,u)},x.translateBy=function(o,m,a,u){x.transform(o,function(){return n(this.__zoom.translate(typeof m=="function"?m.apply(this,arguments):m,typeof a=="function"?a.apply(this,arguments):a),e.apply(this,arguments),h)},null,u)},x.translateTo=function(o,m,a,u,_){x.transform(o,function(){var y=e.apply(this,arguments),g=this.__zoom,T=u==null?G(y):typeof u=="function"?u.apply(this,arguments):u;return n(Mt.translate(T[0],T[1]).scale(g.k).translate(typeof m=="function"?-m.apply(this,arguments):-m,typeof a=="function"?-a.apply(this,arguments):-a),y,h)},u,_)};function N(o,m){return m=Math.max(r[0],Math.min(r[1],m)),m===o.k?o:new vt(m,o.x,o.y)}function L(o,m,a){var u=m[0]-a[0]*o.k,_=m[1]-a[1]*o.k;return u===o.x&&_===o.y?o:new vt(o.k,u,_)}function G(o){return[(+o[0][0]+ +o[1][0])/2,(+o[0][1]+ +o[1][1])/2]}function M(o,m,a,u){o.on("start.zoom",function(){V(this,arguments).event(u).start()}).on("interrupt.zoom end.zoom",function(){V(this,arguments).event(u).end()}).tween("zoom",function(){var _=this,y=arguments,g=V(_,y).event(u),T=e.apply(_,y),I=a==null?G(T):typeof a=="function"?a.apply(_,y):a,U=Math.max(T[1][0]-T[0][0],T[1][1]-T[0][1]),P=_.__zoom,$=typeof m=="function"?m.apply(_,y):m,H=c(P.invert(I).concat(U/P.k),$.invert(I).concat(U/$.k));return function(X){if(X===1)X=$;else{var j=H(X),lt=U/j[2];X=new vt(lt,I[0]-j[0]*lt,I[1]-j[1]*lt)}g.zoom(null,X)}})}function V(o,m,a){return!a&&o.__zooming||new Y(o,m)}function Y(o,m){this.that=o,this.args=m,this.active=0,this.sourceEvent=null,this.extent=e.apply(o,m),this.taps=0}Y.prototype={event:function(o){return o&&(this.sourceEvent=o),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(o,m){return this.mouse&&o!=="mouse"&&(this.mouse[1]=m.invert(this.mouse[0])),this.touch0&&o!=="touch"&&(this.touch0[1]=m.invert(this.touch0[0])),this.touch1&&o!=="touch"&&(this.touch1[1]=m.invert(this.touch1[0])),this.that.__zoom=m,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(o){var m=F(this.that).datum();l.call(o,this.that,new he(o,{sourceEvent:this.sourceEvent,target:x,type:o,transform:this.that.__zoom,dispatch:l}),m)}};function E(o,...m){if(!t.apply(this,arguments))return;var a=V(this,m).event(o),u=this.__zoom,_=Math.max(r[0],Math.min(r[1],u.k*Math.pow(2,s.apply(this,arguments)))),y=J(o);if(a.wheel)(a.mouse[0][0]!==y[0]||a.mouse[0][1]!==y[1])&&(a.mouse[1]=u.invert(a.mouse[0]=y)),clearTimeout(a.wheel);else{if(u.k===_)return;a.mouse=[y,u.invert(y)],yt(this),a.start()}ht(o),a.wheel=setTimeout(g,A),a.zoom("mouse",n(L(N(u,_),a.mouse[0],a.mouse[1]),a.extent,h));function g(){a.wheel=null,a.end()}}function R(o,...m){if(v||!t.apply(this,arguments))return;var a=o.currentTarget,u=V(this,m,!0).event(o),_=F(o.view).on("mousemove.zoom",I,!0).on("mouseup.zoom",U,!0),y=J(o,a),g=o.clientX,T=o.clientY;se(o.view),bt(o),u.mouse=[y,this.__zoom.invert(y)],yt(this),u.start();function I(P){if(ht(P),!u.moved){var $=P.clientX-g,H=P.clientY-T;u.moved=$*$+H*H>C}u.event(P).zoom("mouse",n(L(u.that.__zoom,u.mouse[0]=J(P,a),u.mouse[1]),u.extent,h))}function U(P){_.on("mousemove.zoom mouseup.zoom",null),ie(P.view,u.moved),ht(P),u.event(P).end()}}function et(o,...m){if(t.apply(this,arguments)){var a=this.__zoom,u=J(o.changedTouches?o.changedTouches[0]:o,this),_=a.invert(u),y=a.k*(o.shiftKey?.5:2),g=n(L(N(a,y),u,_),e.apply(this,m),h);ht(o),d>0?F(this).transition().duration(d).call(M,g,u,o):F(this).call(x.transform,g,u,o)}}function pt(o,...m){if(t.apply(this,arguments)){var a=o.touches,u=a.length,_=V(this,m,o.changedTouches.length===u).event(o),y,g,T,I;for(bt(o),g=0;g<u;++g)T=a[g],I=J(T,this),I=[I,this.__zoom.invert(I),T.identifier],_.touch0?!_.touch1&&_.touch0[2]!==I[2]&&(_.touch1=I,_.taps=0):(_.touch0=I,y=!0,_.taps=1+!!p);p&&(p=clearTimeout(p)),y&&(_.taps<2&&(b=I[0],p=setTimeout(function(){p=null},w)),yt(this),_.start())}}function nt(o,...m){if(this.__zooming){var a=V(this,m).event(o),u=o.changedTouches,_=u.length,y,g,T,I;for(ht(o),y=0;y<_;++y)g=u[y],T=J(g,this),a.touch0&&a.touch0[2]===g.identifier?a.touch0[0]=T:a.touch1&&a.touch1[2]===g.identifier&&(a.touch1[0]=T);if(g=a.that.__zoom,a.touch1){var U=a.touch0[0],P=a.touch0[1],$=a.touch1[0],H=a.touch1[1],X=(X=$[0]-U[0])*X+(X=$[1]-U[1])*X,j=(j=H[0]-P[0])*j+(j=H[1]-P[1])*j;g=N(g,Math.sqrt(X/j)),T=[(U[0]+$[0])/2,(U[1]+$[1])/2],I=[(P[0]+H[0])/2,(P[1]+H[1])/2]}else if(a.touch0)T=a.touch0[0],I=a.touch0[1];else return;a.zoom("touch",n(L(g,T,I),a.extent,h))}}function rt(o,...m){if(this.__zooming){var a=V(this,m).event(o),u=o.changedTouches,_=u.length,y,g;for(bt(o),v&&clearTimeout(v),v=setTimeout(function(){v=null},w),y=0;y<_;++y)g=u[y],a.touch0&&a.touch0[2]===g.identifier?delete a.touch0:a.touch1&&a.touch1[2]===g.identifier&&delete a.touch1;if(a.touch1&&!a.touch0&&(a.touch0=a.touch1,delete a.touch1),a.touch0)a.touch0[1]=this.__zoom.invert(a.touch0[0]);else if(a.end(),a.taps===2&&(g=J(g,this),Math.hypot(b[0]-g[0],b[1]-g[1])<B)){var T=F(this).on("dblclick.zoom");T&&T.apply(this,arguments)}}}return x.wheelDelta=function(o){return arguments.length?(s=typeof o=="function"?o:mt(+o),x):s},x.filter=function(o){return arguments.length?(t=typeof o=="function"?o:mt(!!o),x):t},x.touchable=function(o){return arguments.length?(i=typeof o=="function"?o:mt(!!o),x):i},x.extent=function(o){return arguments.length?(e=typeof o=="function"?o:mt([[+o[0][0],+o[0][1]],[+o[1][0],+o[1][1]]]),x):e},x.scaleExtent=function(o){return arguments.length?(r[0]=+o[0],r[1]=+o[1],x):[r[0],r[1]]},x.translateExtent=function(o){return arguments.length?(h[0][0]=+o[0][0],h[1][0]=+o[1][0],h[0][1]=+o[0][1],h[1][1]=+o[1][1],x):[[h[0][0],h[0][1]],[h[1][0],h[1][1]]]},x.constrain=function(o){return arguments.length?(n=o,x):n},x.duration=function(o){return arguments.length?(d=+o,x):d},x.interpolate=function(o){return arguments.length?(c=o,x):c},x.on=function(){var o=l.on.apply(l,arguments);return o===l?x:o},x.clickDistance=function(o){return arguments.length?(C=(o=+o)*o,x):Math.sqrt(C)},x.tapDistance=function(o){return arguments.length?(B=+o,x):B},x}const _e={__name:"Select",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(t){const e=Kt(t,"modelValue");return(n,s)=>Ht((tt(),it("select",{"onUpdate:modelValue":s[1]||(s[1]=i=>e.value=i),class:"mt-3 rounded-sm bg-primary text-background w-full font-bold outline-none select-none"},[Ft(n.$slots,"default",{onChange:s[0]||(s[0]=i=>n.$emit("update:modelValue"))})],512)),[[jt,e.value]])}};function q(t,e){const n=t.x-e.x,s=t.z-e.z,i=Math.abs(n),r=Math.abs(s);let h,d;const c=s>=0?-1:1,l=n>=0?-1:1;return i>=r?(h=t.x+l*r,d=t.z+c*r):(h=t.x+l*i,d=t.z+c*i),{x:h,z:d}}function W(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.z-e.z))}function Ct(t,e,n,s,i){t.bolts=[];const r=t.stations,h=r.length;let d=0,c=0;if(n==="track"&&s!==void 0&&i!==void 0)d=s,c=i;else if(n==="median"){const p=r.map(v=>v.x),b=r.map(v=>v.z);d=Math.round(Vt(p)),c=Math.round(Vt(b))}else if(n==="average"){const p=r.reduce((v,w)=>v+w.x,0),b=r.reduce((v,w)=>v+w.z,0);d=Math.round(p/h),c=Math.round(b/h)}else n==="spawn"&&(d=-80,c=-176);const l={name:"Mergeing point",description:"",colour:"",x:d,z:c};for(let p=0;p<h;++p){const b=r[p];let v;const w=Math.abs(b.x-l.x)/Math.abs(b.z-l.z);e==8&&w>.57735&&w<1.7321?v=q(l,b):v=q(b,l),t.bolts.push({directed:!1,station_a:b,turn:v,station_b:l,length:W(b,l),colour:"#8f7f10"})}return t}function Vt(t){if(t.length===0)throw new Error("Input array is empty");t=[...t].sort((n,s)=>n-s);const e=Math.floor(t.length/2);return t.length%2?t[e]:(t[e-1]+t[e])/2}function Et(t){t.bolts=[];const e=t.stations,n=e.length;for(let s=0;s<n;++s)for(let i=s+1;i<n;++i){const r=e[s],h=e[i];t.bolts.push({directed:!1,station_a:r,turn:q(r,h),station_b:h,length:W(r,h),colour:"#8f7f10"})}return t}async function ve(t,e){t.bolts=[];const n=t.stations,s=n.length;let i={stations:[],bolts:[]},r=1/0;for(let h=0;h<s;++h){let d=function(w){let A=1/0,C=null;for(let B=0;B<s;++B)if(!c[B]){const x=n[B],N=W(w,x);N<A&&(A=N,C=x)}return C};const c=new Array(s).fill(!1);let l=n[h];c[h]=!0;const p=[];let b;for(;(b=d(l))!==null;)p.push({directed:!1,station_a:l,turn:q(l,b),station_b:b,length:W(l,b),colour:"#8f7f10"}),c[n.indexOf(b)]=!0,l=b;const v=p.reduce((w,A)=>w+A.length,0);v<r&&(i={stations:n.slice(),bolts:p.slice()},r=v,e(i),await new Promise(w=>setTimeout(w,0)))}}function ye(t){const e=t.stations,n=e.length;let s={stations:[],bolts:[]},i=1/0;for(let r=0;r<n;++r){let h=function(v){let w=1/0,A=null;for(let C=0;C<n;++C)if(!d[C]){const B=e[C],x=W(v,B);x<w&&(w=x,A=B)}return A};const d=new Array(n).fill(!1);let c=e[r];d[r]=!0;const l=[];let p;for(;(p=h(c))!==null;)l.push({directed:!0,station_a:c,turn:q(c,p),station_b:p,length:W(c,p),colour:"#8f7f10"}),d[e.indexOf(p)]=!0,c=p;l.push({directed:!0,station_a:c,turn:q(c,e[r]),station_b:e[r],length:W(c,e[r]),colour:"#8f7f10"});const b=l.reduce((v,w)=>v+w.length,0);b<i&&(s={stations:e.slice(),bolts:l.slice()},i=b)}return s}function be(t){let e=0,n=0;return t.bolts.forEach(s=>{n+=s.length,s.directed===!1&&(e+=s.length)}),e+=n,[e,n]}function ze(t){const e=t.stations,n=t.bolts,s=e.length,i=Number.POSITIVE_INFINITY,r=Array.from({length:s},()=>Array(s).fill(i));for(let c=0;c<s;++c)r[c][c]=0;for(const c of n){const l=e.find(b=>b.name===c.station_a.name),p=e.find(b=>b.name===c.station_b.name);if(l&&p){const b=e.indexOf(l),v=e.indexOf(p);r[b][v]=c.length,r[v][b]=c.length}}for(let c=0;c<s;++c)for(let l=0;l<s;++l)for(let p=0;p<s;++p)r[l][c]!==i&&r[c][p]!==i&&(r[l][p]=Math.min(r[l][p],r[l][c]+r[c][p]));let h=0,d=0;for(let c=0;c<s;++c)for(let l=0;l<s;++l)c!==l&&r[c][l]!==i&&(h+=r[c][l],d++);return we(r,e),h/d/20}function we(t,e){const n=[];for(let i=0;i<e.length;++i){const h={station_name:e[i].name,values:[]};for(let d=0;d<e.length;++d)h.values.push(t[i][d]);n.push(h)}const s=JSON.stringify(n);localStorage.setItem("distance-matrix",s)}function Me(t){return t.stations.forEach(e=>{e.colour=ke(e.name)}),t.bolts.forEach(e=>{const n=t.stations.find(s=>s.name===e.station_b.name);n?e.colour=n.colour:console.error(`Station ${e.station_b.name} not found in network.`)}),t}function ke(t){const e=Se(t),n=80,s=74,i=(1-Math.abs(2*(s/100)-1))*(n/100),r=i*(1-Math.abs(e/60%2-1)),h=s/100-i/2;let d=0,c=0,l=0;e>=0&&e<60?(d=i,c=r):e>=60&&e<120?(d=r,c=i):e>=120&&e<180?(c=i,l=r):e>=180&&e<240?(c=r,l=i):e>=240&&e<300?(d=r,l=i):e>=300&&e<360&&(d=i,l=r);const p=v=>{const w=Math.round(v*255).toString(16);return w.length===1?"0"+w:w};return`#${p(d+h)}${p(c+h)}${p(l+h)}`.toUpperCase()}function Se(t){let e=0;for(let n=0;n<t.length;++n)e=(e<<5)-e+t.charCodeAt(n),e|=0;return Math.abs(e%360)}Z("scatter-plot",{});function Te(t){const e=t.stations,n=e.length,s=new Array(n).fill(!1),i=new Array(n).fill(-1),r=new Array(n).fill(1/0);r[0]=0;for(let d=0;d<n-1;++d){const c=Ie(r,s);s[c]=!0;for(let l=0;l<n;++l){const p=W(e[c],e[l]);p!==0&&!s[l]&&p<r[l]&&(i[l]=c,r[l]=p)}}const h=[];for(let d=1;d<n;++d)h.push({directed:!1,station_a:{name:e[i[d]].name,x:e[i[d]].x,z:e[i[d]].z},turn:q(e[i[d]],e[d]),station_b:{name:e[d].name,x:e[d].x,z:e[d].z},length:W(e[i[d]],e[d]),colour:"#8f7f10"});return{stations:e.slice(),bolts:h}}function Ie(t,e){let n=1/0,s=-1;for(let i=0;i<t.length;i++)!e[i]&&t[i]<n&&(n=t[i],s=i);return s}class Be{constructor(e){St(this,"parent");this.parent=Array(e).fill(-1)}find(e){let n=e;for(;this.parent[n]!==-1;)n=this.parent[n];let s=e;for(;s!==n;){const i=this.parent[s];if(i===s)break;this.parent[s]=n,s=i}return n}union(e,n){const s=this.find(e),i=this.find(n);s!==i&&(this.parent[s]=i)}}function Pe(t){const e=t.stations,n=t.bolts;n.sort((r,h)=>r.length-h.length);const s=new Be(e.length),i=[];return n.forEach(r=>{const h=e.findIndex(p=>p.name===r.station_a.name),d=e.findIndex(p=>p.name===r.station_b.name),c=s.find(h),l=s.find(d);c!==l&&(i.push(r),s.union(c,l))}),t.bolts=i,t}const Ce={class:"fixed top-0 right-0 w-48 backdrop-blur p-5"},Ve=z("p",{class:"text-center text-accent"},[z("a",{href:"https://github.com/KK-mp4/Bolt-Routing-Problem-V2",target:"_blank",rel:"noopener noreferrer",title:"GitHub"}," Piston Bolt Network Builder "),z("span",{class:"text-[10px] text-text"},"*early alpha build by kk")],-1),Ee=z("option",{value:"None"},"None",-1),De=z("option",{value:"Star graph"},"Star graph (WIP)",-1),Ae=z("option",{value:"Complete graph"},"Complete graph",-1),Ne=z("option",{value:"Nearest neighbor"},"Nearest neighbor (WIP)",-1),Ye=z("option",{value:"Hamiltonian cycle"},"Hamiltonian cycle (WIP)",-1),Ge=z("option",{value:"Prim's algorithm"},"Prim's algorithm (WIP)",-1),Xe=z("option",{value:"Kruskal's algorithm"},"Kruskal's algorithm (WIP)",-1),Le={key:0},$e=z("option",{value:"4"},[O("S"),z("sub",null,"4")],-1),Re=z("option",{value:"8"},[O("S"),z("sub",null,"8")],-1),Ue=z("option",{value:"median"},"Median",-1),Ke=z("option",{value:"average"},"Average",-1),He=z("option",{value:""},"0, 0",-1),je=z("option",{value:"spawn"},"Spawn",-1),Fe=z("option",{value:"track"},"Track mouse",-1),We={class:"fixed top-0 left-0 backdrop-blur p-5 pb-1"},Oe={class:"text-xs"},qe=z("br",null,null,-1),Ze={key:0,class:"text-accent"},Qe={key:1,class:"text-accent"},Je={class:"text-xs mt-1"},tn=z("br",null,null,-1),en={class:"text-accent"},nn={class:"text-xs mt-1"},on=z("br",null,null,-1),an={class:"text-accent"},sn={key:0,class:"text-xs mt-1 mb-2"},rn=z("br",null,null,-1),ln={class:"text-accent"},cn=z("br",null,null,-1),un=z("br",null,null,-1),hn={class:"fixed bottom-0 left-0 text-sm select-none"},fn=z("div",{class:"fixed bottom-0 right-0 text-[10px] select-none invisible md:visible"},[z("p",null,"pan: drag mouse1 / zoom: scroll mouse3 / connect: drag mouse3")],-1),dn=z("div",{id:"network_map",class:"p-0 h-full w-full"},null,-1),yn=Wt({__name:"index",setup(t){te({title:"Piston Bolt Network Builder",description:"Tool for generating and editing piston bolt networks for Minecraft",ogTitle:"Piston Bolt Network Builder",ogDescription:"Tool for generating and editing piston bolt networks for Minecraft",ogImage:"/ogImage.webp",ogUrl:"https://bolt-routing-problem-v2.vercel.app/",twitterTitle:"Piston Bolt Network Builder",twitterDescription:"Tool for generating and editing piston bolt networks for Minecraft",twitterImage:"/ogImage.webp",twitterCard:"summary"});const e=dt(""),n=Z("piston-bolt-network",{});let s={},i={},r=[],h=!1;const d=dt(0),c=dt(0),l=dt(0),p=Z("graph-type",""),b=Z("star-graph-s",8),v=Z("star-graph-merge-pos","median");let w=Mt;const A=Z("show-labels",!1),C=Z("colour-graph",!1),B=Z("calculate-stats",!0);Ot(async()=>{if(window.addEventListener("resize",x),!n.value.stations){const M=await(await fetch("/data/network.json")).json();n.value=M}N()});function x(){const G=document.getElementById("network_map");G!==null&&(G.innerHTML="");const M={top:-1,right:0,bottom:50,left:75},V=window.innerWidth,Y=window.innerHeight,E=V-M.right-M.left,R=Y-M.top-M.bottom,et=Tt(n.value.stations,f=>Math.abs(f.x))||1e3,pt=Tt(n.value.stations,f=>Math.abs(f.z))||1e3,nt=Math.max(et,pt)*1.01,rt=E/R;let o,m;rt>1?(o=nt*rt,m=nt):(o=nt,m=nt/rt);const a=It().domain([-m,m]).range([M.top,R]),u=It().domain([-o,o]).range([M.right,E]),_=ne(a),y=oe(u),g=F("#network_map").append("svg").attr("width",V).attr("height",Y);g.append("g").attr("id","y_axis").attr("transform","translate(75, 0)").call(_).style("font-family","Fira Code").style("font-size","10px"),g.append("g").attr("id","x_axis").attr("transform",`translate(${M.left}, ${Y-M.bottom-M.top})`).call(y).style("font-family","Fira Code").style("font-size","10px");const T=Math.round(Math.min(E,R)/64),I=Math.round(Math.min(E,R)/64*(R/E));g.select("#x_axis").call(y.scale(u).ticks(T).tickSize(-R)),g.select("#y_axis").call(_.scale(a).ticks(I).tickSize(-E)),g.selectAll(".tick line").style("stroke","#422B25");const U=g.append("g").attr("id","edges_a").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",f=>u(f.station_a.x)).attr("y1",f=>a(f.station_a.z)).attr("x2",f=>u(f.turn.x)).attr("y2",f=>a(f.turn.z)).style("stroke",f=>f.colour).style("stroke-width",1),P=g.append("g").attr("id","edges_b").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",f=>u(f.turn.x)).attr("y1",f=>a(f.turn.z)).attr("x2",f=>u(f.station_b.x)).attr("y2",f=>a(f.station_b.z)).style("stroke",f=>f.colour).style("stroke-width",1),$=g.append("g").attr("id","vertices").attr("transform","translate(75, 0)").selectAll("circle").data(n.value.stations).enter().append("circle").attr("r",4).attr("cx",f=>u(f.x)).attr("cy",f=>a(f.z)).style("fill",f=>f.colour).on("click",(f,k)=>lt(k)).on("mousedown",(f,k)=>{f.button===1&&Dt(f,k)}).on("mouseup",(f,k)=>{f.button===1&&At(f,k)}),H=g.append("g").attr("id","lables").style("font-family","Fira Code").style("fill","#fbdfd8").style("font-size","10px").selectAll("text").data(n.value.stations).join("text").attr("dy","0.35em").attr("x",f=>u(f.x)).attr("y",f=>a(f.z)-14).text(f=>f.name).style("visibility",A.value?"visible":"hidden"),X=xe().on("zoom",j);g.call(X),w!==void 0&&g.call(X.transform,w),g.on("mousemove",f=>{if(p.value==="Star graph"&&v.value==="track"){const k=g.node();if(!k)return;const D=k.createSVGPoint();D.x=f.offsetX,D.y=f.offsetY;const S=k.getScreenCTM();if(!S)return;const ot=D.matrixTransform(S.inverse()),gt=ot.x-M.left,ft=ot.y-M.top;n.value=Ct(n.value,b.value,v.value,Math.round(u.invert(gt)),Math.round(a.invert(ft))),x(),L()}h&&s.name!==void 0&&(r=[f.offsetX,f.offsetY],Nt(g,s,r))}),g.on("mousedown",f=>{f.button===1&&(h=!0)}),g.on("mouseup",f=>{f.button===1&&(h=!1,g.select("#temp-line").remove())});function j({transform:f}){w=f,F("#y_axis").transition().duration(50).call(S=>_.scale(f.rescaleY(a))),F("#x_axis").transition().duration(50).call(S=>y.scale(f.rescaleY(u)));const k=f.rescaleX(u),D=f.rescaleY(a);g.select("#x_axis").call(y.scale(k).ticks(T).tickSize(-R)),g.select("#y_axis").call(_.scale(D).ticks(I).tickSize(-E)),g.selectAll(".tick line").style("stroke","#422B25"),$.data(n.value.stations).attr("cx",S=>k(S.x)).attr("cy",S=>D(S.z)),H.data(n.value.stations).attr("x",S=>k(S.x)).attr("y",S=>D(S.z)-14),U.data(n.value.bolts).attr("x1",S=>k(S.station_a.x)).attr("y1",S=>D(S.station_a.z)).attr("x2",S=>k(S.turn.x)).attr("y2",S=>D(S.turn.z)),P.data(n.value.bolts).attr("x1",S=>k(S.turn.x)).attr("y1",S=>D(S.turn.z)).attr("x2",S=>k(S.station_b.x)).attr("y2",S=>D(S.station_b.z))}function lt(f){e.value=f.name+" { X: "+f.x+" , Z: "+f.z+" }"}function Dt(f,k){s={name:k.name,description:"",colour:"",x:k.x,z:k.z},i.x=k.x,i.z=k.z,e.value="Draw bolt from "+s.name}function At(f,k){if(!s.name||k.name===s.name)return;const D={name:i.name,description:i.description,colour:i.colour,x:i.x,z:i.z};n.value.bolts.push({directed:!1,station_a:D,turn:q(D,k),station_b:k,length:W(s,k),colour:"#8f7f10"}),x(),L(),e.value+=" to "+k.name}function Nt(f,k,D){f.select("#temp-line").remove();const S=f.node(),ot=S.createSVGPoint();ot.x=D[0],ot.y=D[1];const gt=S.getScreenCTM(),ft=ot.matrixTransform(gt.inverse()),Yt=ft.x-M.left,Gt=ft.y-M.top,at={name:"",colour:"",description:"",x:u.invert(Yt),z:a.invert(Gt)},Xt=w.rescaleX(u),Lt=w.rescaleY(a);k.x=Xt(i.x),k.z=Lt(i.z),at.x=u(at.x),at.z=a(at.z);const kt=q(k,at),$t=[{start:k,end:kt},{start:kt,end:at}];f.append("g").attr("id","temp-line").attr("transform",`translate(${M.left}, ${M.top})`).selectAll("line").data($t).enter().append("line").attr("x1",Q=>Q.start.x).attr("y1",Q=>Q.start.z).attr("x2",Q=>Q.end.x).attr("y2",Q=>Q.end.z).style("stroke","gray").style("stroke-width",2).style("stroke-dasharray","5 5")}}async function N(){const G=Date.now();switch(p.value){case"None":{n.value.bolts=[];break}case"Star graph":{n.value=Ct(n.value,b.value,v.value);break}case"Complete graph":{n.value=Et(n.value);break}case"Nearest neighbor":{await ve(n.value,M=>{n.value=M,x()});break}case"Hamiltonian cycle":{n.value=ye(n.value);break}case"Prim's algorithm":{n.value=Te(n.value);break}case"Kruskal's algorithm":{n.value=Pe(Et(n.value));break}}e.value="Processing time: "+(Date.now()-G)+"ms",C.value&&(n.value=Me(n.value)),x(),L()}function L(){[d.value,c.value]=be(n.value),B.value&&(l.value=ze(n.value))}return qt(()=>{window.removeEventListener("resize",x)}),(G,M)=>{const V=_e,Y=Jt;return tt(),it(Qt,null,[z("div",Ce,[Ve,ct(V,{"aria-label":"Graph type",modelValue:K(p),"onUpdate:modelValue":M[0]||(M[0]=E=>xt(p)?p.value=E:null),onChange:N},{default:st(()=>[Ee,De,Ae,Ne,Ye,Ge,Xe]),_:1},8,["modelValue"]),K(p)==="Star graph"?(tt(),it("div",Le,[ct(V,{modelValue:K(b),"onUpdate:modelValue":M[1]||(M[1]=E=>xt(b)?b.value=E:null),onChange:N},{default:st(()=>[$e,Re]),_:1},8,["modelValue"]),ct(V,{modelValue:K(v),"onUpdate:modelValue":M[2]||(M[2]=E=>xt(v)?v.value=E:null),onChange:N},{default:st(()=>[Ue,Ke,He,je,Fe]),_:1},8,["modelValue"])])):_t("",!0)]),z("div",We,[z("p",Oe,[O("Stations:"),qe,K(n).stations?(tt(),it("span",Ze,ut(K(n).stations.length),1)):(tt(),it("span",Qe,"0"))]),z("p",Je,[O("Bolt length:"),tn,z("span",en,ut(K(d))+" blocks",1)]),z("p",nn,[O("Tunnel length:"),on,z("span",an,ut(K(c))+" blocks",1)]),K(B)?(tt(),it("p",sn,[O("Average travel time:"),rn,z("span",ln,ut(Math.round(K(l)*100)/100)+" s",1)])):_t("",!0),ct(Y,{to:"/settings",title:"Setting page",class:"text-xs"},{default:st(()=>[O("Settings ->"),cn]),_:1}),K(B)?(tt(),Zt(Y,{key:1,to:"/heatmap",title:"Distance matrix heatmap",class:"text-xs"},{default:st(()=>[O("Heatmap ->"),un]),_:1})):_t("",!0),ct(Y,{to:"/scatterplot",title:"Scatter plot",class:"text-xs"},{default:st(()=>[O("Scatter plot ->")]),_:1})]),z("p",hn,ut(K(e)),1),fn,dn],64)}}});export{yn as default};
