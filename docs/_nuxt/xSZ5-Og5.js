var Lt=Object.defineProperty;var Xt=(t,e,n)=>e in t?Lt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var St=(t,e,n)=>(Xt(t,typeof e!="symbol"?e+"":e,n),n);import{i as $t,j as Rt,v as Kt,o as J,c as it,k as Ut,f as Ht,r as dt,g as jt,h as Ft,a as z,b as ct,w as st,u as U,l as gt,m as _t,d as W,t as ut,n as Wt,F as Ot}from"./2wVEZbMm.js";import{_ as qt}from"./nUSJSnn5.js";import{a as q,u as Zt}from"./Df9W8ATY.js";import{s as j,d as Qt,c as wt,T as xt,e as vt,m as Tt,l as It,b as Jt,a as te}from"./B7PevS6S.js";import"./BV8tGG9l.js";function ee(t){let e;for(;e=t.sourceEvent;)t=e;return t}function Q(t,e){if(t=ee(t),e===void 0&&(e=t.currentTarget),e){var n=e.ownerSVGElement||e;if(n.createSVGPoint){var s=n.createSVGPoint();return s.x=t.clientX,s.y=t.clientY,s=s.matrixTransform(e.getScreenCTM().inverse()),[s.x,s.y]}if(e.getBoundingClientRect){var i=e.getBoundingClientRect();return[t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop]}}return[t.pageX,t.pageY]}const bt={capture:!0,passive:!1};function zt(t){t.preventDefault(),t.stopImmediatePropagation()}function ne(t){var e=t.document.documentElement,n=j(t).on("dragstart.drag",zt,bt);"onselectstart"in e?n.on("selectstart.drag",zt,bt):(e.__noselect=e.style.MozUserSelect,e.style.MozUserSelect="none")}function oe(t,e){var n=t.document.documentElement,s=j(t).on("dragstart.drag",null);e&&(s.on("click.drag",zt,bt),setTimeout(function(){s.on("click.drag",null)},0)),"onselectstart"in n?s.on("selectstart.drag",null):(n.style.MozUserSelect=n.__noselect,delete n.__noselect)}var ae=1e-12;function Bt(t){return((t=Math.exp(t))+1/t)/2}function se(t){return((t=Math.exp(t))-1/t)/2}function ie(t){return((t=Math.exp(2*t))-1)/(t+1)}const re=function t(e,n,s){function i(r,f){var d=r[0],u=r[1],l=r[2],g=f[0],v=f[1],y=f[2],M=g-d,D=v-u,C=M*M+D*D,I,_;if(C<ae)_=Math.log(y/l)/e,I=function(P){return[d+P*M,u+P*D,l*Math.exp(e*P*_)]};else{var N=Math.sqrt(C),A=(y*y-l*l+s*C)/(2*l*n*N),w=(y*y-l*l-s*C)/(2*y*n*N),Y=Math.log(Math.sqrt(A*A+1)-A),V=Math.log(Math.sqrt(w*w+1)-w);_=(V-Y)/e,I=function(P){var $=P*_,tt=Bt(Y),et=l/(n*N)*(tt*ie(e*$+Y)-se(Y));return[d+et*M,u+et*D,l*tt/Bt(e*$+Y)]}}return I.duration=_*1e3*e/Math.SQRT2,I}return i.rho=function(r){var f=Math.max(.001,+r),d=f*f,u=d*d;return t(f,d,u)},i}(Math.SQRT2,2,4),mt=t=>()=>t;function le(t,{sourceEvent:e,target:n,transform:s,dispatch:i}){Object.defineProperties(this,{type:{value:t,enumerable:!0,configurable:!0},sourceEvent:{value:e,enumerable:!0,configurable:!0},target:{value:n,enumerable:!0,configurable:!0},transform:{value:s,enumerable:!0,configurable:!0},_:{value:i}})}function yt(t){t.stopImmediatePropagation()}function ht(t){t.preventDefault(),t.stopImmediatePropagation()}function ce(t){return(!t.ctrlKey||t.type==="wheel")&&!t.button}function ue(){var t=this;return t instanceof SVGElement?(t=t.ownerSVGElement||t,t.hasAttribute("viewBox")?(t=t.viewBox.baseVal,[[t.x,t.y],[t.x+t.width,t.y+t.height]]):[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]):[[0,0],[t.clientWidth,t.clientHeight]]}function Pt(){return this.__zoom||wt}function he(t){return-t.deltaY*(t.deltaMode===1?.05:t.deltaMode?1:.002)*(t.ctrlKey?10:1)}function fe(){return navigator.maxTouchPoints||"ontouchstart"in this}function de(t,e,n){var s=t.invertX(e[0][0])-n[0][0],i=t.invertX(e[1][0])-n[1][0],r=t.invertY(e[0][1])-n[0][1],f=t.invertY(e[1][1])-n[1][1];return t.translate(i>s?(s+i)/2:Math.min(0,s)||Math.max(0,i),f>r?(r+f)/2:Math.min(0,r)||Math.max(0,f))}function me(){var t=ce,e=ue,n=de,s=he,i=fe,r=[0,1/0],f=[[-1/0,-1/0],[1/0,1/0]],d=250,u=re,l=Qt("start","zoom","end"),g,v,y,M=500,D=150,C=0,I=10;function _(o){o.property("__zoom",Pt).on("wheel.zoom",$,{passive:!1}).on("mousedown.zoom",tt).on("dblclick.zoom",et).filter(i).on("touchstart.zoom",nt).on("touchmove.zoom",rt).on("touchend.zoom touchcancel.zoom",ot).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}_.transform=function(o,c,a,m){var x=o.selection?o.selection():o;x.property("__zoom",Pt),o!==x?Y(o,c,a,m):x.interrupt().each(function(){V(this,arguments).event(m).start().zoom(null,typeof c=="function"?c.apply(this,arguments):c).end()})},_.scaleBy=function(o,c,a,m){_.scaleTo(o,function(){var x=this.__zoom.k,p=typeof c=="function"?c.apply(this,arguments):c;return x*p},a,m)},_.scaleTo=function(o,c,a,m){_.transform(o,function(){var x=e.apply(this,arguments),p=this.__zoom,b=a==null?w(x):typeof a=="function"?a.apply(this,arguments):a,T=p.invert(b),B=typeof c=="function"?c.apply(this,arguments):c;return n(A(N(p,B),b,T),x,f)},a,m)},_.translateBy=function(o,c,a,m){_.transform(o,function(){return n(this.__zoom.translate(typeof c=="function"?c.apply(this,arguments):c,typeof a=="function"?a.apply(this,arguments):a),e.apply(this,arguments),f)},null,m)},_.translateTo=function(o,c,a,m,x){_.transform(o,function(){var p=e.apply(this,arguments),b=this.__zoom,T=m==null?w(p):typeof m=="function"?m.apply(this,arguments):m;return n(wt.translate(T[0],T[1]).scale(b.k).translate(typeof c=="function"?-c.apply(this,arguments):-c,typeof a=="function"?-a.apply(this,arguments):-a),p,f)},m,x)};function N(o,c){return c=Math.max(r[0],Math.min(r[1],c)),c===o.k?o:new xt(c,o.x,o.y)}function A(o,c,a){var m=c[0]-a[0]*o.k,x=c[1]-a[1]*o.k;return m===o.x&&x===o.y?o:new xt(o.k,m,x)}function w(o){return[(+o[0][0]+ +o[1][0])/2,(+o[0][1]+ +o[1][1])/2]}function Y(o,c,a,m){o.on("start.zoom",function(){V(this,arguments).event(m).start()}).on("interrupt.zoom end.zoom",function(){V(this,arguments).event(m).end()}).tween("zoom",function(){var x=this,p=arguments,b=V(x,p).event(m),T=e.apply(x,p),B=a==null?w(T):typeof a=="function"?a.apply(x,p):a,R=Math.max(T[1][0]-T[0][0],T[1][1]-T[0][1]),E=x.__zoom,L=typeof c=="function"?c.apply(x,p):c,K=u(E.invert(B).concat(R/E.k),L.invert(B).concat(R/L.k));return function(X){if(X===1)X=L;else{var H=K(X),lt=R/H[2];X=new xt(lt,B[0]-H[0]*lt,B[1]-H[1]*lt)}b.zoom(null,X)}})}function V(o,c,a){return!a&&o.__zooming||new P(o,c)}function P(o,c){this.that=o,this.args=c,this.active=0,this.sourceEvent=null,this.extent=e.apply(o,c),this.taps=0}P.prototype={event:function(o){return o&&(this.sourceEvent=o),this},start:function(){return++this.active===1&&(this.that.__zooming=this,this.emit("start")),this},zoom:function(o,c){return this.mouse&&o!=="mouse"&&(this.mouse[1]=c.invert(this.mouse[0])),this.touch0&&o!=="touch"&&(this.touch0[1]=c.invert(this.touch0[0])),this.touch1&&o!=="touch"&&(this.touch1[1]=c.invert(this.touch1[0])),this.that.__zoom=c,this.emit("zoom"),this},end:function(){return--this.active===0&&(delete this.that.__zooming,this.emit("end")),this},emit:function(o){var c=j(this.that).datum();l.call(o,this.that,new le(o,{sourceEvent:this.sourceEvent,target:_,type:o,transform:this.that.__zoom,dispatch:l}),c)}};function $(o,...c){if(!t.apply(this,arguments))return;var a=V(this,c).event(o),m=this.__zoom,x=Math.max(r[0],Math.min(r[1],m.k*Math.pow(2,s.apply(this,arguments)))),p=Q(o);if(a.wheel)(a.mouse[0][0]!==p[0]||a.mouse[0][1]!==p[1])&&(a.mouse[1]=m.invert(a.mouse[0]=p)),clearTimeout(a.wheel);else{if(m.k===x)return;a.mouse=[p,m.invert(p)],vt(this),a.start()}ht(o),a.wheel=setTimeout(b,D),a.zoom("mouse",n(A(N(m,x),a.mouse[0],a.mouse[1]),a.extent,f));function b(){a.wheel=null,a.end()}}function tt(o,...c){if(y||!t.apply(this,arguments))return;var a=o.currentTarget,m=V(this,c,!0).event(o),x=j(o.view).on("mousemove.zoom",B,!0).on("mouseup.zoom",R,!0),p=Q(o,a),b=o.clientX,T=o.clientY;ne(o.view),yt(o),m.mouse=[p,this.__zoom.invert(p)],vt(this),m.start();function B(E){if(ht(E),!m.moved){var L=E.clientX-b,K=E.clientY-T;m.moved=L*L+K*K>C}m.event(E).zoom("mouse",n(A(m.that.__zoom,m.mouse[0]=Q(E,a),m.mouse[1]),m.extent,f))}function R(E){x.on("mousemove.zoom mouseup.zoom",null),oe(E.view,m.moved),ht(E),m.event(E).end()}}function et(o,...c){if(t.apply(this,arguments)){var a=this.__zoom,m=Q(o.changedTouches?o.changedTouches[0]:o,this),x=a.invert(m),p=a.k*(o.shiftKey?.5:2),b=n(A(N(a,p),m,x),e.apply(this,c),f);ht(o),d>0?j(this).transition().duration(d).call(Y,b,m,o):j(this).call(_.transform,b,m,o)}}function nt(o,...c){if(t.apply(this,arguments)){var a=o.touches,m=a.length,x=V(this,c,o.changedTouches.length===m).event(o),p,b,T,B;for(yt(o),b=0;b<m;++b)T=a[b],B=Q(T,this),B=[B,this.__zoom.invert(B),T.identifier],x.touch0?!x.touch1&&x.touch0[2]!==B[2]&&(x.touch1=B,x.taps=0):(x.touch0=B,p=!0,x.taps=1+!!g);g&&(g=clearTimeout(g)),p&&(x.taps<2&&(v=B[0],g=setTimeout(function(){g=null},M)),vt(this),x.start())}}function rt(o,...c){if(this.__zooming){var a=V(this,c).event(o),m=o.changedTouches,x=m.length,p,b,T,B;for(ht(o),p=0;p<x;++p)b=m[p],T=Q(b,this),a.touch0&&a.touch0[2]===b.identifier?a.touch0[0]=T:a.touch1&&a.touch1[2]===b.identifier&&(a.touch1[0]=T);if(b=a.that.__zoom,a.touch1){var R=a.touch0[0],E=a.touch0[1],L=a.touch1[0],K=a.touch1[1],X=(X=L[0]-R[0])*X+(X=L[1]-R[1])*X,H=(H=K[0]-E[0])*H+(H=K[1]-E[1])*H;b=N(b,Math.sqrt(X/H)),T=[(R[0]+L[0])/2,(R[1]+L[1])/2],B=[(E[0]+K[0])/2,(E[1]+K[1])/2]}else if(a.touch0)T=a.touch0[0],B=a.touch0[1];else return;a.zoom("touch",n(A(b,T,B),a.extent,f))}}function ot(o,...c){if(this.__zooming){var a=V(this,c).event(o),m=o.changedTouches,x=m.length,p,b;for(yt(o),y&&clearTimeout(y),y=setTimeout(function(){y=null},M),p=0;p<x;++p)b=m[p],a.touch0&&a.touch0[2]===b.identifier?delete a.touch0:a.touch1&&a.touch1[2]===b.identifier&&delete a.touch1;if(a.touch1&&!a.touch0&&(a.touch0=a.touch1,delete a.touch1),a.touch0)a.touch0[1]=this.__zoom.invert(a.touch0[0]);else if(a.end(),a.taps===2&&(b=Q(b,this),Math.hypot(v[0]-b[0],v[1]-b[1])<I)){var T=j(this).on("dblclick.zoom");T&&T.apply(this,arguments)}}}return _.wheelDelta=function(o){return arguments.length?(s=typeof o=="function"?o:mt(+o),_):s},_.filter=function(o){return arguments.length?(t=typeof o=="function"?o:mt(!!o),_):t},_.touchable=function(o){return arguments.length?(i=typeof o=="function"?o:mt(!!o),_):i},_.extent=function(o){return arguments.length?(e=typeof o=="function"?o:mt([[+o[0][0],+o[0][1]],[+o[1][0],+o[1][1]]]),_):e},_.scaleExtent=function(o){return arguments.length?(r[0]=+o[0],r[1]=+o[1],_):[r[0],r[1]]},_.translateExtent=function(o){return arguments.length?(f[0][0]=+o[0][0],f[1][0]=+o[1][0],f[0][1]=+o[0][1],f[1][1]=+o[1][1],_):[[f[0][0],f[0][1]],[f[1][0],f[1][1]]]},_.constrain=function(o){return arguments.length?(n=o,_):n},_.duration=function(o){return arguments.length?(d=+o,_):d},_.interpolate=function(o){return arguments.length?(u=o,_):u},_.on=function(){var o=l.on.apply(l,arguments);return o===l?_:o},_.clickDistance=function(o){return arguments.length?(C=(o=+o)*o,_):Math.sqrt(C)},_.tapDistance=function(o){return arguments.length?(I=+o,_):I},_}const pe={__name:"Select",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(t){const e=$t(t,"modelValue");return(n,s)=>Rt((J(),it("select",{"onUpdate:modelValue":s[1]||(s[1]=i=>e.value=i),class:"mt-3 rounded-sm bg-primary text-background w-full font-bold outline-none select-none"},[Ut(n.$slots,"default",{onChange:s[0]||(s[0]=i=>n.$emit("update:modelValue"))})],512)),[[Kt,e.value]])}};function O(t,e){const n=t.x-e.x,s=t.z-e.z,i=Math.abs(n),r=Math.abs(s);let f,d;const u=s>=0?-1:1,l=n>=0?-1:1;return i>=r?(f=t.x+l*r,d=t.z+u*r):(f=t.x+l*i,d=t.z+u*i),{x:f,z:d}}function F(t,e){return Math.max(Math.abs(t.x-e.x),Math.abs(t.z-e.z))}function Ct(t,e,n,s,i){t.bolts=[];const r=t.stations,f=r.length;let d=0,u=0;if(n==="track"&&s!==void 0&&i!==void 0)d=s,u=i;else if(n==="median"){const g=r.map(y=>y.x),v=r.map(y=>y.z);d=Math.round(Vt(g)),u=Math.round(Vt(v))}else if(n==="average"){const g=r.reduce((y,M)=>y+M.x,0),v=r.reduce((y,M)=>y+M.z,0);d=Math.round(g/f),u=Math.round(v/f)}else n==="spawn"&&(d=-80,u=-176);const l={name:"Mergeing point",description:"",colour:"",x:d,z:u};for(let g=0;g<f;++g){const v=r[g];let y;const M=Math.abs(v.x-l.x)/Math.abs(v.z-l.z);e==8&&M>.57735&&M<1.7321?y=O(l,v):y=O(v,l),t.bolts.push({directed:!1,station_a:v,turn:y,station_b:l,length:F(v,l),colour:"#8f7f10"})}return t}function Vt(t){if(t.length===0)throw new Error("Input array is empty");t=[...t].sort((n,s)=>n-s);const e=Math.floor(t.length/2);return t.length%2?t[e]:(t[e-1]+t[e])/2}function Et(t){t.bolts=[];const e=t.stations,n=e.length;for(let s=0;s<n;++s)for(let i=s+1;i<n;++i){const r=e[s],f=e[i];t.bolts.push({directed:!1,station_a:r,turn:O(r,f),station_b:f,length:F(r,f),colour:"#8f7f10"})}return t}async function ge(t,e){t.bolts=[];const n=t.stations,s=n.length;let i={stations:[],bolts:[]},r=1/0;for(let f=0;f<s;++f){let d=function(M){let D=1/0,C=null;for(let I=0;I<s;++I)if(!u[I]){const _=n[I],N=F(M,_);N<D&&(D=N,C=_)}return C};const u=new Array(s).fill(!1);let l=n[f];u[f]=!0;const g=[];let v;for(;(v=d(l))!==null;)g.push({directed:!1,station_a:l,turn:O(l,v),station_b:v,length:F(l,v),colour:"#8f7f10"}),u[n.indexOf(v)]=!0,l=v;const y=g.reduce((M,D)=>M+D.length,0);y<r&&(i={stations:n.slice(),bolts:g.slice()},r=y,e(i),await new Promise(M=>setTimeout(M,0)))}}function _e(t){const e=t.stations,n=e.length;let s={stations:[],bolts:[]},i=1/0;for(let r=0;r<n;++r){let f=function(y){let M=1/0,D=null;for(let C=0;C<n;++C)if(!d[C]){const I=e[C],_=F(y,I);_<M&&(M=_,D=I)}return D};const d=new Array(n).fill(!1);let u=e[r];d[r]=!0;const l=[];let g;for(;(g=f(u))!==null;)l.push({directed:!0,station_a:u,turn:O(u,g),station_b:g,length:F(u,g),colour:"#8f7f10"}),d[e.indexOf(g)]=!0,u=g;l.push({directed:!0,station_a:u,turn:O(u,e[r]),station_b:e[r],length:F(u,e[r]),colour:"#8f7f10"});const v=l.reduce((y,M)=>y+M.length,0);v<i&&(s={stations:e.slice(),bolts:l.slice()},i=v)}return s}function xe(t){let e=0,n=0;return t.bolts.forEach(s=>{n+=s.length,s.directed===!1&&(e+=s.length)}),e+=n,[e,n]}function ve(t){const e=t.stations,n=t.bolts,s=e.length,i=Number.POSITIVE_INFINITY,r=Array.from({length:s},()=>Array(s).fill(i));for(let u=0;u<s;++u)r[u][u]=0;for(const u of n){const l=e.find(v=>v.name===u.station_a.name),g=e.find(v=>v.name===u.station_b.name);if(l&&g){const v=e.indexOf(l),y=e.indexOf(g);r[v][y]=u.length,r[y][v]=u.length}}for(let u=0;u<s;++u)for(let l=0;l<s;++l)for(let g=0;g<s;++g)r[l][u]!==i&&r[u][g]!==i&&(r[l][g]=Math.min(r[l][g],r[l][u]+r[u][g]));let f=0,d=0;for(let u=0;u<s;++u)for(let l=0;l<s;++l)u!==l&&r[u][l]!==i&&(f+=r[u][l],d++);return ye(r,e),f/d/20}function ye(t,e){const n=[];for(let i=0;i<e.length;++i){const f={station_name:e[i].name,values:[]};for(let d=0;d<e.length;++d)f.values.push(t[i][d]);n.push(f)}const s=JSON.stringify(n);localStorage.setItem("distance-matrix",s)}function be(t){return t.stations.forEach(e=>{e.colour=ze(e.name)}),t.bolts.forEach(e=>{const n=t.stations.find(s=>s.name===e.station_b.name);n?e.colour=n.colour:console.error(`Station ${e.station_b.name} not found in network.`)}),t}function ze(t){const e=we(t),n=80,s=74,i=(1-Math.abs(2*(s/100)-1))*(n/100),r=i*(1-Math.abs(e/60%2-1)),f=s/100-i/2;let d=0,u=0,l=0;e>=0&&e<60?(d=i,u=r):e>=60&&e<120?(d=r,u=i):e>=120&&e<180?(u=i,l=r):e>=180&&e<240?(u=r,l=i):e>=240&&e<300?(d=r,l=i):e>=300&&e<360&&(d=i,l=r);const g=y=>{const M=Math.round(y*255).toString(16);return M.length===1?"0"+M:M};return`#${g(d+f)}${g(u+f)}${g(l+f)}`.toUpperCase()}function we(t){let e=0;for(let n=0;n<t.length;++n)e=(e<<5)-e+t.charCodeAt(n),e|=0;return Math.abs(e%360)}q("scatter-plot",{});function Me(t){const e=t.stations,n=e.length,s=new Array(n).fill(!1),i=new Array(n).fill(-1),r=new Array(n).fill(1/0);r[0]=0;for(let d=0;d<n-1;++d){const u=ke(r,s);s[u]=!0;for(let l=0;l<n;++l){const g=F(e[u],e[l]);g!==0&&!s[l]&&g<r[l]&&(i[l]=u,r[l]=g)}}const f=[];for(let d=1;d<n;++d)f.push({directed:!1,station_a:{name:e[i[d]].name,x:e[i[d]].x,z:e[i[d]].z},turn:O(e[i[d]],e[d]),station_b:{name:e[d].name,x:e[d].x,z:e[d].z},length:F(e[i[d]],e[d]),colour:"#8f7f10"});return{stations:e.slice(),bolts:f}}function ke(t,e){let n=1/0,s=-1;for(let i=0;i<t.length;i++)!e[i]&&t[i]<n&&(n=t[i],s=i);return s}class Se{constructor(e){St(this,"parent");this.parent=Array(e).fill(-1)}find(e){let n=e;for(;this.parent[n]!==-1;)n=this.parent[n];let s=e;for(;s!==n;){const i=this.parent[s];if(i===s)break;this.parent[s]=n,s=i}return n}union(e,n){const s=this.find(e),i=this.find(n);s!==i&&(this.parent[s]=i)}}function Te(t){const e=t.stations,n=t.bolts;n.sort((r,f)=>r.length-f.length);const s=new Se(e.length),i=[];return n.forEach(r=>{const f=e.findIndex(g=>g.name===r.station_a.name),d=e.findIndex(g=>g.name===r.station_b.name),u=s.find(f),l=s.find(d);u!==l&&(i.push(r),s.union(u,l))}),t.bolts=i,t}const Ie={class:"fixed top-0 right-0 w-48 backdrop-blur p-5"},Be=z("p",{class:"text-center text-accent"},[z("a",{href:"https://github.com/KK-mp4/Bolt-Routing-Problem-V2",target:"_blank",rel:"noopener noreferrer",title:"GitHub"}," Piston Bolt Network Builder "),z("span",{class:"text-[10px] text-text"},"*early alpha build by kk")],-1),Pe=z("option",{value:"None"},"None",-1),Ce=z("option",{value:"Star graph"},"Star graph (WIP)",-1),Ve=z("option",{value:"Complete graph"},"Complete graph",-1),Ee=z("option",{value:"Nearest neighbor"},"Nearest neighbor (WIP)",-1),De=z("option",{value:"Hamiltonian cycle"},"Hamiltonian cycle (WIP)",-1),Ae=z("option",{value:"Prim's algorithm"},"Prim's algorithm (WIP)",-1),Ne=z("option",{value:"Kruskal's algorithm"},"Kruskal's algorithm (WIP)",-1),Ye={key:0},Ge=z("option",{value:"4"},[W("S"),z("sub",null,"4")],-1),Le=z("option",{value:"8"},[W("S"),z("sub",null,"8")],-1),Xe=z("option",{value:"median"},"Median",-1),$e=z("option",{value:"average"},"Average",-1),Re=z("option",{value:""},"0, 0",-1),Ke=z("option",{value:"spawn"},"Spawn",-1),Ue=z("option",{value:"track"},"Track mouse",-1),He={class:"fixed top-0 left-0 backdrop-blur p-5 pb-1"},je={class:"text-xs"},Fe=z("br",null,null,-1),We={key:0,class:"text-accent"},Oe={key:1,class:"text-accent"},qe={class:"text-xs mt-1"},Ze=z("br",null,null,-1),Qe={class:"text-accent"},Je={class:"text-xs mt-1"},tn=z("br",null,null,-1),en={class:"text-accent"},nn={key:0,class:"text-xs mt-1 mb-2"},on=z("br",null,null,-1),an={class:"text-accent"},sn=z("br",null,null,-1),rn=z("br",null,null,-1),ln={class:"fixed bottom-0 left-0 text-sm select-none"},cn=z("div",{class:"fixed bottom-0 right-0 text-[10px] select-none"},[z("p",null,"pan: drag mouse1 / zoom: scroll mouse3 / connect: drag mouse3")],-1),un=z("div",{id:"network_map",class:"p-0 h-full w-full"},null,-1),_n=Ht({__name:"index",setup(t){Zt({title:"Piston Bolt Network Builder",description:"Tool for generating and editing piston bolt networks for Minecraft",ogTitle:"Piston Bolt Network Builder",ogDescription:"Tool for generating and editing piston bolt networks for Minecraft",ogImage:"/ogImage.webp",ogUrl:"https://bolt-routing-problem-v2.vercel.app/",twitterTitle:"Piston Bolt Network Builder",twitterDescription:"Tool for generating and editing piston bolt networks for Minecraft",twitterImage:"/ogImage.webp",twitterCard:"summary"});const e=dt(""),n=q("piston-bolt-network",{});let s={},i=[],r=!1;const f=dt(0),d=dt(0),u=dt(0),l=q("graph-type",""),g=q("star-graph-s",8),v=q("star-graph-merge-pos","median");let y=wt;const M=q("show-labels",!1),D=q("colour-graph",!1),C=q("calculate-stats",!0);jt(async()=>{if(window.addEventListener("resize",I),!n.value.stations){const w=await(await fetch("/data/network.json")).json();n.value=w}_()});function I(){const A=document.getElementById("network_map");A!==null&&(A.innerHTML="");const w={top:-1,right:0,bottom:50,left:75},Y=window.innerWidth,V=window.innerHeight,P=Y-w.right-w.left,$=V-w.top-w.bottom,tt=Tt(n.value.stations,h=>Math.abs(h.x))||1e3,et=Tt(n.value.stations,h=>Math.abs(h.z))||1e3,nt=Math.max(tt,et)*1.01,rt=P/$;let ot,o;rt>1?(ot=nt*rt,o=nt):(ot=nt,o=nt/rt);const c=It().domain([-o,o]).range([w.top,$]),a=It().domain([-ot,ot]).range([w.right,P]),m=Jt(c),x=te(a),p=j("#network_map").append("svg").attr("width",Y).attr("height",V);p.append("g").attr("id","y_axis").attr("transform","translate(75, 0)").call(m).style("font-family","Fira Code").style("font-size","10px"),p.append("g").attr("id","x_axis").attr("transform",`translate(${w.left}, ${V-w.bottom-w.top})`).call(x).style("font-family","Fira Code").style("font-size","10px");const b=Math.round(Math.min(P,$)/64),T=Math.round(Math.min(P,$)/64*($/P));p.select("#x_axis").call(x.scale(a).ticks(b).tickSize(-$)),p.select("#y_axis").call(m.scale(c).ticks(T).tickSize(-P)),p.selectAll(".tick line").style("stroke","#422B25");const B=p.append("g").attr("id","edges_a").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",h=>a(h.station_a.x)).attr("y1",h=>c(h.station_a.z)).attr("x2",h=>a(h.turn.x)).attr("y2",h=>c(h.turn.z)).style("stroke",h=>h.colour).style("stroke-width",1),R=p.append("g").attr("id","edges_b").attr("transform","translate(75, 0)").selectAll("line").data(n.value.bolts).enter().append("line").attr("x1",h=>a(h.turn.x)).attr("y1",h=>c(h.turn.z)).attr("x2",h=>a(h.station_b.x)).attr("y2",h=>c(h.station_b.z)).style("stroke",h=>h.colour).style("stroke-width",1),E=p.append("g").attr("id","vertices").attr("transform","translate(75, 0)").selectAll("circle").data(n.value.stations).enter().append("circle").attr("r",4).attr("cx",h=>a(h.x)).attr("cy",h=>c(h.z)).style("fill",h=>h.colour).on("click",(h,S)=>H(S)).on("mousedown",(h,S)=>{h.button===1&&lt(h,S)}).on("mouseup",(h,S)=>{h.button===1&&Dt(h,S)}),L=p.append("g").attr("id","lables").style("font-family","Fira Code").style("fill","#fbdfd8").style("font-size","10px").selectAll("text").data(n.value.stations).join("text").attr("dy","0.35em").attr("x",h=>a(h.x)).attr("y",h=>c(h.z)-14).text(h=>h.name).style("visibility",M.value?"visible":"hidden"),K=me().on("zoom",X);p.call(K),y!==void 0&&p.call(K.transform,y),p.on("mousemove",h=>{if(l.value==="Star graph"&&v.value==="track"){const S=p.node();if(!S)return;const G=S.createSVGPoint();G.x=h.offsetX,G.y=h.offsetY;const k=S.getScreenCTM();if(!k)return;const at=G.matrixTransform(k.inverse()),pt=at.x-w.left,ft=at.y-w.top;n.value=Ct(n.value,g.value,v.value,Math.round(a.invert(pt)),Math.round(c.invert(ft))),I(),N()}r&&s.name!==void 0&&(i=[h.offsetX,h.offsetY],At(p,s,i))}),p.on("mousedown",h=>{h.button===1&&(r=!0)}),p.on("mouseup",h=>{h.button===1&&(r=!1,p.select("#temp-line").remove())});function X({transform:h}){y=h,j("#y_axis").transition().duration(50).call(k=>m.scale(h.rescaleY(c))),j("#x_axis").transition().duration(50).call(k=>x.scale(h.rescaleY(a)));const S=h.rescaleX(a),G=h.rescaleY(c);p.select("#x_axis").call(x.scale(S).ticks(b).tickSize(-$)),p.select("#y_axis").call(m.scale(G).ticks(T).tickSize(-P)),p.selectAll(".tick line").style("stroke","#422B25"),E.data(n.value.stations).attr("cx",k=>S(k.x)).attr("cy",k=>G(k.z)),L.data(n.value.stations).attr("x",k=>S(k.x)).attr("y",k=>G(k.z)-14),B.data(n.value.bolts).attr("x1",k=>S(k.station_a.x)).attr("y1",k=>G(k.station_a.z)).attr("x2",k=>S(k.turn.x)).attr("y2",k=>G(k.turn.z)),R.data(n.value.bolts).attr("x1",k=>S(k.turn.x)).attr("y1",k=>G(k.turn.z)).attr("x2",k=>S(k.station_b.x)).attr("y2",k=>G(k.station_b.z)),s.name}function H(h){e.value=h.name+" { X: "+h.x+" , Z: "+h.z+" }"}function lt(h,S){s={name:S.name,description:"",colour:"",x:S.x,z:S.z},e.value="Draw bolt from "+s.name}function Dt(h,S){!s.name||S.name===s.name||(n.value.bolts.push({directed:!1,station_a:s,turn:O(s,S),station_b:S,length:F(s,S),colour:"#8f7f10"}),I(),N(),e.value+=" to "+S.name)}function At(h,S,G){h.select("#temp-line").remove();const k=h.node(),at=k.createSVGPoint();at.x=G[0]+1,at.y=G[1];const pt=k.getScreenCTM(),ft=at.matrixTransform(pt.inverse()),Nt=ft.x-w.left,Yt=ft.y-w.top,Mt={name:"",colour:"",description:"",x:a.invert(Nt),z:c.invert(Yt)},kt=O(S,Mt),Gt=[{start:S,end:kt},{start:kt,end:Mt}];h.append("g").attr("id","temp-line").attr("transform",`translate(${w.left}, ${w.top})`).selectAll("line").data(Gt).enter().append("line").attr("x1",Z=>a(Z.start.x)).attr("y1",Z=>c(Z.start.z)).attr("x2",Z=>a(Z.end.x)).attr("y2",Z=>c(Z.end.z)).style("stroke","gray").style("stroke-width",2).style("stroke-dasharray","5 5")}}async function _(){const A=Date.now();switch(l.value){case"None":{n.value.bolts=[];break}case"Star graph":{n.value=Ct(n.value,g.value,v.value);break}case"Complete graph":{n.value=Et(n.value);break}case"Nearest neighbor":{await ge(n.value,w=>{n.value=w,I()});break}case"Hamiltonian cycle":{n.value=_e(n.value);break}case"Prim's algorithm":{n.value=Me(n.value);break}case"Kruskal's algorithm":{n.value=Te(Et(n.value));break}}e.value="Processing time: "+(Date.now()-A)+"ms",D.value&&(n.value=be(n.value)),I(),N()}function N(){[f.value,d.value]=xe(n.value),C.value&&(u.value=ve(n.value))}return Ft(()=>{window.removeEventListener("resize",I)}),(A,w)=>{const Y=pe,V=qt;return J(),it(Ot,null,[z("div",Ie,[Be,ct(Y,{modelValue:U(l),"onUpdate:modelValue":w[0]||(w[0]=P=>gt(l)?l.value=P:null),onChange:_},{default:st(()=>[Pe,Ce,Ve,Ee,De,Ae,Ne]),_:1},8,["modelValue"]),U(l)==="Star graph"?(J(),it("div",Ye,[ct(Y,{modelValue:U(g),"onUpdate:modelValue":w[1]||(w[1]=P=>gt(g)?g.value=P:null),onChange:_},{default:st(()=>[Ge,Le]),_:1},8,["modelValue"]),ct(Y,{modelValue:U(v),"onUpdate:modelValue":w[2]||(w[2]=P=>gt(v)?v.value=P:null),onChange:_},{default:st(()=>[Xe,$e,Re,Ke,Ue]),_:1},8,["modelValue"])])):_t("",!0)]),z("div",He,[z("p",je,[W("Stations:"),Fe,U(n).stations?(J(),it("span",We,ut(U(n).stations.length),1)):(J(),it("span",Oe,"0"))]),z("p",qe,[W("Bolt length:"),Ze,z("span",Qe,ut(U(f))+" blocks",1)]),z("p",Je,[W("Tunnel length:"),tn,z("span",en,ut(U(d))+" blocks",1)]),U(C)?(J(),it("p",nn,[W("Average travel time:"),on,z("span",an,ut(Math.round(U(u)*100)/100)+" s",1)])):_t("",!0),ct(V,{to:"/settings",title:"Setting page",class:"text-xs"},{default:st(()=>[W("Settings ->"),sn]),_:1}),U(C)?(J(),Wt(V,{key:1,to:"/heatmap",title:"Distance matrix heatmap",class:"text-xs"},{default:st(()=>[W("Heatmap ->"),rn]),_:1})):_t("",!0),ct(V,{to:"/scatterplot",title:"Scatter plot",class:"text-xs"},{default:st(()=>[W("Scatter plot ->")]),_:1})]),z("p",ln,ut(U(e)),1),cn,un],64)}}});export{_n as default};
