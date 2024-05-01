import{_ as A}from"./CTGTP2KQ.js";import{f as N,h as G,o as _,c as g,i as v,q as H,a as e,j as E,_ as P,F as J,s as K,b as r,w as d,d as u,x as $,y as q,r as R,g as X,u as b,l as L,t as Z,n as Q,m as W}from"./U3-ZX0SS.js";import j from"./CiEthyDG.js";import{u as Y}from"./ErMchg64.js";import{u as y}from"./B-WDjgS2.js";import"./CvPl5tTm.js";const ee={class:"relative inline-flex cursor-pointer mb-3"},te=e("div",{class:"w-11 h-6 rounded-full peer bg-secondary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"},null,-1),oe={class:"ml-3 text-sm font-medium"},se=N({__name:"Toggle",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(f){const l=G(f,"modelValue");return(w,x)=>(_(),g("label",ee,[v(e("input",{"onUpdate:modelValue":x[0]||(x[0]=m=>l.value=m),type:"checkbox",class:"sr-only peer"},null,512),[[H,l.value]]),te,e("span",oe,[E(w.$slots,"default")])]))}}),ne={},le={type:"button",class:"w-full text-background bg-primary hover:bg-background hover:text-primary border-2 border-primary rounded-sm py-1 me-2 mb-2"};function ae(f,l){return _(),g("button",le,[E(f.$slots,"default")])}const B=P(ne,[["render",ae]]),re={class:"w-full h-screen overflow-y-auto"},ce={class:"w-full text-sm text-left rtl:text-right"},ie=e("thead",{class:"text-xs bg-[#49291E]"},[e("tr",null,[e("th",{scope:"col",class:"px-6 py-3"}," STATION NAME "),e("th",{scope:"col",class:"px-6 py-3"}," DESCRIPTION "),e("th",{scope:"col",class:"px-6 py-3"}," ASSIGNED COLOUR "),e("th",{scope:"col",class:"px-6 py-3"}," X "),e("th",{scope:"col",class:"px-6 py-3"}," Z "),e("th",{scope:"col",class:""})])],-1),de={class:"px-6 py-4 font-medium whitespace-nowrap"},ue=["onUpdate:modelValue"],pe={class:"px-6 py-4"},me=["onUpdate:modelValue"],_e=["onUpdate:modelValue"],fe={class:"px-6 py-4"},xe=["onUpdate:modelValue"],he={class:"px-6 py-4"},be=["onUpdate:modelValue"],ye={class:"px-6 py-4"},ve=["onClick"],ge={colspan:"5",class:"px-6 py-4"},we=N({__name:"Table",props:{stations:{}},setup(f){const l=f,w=()=>{l.stations.push({name:"New Station",description:"",colour:"#f2a788",x:0,z:0})},x=m=>{l.stations.splice(m,1)};return(m,S)=>{const k=j,h=B;return _(),g("div",re,[e("table",ce,[ie,e("tbody",null,[(_(!0),g(J,null,K(l.stations,(a,C)=>(_(),g("tr",{key:C,class:"even:bg-[#49291E] odd:bg-background text-accent"},[e("td",de,[v(e("input",{"onUpdate:modelValue":c=>a.name=c,class:"w-full",style:{"background-color":"transparent"}},null,8,ue),[[$,a.name]])]),e("td",pe,[v(e("input",{"onUpdate:modelValue":c=>a.description=c,class:"w-full",style:{"background-color":"transparent"}},null,8,me),[[$,a.description]])]),e("td",{class:"px-6 py-4",style:q({color:a.colour})},[v(e("input",{"onUpdate:modelValue":c=>a.colour=c,class:"w-full",style:{"background-color":"transparent"}},null,8,_e),[[$,a.colour]])],4),e("td",fe,[v(e("input",{"onUpdate:modelValue":c=>a.x=c,class:"w-full",style:{"background-color":"transparent"}},null,8,xe),[[$,a.x,void 0,{number:!0}]])]),e("td",he,[v(e("input",{"onUpdate:modelValue":c=>a.z=c,class:"w-full",style:{"background-color":"transparent"}},null,8,be),[[$,a.z,void 0,{number:!0}]])]),e("td",ye,[e("button",{onClick:c=>x(C)},[r(k,{class:"my-auto",name:"octicon:trashcan",size:"14px"})],8,ve)])]))),128)),e("tr",null,[e("td",ge,[r(h,{onClick:w},{default:d(()=>[u("Add")]),_:1})])])])])])}}}),ke={class:"flex"},Ce={class:"min-w-[520px] w-[520px] flex flex-col"},Ve={class:"p-5 my-auto flex flex-col"},Ue=e("a",{class:"underline cursor-pointer text-xl text-primary mb-7 font-extrabold",href:"https://github.com/KK-mp4/Bolt-Routing-Problem-V2?tab=readme-ov-file#piston-bolt-network-builder-for-minecraft-v2-wip",target:"_blank",rel:"noopener noreferrer",title:"GitHub"}," User guide available on GitHub: ",-1),$e=e("p",{class:"text-xs text-primary"},"Displays station labels next to graph vertices",-1),Se=e("p",{class:"text-xs text-primary"},"Colours graph randomly after generation",-1),Le=e("p",{class:"text-xs text-primary"},"Slows processing time, but unlocks distance matrix heatmap",-1),Ne=e("div",{class:"w-full h-0 border border-primary mb-7"},null,-1),Re=e("div",{class:"w-full h-0 border border-primary mb-7"},null,-1),Ee={class:"fixed bottom-0 left-0 text-sm select-none"},je={class:"flex-1 h-screen"},Me=N({__name:"settings",setup(f){Y({title:"Settings"});const l=y("piston-bolt-network",{}),w=y("distance-matrix",{}),x=y("scatter-plot",{}),m=y("show-labels",!1),S=y("colour-graph",!1),k=y("calculate-stats",!0),h=R("");let a=0;const C=R(null);X(async()=>{if(!l.value.stations){const o=await(await fetch("/data/network.json")).json();l.value=o}});function c(){h.value="Changes saved.";for(let s=0;s<a;++s)h.value+=".";a++,a>=30&&(h.value+="is this funny to you?")}const T=()=>{var s;(s=C.value)==null||s.click()};function O(s){const n=s.target.files[0];if(n){const t=new FileReader;(i=>new Promise((U,p)=>{t.onload=()=>{t.result?U(t.result.toString()):p(new Error("Failed to read file"))},t.onerror=p,t.readAsText(i)}))(n).then(i=>{try{l.value=JSON.parse(i)}catch(U){console.error("Error parsing JSON:",U)}}).catch(i=>{console.error("Error reading file:",i)})}}function I(){const s=JSON.stringify(l.value,null,4),o=new Blob([s],{type:"application/json"}),n=window.URL.createObjectURL(o),t=document.createElement("a");t.href=n,t.download="network.json",document.body.appendChild(t),t.click(),window.URL.revokeObjectURL(n)}function z(){const s=D(w.value),o=new Blob([s],{type:"text/csv"}),n=window.URL.createObjectURL(o),t=document.createElement("a");t.href=n,t.download="distance_matrix.csv",document.body.appendChild(t),t.click(),window.URL.revokeObjectURL(n)}function D(s){const o=s.map(t=>t.station_name);let n=';"'+o.join('";"')+`"
`;for(let t=0;t<s.length;t++)n+=`"${o[t]}";"${s[t].values.join('";"')}"
`;return n}function M(){const s=F(x.value),o=new Blob([s],{type:"text/csv"}),n=window.URL.createObjectURL(o),t=document.createElement("a");t.href=n,t.download="scatter-plot.csv",document.body.appendChild(t),t.click(),window.URL.revokeObjectURL(n)}function F(s){const o=`"Graph";"Total tunnel length, blocks";"Average travel time, s"
`;let n="";for(const t of s)n+=`"${t.graph_name}";${t.length};${t.time}
`;return o+n}return(s,o)=>{const n=A,t=se,V=j,i=B,U=we;return _(),g("div",ke,[e("div",Ce,[r(n,{to:"/",title:"Go back to main page",class:"fixed top-3 left-3 text-xs"},{default:d(()=>[u("← Back")]),_:1}),e("div",Ve,[Ue,r(t,{modelValue:b(m),"onUpdate:modelValue":o[0]||(o[0]=p=>L(m)?m.value=p:null),onChange:c},{default:d(()=>[u("Show station labels"),$e]),_:1},8,["modelValue"]),r(t,{modelValue:b(S),"onUpdate:modelValue":o[1]||(o[1]=p=>L(S)?S.value=p:null),onChange:c},{default:d(()=>[u("Colour graph automatically"),Se]),_:1},8,["modelValue"]),r(t,{modelValue:b(k),"onUpdate:modelValue":o[2]||(o[2]=p=>L(k)?k.value=p:null),onChange:c},{default:d(()=>[u("Calculate average travel time"),Le]),_:1},8,["modelValue"]),Ne,r(i,{onClick:T},{default:d(()=>[u("Import network"),r(V,{class:"ml-3 my-auto",name:"bi:filetype-json",size:"16px"})]),_:1}),e("input",{type:"file",ref_key:"fileInput",ref:C,style:{display:"none"},onChange:O},null,544),r(i,{onClick:o[3]||(o[3]=p=>l.value={stations:[],bolts:[]})},{default:d(()=>[u("Clear network")]),_:1}),Re,r(i,{onClick:I},{default:d(()=>[u("Export network"),r(V,{class:"ml-3 my-auto",name:"bi:filetype-json",size:"16px"})]),_:1}),r(i,{onClick:z},{default:d(()=>[u("Export distance matrix"),r(V,{class:"ml-3 my-auto",name:"bi:filetype-csv",size:"16px"})]),_:1}),r(i,{onClick:M},{default:d(()=>[u("Export scatter plot"),r(V,{class:"ml-3 my-auto",name:"bi:filetype-csv",size:"16px"})]),_:1})]),e("p",Ee,Z(b(h)),1)]),e("div",je,[b(l).stations?(_(),Q(U,{key:0,stations:b(l).stations},null,8,["stations"])):W("",!0)])])}}});export{Me as default};