var Rt=Object.defineProperty;var Ut=(t,e,n)=>e in t?Rt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var St=(t,e,n)=>(Ut(t,typeof e!="symbol"?e+"":e,n),n);import{i as Ht,j as Kt,v as jt,o as tt,c as it,k as Wt,f as Ft,r as dt,g as Ot,h as qt,a as w,b as ct,w as st,u as H,l as xt,m as _t,d as O,t as ut,n as Zt,F as Qt}from"./cMwQQtMZ.js";import{_ as Jt}from"./Bs_x37i1.js";import{a as Z,u as te}from"./DtfcDkAb.js";import{s as W,d as ee,c as Mt,T as vt,e as yt,m as Tt,l as It,b as ne,a as oe}from"./B7PevS6S.js";import"./SA0z0i-t.js";function ae(t){let e;for(;e=t.sourceEvent;)t=e;return t}function J(t,e){if(t=ae(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var s=n.createSVGPoint();return s.x=t.clientX,s.y=t.clientY,s=s.matrixTransform(e.getScreenCTM().inverse()),[s.x,s.y]}if(e.getBoundingClientRect){var i=e.getBoundingClientRect();return[t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop]}}return[t.pageX,t.pageY]}const zt={capture:!0,passive:!1};function wt(t){t.preventDefault(),t.stopImmediatePropagation()}function se(t){var e=t.document.documentElement,n=W(t).on("dragstart.drag",wt,zt);"onselectstart"in e?n.on("selectstart.drag",wt,zt):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function ie(t,e){var n=t.document.documentElement,s=W(t).on("dragstart.drag",null);e&&(s.on("click.drag",wt,zt),setTimeout(function(){s.on("click.drag",null)},0)),"onselectstart"in n?s.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}var re=1e-12;function Bt(t){return((t=Math.exp(t))+1/t)/2}function le(t){return((t=Math.exp(t))-1/t)/2}function ce(t){return((t=Math.exp(2*t))-1)/(t+1)}const ue=function t(e,n,s){function i(r,f){var d=r[0],u=r[1],c=r[2],g=f[0],b=f[1],v=f[2],M=g-d,A=b-u,C=M*M+A*A,B,x;if(C<re)x=Math.log(v/c)/e,B=function(Y){return[d+Y*M,u+Y*A,c*Math.exp(e*Y*x)]};else{var N=Math.sqrt(C),X=(v*v-c*c+s*C)/(2*c*n*N),G=(v*v-c*c-s*C)/(2*v*n*N),k=Math.log(Math.sqrt(X*X+1)-X),V=Math.log(Math.sqrt(G*G+1)-G);x=(V-k)/e,B=function(Y){var E=Y*x,R=Bt(k),et=c/(n*N)*(R*ce(e*E+k)-le(k));return[d+et*M,u+et*A,c*R/Bt(e*E+k)]}}return B.duration=x*1e3*e/Math.SQRT2,B}return i.rho=function(r){var f=Math.max(.001,+r),d=f*f,u=d*d;return t(f,d,u)},i}(Math.SQRT2,2,4),mt=t=>()=>t;function he(t,{sourceEvent:e,target:n,transform:s,dispatch:i}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:s,enumerable:!0,configurable:!0},_:{value:i}})}function bt(t){t.stopImmediatePropagation()}function ht(t){t.preventDefault(),t.stopImmediatePropagation()}function fe(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function de(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function Pt(){return this.__zoom||Mt}function me(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function pe(){return navigator.maxTouchPoints||"ontouchstart"in this}function ge(t,e,n){var s=t.invertX(e[0][0])-n[0][0],i=t.invertX(e[1][0])-n[1][0],r=t.invertY(e[0][1])-n[0][1],f=t.invertY(e[1][1])-n[1][1];return t.translate(i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i),f>r?(r+f)/2:Math.min(0,r)||Math.max(0,f))}function xe(){var t=fe,e=de,n=ge,s=me,i=pe,r=[0,1/0],f=[[-1/0,-1/0],[1/0,1/0]],d=250,u=ue,c=ee("start","zoom","end"),g,b,v,M=500,A=150,C=0,B=10;function x(o){o.property("__zoom",Pt).on("wheel.zoom",E,{passive:!1}).on("mousedown.zoom",R).on("dblclick.zoom",et).filter(i).on("touchstart.zoom",pt).on("touchmove.zoom",nt).on("touchend.zoom touchcancel.zoom",rt).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}x.transform=function(o,m,a,h){var _=o.selection?o.selection():o;_.property("__zoom",Pt),o!==_?k(o,m,a,h):_.interrupt().each(function(){V(this,arguments).event(h).start().zoom(null,typeof m=="function"?m.apply(this,arguments):m).end()})},x.scaleBy=function(o,m,a,h){x.scaleTo(o,function(){var _=this.__zoom.k,y=typeof m=="function"?m.apply(this,arguments):m;return _*y},a,h)},x.scaleTo=function(o,m,a,h){x.transform(o,function(){var _=e.apply(this,arguments),y=this.__zoom,p=a==null?G(_):typeof a=="function"?a.apply(this,arguments):a,T=y.invert(p),I=typeof m=="function"?m.apply(this,arguments):m;return n(X(N(y,I),p,T),_,f)},a,h)},x.translateBy=function(o,m,a,h){x.transform(o,function(){return n(this.__zoom.translate(typeof m=="function"?m.apply(this,arguments):m,typeof a=="function"?a.apply(this,arguments):a),e.apply(this,arguments),f)},null,h)},x.translateTo=function(o,m,a,h,_){x.transform(o,function(){var y=e.apply(this,arguments),p=this.__zoom,T=h==null?G(y):typeof h=="function"?h.apply(this,arguments):h;return n(Mt.translate(T[0],T[1]).scale(p.k).translate(typeof m=="function"?-m.apply(this,arguments):-m,typeof a=="function"?-a.apply(this,arguments):-a),y,f)},h,_)};function N(o,m){return m=Math.max(r[0],Math.min(r[1],m)),m===o.k?o:new vt(m,o.x,o.y)}function X(o,m,a){var h=m[0]-a[0]*o.k,_=m[1]-a[1]*o.k;return h===o.x&&_===o.y?o:new vt(o.k,h,_)}function G(o){return[(+o[0][0]+ +o[1][0])/2,(+o[0][1]+ +o[1][1])/2]}function k(o,m,a,h){o.on("start.zoom",function(){V(this,arguments).event(h).start()}).on("interrupt.zoom end.zoom",function(){V(this,arguments).event(h).end()}).tween("zoom",function(){var _=this,y=arguments,p=V(_,y).event(h),T=e.apply(_,y),I=a==null?G(T):typeof a=="function"?a.apply(_,y):a,U=Math.max(T[1][0]-T[0][0],T[1][1]-T[0][1]),P=_.__zoom,$=typeof m=="function"?m.apply(_,y):m,K=u(P.invert(I).concat(U/P.k),$.invert(I).concat(U/$.k));return function(L){if(L===1)L=$;else{var j=K(L),lt=U/j[2];L=new vt(lt,I[0]-j[0]*lt,I[1]-j[1]*lt)}p.zoom(null,L)}})}function V(o,m,a){return!a&&o.__zooming||new Y(o,m)}function Y(o,m){this.that=o,this.args=m,this.active=0,this.sourceEvent=null,this.extent=e.apply(o,m),this.taps=0}Y.prototype={event:function(o){return o&&(this.sourceEvent=o),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(o,m){return this.mouse&&o!=="mouse"&&(this.mouse[1]=m.invert(this.mouse[0])),this.touch0&&o!=="touch"&&(this.touch0[1]=m.invert(this.touch0[0])),this.touch1&&o!=="touch"&&(this.touch1[1]=m.invert(this.touch1[0])),this.that.__zoom=m,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(o){var m=W(this.that).datum();c.call(o,this.that,new he(o,{sourceEvent:this.sourceEvent,target:x,type:o,transform:this.that.__zoom,dispatch:c}),m)}};function E(o,...m){if(!t.apply(this,arguments))return;var a=V(this,m).event(o),h=this.__zoom,_=Math.max(r[0],Math.min(r[1],h.k*Math.pow(2,s.apply(this,arguments)))),y=J(o);if(a.wheel)(a.mouse[0][0]!==y[0]||a.mouse[0][1]!==y[1])&&(a.mouse[1]=h.invert(a.mouse[0]=y)),clearTimeout(a.wheel);else{if(h.k===_)return;a.mouse=[y,h.invert(y)],yt(this),a.start()}ht(o),a.wheel=setTimeout(p,A),a.zoom("mouse",n(X(N(h,_),a.mouse[0],a.mouse[1]),a.extent,f));function p(){a.wheel=null,a.end()}}function R(o,...m){if(v||!t.apply(this,arguments))return;var a=o.currentTarget,h=V(this,m,!0).event(o),_=W(o.view).on("mousemove.zoom",I,!0).on("mouseup.zoom",U,!0),y=J(o,a),p=o.clientX,T=o.clientY;se(o.view),bt(o),h.mouse=[y,this.__zoom.invert(y)],yt(this),h.start();function I(P){if(ht(P),!h.moved){var $=P.clientX-p,K=P.clientY-T;h.moved=$*$+K*K>C}h.event(P).zoom("mouse",n(X(h.that.__zoom,h.mouse[0]=J(P,a),h.mouse[1]),h.extent,f))}function U(P){_.on("mousemove.zoom mouseup.zoom",null),ie(P.view,h.moved),ht(P),h.event(P).end()}}function et(o,...m){if(t.apply(this,arguments)){var a=this.__zoom,h=J(o.changedTouches?o.changedTouches[0]:o,this),_=a.invert(h),y=a.k*(o.shiftKey?.5:2),p=n(X(N(a,y),h,_),e.apply(this,m),f);ht(o),d>0?W(this).transition().duration(d).call(k,p,h,o):W(this).call(x.transform,p,h,o)}}function pt(o,...m){if(t.apply(this,arguments)){var a=o.touches,h=a.length,_=V(this,m,o.changedTouches.length===h).event(o),y,p,T,I;for(bt(o),p=0;p<h;++p)T=a[p],I=J(T,this),I=[I,this.__zoom.invert(I),T.identifier],_.touch0?!_.touch1&&_.touch0[2]!==I[2]&&(_.touch1=I,_.taps=0):(_.touch0=I,y=!0,_.taps=1+!!g);g&&(g=clearTimeout(g)),y&&(_.taps<2&&(b=I[0],g=setTimeout(function(){g=null},M)),yt(this),_.start())}}function nt(o,...m){if(this.__zooming){var a=V(this,m).event(o),h=o.changedTouches,_=h.length,y,p,T,I;for(ht(o),y=0;y<_;++y)p=h[y],T=J(p,this),a.touch0&&a.touch0[2]===p.identifier?a.touch0[0]=T:a.touch1&&a.touch1[2]===p.identifier&&(a.touch1[0]=T);if(p=a.that.__zoom,a.touch1){var U=a.touch0[0],P=a.touch0[1],$=a.touch1[0],K=a.touch1[1],L=(L=$[0]-U[0])*L+(L=$[1]-U[1])*L,j=(j=K[0]-P[0])*j+(j=K[1]-P[1])*j;p=N(p,Math.sqrt(L/j)),T=[(U[0]+$[0])/2,(U[1]+$[1])/2],I=[(P[0]+K[0])/2,(P[1]+K[1])/2]}else if(a.touch0)T=a.touch0[0],I=a.touch0[1];else return;a.zoom("touch",n(X(p,T,I),a.extent,f))}}function rt(o,...m){if(this.__zooming){var a=V(this,m).event(o),h=o.changedTouches,_=h.length,y,p;for(bt(o),v&&clearTimeout(v),v=setTimeout(function(){v=null},M),y=0;y<_;++y)p=h[y],a.touch0&&a.touch0[2]===p.identifier?delete a.touch0:a.touch1&&a.touch1[2]===p.identifier&&delete a.touch1;if(a.touch1&&!a.touch0&&(a.touch0=a.touch1,delete a.touch1),a.touch0)a.touch0[1]=this.__zoom.invert(a.touch0[0]);else if(a.end(),a.taps===2&&(p=J(p,this),Math.hypot(b[0]-p[0],b[1]-p[1])<B)){var T=W(this).on("dblclick.zoom");T&&T.apply(this,arguments)}}}return x.wheelDelta=function(o){return arguments.length?(s=typeof o=="function"?o:mt(+o),x):s},x.filter=function(o){return arguments.length?(t=typeof o=="function"?o:mt(!!o),x):t},x.touchable=function(o){return arguments.length?(i=typeof o=="function"?o:mt(!!o),x):i},x.extent=function(o){return arguments.length?(e=typeof o=="function"?o:mt([[+o[0][0],+o[0][1]],[+o[1][0],+o[1][1]]]),x):e},x.scaleExtent=function(o){return arguments.length?(r[0]=+o[0],r[1]=+o[1],x):[r[0],r[1]]},x.translateExtent=function(o){return arguments.length?(f[0][0]=+o[0][0],f[1][0]=+o[1][0],f[0][1]=+o[0][1],f[1][1]=+o[1][1],x):[[f[0][0],f[0][1]],[f[1][0],f[1][1]]]},x.constrain=function(o){return arguments.length?(n=o,x):n},x.duration=function(o){return arguments.length?(d=+o,x):d},x.interpolate=function(o){return arguments.length?(u=o,x):u},x.on=function(){var o=c.on.apply(c,arguments);return o===c?x:o},x.clickDistance=function(o){return arguments.length?(C=(o=+o)*o,x):Math.sqrt(C)},x.tapDistance=function(o){return arguments.length?(B=+o,x):B},x}const _e={__name:"Select",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(t){const e=Ht(t,"modelValue");return(n,s)=>Kt((tt(),it("select",{"onUpdate:modelValue":s[1]||(s[1]=i=>e.value=i),class:"mt-3 rounded-sm bg-primary text-background w-full font-bold outline-none select-none"},[Wt(n.$slots,"default",{onChange:s[0]||(s[0]=i=>n.$emit("update:modelValue"))})],512)),[[jt,e.value]])}};function q(t,e){const n=t.x-e.x,s=t.z-e.z,i=Math.abs(n),r=Math.abs(s);let f,d;const u=s>=0?-1:1,c=n>=0?-1:1;return i>=r?(f=t.x+c*r,d=t.z+u*r):(f=t.x+c*i,d=t.z+u*i),{x:f,z:d}}function F(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.z-e.z))}function Ct(t,e,n,s,i){t.bolts=[];const r=t.stations,f=r.length;let d=0,u=0;if(n==="track"&&s!==void 0&&i!==void 0)d=s,u=i;else if(n==="median"){const g=r.map(v=>v.x),b=r.map(v=>v.z);d=Math.round(Vt(g)),u=Math.round(Vt(b))}else if(n==="average"){const g=r.reduce((v,M)=>v+M.x,0),b=r.reduce((v,M)=>v+M.z,0);d=Math.round(g/f),u=Math.round(b/f)}else n==="spawn"&&(d=-80,u=-176);const c={name:"Mergeing point",description:"",colour:"",x:d,z:u};for(let g=0;g<f;++g){const b=r[g];let v;const M=Math.abs(b.x-c.x)/Math.abs(b.z-c.z);e==8&&M>.57735&&M<1.7321?v=q(c,b):v=q(b,c),t.bolts.push({directed:!1,station_a:b,turn:v,station_b:c,length:F(b,c),colour:"#8f7f10"})}return t}function Vt(t){if(t.length===0)throw new Error("Input array is empty");t=[...t].sort((n,s)=>n-s);const e=Math.floor(t.length/2);return t.length%2?t[e]:(t[e-1]+t[e])/2}function Et(t){t.bolts=[];const e=t.stations,n=e.length;for(let s=0;s<n;++s)for(let i=s+1;i<n;++i){const r=e[s],f=e[i];t.bolts.push({directed:!1,station_a:r,turn:q(r,f),station_b:f,length:F(r,f),colour:"#8f7f10"})}return t}async function ve(t,e){t.bolts=[];const n=t.stations,s=n.length;let i={stations:[],bolts:[]},r=1/0;for(let f=0;f<s;++f){let d=function(M){let A=1/0,C=null;for(let B=0;B<s;++B)if(!u[B]){const x=n[B],N=F(M,x);N<A&&(A=N,C=x)}return C};const u=new Array(s).fill(!1);let c=n[f];u[f]=!0;const g=[];let b;for(;(b=d(c))!==null;)g.push({directed:!1,station_a:c,turn:q(c,b),station_b:b,length:F(c,b),colour:"#8f7f10"}),u[n.indexOf(b)]=!0,c=b;const v=g.reduce((M,A)=>M+A.length,0);v<r&&(i={stations:n.slice(),bolts:g.slice()},r=v,e(i),await new Promise(M=>setTimeout(M,0)))}}function ye(t){const e=t.stations,n=e.length;let s={stations:[],bolts:[]},i=1/0;for(let r=0;r<n;++r){let f=function(v){let M=1/0,A=null;for(let C=0;C<n;++C)if(!d[C]){const B=e[C],x=F(v,B);x<M&&(M=x,A=B)}return A};const d=new Array(n).fill(!1);let u=e[r];d[r]=!0;const c=[];let g;for(;(g=f(u))!==null;)c.push({directed:!0,station_a:u,turn:q(u,g),station_b:g,length:F(u,g),colour:"#8f7f10"}),d[e.indexOf(g)]=!0,u=g;c.push({directed:!0,station_a:u,turn:q(u,e[r]),station_b:e[r],length:F(u,e[r]),colour:"#8f7f10"});const b=c.reduce((v,M)=>v+M.length,0);b<i&&(s={stations:e.slice(),bolts:c.slice()},i=b)}return s}function be(t){let e=0,n=0;return t.bolts.forEach(s=>{n+=s.length,s.directed===!1&&(e+=s.length)}),e+=n,[e,n]}function ze(t){const e=t.stations,n=t.bolts,s=e.length,i=Number.POSITIVE_INFINITY,r=Array.from({length:s},()=>Array(s).fill(i));for(let u=0;u<s;++u)r[u][u]=0;for(const u of n){const c=e.find(b=>b.name===u.station_a.name),g=e.find(b=>b.name===u.station_b.name);if(c&&g){const b=e.indexOf(c),v=e.indexOf(g);r[b][v]=u.length,r[v][b]=u.length}}for(let u=0;u<s;++u)for(let c=0;c<s;++c)for(let g=0;g<s;++g)r[c][u]!==i&&r[u][g]!==i&&(r[c][g]=Math.min(r[c][g],r[c][u]+r[u][g]));let f=0,d=0;for(let u=0;u<s;++u)for(let c=0;c<s;++c)u!==c&&r[u][c]!==i&&(f+=r[u][c],d++);return we(r,e),f/d/20}function we(t,e){const n=[];for(let i=0;i<e.length;++i){const f={station_name:e[i].name,values:[]};for(let d=0;d<e.length;++d)f.values.push(t[i][d]);n.push(f)}const s=JSON.stringify(n);localStorage.setItem("distance-matrix",s)}function Me(t){return t.stations.forEach(e=>{e.colour=ke(e.name)}),t.bolts.forEach(e=>{const n=t.stations.find(s=>s.name===e.station_b.name);n?e.colour=n.colour:console.error(`Station ${e.station_b.name} not found in network.`)}),t}function ke(t){const e=Se(t),n=80,s=74,i=(1-Math.abs(2*(s/100)-1))*(n/100),r=i*(1-Math.abs(e/60%2-1)),f=s/100-i/2;let d=0,u=0,c=0;e>=0&&e<60?(d=i,u=r):e>=60&&e<120?(d=r,u=i):e>=120&&e<180?(u=i,c=r):e>=180&&e<240?(u=r,c=i):e>=240&&e<300?(d=r,c=i):e>=300&&e<360&&(d=i,c=r);const g=v=>{const M=Math.round(v*255).toString(16);return M.length===1?"0"+M:M};return`#${g(d+f)}${g(u+f)}${g(c+f)}`.toUpperCase()}function Se(t){let e=0;for(let n=0;n<t.length;++n)e=(e<<5)-e+t.charCodeAt(n),e|=0;return Math.abs(e%360)}Z("scatter-plot",{});function Te(t){const e=t.stations,n=e.length,s=new Array(n).fill(!1),i=new Array(n).fill(-1),r=new Array(n).fill(1/0);r[0]=0;for(let d=0;d<n-1;++d){const u=Ie(r,s);s[u]=!0;for(let c=0;c<n;++c){const g=F(e[u],e[c]);g!==0&&!s[c]&&g<r[c]&&(i[c]=u,r[c]=g)}}const f=[];for(let d=1;d<n;++d)f.push({directed:!1,station_a:{name:e[i[d]].name,x:e[i[d]].x,z:e[i[d]].z},turn:q(e[i[d]],e[d]),station_b:{name:e[d].name,x:e[d].x,z:e[d].z},length:F(e[i[d]],e[d]),colour:"#8f7f10"});return{stations:e.slice(),bolts:f}}function Ie(t,e){let n=1/0,s=-1;for(let i=0;i<t.length;i++)!e[i]&&t[i]<n&&(n=t[i],s=i);return s}class Be{constructor(e){St(this,"parent");this.parent=Array(e).fill(-1)}find(e){let n=e;for(;this.parent[n]!==-1;)n=this.parent[n];let s=e;for(;s!==n;){const i=this.parent[s];if(i===s)break;this.parent[s]=n,s=i}return n}union(e,n){const s=this.find(e),i=this.find(n);s!==i&&(this.parent[s]=i)}}function Pe(t){const e=t.stations,n=t.bolts;n.sort((r,f)=>r.length-f.length);const s=new Be(e.length),i=[];return n.forEach(r=>{const f=e.findIndex(g=>g.name===r.station_a.name),d=e.findIndex(g=>g.name===r.station_b.name),u=s.find(f),c=s.find(d);u!==c&&(i.push(r),s.union(u,c))}),t.bolts=i,t}const Ce={class:"fixed top-0 right-0 w-48 backdrop-blur p-5"},Ve=w("p",{class:"text-center text-accent"},[w("a",{href:"https://github.com/KK-mp4/Bolt-Routing-Problem-V2",target:"_blank",rel:"noopener noreferrer",title:"GitHub"}," Piston Bolt Network Builder "),w("span",{class:"text-[10px] text-text"},"*early alpha build by kk")],-1),Ee=w("option",{value:"None"},"None",-1),De=w("option",{value:"Star graph"},"Star graph (WIP)",-1),Ae=w("option",{value:"Complete graph"},"Complete graph",-1),Ne=w("option",{value:"Nearest neighbor"},"Nearest neighbor (WIP)",-1),Ye=w("option",{value:"Hamiltonian cycle"},"Hamiltonian cycle (WIP)",-1),Ge=w("option",{value:"Prim's algorithm"},"Prim's algorithm (WIP)",-1),Le=w("option",{value:"Kruskal's algorithm"},"Kruskal's algorithm (WIP)",-1),Xe={key:0},$e=w("option",{value:"4"},[O("S"),w("sub",null,"4")],-1),Re=w("option",{value:"8"},[O("S"),w("sub",null,"8")],-1),Ue=w("option",{value:"median"},"Median",-1),He=w("option",{value:"average"},"Average",-1),Ke=w("option",{value:""},"0, 0",-1),je=w("option",{value:"spawn"},"Spawn",-1),We=w("option",{value:"track"},"Track mouse",-1),Fe={class:"fixed top-0 left-0 backdrop-blur p-5 pb-1"},Oe={class:"text-xs"},qe=w("br",null,null,-1),Ze={key:0,class:"text-accent"},Qe={key:1,class:"text-accent"},Je={class:"text-xs mt-1"},tn=w("br",null,null,-1),en={class:"text-accent"},nn={class:"text-xs mt-1"},on=w("br",null,null,-1),an={class:"text-accent"},sn={key:0,class:"text-xs mt-1 mb-2"},rn=w("br",null,null,-1),ln={class:"text-accent"},cn=w("br",null,null,-1),un=w("br",null,null,-1),hn={class:"fixed bottom-0 left-0 text-sm select-none"},fn=w("div",{class:"fixed bottom-0 right-0 text-[10px] select-none invisible md:visible"},[w("p",null,"pan: drag mouse1 / zoom: scroll mouse3 / connect: drag mouse3")],-1),dn=w("div",{id:"network_map",class:"p-0 h-full w-full"},null,-1),yn=Ft({__name:"index",setup(t){te({title:"Piston Bolt Network Builder",description:"Tool for generating and editing piston bolt networks for Minecraft",ogTitle:"Piston Bolt Network Builder",ogDescription:"Tool for generating and editing piston bolt networks for Minecraft",ogImage:"/ogImage.webp",ogUrl:"https://bolt-routing-problem-v2.vercel.app/",twitterTitle:"Piston Bolt Network Builder",twitterDescription:"Tool for generating and editing piston bolt networks for Minecraft",twitterImage:"/ogImage.webp",twitterCard:"summary"});const e=dt(""),n=Z("piston-bolt-network",{});let s={},i={},r=[],f=!1;const d=dt(0),u=dt(0),c=dt(0),g=Z("graph-type",""),b=Z("star-graph-s",8),v=Z("star-graph-merge-pos","median");let M=Mt;const A=Z("show-labels",!1),C=Z("colour-graph",!1),B=Z("calculate-stats",!0);Ot(async()=>{if(window.addEventListener("resize",x),!n.value.stations){const k=await(await fetch("/data/network.json")).json();n.value=k}N()});function x(){const G=document.getElementById("network_map");G!==null&&(G.innerHTML="");const k={top:-1,right:0,bottom:50,left:75},V=window.innerWidth,Y=window.innerHeight,E=V-k.right-k.left,R=Y-k.top-k.bottom,et=Tt(n.value.stations,l=>Math.abs(l.x))||1e3,pt=Tt(n.value.stations,l=>Math.abs(l.z))||1e3,nt=Math.max(et,pt)*1.01,rt=E/R;let o,m;rt>1?(o=nt*rt,m=nt):(o=nt,m=nt/rt);const a=It().domain([-m,m]).range([k.top,R]),h=It().domain([-o,o]).range([k.right,E]),_=ne(a),y=oe(h),p=W("#network_map").append("svg").attr("width",V).attr("height",Y);p.append("g").attr("id","y_axis").attr("transform","translate(75, 0)").call(_).style("font-family","Fira Code").style("font-size","10px"),p.append("g").attr("id","x_axis").attr("transform",`translate(${k.left}, ${Y-k.bottom-k.top})`).call(y).style("font-family","Fira Code").style("font-size","10px");const T=Math.round(Math.min(E,R)/64),I=Math.round(Math.min(E,R)/64*(R/E));p.select("#x_axis").call(y.scale(h).ticks(T).tickSize(-R)),p.select("#y_axis").call(_.scale(a).ticks(I).tickSize(-E)),p.selectAll(".tick line").style("stroke","#422B25");const U=p.append("g").attr("id","edges_a").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",l=>h(l.station_a.x)).attr("y1",l=>a(l.station_a.z)).attr("x2",l=>h(l.turn.x)).attr("y2",l=>a(l.turn.z)).style("stroke",l=>l.colour).style("stroke-width",1);p.append("defs").selectAll("marker").data(n.value.bolts.filter(l=>l.directed)).enter().append("marker").attr("id",(l,z)=>`arrow-${z}`).attr("viewBox","0 -5 10 10").attr("refX",14).attr("refY",0).attr("markerWidth",8).attr("markerHeight",8).attr("orient","auto").append("path").attr("fill",l=>l.colour).attr("d","M0,-5L10,0L0,5");const P=p.append("g").attr("id","edges_b").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",l=>h(l.turn.x)).attr("y1",l=>a(l.turn.z)).attr("x2",l=>h(l.station_b.x)).attr("y2",l=>a(l.station_b.z)).style("stroke",l=>l.colour).style("stroke-width",1).attr("marker-end",(l,z)=>`url(#arrow-${z})`),$=p.append("g").attr("id","vertices").attr("transform","translate(75, 0)").selectAll("circle").data(n.value.stations).enter().append("circle").attr("r",4).attr("cx",l=>h(l.x)).attr("cy",l=>a(l.z)).style("fill",l=>l.colour).on("click",(l,z)=>lt(z)).on("mousedown",(l,z)=>{l.button===1&&Dt(l,z)}).on("mouseup",(l,z)=>{l.button===1&&At(l,z)}),K=p.append("g").attr("id","lables").style("font-family","Fira Code").style("fill","#fbdfd8").style("font-size","10px").selectAll("text").data(n.value.stations).join("text").attr("dy","0.35em").attr("x",l=>h(l.x)).attr("y",l=>a(l.z)-14).text(l=>l.name).style("visibility",A.value?"visible":"hidden"),L=xe().on("zoom",j);p.call(L),M!==void 0&&p.call(L.transform,M),p.on("mousemove",l=>{if(g.value==="Star graph"&&v.value==="track"){const z=p.node();if(!z)return;const D=z.createSVGPoint();D.x=l.offsetX,D.y=l.offsetY;const S=z.getScreenCTM();if(!S)return;const ot=D.matrixTransform(S.inverse()),gt=ot.x-k.left,ft=ot.y-k.top;n.value=Ct(n.value,b.value,v.value,Math.round(h.invert(gt)),Math.round(a.invert(ft))),x(),X()}f&&s.name!==void 0&&(r=[l.offsetX,l.offsetY],Nt(p,s,r))}),p.on("mousedown",l=>{l.button===1&&(f=!0)}),p.on("mouseup",l=>{l.button===1&&(f=!1,p.select("#temp-line").remove())});function j({transform:l}){M=l,W("#y_axis").transition().duration(50).call(S=>_.scale(l.rescaleY(a))),W("#x_axis").transition().duration(50).call(S=>y.scale(l.rescaleY(h)));const z=l.rescaleX(h),D=l.rescaleY(a);p.select("#x_axis").call(y.scale(z).ticks(T).tickSize(-R)),p.select("#y_axis").call(_.scale(D).ticks(I).tickSize(-E)),p.selectAll(".tick line").style("stroke","#422B25"),$.data(n.value.stations).attr("cx",S=>z(S.x)).attr("cy",S=>D(S.z)),K.data(n.value.stations).attr("x",S=>z(S.x)).attr("y",S=>D(S.z)-14),U.data(n.value.bolts).attr("x1",S=>z(S.station_a.x)).attr("y1",S=>D(S.station_a.z)).attr("x2",S=>z(S.turn.x)).attr("y2",S=>D(S.turn.z)),P.data(n.value.bolts).attr("x1",S=>z(S.turn.x)).attr("y1",S=>D(S.turn.z)).attr("x2",S=>z(S.station_b.x)).attr("y2",S=>D(S.station_b.z))}function lt(l){e.value=l.name+" { X: "+l.x+" , Z: "+l.z+" }"}function Dt(l,z){s={name:z.name,description:"",colour:"",x:z.x,z:z.z},i.x=z.x,i.z=z.z,e.value="Draw bolt from "+s.name}function At(l,z){if(!s.name||z.name===s.name)return;const D={name:i.name,description:i.description,colour:i.colour,x:i.x,z:i.z};n.value.bolts.push({directed:!1,station_a:D,turn:q(D,z),station_b:z,length:F(s,z),colour:"#8f7f10"}),x(),X(),e.value+=" to "+z.name}function Nt(l,z,D){l.select("#temp-line").remove();const S=l.node(),ot=S.createSVGPoint();ot.x=D[0]+1,ot.y=D[1];const gt=S.getScreenCTM(),ft=ot.matrixTransform(gt.inverse()),Yt=ft.x-k.left,Gt=ft.y-k.top,at={name:"",colour:"",description:"",x:h.invert(Yt),z:a.invert(Gt)},Lt=M.rescaleX(h),Xt=M.rescaleY(a);z.x=Lt(i.x),z.z=Xt(i.z),at.x=h(at.x),at.z=a(at.z);const kt=q(z,at),$t=[{start:z,end:kt},{start:kt,end:at}];l.append("g").attr("id","temp-line").attr("transform",`translate(${k.left}, ${k.top})`).selectAll("line").data($t).enter().append("line").attr("x1",Q=>Q.start.x).attr("y1",Q=>Q.start.z).attr("x2",Q=>Q.end.x).attr("y2",Q=>Q.end.z).style("stroke","gray").style("stroke-width",2).style("stroke-dasharray","5 5")}}async function N(){const G=Date.now();switch(g.value){case"None":{n.value.bolts=[];break}case"Star graph":{n.value=Ct(n.value,b.value,v.value);break}case"Complete graph":{n.value=Et(n.value);break}case"Nearest neighbor":{await ve(n.value,k=>{n.value=k,x()});break}case"Hamiltonian cycle":{n.value=ye(n.value);break}case"Prim's algorithm":{n.value=Te(n.value);break}case"Kruskal's algorithm":{n.value=Pe(Et(n.value));break}}e.value="Processing time: "+(Date.now()-G)+"ms",C.value&&(n.value=Me(n.value)),x(),X()}function X(){[d.value,u.value]=be(n.value),B.value&&(c.value=ze(n.value))}return qt(()=>{window.removeEventListener("resize",x)}),(G,k)=>{const V=_e,Y=Jt;return tt(),it(Qt,null,[w("div",Ce,[Ve,ct(V,{"aria-label":"Graph type",modelValue:H(g),"onUpdate:modelValue":k[0]||(k[0]=E=>xt(g)?g.value=E:null),onChange:N},{default:st(()=>[Ee,De,Ae,Ne,Ye,Ge,Le]),_:1},8,["modelValue"]),H(g)==="Star graph"?(tt(),it("div",Xe,[ct(V,{modelValue:H(b),"onUpdate:modelValue":k[1]||(k[1]=E=>xt(b)?b.value=E:null),onChange:N},{default:st(()=>[$e,Re]),_:1},8,["modelValue"]),ct(V,{modelValue:H(v),"onUpdate:modelValue":k[2]||(k[2]=E=>xt(v)?v.value=E:null),onChange:N},{default:st(()=>[Ue,He,Ke,je,We]),_:1},8,["modelValue"])])):_t("",!0)]),w("div",Fe,[w("p",Oe,[O("Stations:"),qe,H(n).stations?(tt(),it("span",Ze,ut(H(n).stations.length),1)):(tt(),it("span",Qe,"0"))]),w("p",Je,[O("Bolt length:"),tn,w("span",en,ut(Math.round(H(d)))+" blocks",1)]),w("p",nn,[O("Tunnel length:"),on,w("span",an,ut(Math.round(H(u)))+" blocks",1)]),H(B)?(tt(),it("p",sn,[O("Average travel time:"),rn,w("span",ln,ut(Math.round(H(c)*100)/100)+" s",1)])):_t("",!0),ct(Y,{to:"/settings",title:"Setting page",class:"text-xs"},{default:st(()=>[O("Settings ->"),cn]),_:1}),H(B)?(tt(),Zt(Y,{key:1,to:"/heatmap",title:"Distance matrix heatmap",class:"text-xs"},{default:st(()=>[O("Heatmap ->"),un]),_:1})):_t("",!0),ct(Y,{to:"/scatterplot",title:"Scatter plot",class:"text-xs"},{default:st(()=>[O("Scatter plot ->")]),_:1})]),w("p",hn,ut(H(e)),1),fn,dn],64)}}});export{yn as default};