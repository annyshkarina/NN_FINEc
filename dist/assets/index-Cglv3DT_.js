(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const c of d.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function a(i){if(i.ep)return;i.ep=!0;const d=n(i);fetch(i.href,d)}})();const mt=[{id:"home",label:"Home",href:"#/home"},{id:"excursions",label:"Tours",href:"#/excursions"},{id:"run",label:"Run",href:"#/run"},{id:"tasks",label:"Tasks",href:"#/tasks"},{id:"articles",label:"Articles",href:"#/articles"},{id:"profile",label:"Profile",href:"#/profile"},{id:"about",label:"About",href:"#/about"}];function ht({active:t="home"}={}){return`
    <header class="topbar">
      <div class="topbar__brand">
        <span class="topbar__title">Financial Code</span>
        <span class="topbar__subtitle">Walking Tour of Nizhny Novgorod</span>
      </div>
      <nav class="topbar__nav" aria-label="Main navigation">
        ${mt.map(e=>`
          <a href="${e.href}" class="topbar__link ${e.id===t?"is-active":""}">${e.label}</a>
        `).join("")}
      </nav>
    </header>
  `}function gt({activeNav:t="home",content:e}){return`
    <div class="app-layout">
      ${ht({active:t})}
      <main class="app-content" data-page-root>
        ${e}
      </main>
    </div>
  `}function R({title:t="",subtitle:e="",body:n,footer:a="",className:i=""}){return`
    <section class="card ${i}">
      ${t?`<header class="card__header"><h2>${t}</h2>${e?`<p class="text-muted">${e}</p>`:""}</header>`:""}
      <div class="card__body">${n}</div>
      ${a?`<footer class="card__footer">${a}</footer>`:""}
    </section>
  `}function E({label:t,variant:e="secondary",attrs:n="",type:a="button"}){const i=e==="secondary"?"":` btn--${e}`;return`<button type="${a}" class="btn${i}" ${n}>${t}</button>`}function g({label:t,href:e,variant:n="secondary",attrs:a=""}){return`<a class="btn${n==="secondary"?"":` btn--${n}`}" href="${e}" ${a}>${t}</a>`}function yt({message:t}){return`
    <aside class="mascot">
      <div class="mascot__avatar" aria-hidden="true">/_/\\</div>
      <div class="mascot__speech">
        <strong>Cat Guide</strong>
        <p>${t}</p>
      </div>
    </aside>
  `}function it({value:t,max:e,label:n}){const a=Math.max(e,1),i=Math.max(0,Math.min(t,a)),d=Math.round(i/a*100);return`
    <section class="progress">
      <div class="progress__meta">
        <span>${n}</span>
        <span>${i}/${e}</span>
      </div>
      <div class="progress__track" role="progressbar" aria-valuemin="0" aria-valuemax="${e}" aria-valuenow="${i}">
        <span class="progress__fill" style="width:${d}%"></span>
      </div>
    </section>
  `}async function vt(t){const{store:e,contentService:n,routeEngine:a}=t,i=e.getState(),d=await n.getRoutes(),c=i.selectedRouteId?await n.getRouteById(i.selectedRouteId):null,s=await a.getProgress(),h=`
    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-card__value">${i.reachedPoints.length}</span>
        <span class="stat-card__label">Points reached</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${i.completedTasks.length}</span>
        <span class="stat-card__label">Tasks completed</span>
      </article>
      <article class="stat-card">
        <span class="stat-card__value">${i.finishedRoutes.length}</span>
        <span class="stat-card__label">Routes finished</span>
      </article>
    </div>
  `,m=c?`
      <h3>${c.title}</h3>
      <p class="text-muted">${c.description}</p>
      ${it({label:"Current route progress",value:s.reached,max:s.total})}
      <div class="inline-actions">
        ${g({label:"Continue tour",href:"#/run",variant:"primary"})}
        ${g({label:"Transport",href:"#/transport"})}
      </div>
    `:`
      <p class="text-muted">Choose a route to start the tour.</p>
      <div class="inline-actions">
        ${g({label:"Choose route",href:"#/excursions",variant:"primary"})}
      </div>
    `;return{activeNav:"home",html:`
    <section class="hero">
      <h1>Financial Code: Walking Tour of Nizhny Novgorod</h1>
      <p>
        Learn financial literacy by walking through real city stories about fraud,
        banking institutions and economic risk management.
      </p>
      ${yt({message:"Tip: reach points physically to unlock articles and tasks."})}
    </section>

    ${R({title:"Your session",subtitle:`${d.length} available routes`,body:m})}

    ${R({title:"Overall progress",body:h,footer:`
        <div class="inline-actions">
          ${g({label:"Tasks",href:"#/tasks"})}
          ${g({label:"Articles",href:"#/articles"})}
          ${g({label:"Profile",href:"#/profile"})}
        </div>
      `})}
  `}}function rt(t){const e=Number.isFinite(t)?Math.max(0,Math.round(t)):0,n=Math.floor(e/60),a=e%60;return n===0?`${a} min`:a===0?`${n}h`:`${n}h ${a}m`}async function bt(t){const{contentService:e,store:n}=t,a=n.getState(),d=`
    <div class="stack">
      ${(await e.getRoutes()).map(c=>{const s=c.id===a.selectedRouteId,h=c.transportDurations[a.selectedTransport];return`
            <article class="route-card ${s?"is-active":""}">
              <div class="route-card__content">
                <h3>${c.title}</h3>
                <p class="text-muted">${c.description}</p>
                <div class="tag-row">
                  <span class="tag">${c.points.length} points</span>
                  <span class="tag">${rt(h)} by ${a.selectedTransport}</span>
                </div>
              </div>
              <div class="inline-actions">
                ${E({label:s?"Selected":"Select",variant:"primary",attrs:`data-select-route="${c.id}" ${s?"disabled":""}`})}
                ${g({label:"Transport",href:"#/transport"})}
              </div>
            </article>
          `}).join("")}
    </div>
  `;return{activeNav:"excursions",html:R({title:"Choose an excursion",subtitle:"Select a route to start a self-guided walking tour.",body:d,footer:`
        <div class="inline-actions">
          ${g({label:"Back home",href:"#/home"})}
          ${g({label:"Start run",href:"#/run",variant:"primary"})}
        </div>
      `}),mount(c){const s=h=>{const y=h.target.getAttribute("data-select-route");y&&(n.selectRoute(y),t.router.navigate("/transport"))};return c.addEventListener("click",s),()=>c.removeEventListener("click",s)}}}const kt={walk:"Walk",scooter:"Scooter",car:"Car"};async function It(t){const{store:e,contentService:n}=t,a=e.getState();if(!a.selectedRouteId)return{activeNav:"excursions",html:R({title:"Transport",body:'<p class="text-muted">Choose a route first.</p>',footer:g({label:"Go to routes",href:"#/excursions",variant:"primary"})})};const i=await n.getRouteById(a.selectedRouteId);if(!i)return{activeNav:"excursions",html:R({title:"Transport",body:'<p class="text-muted">Selected route is unavailable.</p>',footer:g({label:"Choose route",href:"#/excursions",variant:"primary"})})};const d=n.getTransportModes(),c=`
    <p class="text-muted"><strong>${i.title}</strong></p>
    <div class="stack">
      ${d.map(s=>{const h=a.selectedTransport===s.id,m=i.transportDurations[s.id];return`
            <article class="transport-card ${h?"is-active":""}">
              <div>
                <h3>${kt[s.id]}</h3>
                <p class="text-muted">Estimated duration: ${rt(m)}</p>
              </div>
              ${E({label:h?"Selected":"Use this",variant:"primary",attrs:`data-transport="${s.id}" ${h?"disabled":""}`})}
            </article>
          `}).join("")}
    </div>
  `;return{activeNav:"excursions",html:R({title:"Choose transport",subtitle:"Duration recalculates for each transport mode.",body:c,footer:`
        <div class="inline-actions">
          ${g({label:"Back",href:"#/excursions"})}
          ${g({label:"Start run",href:"#/run",variant:"primary"})}
        </div>
      `}),mount(s){const h=m=>{const I=m.target.getAttribute("data-transport");I&&(e.setTransport(I),t.router.navigate("/run"))};return s.addEventListener("click",h),()=>s.removeEventListener("click",h)}}}const F=[.75,1,1.25,1.5];function $t({store:t}){const e=new Audio;e.preload="metadata";const n=new Set;let a="",i="";function d(){return{src:a,isPlaying:!e.paused,currentTime:e.currentTime,duration:Number.isFinite(e.duration)?e.duration:0,speed:e.playbackRate,hasError:i!=="",errorMessage:i}}function c(){const u=d();for(const v of n)v(u)}e.addEventListener("play",()=>{i="",c()}),e.addEventListener("pause",c),e.addEventListener("ended",c),e.addEventListener("timeupdate",c),e.addEventListener("error",()=>{i="Audio file is unavailable or broken.",c()}),y(t.getState().audioSpeed);async function s(u){if(!u)throw new Error("Audio source is not configured.");u!==a&&(a=u,i="",e.src=u,e.load()),e.playbackRate=t.getState().audioSpeed,await e.play(),c()}function h(){e.pause(),c()}function m(){e.pause(),e.currentTime=0,c()}function y(u){return F.includes(u)?(e.playbackRate=u,t.setAudioSpeed(u),c(),!0):!1}function I(u){return n.add(u),u(d()),()=>n.delete(u)}return{play:s,pause:h,stop:m,setSpeed:y,subscribe:I,getSnapshot:d,getAllowedSpeeds:()=>[...F]}}function Pt({pointId:t,audioSrc:e,speed:n}){return`
    <section class="audio-player" data-audio-player data-point-id="${t}" data-audio-src="${e}">
      <div class="audio-player__controls">
        ${E({label:"Play",variant:"primary",attrs:'data-audio-action="play"'})}
        ${E({label:"Pause",attrs:'data-audio-action="pause"'})}
        ${E({label:"Stop",attrs:'data-audio-action="stop"'})}
      </div>
      <div class="audio-player__settings">
        <label class="audio-player__label" for="speed-${t}">Speed</label>
        <select id="speed-${t}" class="audio-player__speed" data-audio-speed>
          ${F.map(a=>`
            <option value="${a}" ${a===n?"selected":""}>${a}x</option>
          `).join("")}
        </select>
      </div>
      <div class="audio-player__status" data-audio-status>Ready</div>
    </section>
  `}function wt(t,{audioService:e}){const n=t.querySelector("[data-audio-player]");if(!n)return()=>{};const a=n.getAttribute("data-audio-src")||"",i=n.querySelector("[data-audio-status]"),d=n.querySelector("[data-audio-speed]"),c=async m=>{const u=m.target.closest("[data-audio-action]")?.getAttribute("data-audio-action");if(u){if(u==="play"){try{await e.play(a)}catch{i&&(i.textContent="Audio failed to start.")}return}if(u==="pause"){e.pause();return}u==="stop"&&e.stop()}},s=()=>{if(!d)return;const m=Number(d.value);e.setSpeed(m)},h=e.subscribe(m=>{if(!i)return;if(m.hasError){i.textContent=m.errorMessage||"Audio is unavailable.";return}if(!m.src){i.textContent=`Ready ${m.speed}x`;return}const y=m.isPlaying?"Playing":"Paused",u=m.duration>0?` · ${tt(m.currentTime)}/${tt(m.duration)}`:"";i.textContent=`${y} ${m.speed}x${u}`});return n.addEventListener("click",c),d?.addEventListener("change",s),()=>{h(),n.removeEventListener("click",c),d?.removeEventListener("change",s)}}function tt(t){const e=Math.max(0,Math.floor(t||0)),n=Math.floor(e/60),a=e%60;return`${n}:${String(a).padStart(2,"0")}`}function St({hasApiKey:t}){return t?`
    <section class="map-panel">
      <div class="map-panel__canvas" data-map-canvas aria-label="Route map"></div>
    </section>
  `:`
      <section class="map-panel map-panel--fallback">
        <p>Map is unavailable. Please configure Yandex Maps API key.</p>
      </section>
    `}function et(t,e){return t.querySelector(e)}function Rt(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstElementChild}function nt(t){document.querySelector("[data-point-modal]")?.remove();const n=Rt(`
    <div class="point-modal" data-point-modal>
      <div class="point-modal__overlay" data-close-modal></div>
      <article class="point-modal__content" role="dialog" aria-modal="true" aria-label="Point reached">
        <header>
          <h3>${t.title}</h3>
          <p>${t.summary}</p>
        </header>
        <p><strong>Financial insight:</strong> ${t.insight}</p>
        <button class="btn btn--primary" type="button" data-close-modal>Continue</button>
      </article>
    </div>
  `),a=()=>{n.remove()};et(n,".point-modal__overlay")?.addEventListener("click",a),et(n,"button[data-close-modal]")?.addEventListener("click",a),document.body.append(n)}const st="financial-code-demo-mode";async function At(t){const{routeEngine:e,store:n,contentService:a}=t,i=n.getState();if(!i.selectedRouteId)return{activeNav:"run",html:R({title:"Tour run",body:'<p class="text-muted">Select route and transport before starting.</p>',footer:g({label:"Choose route",href:"#/excursions",variant:"primary"})})};const d=await e.getSelectedRouteBundle(),c=await a.getConfig();if(!d)return{activeNav:"run",html:R({title:"Tour run",body:'<p class="text-muted">Route data is unavailable.</p>'})};const s=await e.getCurrentPoint(),h=await e.getProgress();if(!s)return{activeNav:"run",html:R({title:"Tour run",body:'<p class="text-muted">No points configured for this route.</p>'})};const m=i.reachedPoints.includes(s.id),y=!!c.YANDEX_MAPS_API_KEY.trim(),I=t.geolocationService.isSupported(),u=Tt(),v=typeof s.articleId=="string"&&s.articleId.trim()!=="",P=typeof s.taskId=="string"&&s.taskId.trim()!=="",k=Math.max(0,d.points.findIndex(o=>o.id===s.id)),f=`
    <article class="run-header">
      <h2>${d.route.title}</h2>
      <p class="text-muted">Current point: ${k+1}/${d.points.length}</p>
      ${it({label:"Reached points",value:h.reached,max:h.total})}
    </article>

    ${St({hasApiKey:y})}

    <section class="run-status" data-run-status>
      Waiting for geolocation...
    </section>

    <article class="point-card">
      <header>
        <h3>${s.title}</h3>
        <p class="text-muted">${s.address}</p>
      </header>
      <p>${s.fullDescription}</p>
      <p><strong>Financial insight:</strong> ${s.financialInsight}</p>
      <p><strong>Logistics:</strong> ${s.logistics}</p>

      ${Pt({pointId:s.id,audioSrc:s.audioSrc,speed:i.audioSpeed})}

      <div class="inline-actions">
        ${g({label:v?"Article":"Article unavailable",href:v?`#/articles/${s.articleId}`:"#",attrs:m&&v?"":"aria-disabled=true data-locked-content=true"})}
        ${g({label:P?"Task":"Task unavailable",href:P?`#/tasks/${s.taskId}`:"#",attrs:m&&P?"":"aria-disabled=true data-locked-content=true"})}
      </div>

      <div class="inline-actions">
        ${E({label:m?"Point reached":"I reached the point",variant:"primary",attrs:`data-manual-reach ${I&&!u?"hidden":""} ${m?"disabled":""}`})}
        ${E({label:"Next point",attrs:"data-next-point"})}
        ${E({label:"Finish route",variant:"danger",attrs:"data-finish-route"})}
      </div>
      <div class="inline-actions">
        ${E({label:u?"Disable demo mode":"Enable demo mode",attrs:"data-demo-toggle"})}
      </div>
      <p class="text-muted" data-geo-fallback hidden>
        ${u?"Demo mode is enabled. You can move through points manually.":"Geolocation is disabled. Use manual confirmation button."}
      </p>
    </article>
  `;return{activeNav:"run",html:R({title:"Run",body:f,footer:`
        <div class="inline-actions">
          ${g({label:"Transport",href:"#/transport"})}
          ${g({label:"Tasks",href:"#/tasks"})}
          ${g({label:"Articles",href:"#/articles"})}
        </div>
      `}),mount(o){const l=o.querySelector("[data-run-status]"),r=o.querySelector("[data-manual-reach]"),p=o.querySelector("[data-next-point]"),w=o.querySelector("[data-finish-route]"),T=o.querySelector("[data-demo-toggle]"),S=o.querySelector("[data-geo-fallback]"),b=o.querySelector("[data-map-canvas]");let x=()=>{},M=null,K=()=>{},H=!1;function _($){l&&(l.textContent=$)}function X(){if(!M)return;const $=n.getState(),A=d.points[$.currentPointIndex];M.updatePointState({currentPointId:A?.id,reachedPointIds:$.reachedPoints})}async function dt(){if(!(!y||!b))try{if(M=await t.mapService.createSession({container:b,apiKey:c.YANDEX_MAPS_API_KEY}),H){M.destroy();return}M.renderRoute(d.points,{currentPointId:s.id,reachedPointIds:n.getState().reachedPoints,onPointClick(A){const L=d.points.findIndex(B=>B.id===A);L>=0&&(n.setCurrentPointIndex(L),t.router.refresh())}});const $=n.getState().lastKnownPosition;$&&M.updateUserLocation($)}catch{_("Map is unavailable right now.")}}async function ut($){const A=await e.getSelectedRouteBundle(),L=n.getState(),B=A?.points[L.currentPointIndex];if(!B)return;const N=await e.unlockPoint(B.id);X(),N&&!N.alreadyReached&&$&&(nt({title:`${N.point.title} unlocked`,summary:N.point.shortDescription,insight:N.point.financialInsight}),await t.router.refresh())}async function pt($){M?.updateUserLocation($);const A=await e.evaluatePosition($);if(A.type==="tracking"){_(`Distance to ${A.currentPoint.title}: ${Math.round(A.distanceMeters)} m`);return}if(A.type==="reached"){_(`Point reached: ${A.currentPoint.title}`),X(),A.unlocked&&!A.unlocked.alreadyReached&&(nt({title:`${A.currentPoint.title} unlocked`,summary:A.currentPoint.shortDescription,insight:A.currentPoint.financialInsight}),await t.router.refresh());return}_("Tracking is idle.")}function ft($){if(r?.removeAttribute("hidden"),S?.removeAttribute("hidden"),$.code===1){_("Geolocation permission denied. Use manual confirmation.");return}if($.code===2){_("Unable to detect your location. You can continue manually.");return}if($.code===3){_("Geolocation timed out. You can continue manually.");return}_("Geolocation issue. You can continue manually.")}K=wt(o,{audioService:t.audioService});const z=Array.from(o.querySelectorAll("[data-locked-content]")),W=$=>$.preventDefault();z.forEach($=>{$.addEventListener("click",W)});const J=async()=>{await ut(!0)},V=async()=>{if((await e.advanceToNextPoint()).routeCompleted){t.router.navigate("/profile");return}await t.router.refresh()},Z=async()=>{await e.finishSelectedRoute(),t.router.navigate("/profile")},Q=async()=>{_t(!u),await t.router.refresh()};if(r?.addEventListener("click",J),p?.addEventListener("click",V),w?.addEventListener("click",Z),T?.addEventListener("click",Q),dt(),u)r?.removeAttribute("hidden"),S?.removeAttribute("hidden"),_("Demo mode enabled. Manual progression is active.");else if(I){_("Requesting geolocation permission...");try{x=t.geolocationService.watchPosition({onPosition:pt,onError:ft})}catch{r?.removeAttribute("hidden"),S?.removeAttribute("hidden"),_("Geolocation is unavailable. Use manual confirmation.")}}else r?.removeAttribute("hidden"),S?.removeAttribute("hidden"),_("Geolocation is not supported by this device.");return()=>{H=!0,x(),M?.destroy(),K(),t.audioService.stop(),r?.removeEventListener("click",J),p?.removeEventListener("click",V),w?.removeEventListener("click",Z),T?.removeEventListener("click",Q),z.forEach($=>{$.removeEventListener("click",W)})}}}}function Tt(){try{const t=window.localStorage.getItem(st);if(t==="1")return!0;if(t==="0")return!1;const e=window.location.hash||"",[,n=""]=e.split("?"),a=new URLSearchParams(n);return a.get("demo")==="1"?!0:(a.get("demo")==="0",!1)}catch{return!1}}function _t(t){try{window.localStorage.setItem(st,t?"1":"0")}catch{}}async function Et(t){const n=`
    <div class="stack">
      ${(await t.routeEngine.getTasksOverview()).map(a=>`
            <article class="task-card ${a.status==="completed"?"is-complete":""}">
              <header>
                <h3>${a.title}</h3>
                <p class="text-muted">${a.routeTitle} · ${a.pointTitle}</p>
              </header>
              <div class="tag-row">
                <span class="tag">${a.type}</span>
                <span class="tag">${a.rewardPoints} pts</span>
                <span class="tag status-${a.status}">${a.status}</span>
              </div>
              <div class="inline-actions">
                ${g({label:"Open",href:`#/tasks/${a.id}`})}
              </div>
            </article>
          `).join("")}
    </div>
  `;return{activeNav:"tasks",html:R({title:"Tasks",subtitle:"State model: locked -> available -> completed.",body:n,footer:`
        <div class="inline-actions">
          ${g({label:"Run",href:"#/run"})}
          ${g({label:"Articles",href:"#/articles"})}
        </div>
      `})}}async function xt(t){const e=t.route.params.taskId,n=await t.routeEngine.getTaskDetails(e);if(!n)return{activeNav:"tasks",html:R({title:"Task",body:'<p class="text-muted">Task not found.</p>',footer:g({label:"Back to tasks",href:"#/tasks"})})};const a=n.status==="locked"?'<p class="text-muted">Task is locked. Reach the related point first.</p>':`
      <p>${n.description}</p>
      <div class="tag-row">
        <span class="tag">Reward: ${n.rewardPoints}</span>
        <span class="tag">Skip allowed: ${n.canSkip?"yes":"no"}</span>
        <span class="tag status-${n.status}">${n.status}</span>
      </div>
      ${E({label:n.status==="completed"?"Completed":"Mark as completed",variant:"primary",attrs:`data-complete-task ${n.canComplete?"":"disabled"}`})}
    `;return{activeNav:"tasks",html:R({title:n.title,subtitle:`${n.routeTitle} · ${n.pointTitle}`,body:a,footer:`
        <div class="inline-actions">
          ${g({label:"Back to tasks",href:"#/tasks"})}
          ${g({label:"Go to run",href:"#/run"})}
        </div>
      `}),mount(i){const d=i.querySelector("[data-complete-task]"),c=async()=>{(await t.routeEngine.completeTask(e)).ok&&t.router.navigate("/tasks")};return d?.addEventListener("click",c),()=>d?.removeEventListener("click",c)}}}async function Mt(t){const n=`
    <div class="stack">
      ${(await t.routeEngine.getArticlesOverview()).map(a=>`
            <article class="article-card">
              <header>
                <h3>${a.title}</h3>
                <p class="text-muted">${a.routeTitle} · ${a.pointTitle}</p>
              </header>
              <p>${a.summary}</p>
              <div class="tag-row">
                <span class="tag ${a.status==="available"?"status-available":"status-locked"}">${a.status}</span>
              </div>
              <div class="inline-actions">
                ${g({label:"Read",href:`#/articles/${a.id}`})}
              </div>
            </article>
          `).join("")}
    </div>
  `;return{activeNav:"articles",html:R({title:"Articles",subtitle:"Articles unlock when route points are reached.",body:n,footer:`
        <div class="inline-actions">
          ${g({label:"Run",href:"#/run"})}
          ${g({label:"Tasks",href:"#/tasks"})}
        </div>
      `})}}async function Ct(t){const e=t.route.params.articleId,n=await t.routeEngine.getArticleDetails(e);if(!n)return{activeNav:"articles",html:R({title:"Article",body:'<p class="text-muted">Article not found.</p>',footer:g({label:"Back to articles",href:"#/articles"})})};const a=n.unlocked?`
      <p>${n.content}</p>
      ${n.images.length>0?`
          <div class="image-grid">
            ${n.images.map(i=>`
                <img src="${i}" alt="${n.title}" loading="lazy" onerror="this.style.display='none'" />
              `).join("")}
          </div>
        `:""}
      ${n.relatedPoint?`
          <article class="point-card">
            <h3>Related point</h3>
            <p><strong>${n.relatedPoint.title}</strong></p>
            <p class="text-muted">${n.relatedPoint.address}</p>
            <p>${n.relatedPoint.shortDescription}</p>
          </article>
        `:""}
    `:'<p class="text-muted">Article is locked. Reach its point first.</p>';return{activeNav:"articles",html:R({title:n.title,subtitle:`${n.routeTitle} · ${n.pointTitle}`,body:a,footer:`
        <div class="inline-actions">
          ${g({label:"Back to articles",href:"#/articles"})}
          ${g({label:"Go to run",href:"#/run"})}
        </div>
      `})}}async function Nt(t){const{store:e,contentService:n}=t,a=e.getState(),i=a.selectedRouteId?await n.getRouteById(a.selectedRouteId):null,d=`
    <form class="profile-form" data-profile-form>
      <label>
        Name
        <input type="text" name="name" value="${Dt(a.profile.name)}" placeholder="Your name" maxlength="80" />
      </label>
      <label>
        Age
        <input type="number" name="age" value="${a.profile.age??""}" min="7" max="120" placeholder="Age" />
      </label>
      ${E({label:"Save profile",type:"submit",variant:"primary"})}
    </form>

    <section class="profile-metrics">
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-card__value">${a.completedTasks.length}</span>
          <span class="stat-card__label">Completed tasks</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${a.reachedPoints.length}</span>
          <span class="stat-card__label">Reached points</span>
        </article>
        <article class="stat-card">
          <span class="stat-card__value">${a.finishedRoutes.length}</span>
          <span class="stat-card__label">Finished routes</span>
        </article>
      </div>
      <p class="text-muted">Current route: ${i?.title||"Not selected"}</p>
      ${E({label:"Reset all progress",variant:"danger",attrs:"data-reset-progress"})}
    </section>
  `;return{activeNav:"profile",html:R({title:"Profile",subtitle:"Stored locally on your device.",body:d,footer:`
        <div class="inline-actions">
          ${g({label:"Home",href:"#/home"})}
          ${g({label:"Run",href:"#/run",variant:"primary"})}
        </div>
      `}),mount(c){const s=c.querySelector("[data-profile-form]"),h=c.querySelector("[data-reset-progress]"),m=I=>{if(I.preventDefault(),!s)return;const u=new FormData(s),v=u.get("age"),P=typeof v=="string"&&v.trim()!==""?Number(v):null;e.setProfile({name:String(u.get("name")||"").trim(),age:Number.isFinite(P)?P:null})},y=()=>{e.resetProgress(),t.router.navigate("/home")};return s?.addEventListener("submit",m),h?.addEventListener("click",y),()=>{s?.removeEventListener("submit",m),h?.removeEventListener("click",y)}}}}function Dt(t){return t.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Lt(t){return{activeNav:"about",html:R({title:"About project",body:`
    <section class="stack">
      <p>
        "Financial Code" is a mobile-first self-guided tour about financial literacy,
        scams, banking institutions and economic behavior in Nizhny Novgorod.
      </p>
      <p>
        This MVP runs as a static SPA and is deployable on GitHub Pages.
        Content is stored in JSON, while user progress is saved in localStorage.
      </p>
      <p>
        Architecture is intentionally backend-ready: service layer and route engine can be
        replaced with API calls without rewriting the UI.
      </p>
    </section>
  `,footer:`
        <div class="inline-actions">
          ${g({label:"Home",href:"#/home"})}
          ${g({label:"Choose route",href:"#/excursions",variant:"primary"})}
        </div>
      `})}}function Bt({routes:t,fallbackPath:e="/home",onRouteChange:n}){let a=null;function i(u,v){const P=d(u),k=d(v);if(P.length!==k.length)return null;const f={};for(let o=0;o<P.length;o+=1){const l=P[o],r=k[o];if(l.startsWith(":")){f[l.slice(1)]=decodeURIComponent(r);continue}if(l!==r)return null}return f}function d(u){return u.replace(/^\//,"").replace(/\/$/,"").split("/").filter(Boolean)}function c(){const v=(window.location.hash||`#${e}`).slice(1).split("?")[0];return v.startsWith("/")?v:`/${v}`}function s(u){for(const v of t){const P=i(v.path,u);if(P)return{name:v.name,path:u,params:P}}return{name:"not-found",path:e,params:{}}}async function h(){const u=s(c());a=u.name==="not-found"?s(e):u,await n(a)}function m(u,v={}){const k=`#${u.startsWith("/")?u:`/${u}`}`;if(v.replace){window.location.replace(k);return}window.location.hash=k}function y(){if(window.addEventListener("hashchange",h),!window.location.hash){window.location.hash=`#${e}`;return}h()}function I(){window.removeEventListener("hashchange",h)}return{start:y,stop:I,navigate:m,getCurrentRoute:()=>a,refresh:h}}const Ot="financial-code-tour-state-v1";function O(t){const e=a=>Array.isArray(a)?Array.from(new Set(a.filter(i=>typeof i=="string"))):[],n=Array.isArray(t.lastKnownPosition)&&t.lastKnownPosition.length===2&&Number.isFinite(t.lastKnownPosition[0])&&Number.isFinite(t.lastKnownPosition[1])?t.lastKnownPosition:null;return{profile:{name:typeof t.profile?.name=="string"?t.profile.name.trim():"",age:Number.isInteger(t.profile?.age)&&t.profile.age>=0?t.profile.age:null},selectedRouteId:typeof t.selectedRouteId=="string"?t.selectedRouteId:null,selectedTransport:["walk","scooter","car"].includes(t.selectedTransport)?t.selectedTransport:"walk",currentPointIndex:Number.isInteger(t.currentPointIndex)?Math.max(0,t.currentPointIndex):0,reachedPoints:e(t.reachedPoints),unlockedTasks:e(t.unlockedTasks),completedTasks:e(t.completedTasks),unlockedArticles:e(t.unlockedArticles),finishedRoutes:e(t.finishedRoutes),audioSpeed:[.75,1,1.25,1.5].includes(t.audioSpeed)?t.audioSpeed:1,lastKnownPosition:n}}function jt({storageKey:t=Ot}={}){function e(i){try{const d=window.localStorage.getItem(t);if(!d)return O(i);const c=JSON.parse(d);return O({...i,...c})}catch{return O(i)}}function n(i){try{const d=O(i);window.localStorage.setItem(t,JSON.stringify(d))}catch{}}function a(){try{window.localStorage.removeItem(t)}catch{}}return{loadState:e,saveState:n,clear:a}}const qt=[{id:"route-1",slug:"financial-nizhny",title:"Financial Code: Центр Нижнего",description:"Пешеходная экскурсия о финансовых аферах, банках и экономической истории города.",theme:"Финансовая грамотность через историю города",coverImage:"./assets/images/routes/route1.jpg",startPointId:"point-1",transportDurations:{walk:120,scooter:105,car:90},points:["point-1","point-2","point-3","point-4"]},{id:"route-2",slug:"banks-and-fraud",title:"Банки и мошенничество XIX-XX века",description:"Короткий маршрут по местам, связанным с банковскими практиками и резонансными аферами.",theme:"История финансовых рисков",coverImage:"./assets/images/routes/route2.jpg",startPointId:"point-5",transportDurations:{walk:90,scooter:75,car:60},points:["point-5","point-6","point-7"]}],Ft=[{id:"point-1",routeId:"route-1",order:1,title:"Здание Госбанка",address:"ул. Большая Покровская, 26",coords:[56.325519,44.002193],shortDescription:"Историческое здание государственного банка.",fullDescription:"В этом здании сосредотачивались важные финансовые операции города. Архитектура подчеркивала статус и надежность института.",financialInsight:"Внешний облик финансовых институтов часто формирует доверие. Важно отличать имидж от реальной устойчивости организации.",logistics:"Остановитесь у главного фасада и обратите внимание на символику и детали декора.",currentInfo:"Сегодня рядом расположены туристические и культурные объекты.",articleId:"article-1",taskId:"task-1",audioSrc:"./assets/audio/route1/point-01.mp3",image:"./assets/images/points/point1.jpg",radiusMeters:40},{id:"point-2",routeId:"route-1",order:2,title:"Нижегородский кремль",address:"Кремль, 1",coords:[56.328635,44.003905],shortDescription:"Кремль как административный и финансовый центр эпохи.",fullDescription:"Через Кремль проходили управленческие решения, влияющие на торговлю и бюджет региона.",financialInsight:"Финансовая безопасность города зависит от качества институтов управления.",logistics:"Лучше подойти со стороны Дмитриевской башни.",currentInfo:"На территории работают музеи и обзорные площадки.",articleId:"article-2",taskId:"task-2",audioSrc:"./assets/audio/route1/point-02.mp3",image:"./assets/images/points/point2.jpg",radiusMeters:60},{id:"point-3",routeId:"route-1",order:3,title:"Чкаловская лестница",address:"Верхне-Волжская набережная",coords:[56.329861,44.014836],shortDescription:"Ключевая городская точка с видом на Волгу.",fullDescription:"Лестница соединяет исторический центр и набережную, формируя важный городской маршрут.",financialInsight:"Инфраструктура влияет на стоимость территорий и инвестиционную привлекательность.",logistics:"Поднимайтесь к верхней площадке для лучшего обзора.",currentInfo:"Популярная точка для городских прогулок.",articleId:"article-3",taskId:"task-3",audioSrc:"./assets/audio/route1/point-03.mp3",image:"./assets/images/points/point3.jpg",radiusMeters:50},{id:"point-4",routeId:"route-1",order:4,title:"Рождественская улица",address:"ул. Рождественская",coords:[56.327834,43.989954],shortDescription:"Историческая торговая улица Нижнего.",fullDescription:"Торговая активность этой улицы иллюстрирует развитие городской экономики и предпринимательства.",financialInsight:"Диверсификация бизнеса снижает риски для городской экономики.",logistics:"Пройдите вдоль фасадов купеческих домов.",currentInfo:"Сейчас здесь много кафе и городских мероприятий.",articleId:"article-4",taskId:"task-4",audioSrc:"./assets/audio/route1/point-04.mp3",image:"./assets/images/points/point4.jpg",radiusMeters:45},{id:"point-5",routeId:"route-2",order:1,title:"Ярмарочный дом",address:"ул. Совнаркомовская, 13",coords:[56.337073,43.964867],shortDescription:"Финансовые сделки и торговые договоренности.",fullDescription:"Ярмарка была местом крупных сделок, кредитов и обмена товарами между регионами.",financialInsight:"Чем выше оборот и скорость сделок, тем важнее механизмы проверки контрагентов.",logistics:"Осмотрите площадь перед главным входом.",currentInfo:"Район активно развивается как деловой кластер.",articleId:"article-5",taskId:"task-5",audioSrc:"https://storage/audio/route2/point1.mp3",image:"./assets/images/points/point5.jpg",radiusMeters:50},{id:"point-6",routeId:"route-2",order:2,title:"Старое купеческое подворье",address:"район Нижне-Волжской набережной",coords:[56.331684,43.989277],shortDescription:"Район сделок и коммерческих рисков.",fullDescription:"Здесь заключались коммерческие соглашения, а также происходили споры из-за невыполненных обязательств.",financialInsight:"Письменные договоры и прозрачная отчетность снижают риск мошенничества.",logistics:"Сравните архитектуру складов и доходных домов.",currentInfo:"Сейчас это прогулочная зона и культурный маршрут.",articleId:"article-6",taskId:"task-6",audioSrc:"https://storage/audio/route2/point2.mp3",image:"./assets/images/points/point6.jpg",radiusMeters:45},{id:"point-7",routeId:"route-2",order:3,title:"Почтовая контора",address:"исторический центр",coords:[56.323556,43.996801],shortDescription:"Коммуникации и финансовая информация.",fullDescription:"Почта была ключевым каналом передачи финансовых поручений, векселей и деловой переписки.",financialInsight:"Утечка данных и подделка документов были риском и тогда, и сейчас.",logistics:"Подойдите ближе к фасаду, чтобы рассмотреть таблички и старые символы связи.",currentInfo:"Объект используется в культурно-образовательных целях.",articleId:"article-7",taskId:"task-7",audioSrc:"https://storage/audio/route2/point3.mp3",image:"./assets/images/points/point7.jpg",radiusMeters:40}],Yt=[{id:"task-1",routeId:"route-1",pointId:"point-1",title:"Найдите финансовые символы",type:"observation",description:"Определите 2 архитектурных элемента, которые должны были вызывать доверие к банку.",rewardPoints:10,canSkip:!0},{id:"task-2",routeId:"route-1",pointId:"point-2",title:"Разберите риск-сценарий",type:"reflection",description:"Представьте, что вы городской казначей. Назовите 2 риска для бюджета и 1 способ их снизить.",rewardPoints:15,canSkip:!0},{id:"task-3",routeId:"route-1",pointId:"point-3",title:"Инфраструктура и деньги",type:"analysis",description:"Опишите, как транспортная доступность этой точки может влиять на бизнес рядом.",rewardPoints:20,canSkip:!1},{id:"task-4",routeId:"route-1",pointId:"point-4",title:"Антимошенническая проверка",type:"quiz",description:"Назовите 3 признака сомнительного инвестиционного предложения.",rewardPoints:20,canSkip:!0},{id:"task-5",routeId:"route-2",pointId:"point-5",title:"Проверка контрагента",type:"observation",description:"Составьте короткий чек-лист из 4 пунктов для проверки партнера по сделке.",rewardPoints:10,canSkip:!0},{id:"task-6",routeId:"route-2",pointId:"point-6",title:"Защита договора",type:"reflection",description:"Укажите 2 условия, которые нужно обязательно добавить в договор, чтобы снизить риск спора.",rewardPoints:15,canSkip:!0},{id:"task-7",routeId:"route-2",pointId:"point-7",title:"Безопасность данных",type:"analysis",description:"Приведите 2 современных примера, как защищать финансовые данные от подделки и утечки.",rewardPoints:20,canSkip:!1}],Ut=[{id:"article-1",routeId:"route-1",pointId:"point-1",title:"История Госбанка в Нижнем",summary:"Почему банковские здания становились символом стабильности.",content:"В XIX-XX веках отделения банков были не просто местом расчетов. Они демонстрировали статус института, надежность капитала и роль государства в денежном обращении. Для современного пользователя это важный урок: репутация и внешний вид организации не заменяют проверки лицензий, условий и рисков.",images:["./assets/images/articles/article1.jpg"]},{id:"article-2",routeId:"route-1",pointId:"point-2",title:"Кремль и финансовая власть",summary:"Как административные центры влияли на финансы региона.",content:"Финансовые решения редко изолированы: они зависят от управления, налоговой политики и контроля торговли. История Кремля показывает, как власть и финансы развиваются вместе, а прозрачные правила помогают снижать коррупционные и мошеннические риски.",images:["./assets/images/articles/article2.jpg"]},{id:"article-3",routeId:"route-1",pointId:"point-3",title:"Городская инфраструктура и капитал",summary:"Почему лестницы, мосты и набережные важны для экономики.",content:"Инфраструктура увеличивает поток людей, а вместе с ним спрос на товары и услуги. Эта связь объясняет, почему инвестиции в городскую среду окупаются за счет развития локального бизнеса и туризма.",images:["./assets/images/articles/article3.jpg"]},{id:"article-4",routeId:"route-1",pointId:"point-4",title:"Рождественская: улица торговли",summary:"Историческая торговая ось и культура сделок.",content:"Торговые улицы формировали деловые правила, репутацию купцов и механизмы доверия. Финансовая грамотность начинается с понимания того, как строятся устойчивые сделки и как распознаются мошеннические схемы.",images:["./assets/images/articles/article4.jpg"]},{id:"article-5",routeId:"route-2",pointId:"point-5",title:"Ярмарка и кредит",summary:"Масштаб торговли и рост кредитных инструментов.",content:"Нижегородская ярмарка была центром товарных потоков. Чем больше сделок, тем выше роль доверия, учета и проверки обязательств.",images:[]},{id:"article-6",routeId:"route-2",pointId:"point-6",title:"Контракты и конфликты",summary:"Почему формализация договоров защищает бизнес.",content:"Исторический опыт показывает: неформальные соглашения ускоряют переговоры, но увеличивают правовые риски. Надежный договор и прозрачные расчеты снижают вероятность финансовых потерь.",images:[]},{id:"article-7",routeId:"route-2",pointId:"point-7",title:"Передача данных и деньги",summary:"Связь как инфраструктура финансовых систем.",content:"От почтовых поручений до цифровых платежей остается одна логика: скорость и безопасность передачи информации определяют устойчивость экономических процессов.",images:[]}],Gt="5b762900-5e4a-421d-aade-596e695cb5e3",Kt={YANDEX_MAPS_API_KEY:Gt};function Ht(){const t=qt,e=Ft,n=Yt,a=Ut,i=new Map(e.map(r=>[r.id,r])),d=new Map(n.map(r=>[r.id,r])),c=new Map(a.map(r=>[r.id,r]));function s(r){return typeof structuredClone=="function"?structuredClone(r):JSON.parse(JSON.stringify(r))}async function h(){return s(t)}async function m(r){return s(t.find(p=>p.id===r)||null)}async function y(r){const p=e.filter(w=>w.routeId===r).sort((w,T)=>w.order-T.order);return s(p)}async function I(r){return s(i.get(r)||null)}async function u(r){return s(n.filter(p=>p.routeId===r))}async function v(r){return s(d.get(r)||null)}async function P(r){return s(a.filter(p=>p.routeId===r))}async function k(r){return s(c.get(r)||null)}async function f(r){const p=t.find(S=>S.id===r);if(!p)return null;const w=p.points.map(S=>i.get(S)).filter(Boolean).map(S=>S);return s({route:p,points:w})}async function o(){return s(Kt)}function l(){return[{id:"walk",label:"Walk"},{id:"scooter",label:"Scooter"},{id:"car",label:"Car"}]}return{getRoutes:h,getRouteById:m,getRouteBundle:f,getPointsByRouteId:y,getPointById:I,getTasksByRouteId:u,getTaskById:v,getArticlesByRouteId:P,getArticleById:k,getConfig:o,getTransportModes:l}}function Xt(){function t(){return"geolocation"in navigator}function e({onPosition:n,onError:a,options:i}){if(!t())throw new Error("Geolocation is not supported by this browser.");const d=navigator.geolocation.watchPosition(c=>{n([c.coords.latitude,c.coords.longitude],c)},c=>{a?.(c)},{enableHighAccuracy:!0,timeout:15e3,maximumAge:5e3,...i});return()=>navigator.geolocation.clearWatch(d)}return{isSupported:t,watchPosition:e}}let C=null;function zt(t){return t?window.ymaps?new Promise(e=>{window.ymaps.ready(()=>e(window.ymaps))}):C||(C=new Promise((e,n)=>{const a=document.createElement("script");a.src=`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(t)}&lang=ru_RU`,a.async=!0,a.dataset.source="yandex-maps",a.onload=()=>{if(!window.ymaps){C=null,n(new Error("Yandex Maps script loaded but ymaps is unavailable."));return}window.ymaps.ready(()=>e(window.ymaps))},a.onerror=()=>{C=null,n(new Error("Failed to load Yandex Maps script."))},document.head.append(a)}),C):Promise.reject(new Error("Yandex Maps API key is missing."))}function Wt(){async function t({container:e,apiKey:n,center:a=[56.326,44.006],zoom:i=13}){const d=await zt(n),c=new d.Map(e,{center:a,zoom:i,controls:["zoomControl","typeSelector"]});let s=null,h=[],m=null;function y(){s&&(c.geoObjects.remove(s),s=null),h.forEach(({marker:k})=>c.geoObjects.remove(k)),h=[]}function I(k,f={}){if(y(),k.length===0)return;const o=k.map(l=>l.coords);s=new d.Polyline(o,{},{strokeColor:"#57b4ff",strokeWidth:4,strokeOpacity:.85}),c.geoObjects.add(s),h=k.map((l,r)=>{const p=l.id===f.currentPointId,w=f.reachedPointIds?.includes(l.id),T=p?"islands#redIcon":w?"islands#greenIcon":"islands#blueIcon",S=new d.Placemark(l.coords,{hintContent:l.title,balloonContentHeader:l.title,balloonContentBody:`Point ${r+1}`},{preset:T});return S.events.add("click",()=>{f.onPointClick?.(l.id)}),c.geoObjects.add(S),{pointId:l.id,marker:S}}),o.length>1?c.setBounds(s.geometry.getBounds(),{checkZoomRange:!0,zoomMargin:[48,24,48,24]}):c.setCenter(o[0],15)}function u({currentPointId:k,reachedPointIds:f=[]}){h.forEach(({pointId:o,marker:l})=>{const r=o===k,p=f.includes(o),w=r?"islands#redIcon":p?"islands#greenIcon":"islands#blueIcon";l.options.set("preset",w)})}function v(k){m?m.geometry.setCoordinates(k):(m=new d.Placemark(k,{hintContent:"You are here"},{preset:"islands#violetCircleDotIcon"}),c.geoObjects.add(m))}function P(){try{c.destroy()}catch{}}return{renderRoute:I,updatePointState:u,updateUserLocation:v,destroy:P}}return{createSession:t}}const Jt=6371e3;function Vt(t,e){const[n,a]=t,[i,d]=e,c=I=>I*Math.PI/180,s=c(i-n),h=c(d-a),m=Math.sin(s/2)*Math.sin(s/2)+Math.cos(c(n))*Math.cos(c(i))*Math.sin(h/2)*Math.sin(h/2),y=2*Math.atan2(Math.sqrt(m),Math.sqrt(1-m));return Jt*y}function Zt({contentService:t,store:e}){async function n(){const f=e.getState();return f.selectedRouteId?t.getRouteBundle(f.selectedRouteId):null}async function a(){const f=e.getState(),o=await n();if(!o||o.points.length===0)return null;const l=o.points.length-1,r=Math.max(0,Math.min(f.currentPointIndex,l));return r!==f.currentPointIndex&&e.setCurrentPointIndex(r),o.points[r]||null}async function i(f){const o=await t.getPointById(f);if(!o)return null;const l=e.getState().reachedPoints.includes(o.id);if(!l){e.markPointReached({pointId:o.id,taskId:o.taskId,articleId:o.articleId});const r=await n();if(r&&r.route.id===o.routeId){const p=e.getState().reachedPoints;r.points.every(T=>p.includes(T.id))&&e.finishRoute(r.route.id)}}return{point:o,alreadyReached:l}}async function d(f){e.setLastKnownPosition(f,{notify:!1});const o=await a();if(!o)return{type:"idle"};const l=Vt(f,o.coords);if(!(l<=o.radiusMeters))return{type:"tracking",currentPoint:o,distanceMeters:l};const p=await i(o.id);return{type:"reached",currentPoint:o,distanceMeters:l,unlocked:p}}async function c(){const f=e.getState(),o=await n();if(!o)return{done:!1};const l=f.currentPointIndex+1;return l>=o.points.length?(e.finishRoute(o.route.id),{done:!0,routeCompleted:!0}):(e.setCurrentPointIndex(l),{done:!0,routeCompleted:!1})}async function s(){const f=await n();return f?(e.finishRoute(f.route.id),{ok:!0}):{ok:!1}}async function h(){const f=e.getState(),o=await n();if(!o)return{reached:0,total:0,percent:0};const l=o.points.filter(p=>f.reachedPoints.includes(p.id)).length,r=o.points.length;return{reached:l,total:r,percent:r===0?0:Math.round(l/r*100)}}function m(f,o){return o.completedTasks.includes(f)?"completed":o.unlockedTasks.includes(f)?"available":"locked"}function y(f,o){return o.unlockedArticles.includes(f)?"available":"locked"}async function I(){const f=e.getState(),o=await t.getRoutes();return(await Promise.all(o.map(async(r,p)=>{const[w,T]=await Promise.all([t.getTasksByRouteId(r.id),t.getPointsByRouteId(r.id)]),S=new Map(T.map(b=>[b.id,b]));return w.map(b=>{const x=S.get(b.pointId)||null;return{id:b.id,routeId:b.routeId,routeTitle:r.title,pointId:b.pointId,pointTitle:x?.title||"Unknown point",pointOrder:x?.order??Number.MAX_SAFE_INTEGER,routeOrder:p,title:b.title,type:b.type,description:b.description,rewardPoints:b.rewardPoints,canSkip:b.canSkip,status:m(b.id,f)}})}))).flat().sort((r,p)=>r.routeOrder!==p.routeOrder?r.routeOrder-p.routeOrder:r.pointOrder!==p.pointOrder?r.pointOrder-p.pointOrder:r.title.localeCompare(p.title))}async function u(f){const o=await t.getTaskById(f);if(!o)return null;const[l,r]=await Promise.all([t.getRouteById(o.routeId),t.getPointById(o.pointId)]),p=e.getState(),w=m(o.id,p);return{...o,routeTitle:l?.title||"Route",pointTitle:r?.title||"Point",status:w,canComplete:w==="available"}}async function v(f){const o=await u(f);return o?o.status==="locked"?{ok:!1,reason:"locked"}:o.status==="completed"?{ok:!0,alreadyCompleted:!0}:(e.completeTask(f),{ok:!0,alreadyCompleted:!1}):{ok:!1,reason:"not-found"}}async function P(){const f=e.getState(),o=await t.getRoutes();return(await Promise.all(o.map(async(r,p)=>{const[w,T]=await Promise.all([t.getArticlesByRouteId(r.id),t.getPointsByRouteId(r.id)]),S=new Map(T.map(b=>[b.id,b]));return w.map(b=>{const x=S.get(b.pointId)||null;return{id:b.id,routeId:b.routeId,routeTitle:r.title,pointId:b.pointId,pointTitle:x?.title||"Unknown point",pointOrder:x?.order??Number.MAX_SAFE_INTEGER,routeOrder:p,title:b.title,summary:b.summary,status:y(b.id,f)}})}))).flat().sort((r,p)=>r.routeOrder!==p.routeOrder?r.routeOrder-p.routeOrder:r.pointOrder!==p.pointOrder?r.pointOrder-p.pointOrder:r.title.localeCompare(p.title))}async function k(f){const o=await t.getArticleById(f);if(!o)return null;const[l,r]=await Promise.all([t.getRouteById(o.routeId),t.getPointById(o.pointId)]),p=e.getState();return{...o,routeTitle:l?.title||"Route",pointTitle:r?.title||"Point",relatedPoint:r,status:y(o.id,p),unlocked:p.unlockedArticles.includes(o.id)}}return{getSelectedRouteBundle:n,getCurrentPoint:a,unlockPoint:i,evaluatePosition:d,advanceToNextPoint:c,finishSelectedRoute:s,getProgress:h,getTasksOverview:I,getTaskDetails:u,completeTask:v,getArticlesOverview:P,getArticleDetails:k}}const at={profile:{name:"",age:null},selectedRouteId:null,selectedTransport:"walk",currentPointIndex:0,reachedPoints:[],unlockedTasks:[],completedTasks:[],unlockedArticles:[],finishedRoutes:[],audioSpeed:1,lastKnownPosition:null};function D(t,e){return t.includes(e)?t:[...t,e]}function j(t){return typeof structuredClone=="function"?structuredClone(t):JSON.parse(JSON.stringify(t))}function Qt({storageService:t}){let e=t.loadState(at);const n=new Set;function a(){const o=j(e);for(const l of n)l(o)}function i(o,l={}){e=o(e),t.saveState(e),l.notify!==!1&&a()}function d(){return j(e)}function c(o){return n.add(o),o(j(e)),()=>{n.delete(o)}}function s(o){i(l=>({...l,selectedRouteId:o,currentPointIndex:0}))}function h(o){i(l=>({...l,selectedTransport:o}))}function m(o){i(l=>({...l,currentPointIndex:Math.max(0,o)}))}function y({pointId:o,taskId:l,articleId:r}){i(p=>({...p,reachedPoints:D(p.reachedPoints,o),unlockedTasks:typeof l=="string"&&l.trim()!==""?D(p.unlockedTasks,l):p.unlockedTasks,unlockedArticles:typeof r=="string"&&r.trim()!==""?D(p.unlockedArticles,r):p.unlockedArticles}))}function I(o){i(l=>({...l,completedTasks:D(l.completedTasks,o)}))}function u(o){[.75,1,1.25,1.5].includes(o)&&i(l=>({...l,audioSpeed:o}),{notify:!1})}function v(o,l={}){i(r=>({...r,lastKnownPosition:o}),{notify:l.notify})}function P(o){i(l=>({...l,finishedRoutes:D(l.finishedRoutes,o)}))}function k(o){i(l=>({...l,profile:{name:o.name,age:o.age}}))}function f(){e=j(at),t.clear(),a()}return{getState:d,subscribe:c,selectRoute:s,setTransport:h,setCurrentPointIndex:m,markPointReached:y,completeTask:I,setAudioSpeed:u,setLastKnownPosition:v,finishRoute:P,setProfile:k,resetProgress:f}}const Y=document.getElementById("app");if(!Y)throw new Error("App root #app is missing.");const te=jt(),ct=Ht(),ee=Xt(),ne=Wt(),G=Qt({storageService:te}),ae=$t({store:G}),oe=Zt({contentService:ct,store:G});let q=()=>{};const ie=[{name:"home",path:"/home"},{name:"excursions",path:"/excursions"},{name:"transport",path:"/transport"},{name:"run",path:"/run"},{name:"tasks",path:"/tasks"},{name:"task-details",path:"/tasks/:taskId"},{name:"articles",path:"/articles"},{name:"article-details",path:"/articles/:articleId"},{name:"profile",path:"/profile"},{name:"about",path:"/about"}],ot={home:vt,excursions:bt,transport:It,run:At,tasks:Et,"task-details":xt,articles:Mt,"article-details":Ct,profile:Nt,about:Lt},U={store:G,contentService:ct,geolocationService:ee,mapService:ne,audioService:ae,routeEngine:oe,router:null,route:null};async function re(t){q(),q=()=>{},U.route=t;const n=await(ot[t.name]||ot.home)(U);Y.innerHTML=gt({activeNav:n.activeNav,content:n.html});const a=Y.querySelector("[data-page-root]");!a||!n.mount||(q=n.mount(a)||(()=>{}))}const lt=Bt({routes:ie,fallbackPath:"/home",onRouteChange:re});U.router=lt;lt.start();
