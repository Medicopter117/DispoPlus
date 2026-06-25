// ==UserScript==
// @name         Leitstellenspiel – Dashboard
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0.0
// @description  Optimiertes Dark-Command-Theme: Dropdown-Fix, Einsatzseite mit Fahrzeugfarben, fixe Bottom-Bar.
// @author       LennyPegauOfficial & AI
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Animationen pausieren wenn Tab nicht sichtbar → CPU sparen
    document.addEventListener('visibilitychange', () => {
        document.documentElement.classList.toggle('lss-bg', document.hidden);
    });

    GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ============================================================
   KEYFRAMES – nur transform/opacity (kein Reflow)
   ============================================================ */
@keyframes lss-pulse {
  0%,100% { opacity: 1; }
  50%      { opacity: .6; }
}
@keyframes lss-scan {
  0%   { transform: translateX(-100%); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateX(200%); opacity: 0; }
}
@keyframes lss-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.lss-bg * { animation-play-state: paused !important; }

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --c0: #000;
  --c1: #080c12;
  --c2: #0d1520;
  --c3: #121d2e;
  --cc: #0a1018;
  --ci: #06090f;
  --bl: #141f30;
  --bh: #1c2e47;
  --t1: #d4e1f7;
  --t2: #556680;
  --t3: #22304a;
  --lk: #58a6ff;
  --a:  #1f6feb;
  --ah: #4d9fff;
  --ad: rgba(31,111,235,.18);
  --ag: rgba(77,159,255,.09);
  --r:  #d93025;
  --rt: #ff6b63;
  --rb: rgba(217,48,37,.10);
  --y:  #b8860b;
  --yt: #ffd166;
  --yb: rgba(184,134,11,.10);
  --g:  #1e7a36;
  --gt: #56e075;
  --gb: rgba(30,122,54,.10);
  --fn: 'Inter',-apple-system,'Segoe UI',sans-serif;
  --ease: 140ms ease;
}

/* ============================================================
   WERBUNG
   ============================================================ */
ins.adsbygoogle,[id^="div-gpt-ad"],[class*="adsbygoogle"],
[class*="werbung"],[class*="banner_ad"],[id*="banner"],
.google-auto-placed,iframe[src*="doubleclick"],
iframe[src*="googlesyndication"],#news_ticker,#news_box,
#sponsor_panel,.sponsor-box,#cookie-consent,.cc-window {
  display: none !important;
}

/* ============================================================
   GLOBALE BASIS
   ============================================================ */
html,body {
  background-color: var(--c0) !important;
  color: var(--t1) !important;
  font-family: var(--fn) !important;
  font-size: 13px !important;
  -webkit-font-smoothing: antialiased !important;
}
*,*::before,*::after {
  border-radius: 0 !important;
  transition: background-color var(--ease),color var(--ease),
              border-color var(--ease),opacity var(--ease) !important;
}
body>div,#main,#frame,#content,#container,#wrapper,
#page-wrapper,#main_page,#building_panel,#mission_list,
#map,#map_container,#map-container,
[class*="container"],[class*="col-xs-"],[class*="col-sm-"],
[class*="col-md-"],[class*="col-lg-"] {
  background-color: var(--c0) !important;
}
[class*="col-xs-"],[class*="col-sm-"],
[class*="col-md-"],[class*="col-lg-"] {
  padding-left: 2px !important; padding-right: 2px !important;
}
.row { margin-left: 0 !important; margin-right: 0 !important; }
a,a:visited { color: var(--lk) !important; text-decoration: none !important; }
a:hover     { color: var(--ah) !important; }
hr { border: none !important; border-top: 1px solid var(--bl) !important; margin: 6px 0 !important; }

/* ============================================================
   SCROLLBARS
   ============================================================ */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg,var(--a),#0a3060); }
::-webkit-scrollbar-thumb:hover { background: var(--ah); }

/* ============================================================
   NAVBAR  –  overflow entfernt (Dropdown-Fix)
   ============================================================ */
.navbar,.navbar-default {
  background: linear-gradient(180deg,#0a0e16,var(--c1)) !important;
  border: none !important;
  border-bottom: 1px solid var(--bh) !important;
  min-height: 42px !important;
  position: relative !important;
  contain: layout !important;
}
.navbar::before {
  content:'' !important; position:absolute !important;
  bottom:0 !important; left:0 !important; right:0 !important; height:1px !important;
  background: linear-gradient(90deg,transparent,var(--a) 30%,var(--ah) 50%,var(--a) 70%,transparent) !important;
  opacity:.6 !important; pointer-events:none !important;
}
.navbar::after {
  content:'' !important; position:absolute !important;
  top:0 !important; left:0 !important; width:40% !important; height:100% !important;
  background: linear-gradient(90deg,transparent,rgba(77,159,255,.06) 50%,transparent) !important;
  animation: lss-scan 8s ease-in-out infinite !important;
  pointer-events:none !important; will-change:transform !important;
}
.navbar-default .navbar-brand,
.navbar-default .navbar-nav>li>a,
.navbar-default .navbar-text {
  color: var(--t1) !important; font-size:12px !important;
  font-weight:500 !important; padding:11px 12px !important; letter-spacing:.03em !important;
}
.navbar-default .navbar-nav>li>a:hover {
  background-color: rgba(77,159,255,.07) !important; color: var(--ah) !important;
}
.navbar-default .navbar-nav>.active>a,
.navbar-default .navbar-nav>.active>a:focus {
  background: linear-gradient(180deg,rgba(77,159,255,.10),transparent) !important;
  border-bottom: 2px solid var(--ah) !important; color: var(--ah) !important;
}
#top_nav_alert_counter,.navbar-right .navbar-text,#top_nav_sos,#top_nav_coins {
  color: var(--t2) !important; font-size:11px !important;
}
.navbar .btn-success,#mission_count_bg {
  background: linear-gradient(135deg,#145226,var(--g)) !important;
  border:1px solid rgba(86,224,117,.3) !important;
  color:#fff !important; font-size:11px !important; font-weight:700 !important; padding:2px 9px !important;
}

/* ============================================================
   DROPDOWN  –  Fix: z-index + position
   ============================================================ */
.dropdown-menu {
  background: linear-gradient(180deg,#0f1825,var(--c2)) !important;
  border:1px solid var(--bh) !important; border-top:1px solid var(--ad) !important;
  padding:4px 0 !important; z-index:9999 !important; position:absolute !important;
  contain:content !important;
}
.open>.dropdown-menu { display: block !important; }
.dropdown-menu>li>a {
  color: var(--t1) !important; font-size:12px !important; padding:6px 16px !important;
}
.dropdown-menu>li>a:hover {
  background: linear-gradient(90deg,var(--ag),transparent) !important;
  color: var(--ah) !important; padding-left:20px !important;
}
.dropdown-divider,.divider { border-color: var(--bl) !important; }

/* ============================================================
   PANELS
   ============================================================ */
.panel,.panel-default,.panel-primary,
.panel-success,.panel-info,.panel-warning,.panel-danger {
  background-color: var(--cc) !important; border:1px solid var(--bh) !important;
  margin-bottom:2px !important; margin-top:0 !important; contain:content !important;
}
.panel-heading,
.panel-default>.panel-heading,.panel-primary>.panel-heading,
.panel-success>.panel-heading,.panel-info>.panel-heading,
.panel-warning>.panel-heading,.panel-danger>.panel-heading {
  background: linear-gradient(90deg,#0d1826,var(--cc)) !important;
  border-bottom:1px solid var(--bh) !important; color:var(--t2) !important;
  font-size:10px !important; font-weight:700 !important;
  letter-spacing:.14em !important; text-transform:uppercase !important; padding:7px 12px !important;
}
.panel-primary>.panel-heading { border-left:2px solid var(--ah) !important; }
.panel-success>.panel-heading { border-left:2px solid var(--gt) !important; }
.panel-warning>.panel-heading { border-left:2px solid var(--yt) !important; }
.panel-danger>.panel-heading  { border-left:2px solid var(--rt) !important; }
.panel-info>.panel-heading    { border-left:2px solid #3ab8d4 !important; }
.panel-body {
  background-color:var(--cc) !important; color:var(--t1) !important; padding:10px 12px !important;
}
.panel-footer {
  background: linear-gradient(90deg,#0d1826,var(--cc)) !important;
  border-top:1px solid var(--bl) !important; color:var(--t2) !important; padding:5px 12px !important;
}

/* ============================================================
   EINSATZLISTE (Sidebar)
   ============================================================ */
.missionSideBarEntry {
  background-color:var(--cc) !important; border-left:2px solid transparent !important;
  border-bottom:2px solid #000 !important; color:var(--t1) !important;
  padding:6px 10px 6px 8px !important; font-size:12px !important;
  position:relative !important; contain:layout !important;
}
.missionSideBarEntry:hover {
  background: linear-gradient(90deg,rgba(77,159,255,.07),var(--cc)) !important;
  border-left-color:var(--ah) !important;
}
.missionSideBarEntry.alert-danger {
  background-color:var(--rb) !important; border-left-color:var(--r) !important;
  will-change:opacity !important; animation:lss-pulse 2.5s ease-in-out infinite !important;
}
.missionSideBarEntry.alert-warning {
  background-color:var(--yb) !important; border-left-color:var(--yt) !important;
}
.missionSideBarEntry.alert-success {
  background-color:var(--gb) !important; border-left-color:var(--gt) !important;
}
.label-danger,.label-warning,.label-success,.label-info,.label-default,.label-primary {
  font-size:9px !important; font-weight:800 !important;
  letter-spacing:.08em !important; padding:2px 6px !important; text-transform:uppercase !important;
}
.label-danger  { background-color:var(--r) !important; color:#fff !important; }
.label-warning { background-color:var(--y) !important; color:#fff !important; }
.label-success { background-color:var(--g) !important; color:#fff !important; }
.label-info    { background-color:var(--a) !important; color:#fff !important; }
.label-default { background-color:var(--c3) !important; color:var(--t2) !important; }
.label-primary { background-color:var(--a) !important; color:#fff !important; }
.missionSideBarEntry a,#mission_list a { color:var(--t1) !important; font-weight:500 !important; }
.missionSideBarEntry a:hover { color:var(--ah) !important; }
.missionSideBarEntry .progress { height:3px !important; background:#000 !important; margin:4px 0 !important; }
.missionSideBarEntry .progress-bar {
  background: linear-gradient(90deg,var(--a),var(--ah),var(--a)) !important;
  background-size:200% !important; will-change:background-position !important;
  animation:lss-shimmer 2.5s linear infinite !important;
}
.missionSideBarEntry .progress-bar-danger  { background:var(--r) !important; }
.missionSideBarEntry .progress-bar-warning { background:var(--yt) !important; }
.missionSideBarEntry .progress-bar-success { background:var(--gt) !important; }
.missionSideBarEntry .alert,.mission_missing {
  background-color:var(--rb) !important; border-left:2px solid var(--r) !important;
  color:var(--rt) !important; font-size:11px !important; padding:3px 8px !important;
}
#mission_list_top_filter,#mission_list_filter_container,.mission_list_filter {
  background: linear-gradient(90deg,#080e18,var(--c1)) !important;
  border-bottom:1px solid var(--bh) !important; padding:5px 8px !important;
}
#mission_list_search,#search_input_field {
  background-color:var(--ci) !important; border:1px solid var(--bh) !important;
  color:var(--t1) !important; height:28px !important; font-size:12px !important;
  padding:2px 10px !important; width:100% !important;
}
#mission_list_search:focus,#search_input_field:focus {
  border-color:var(--ah) !important;
  box-shadow:0 0 0 2px var(--ad),0 0 8px rgba(77,159,255,.15) !important;
}

/* ============================================================
   EINSATZ-DETAILSEITE  (/missions/*)
   Fahrzeug-Auswahl-Buttons, AAO-Tabs, Bottom-Bar
   ============================================================ */

/* === Einsatz-Header === */
#mission_header,#missionH,#mission-header,.mission-title-container,
.col-xs-12.col-md-9 > h1,.col-xs-12 > h1 {
  color: var(--t1) !important;
}
#mission_header small,#missionH small { color: var(--t2) !important; font-size:11px !important; }

/* === Wrapper der gesamten Seite === */
#mission-form { background: var(--c0) !important; }

/* === Fahrzeug-Auswahl-Buttons (rote/grüne Rechtecke) ===
   Die Checkboxen sind als <label> mit Hintergrundfarbe umgesetzt.
   Klassen: .vehicle_checkbox oder als label[class*="vehicle"]
   Farben: rot = nicht verfügbar/unterwegs, grün = verfügbar, blau = ausgewählt
   ============================================================ */
#vehicle_show_table_body_all label,
#vehicle_show_table_body_rett label,
#vehicle_show_table_body_fire label,
#vehicle_show_table_body_police label,
#vehicle_show_table_body_thw label,
#vehicle_show_table_body_water label,
#vehicle_show_table_body_bereit label,
#vehicle_show_table_body_airport label,
#vehicle_show_table_body_sea label,
.vehicle_checkbox_label,
label.vehicle_button,
#accordion label {
  display: inline-block !important;
  min-width: 90px !important;
  padding: 3px 7px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: .04em !important;
  text-transform: uppercase !important;
  cursor: pointer !important;
  border: 1px solid transparent !important;
  text-align: center !important;
  transition: filter var(--ease), border-color var(--ease) !important;
}

/* Rot = Fahrzeug nicht verfügbar / unterwegs */
#vehicle_show_table_body_all label.label-danger,
#vehicle_show_table_body_rett label.label-danger,
#vehicle_show_table_body_fire label.label-danger,
#vehicle_show_table_body_police label.label-danger,
#vehicle_show_table_body_thw label.label-danger,
#vehicle_show_table_body_water label.label-danger,
#vehicle_show_table_body_airport label.label-danger,
label.label-danger.vehicle_checkbox_label,
label.vehicle_button.label-danger,
#accordion label.label-danger,
td label.label-danger {
  background: linear-gradient(135deg,#5c0d0d,var(--r)) !important;
  color: #ffb3b0 !important;
  border-color: rgba(217,48,37,.5) !important;
}
#vehicle_show_table_body_all label.label-danger:hover,
td label.label-danger:hover,
label.label-danger.vehicle_checkbox_label:hover {
  filter: brightness(1.15) !important;
  border-color: var(--rt) !important;
}

/* Grün = verfügbar */
#vehicle_show_table_body_all label.label-success,
#vehicle_show_table_body_rett label.label-success,
#vehicle_show_table_body_fire label.label-success,
label.label-success.vehicle_checkbox_label,
label.vehicle_button.label-success,
#accordion label.label-success,
td label.label-success {
  background: linear-gradient(135deg,#0d3a1a,var(--g)) !important;
  color: #9effc0 !important;
  border-color: rgba(30,122,54,.5) !important;
}
td label.label-success:hover,
label.label-success.vehicle_checkbox_label:hover {
  filter: brightness(1.15) !important;
  border-color: var(--gt) !important;
}

/* Blau = ausgewählt/alarmiert */
#vehicle_show_table_body_all label.label-primary,
#vehicle_show_table_body_all label.label-info,
label.label-primary.vehicle_checkbox_label,
label.label-info.vehicle_checkbox_label,
#accordion label.label-primary,
#accordion label.label-info,
td label.label-primary,
td label.label-info {
  background: linear-gradient(135deg,#0a2a5c,var(--a)) !important;
  color: #a8d4ff !important;
  border-color: rgba(31,111,235,.6) !important;
}
td label.label-primary:hover,
td label.label-info:hover {
  filter: brightness(1.15) !important;
  border-color: var(--ah) !important;
}

/* Gelb = unterwegs/Status 3+4 */
#vehicle_show_table_body_all label.label-warning,
label.label-warning.vehicle_checkbox_label,
#accordion label.label-warning,
td label.label-warning {
  background: linear-gradient(135deg,#3d2600,var(--y)) !important;
  color: #ffe8a0 !important;
  border-color: rgba(184,134,11,.5) !important;
}

/* === Tabelle-Wrapper für Fahrzeuge === */
#vehicle_show_table_body_all,
#vehicle_show_table_body_rett,
#vehicle_show_table_body_fire,
#vehicle_show_table_body_police,
#vehicle_show_table_body_thw,
#vehicle_show_table_body_water,
[id^="vehicle_show_table_body_"] {
  background: var(--c0) !important;
}
#vehicle_show_table_body_all tr td,
#vehicle_show_table_body_rett tr td,
[id^="vehicle_show_table_body_"] tr td {
  background: transparent !important;
  border: none !important;
  padding: 2px 3px !important;
  vertical-align: middle !important;
}

/* Gebäude-Gruppen-Header im Accordion */
#accordion .panel-heading a,
#accordion .panel-title a {
  color: var(--t2) !important;
  font-size:10px !important; font-weight:700 !important;
  letter-spacing:.12em !important; text-transform:uppercase !important;
}
#accordion .panel-heading a:hover { color: var(--ah) !important; }

/* === AAO / Einsatz-Typ Raster ===
   Die Kacheln mit grünem/rotem Indikator links + Einsatzname
   ============================================================ */
#aao_category_panel,#aao_table,
.aao_category,.mission_aao_container {
  background: var(--c0) !important;
}

/* AAO-Button-Kacheln */
.aao_btn, a[id^="aao_button_"],
#aao_table a, #aao_table button,
.mission_aao_btn {
  background-color: var(--cc) !important;
  border: 1px solid var(--bl) !important;
  border-left: 3px solid var(--bl) !important;
  color: var(--t1) !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  padding: 4px 8px 4px 6px !important;
  display: inline-block !important;
  cursor: pointer !important;
  text-align: left !important;
}
.aao_btn:hover,a[id^="aao_button_"]:hover,.mission_aao_btn:hover {
  background-color: var(--c2) !important;
  border-left-color: var(--ah) !important;
  color: var(--ah) !important;
}

/* Grüner Indikator links = alle FK vorhanden */
.label.label-success.aao_available,
[class*="aao"][class*="success"],
.mission_aao_btn .label-success,
span.label.label-success {
  background-color: var(--g) !important;
  color: #fff !important;
  min-width: 8px !important; min-height: 8px !important;
  padding: 2px 5px !important;
}

/* Roter Indikator = Fahrzeuge fehlen */
.label.label-danger.aao_missing,
[class*="aao"][class*="danger"],
.mission_aao_btn .label-danger,
span.label.label-danger {
  background-color: var(--r) !important; color:#fff !important;
  padding:2px 5px !important;
}

/* === Kategorie-Tabs (FEUERWEHR / RETTUNGSDIENST etc.) ===
   ============================================================ */
#mission_vehicle_at_mission_tabs,
#tabs-mission-vehicles,
.mission-tabs,
ul#vehicle_tabs,
ul#aao_tabs {
  background: var(--c1) !important;
  border-bottom: 1px solid var(--bh) !important;
}
#mission_vehicle_at_mission_tabs>li>a,
#tabs-mission-vehicles>li>a,
ul#vehicle_tabs>li>a,
ul#aao_tabs>li>a,
.nav-tabs.mission-nav-tabs>li>a {
  color: var(--t2) !important;
  font-size: 10px !important; font-weight: 700 !important;
  letter-spacing: .09em !important; text-transform: uppercase !important;
  padding: 7px 12px !important; background: transparent !important;
  border: none !important; border-bottom: 2px solid transparent !important;
}
#mission_vehicle_at_mission_tabs>li>a:hover,
ul#vehicle_tabs>li>a:hover,
ul#aao_tabs>li>a:hover {
  color: var(--t1) !important;
  background: rgba(77,159,255,.05) !important;
}
#mission_vehicle_at_mission_tabs>li.active>a,
ul#vehicle_tabs>li.active>a,
ul#aao_tabs>li.active>a {
  color: var(--ah) !important;
  border-bottom: 2px solid var(--ah) !important;
  background: linear-gradient(180deg,rgba(77,159,255,.08),transparent) !important;
}

/* === Einsatz-Typ-Filter-Tabs oben (LEER / FEUERWEHR / RETTUNG...) ===
   ============================================================ */
#mission-aao-category-tabs,
#aao-category-tabs,
ul.nav.nav-tabs[id*="aao"],
ul.nav.nav-tabs[id*="category"],
.mission-type-tabs {
  background: var(--c1) !important;
  border-bottom: 1px solid var(--bh) !important;
  margin: 0 !important;
  overflow-x: auto !important;
  white-space: nowrap !important;
  display: flex !important;
  flex-wrap: nowrap !important;
}

/* === Einsatztypen-Kachel-Grid ===
   Das große Raster mit den Einsatz-Namen
   ============================================================ */
#aao_panel,#mission_aao_content,.mission-content {
  background: var(--c0) !important;
  padding: 4px !important;
}

/* Jede Zeile / Kachel im Einsatz-Typ-Raster */
.col-xs-12.col-sm-6.col-md-4 a,
.col-xs-12.col-md-4 a,
[class*="col-"][class*="aao"] a,
#aao_panel a, #aao_panel button,
.aao-missions-row a,
.aao_filter_div a {
  background-color: var(--cc) !important;
  border: none !important;
  border-left: 3px solid var(--bl) !important;
  border-bottom: 1px solid var(--c0) !important;
  color: var(--t1) !important;
  font-size: 11px !important;
  padding: 3px 6px !important;
  display: block !important;
}
#aao_panel a:hover,.aao_filter_div a:hover {
  background-color: var(--c2) !important;
  border-left-color: var(--ah) !important;
  color: var(--ah) !important;
}

/* Fahrzeug-Zähler Badge neben Einsatztyp */
#aao_panel .badge,
.aao_filter_div .badge,
.mission-count-badge {
  background-color: var(--c3) !important;
  color: var(--t2) !important;
  font-size: 9px !important; font-weight:700 !important;
  border: 1px solid var(--bh) !important;
  padding: 1px 5px !important;
}

/* ============================================================
   ALARMIEREN-LEISTE  (fixed bottom)
   IDs: #mission_alarm_panel, #alarmierungs_bar, #alarm_button_row
   ============================================================ */
#mission_alarm_panel,
#alarmierungs_panel,
#alarm_button_row,
.mission-alarm-container,
#mission_alarm_buttons,
#mission-form > .row:last-child,
.alarmierungs-leiste,
#alarm-bar {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 5000 !important;
  background: linear-gradient(90deg,#060d18,#0a1422) !important;
  border-top: 1px solid var(--bh) !important;
  padding: 6px 12px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  box-shadow: 0 -4px 20px rgba(0,0,0,.8) !important;
}
/* Neon-Linie oben auf der Alarm-Leiste */
#mission_alarm_panel::before,
#alarm_button_row::before,
.mission-alarm-container::before {
  content:'' !important; position:absolute !important;
  top:0 !important; left:0 !important; right:0 !important; height:1px !important;
  background: linear-gradient(90deg,transparent,var(--a) 30%,var(--ah) 50%,var(--a) 70%,transparent) !important;
  opacity:.5 !important;
}
#mission_alarm_panel,#alarm_button_row { position:relative !important; }

/* ALARMIEREN-Button */
#alarm_button,
#mission_alarm_panel .btn-success,
#alarm_button_row .btn-success,
.alarm-btn-main,
button[id*="alarm"][class*="success"] {
  background: linear-gradient(135deg,#0d4020,var(--g)) !important;
  border:1px solid rgba(86,224,117,.4) !important;
  color:#fff !important; font-size:12px !important; font-weight:700 !important;
  letter-spacing:.06em !important; padding:6px 16px !important;
  text-shadow: 0 0 8px rgba(86,224,117,.4) !important;
}
#alarm_button:hover,.alarm-btn-main:hover {
  background: linear-gradient(135deg,var(--g),#2ea043) !important;
  box-shadow: 0 0 12px rgba(86,224,117,.25) !important;
}

/* Pfeil-Buttons (vorheriger/nächster Einsatz) */
#mission_alarm_panel .btn-default,
#alarm_button_row .btn-default,
.mission-nav-btn {
  background-color: var(--c2) !important;
  border:1px solid var(--bh) !important;
  color: var(--t2) !important; font-size:12px !important; padding:6px 10px !important;
}
#mission_alarm_panel .btn-default:hover {
  color: var(--ah) !important; border-color: var(--a) !important;
  background: linear-gradient(135deg,var(--ad),transparent) !important;
}

/* Hilfe-Button */
#help_button,
#mission_alarm_panel .btn-info,
#alarm_button_row .btn-info,
.btn-help-mission {
  background: linear-gradient(135deg,#0f3a50,#1a6a8a) !important;
  border:1px solid rgba(58,184,212,.3) !important; color:#fff !important;
  font-size:11px !important; padding:6px 12px !important;
  margin-left:auto !important;
}

/* Counter Badge auf Alarmieren */
#alarm_vehicle_count,
.alarm-count-badge,
#mission_alarm_panel .badge,
#alarm_button_row .badge {
  background: linear-gradient(135deg,var(--c3),var(--c2)) !important;
  border:1px solid var(--bh) !important;
  color: var(--ah) !important; font-size:11px !important; font-weight:800 !important;
  padding:2px 7px !important;
}

/* Sicherheitsabstand damit Inhalt nicht unter fixem Bar verschwindet */
#mission-form { padding-bottom: 60px !important; }
body[class*="mission"] { padding-bottom: 60px !important; }

/* ============================================================
   FAHRZEUGE AM EINSATZ / ANFAHRT-LISTE
   ============================================================ */
#mission_vehicle_at_mission,#mission_vehicle_driving,
.mission-vehicle-list {
  background: var(--c0) !important;
}
#mission_vehicle_at_mission tr td,
#mission_vehicle_driving tr td {
  background: transparent !important;
  border-top: 1px solid var(--bl) !important;
  padding:4px 8px !important; color:var(--t1) !important; font-size:11px !important;
}
#mission_vehicle_at_mission tr:hover td,
#mission_vehicle_driving tr:hover td {
  background: rgba(77,159,255,.04) !important;
}

/* ============================================================
   WACHEN-PANEL
   ============================================================ */
#building_list,#vehicle_list { background-color:#000 !important; }
#building_search,#vehicle_search {
  background-color:var(--ci) !important; border:1px solid var(--bh) !important;
  color:var(--t1) !important; height:28px !important; font-size:12px !important;
}
#building_list_filter .btn,#vehicle_list_filter .btn,
.building_list_filter_btn,.vehicle_filter_btn {
  background-color:var(--c2) !important; border:1px solid var(--bl) !important;
  color:var(--t2) !important; font-size:11px !important; font-weight:600 !important;
  padding:3px 9px !important; margin:1px !important; text-transform:uppercase !important;
}
#building_list_filter .btn:hover,.building_list_filter_btn:hover {
  background: linear-gradient(135deg,var(--ad),transparent) !important;
  color:var(--ah) !important; border-color:var(--a) !important;
}
#building_list_filter .btn.active,.building_list_filter_btn.active {
  background: linear-gradient(135deg,var(--ad),rgba(77,159,255,.05)) !important;
  border-color:var(--ah) !important; color:var(--ah) !important;
}
.building_list_entry,#building_list li,#vehicle_list li {
  background-color:var(--cc) !important; border-left:2px solid transparent !important;
  border-bottom:2px solid #000 !important; color:var(--t1) !important;
  padding:5px 10px 5px 8px !important; font-size:12px !important; contain:layout !important;
}
.building_list_entry:hover {
  background: linear-gradient(90deg,rgba(77,159,255,.06),var(--cc)) !important;
  border-left-color:var(--a) !important;
}
.building_list_entry a,#building_list a { color:var(--t1) !important; font-weight:500 !important; }
.building_list_entry a:hover { color:var(--ah) !important; }
.building_list_entry .btn-xs,#building_list .btn-xs,#vehicle_list .btn-xs {
  background-color:var(--c3) !important; border:1px solid var(--bh) !important;
  color:var(--t2) !important; font-size:10px !important; padding:1px 6px !important;
}
.building_list_entry .btn-xs:hover {
  color:var(--ah) !important; border-color:var(--a) !important;
  background: linear-gradient(135deg,var(--ad),transparent) !important;
}
.building_list_fms,.vehicle_fms_indicator,.fms_indicator {
  font-size:10px !important; font-weight:800 !important; min-width:20px !important;
  display:inline-block !important; padding:1px 5px !important;
  border:1px solid var(--bh) !important; text-align:center !important;
}
.fms-1,[class*="fms_1"],.fms-2,[class*="fms_2"] { background:#1a4020 !important; color:var(--gt) !important; }
.fms-3,[class*="fms_3"],.fms-4,[class*="fms_4"] { background:#3a2800 !important; color:var(--yt) !important; }
.fms-5,[class*="fms_5"] { background:rgba(77,159,255,.12) !important; color:var(--ah) !important; }
.fms-6,[class*="fms_6"] { background:rgba(217,48,37,.12) !important; color:var(--rt) !important; }
#building_list_tabs .nav-tabs,#building_list .nav-tabs {
  border-bottom:1px solid var(--bh) !important; background-color:var(--c2) !important;
}
#building_list_tabs .nav-tabs>li>a,#building_list .nav-tabs>li>a {
  background:transparent !important; border:none !important;
  color:var(--t2) !important; font-size:11px !important; padding:6px 12px !important;
}
#building_list_tabs .nav-tabs>li.active>a,#building_list .nav-tabs>li.active>a {
  background-color:var(--c1) !important; border-bottom:2px solid var(--ah) !important;
  color:var(--ah) !important;
}

/* ============================================================
   CHAT
   ============================================================ */
#chat_window,#chat-container,.chat_window,#chatContent {
  background-color:var(--cc) !important; border:1px solid var(--bh) !important; contain:content !important;
}
#chat_messages>div,.chat-message,#chatMessages>div {
  border-bottom:1px solid rgba(28,46,71,.5) !important;
  color:var(--t1) !important; font-size:12px !important; padding:4px 8px !important;
}
#chat_messages>div:hover,#chatMessages>div:hover {
  background: linear-gradient(90deg,rgba(77,159,255,.05),transparent) !important;
}
.chat_username,.chat-username { color:var(--ah) !important; font-weight:700 !important; }
.chat_time,.chat-time { color:var(--t3) !important; font-size:10px !important; }
#chat_head,.chat_head {
  background: linear-gradient(90deg,#0d1826,var(--cc)) !important;
  border-bottom:1px solid var(--bh) !important; color:var(--t2) !important;
  font-size:10px !important; font-weight:700 !important;
  letter-spacing:.12em !important; text-transform:uppercase !important; padding:7px 12px !important;
}
#chat_message,#chatInput {
  background-color:var(--ci) !important; border:1px solid var(--bh) !important;
  color:var(--t1) !important; font-size:12px !important;
}

/* ============================================================
   TABELLEN
   ============================================================ */
.table { color:var(--t1) !important; }
.table>thead>tr>th {
  background: linear-gradient(90deg,#0d1826,var(--cc)) !important;
  border-bottom:1px solid var(--ad) !important; color:var(--t2) !important;
  font-size:10px !important; font-weight:700 !important;
  letter-spacing:.10em !important; text-transform:uppercase !important; padding:7px 10px !important;
}
.table>tbody>tr>td,.table>tbody>tr>th {
  border-top:1px solid var(--bl) !important; padding:5px 10px !important; vertical-align:middle !important;
}
.table-striped>tbody>tr:nth-of-type(odd) { background-color:rgba(13,21,32,.7) !important; }
.table-hover>tbody>tr:hover>td {
  background: linear-gradient(90deg,rgba(77,159,255,.05),transparent) !important;
}

/* ============================================================
   BUTTONS (allgemein)
   ============================================================ */
.btn {
  font-size:12px !important; font-weight:600 !important; padding:4px 12px !important;
  letter-spacing:.04em !important; text-transform:uppercase !important; cursor:pointer !important;
}
.btn-default {
  background-color:var(--c2) !important; border:1px solid var(--bh) !important; color:var(--t1) !important;
}
.btn-default:hover { background-color:var(--c3) !important; }
.btn-primary {
  background: linear-gradient(135deg,#143d8c,var(--a)) !important;
  border:1px solid rgba(77,159,255,.4) !important; color:#fff !important;
}
.btn-primary:hover {
  background: linear-gradient(135deg,var(--a),var(--ah)) !important; border-color:var(--ah) !important;
}
.btn-success {
  background: linear-gradient(135deg,#114724,var(--g)) !important;
  border:1px solid rgba(86,224,117,.3) !important; color:#fff !important;
}
.btn-success:hover { background: linear-gradient(135deg,var(--g),#2ea043) !important; }
.btn-warning {
  background: linear-gradient(135deg,#5c3a00,var(--y)) !important;
  border:1px solid rgba(255,209,102,.3) !important; color:#fff !important;
}
.btn-danger {
  background: linear-gradient(135deg,#7a1010,var(--r)) !important;
  border:1px solid rgba(255,107,99,.3) !important; color:#fff !important;
}
.btn-danger:hover { background: linear-gradient(135deg,var(--r),#ff5050) !important; }
.btn-info {
  background: linear-gradient(135deg,#0f4060,#1a6a8a) !important;
  border:1px solid rgba(58,184,212,.3) !important; color:#fff !important;
}

/* ============================================================
   FORMULARE
   ============================================================ */
input[type="text"],input[type="number"],input[type="email"],
input[type="password"],input[type="search"],
select,textarea,.form-control {
  background-color:var(--ci) !important; border:1px solid var(--bh) !important;
  color:var(--t1) !important; font-size:12px !important; font-family:var(--fn) !important;
}
input::placeholder,textarea::placeholder { color:var(--t3) !important; font-style:italic !important; }
input:focus,select:focus,textarea:focus,.form-control:focus {
  border-color:var(--ah) !important;
  box-shadow:0 0 0 2px var(--ad),0 0 10px rgba(77,159,255,.15) !important; outline:none !important;
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-content { background-color:var(--c1) !important; border:1px solid var(--bh) !important; }
.modal-header {
  background: linear-gradient(90deg,#0d1826,var(--c1)) !important;
  border-bottom:1px solid var(--ad) !important; color:var(--t1) !important; padding:12px 16px !important;
}
.modal-title { font-size:13px !important; font-weight:700 !important; text-transform:uppercase !important; }
.modal-header .close { color:var(--t2) !important; opacity:1 !important; font-size:18px !important; }
.modal-header .close:hover { color:var(--rt) !important; }
.modal-body { color:var(--t1) !important; background-color:var(--c1) !important; padding:14px 16px !important; }
.modal-footer {
  background: linear-gradient(90deg,#0d1826,var(--c1)) !important;
  border-top:1px solid var(--bl) !important; padding:10px 16px !important;
}
.modal-backdrop { background-color:#000 !important; opacity:.8 !important; }

/* ============================================================
   TABS (allgemein)
   ============================================================ */
.nav-tabs { border-bottom:1px solid var(--bh) !important; }
.nav-tabs>li>a {
  background:transparent !important; border:1px solid transparent !important;
  color:var(--t2) !important; font-size:11px !important; font-weight:600 !important;
  padding:6px 14px !important; text-transform:uppercase !important;
}
.nav-tabs>li>a:hover {
  background: linear-gradient(180deg,rgba(77,159,255,.07),transparent) !important; color:var(--t1) !important;
}
.nav-tabs>li.active>a,.nav-tabs>li.active>a:focus {
  background-color:var(--cc) !important; border:1px solid var(--bh) !important;
  border-top:2px solid var(--ah) !important; border-bottom-color:var(--cc) !important;
  color:var(--ah) !important;
}

/* ============================================================
   ALERTS / STATUS
   ============================================================ */
.alert { padding:6px 12px !important; font-size:12px !important; }
.alert-success { background-color:var(--gb) !important; border-left:2px solid var(--gt) !important; color:var(--gt) !important; }
.alert-warning { background-color:var(--yb) !important; border-left:2px solid var(--yt) !important; color:var(--yt) !important; }
.alert-danger  { background-color:var(--rb) !important; border-left:2px solid var(--rt) !important; color:var(--rt) !important; }
.alert-info    { background-color:rgba(31,111,235,.10) !important; border-left:2px solid var(--ah) !important; color:var(--lk) !important; }

/* ============================================================
   DIVERSES
   ============================================================ */
.badge {
  background: linear-gradient(135deg,var(--c3),var(--c2)) !important;
  color:var(--t2) !important; border:1px solid var(--bh) !important;
  font-size:10px !important; font-weight:700 !important; padding:2px 6px !important;
}
.progress {
  background:#000 !important; height:6px !important; margin-bottom:4px !important;
  border:1px solid var(--bl) !important;
}
.progress-bar {
  background: linear-gradient(90deg,var(--a),var(--ah),var(--a)) !important;
  background-size:200% !important; will-change:background-position !important;
  animation:lss-shimmer 3s linear infinite !important;
}
.progress-bar-success { background: linear-gradient(90deg,var(--g),var(--gt)) !important; }
.progress-bar-warning { background: linear-gradient(90deg,var(--y),var(--yt)) !important; }
.progress-bar-danger  { background: linear-gradient(90deg,var(--r),var(--rt)) !important; }
.well { background: linear-gradient(135deg,#0d1826,var(--cc)) !important; border:1px solid var(--bh) !important; padding:12px !important; }
.breadcrumb {
  background: linear-gradient(90deg,#0d1826,var(--cc)) !important;
  color:var(--t2) !important; font-size:11px !important; padding:5px 12px !important;
  border-bottom:1px solid var(--bh) !important;
}
.breadcrumb>.active { color:var(--t1) !important; }
.breadcrumb>li+li::before { color:var(--t3) !important; }
.tooltip-inner {
  background: linear-gradient(135deg,#0d1826,var(--c3)) !important;
  color:var(--t1) !important; border:1px solid var(--ad) !important;
  font-size:11px !important; padding:4px 10px !important;
}
.popover {
  background-color:var(--c2) !important; border:1px solid var(--bh) !important; z-index:9998 !important;
}
.popover-title {
  background: linear-gradient(90deg,#0d1826,var(--c2)) !important;
  border-bottom:1px solid var(--bh) !important; color:var(--t1) !important;
  font-size:12px !important; font-weight:700 !important; text-transform:uppercase !important;
}
.popover-content { color:var(--t1) !important; font-size:12px !important; }
.pagination>li>a,.pagination>li>span {
  background-color:var(--c2) !important; border-color:var(--bh) !important; color:var(--t2) !important;
}
.pagination>li>a:hover {
  background: linear-gradient(135deg,var(--ad),transparent) !important; color:var(--ah) !important;
}
.pagination>.active>a,.pagination>.active>span {
  background: linear-gradient(135deg,var(--a),#143d8c) !important; color:#fff !important;
}
.pagination>.disabled>a { background-color:var(--cc) !important; color:var(--t3) !important; }
.list-group-item {
  background-color:var(--cc) !important; border-color:var(--bl) !important;
  border-bottom:1px solid #000 !important; color:var(--t1) !important; font-size:12px !important;
}
.list-group-item:hover {
  background: linear-gradient(90deg,rgba(77,159,255,.06),var(--cc)) !important;
  border-left:2px solid var(--a) !important;
}
.list-group-item.active {
  background: linear-gradient(90deg,var(--ad),transparent) !important;
  border-left:2px solid var(--ah) !important; color:var(--ah) !important;
}
.input-group-addon {
  background-color:var(--c2) !important; border-color:var(--bh) !important;
  color:var(--t2) !important; font-size:12px !important;
}
.glyphicon { color:var(--t2) !important; }
a:hover .glyphicon,.btn:hover .glyphicon { color:var(--ah) !important; }
footer,#footer {
  background: linear-gradient(90deg,#0d1826,var(--c1)) !important;
  border-top:1px solid var(--bh) !important; color:var(--t3) !important; font-size:11px !important;
}
code,pre {
  background-color:#060c14 !important; color:#79c0ff !important;
  border:1px solid var(--bh) !important; font-size:11px !important;
}
[style*="background-color: white"],[style*="background-color:#fff"],
[style*="background-color: #fff"],[style*="background: white"],[style*="background:#fff"] {
  background-color:var(--c1) !important;
}
[style*="color: black"],[style*="color:#000"],[style*="color: #000"] {
  color:var(--t1) !important;
}
`);

})();