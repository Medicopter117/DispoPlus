// ==UserScript==
// @name         Leitstellenspiel – Dark Command Theme v4
// @namespace    https://www.leitstellenspiel.de/
// @version      4.0.0
// @description  Premium Dark-Dashboard-Theme v4: Neon-Akzente, Puls-Animationen, Command-Center-Ästhetik.
// @author       UserScript by Claude
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`

/* ============================================================
   GOOGLE FONT IMPORT
   ============================================================ */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* ============================================================
   KEYFRAME ANIMATIONEN
   ============================================================ */

/* Puls für kritische Alarm-Einträge */
@keyframes lss-pulse-red {
  0%, 100% { border-left-color: #da3633; background-color: rgba(218,54,51,0.08); }
  50%       { border-left-color: #ff5e5b; background-color: rgba(218,54,51,0.16); }
}

/* Sanftes Glühen für Accent-Elemente */
@keyframes lss-glow-blue {
  0%, 100% { box-shadow: 0 0 4px rgba(56,139,253,0.3); }
  50%       { box-shadow: 0 0 10px rgba(56,139,253,0.6); }
}

/* Slide-in von rechts für neue Einsatzeinträge */
@keyframes lss-slidein {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Scan-Linie über Navbar */
@keyframes lss-scan {
  0%   { transform: translateX(-100%); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateX(200%); opacity: 0; }
}

/* Shimmer für aktive Buttons */
@keyframes lss-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  /* Tiefschwarz als Basis */
  --bg-base:        #000000;
  --bg-surface:     #080c12;
  --bg-raised:      #0d1520;
  --bg-overlay:     #121d2e;
  --bg-card:        #0a1018;
  --bg-input:       #06090f;

  /* Borders */
  --border-subtle:  #141f30;
  --border-active:  #1c2e47;
  --border-neon:    rgba(56,139,253,0.4);

  /* Text */
  --text-primary:   #d4e1f7;
  --text-secondary: #556680;
  --text-muted:     #22304a;
  --text-link:      #58a6ff;

  /* Neon-Blau Accent */
  --accent:         #1f6feb;
  --accent-bright:  #4d9fff;
  --accent-dim:     rgba(31,111,235,0.18);
  --accent-glow:    rgba(77,159,255,0.09);
  --accent-neon:    rgba(77,159,255,0.5);

  /* Status-Farben – kräftig & leuchtend */
  --red:            #d93025;
  --red-dim:        rgba(217,48,37,0.10);
  --red-text:       #ff6b63;

  --yellow:         #b8860b;
  --yellow-dim:     rgba(184,134,11,0.10);
  --yellow-text:    #ffd166;

  --green:          #1e7a36;
  --green-dim:      rgba(30,122,54,0.10);
  --green-text:     #56e075;

  --blue-dim:       rgba(31,111,235,0.10);
  --blue-text:      #58a6ff;

  --font-ui: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;

  --trans-fast: 130ms ease;
  --trans-base: 200ms ease;
}

/* ============================================================
   WERBUNG ENTFERNEN
   ============================================================ */
ins.adsbygoogle, [id^="div-gpt-ad"], [class*="adsbygoogle"],
[class*="werbung"], [class*="banner_ad"], [id*="banner"],
.google-auto-placed, iframe[src*="doubleclick"],
iframe[src*="googlesyndication"], #news_ticker, #news_box,
#sponsor_panel, .sponsor-box, #cookie-consent, .cc-window {
  display: none !important;
}

/* ============================================================
   GLOBALE BASIS
   ============================================================ */
html, body {
  background-color: #000000 !important;
  color: var(--text-primary) !important;
  font-family: var(--font-ui) !important;
  font-size: 13px !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}

/* ============================================================
   LAYOUT – ALLE ZWISCHENRÄUME SCHWARZ
   ============================================================ */
body > div, #main, #frame, #content, #container,
#wrapper, #page-wrapper, #main_page,
[id*="layout"], [id*="frame"], [id*="outer"],
[id*="content"], [id*="wrapper"],
[class*="container"], .container-fluid, .container, .row,
[class*="col-xs-"], [class*="col-sm-"],
[class*="col-md-"], [class*="col-lg-"],
#building_panel, #mission_list, #map, #map_container, #map-container {
  background-color: #000000 !important;
}

[class*="col-xs-"], [class*="col-sm-"],
[class*="col-md-"], [class*="col-lg-"] {
  padding-left: 2px !important;
  padding-right: 2px !important;
}

.row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* Übergänge */
*, *::before, *::after {
  border-radius: 0 !important;
  box-shadow: none !important;
  transition:
    background-color var(--trans-fast),
    color var(--trans-fast),
    border-color var(--trans-fast),
    box-shadow var(--trans-fast),
    opacity var(--trans-fast) !important;
}

a, a:visited { color: var(--text-link) !important; text-decoration: none !important; }
a:hover      { color: var(--accent-bright) !important; }

hr { border: none !important; border-top: 1px solid var(--border-subtle) !important; margin: 6px 0 !important; }

/* ============================================================
   SCROLLBARS
   ============================================================ */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #000000; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--accent), #0a3060);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover { background: var(--accent-bright); }

/* ============================================================
   NAVBAR – Command-Center-Leiste
   ============================================================ */
.navbar,
.navbar-default {
  background: linear-gradient(180deg, #0a0e16 0%, var(--bg-surface) 100%) !important;
  border: none !important;
  border-bottom: 1px solid var(--border-active) !important;
  min-height: 42px !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Scan-Linie-Effekt über Navbar */
.navbar::after {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 40% !important;
  height: 100% !important;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(77,159,255,0.04) 40%,
    rgba(77,159,255,0.08) 50%,
    rgba(77,159,255,0.04) 60%,
    transparent 100%) !important;
  animation: lss-scan 8s ease-in-out infinite !important;
  pointer-events: none !important;
}

/* Blauer Neon-Strich unten auf Navbar */
.navbar::before {
  content: '' !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 1px !important;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--accent) 30%,
    var(--accent-bright) 50%,
    var(--accent) 70%,
    transparent 100%) !important;
  opacity: 0.6 !important;
}

.navbar-default .navbar-brand,
.navbar-default .navbar-nav > li > a,
.navbar-default .navbar-text {
  color: var(--text-primary) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding-top: 11px !important;
  padding-bottom: 11px !important;
  letter-spacing: 0.03em !important;
}

.navbar-default .navbar-nav > li > a:hover {
  background-color: rgba(77,159,255,0.07) !important;
  color: var(--accent-bright) !important;
}

.navbar-default .navbar-nav > .active > a,
.navbar-default .navbar-nav > .active > a:focus {
  background: linear-gradient(180deg, rgba(77,159,255,0.10) 0%, transparent 100%) !important;
  border-bottom: 2px solid var(--accent-bright) !important;
  color: var(--accent-bright) !important;
}

#top_nav_alert_counter,
.navbar-right .navbar-text,
#top_nav_sos,
#top_nav_coins {
  color: var(--text-secondary) !important;
  font-size: 11px !important;
}

/* Einsatz-Counter-Button */
.navbar .btn-success,
#mission_count_bg {
  background: linear-gradient(135deg, #145226, var(--green)) !important;
  border: 1px solid rgba(86,224,117,0.3) !important;
  color: #fff !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  padding: 2px 9px !important;
  letter-spacing: 0.04em !important;
  text-shadow: 0 0 8px rgba(86,224,117,0.5) !important;
}

/* Dropdown */
.dropdown-menu {
  background: linear-gradient(180deg, #0f1825 0%, var(--bg-raised) 100%) !important;
  border: 1px solid var(--border-active) !important;
  border-top: 1px solid var(--accent-dim) !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(77,159,255,0.05) !important;
  padding: 4px 0 !important;
}
.dropdown-menu > li > a {
  color: var(--text-primary) !important;
  font-size: 12px !important;
  padding: 6px 16px !important;
}
.dropdown-menu > li > a:hover {
  background: linear-gradient(90deg, var(--accent-glow) 0%, transparent 100%) !important;
  color: var(--accent-bright) !important;
  padding-left: 20px !important;
}
.dropdown-divider, .divider {
  border-color: var(--border-subtle) !important;
}

/* ============================================================
   PANELS
   ============================================================ */
.panel, .panel-default, .panel-primary,
.panel-success, .panel-info, .panel-warning, .panel-danger {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-active) !important;
  margin-bottom: 2px !important;
  margin-top: 0 !important;
}

.panel-heading,
.panel-default > .panel-heading,
.panel-primary > .panel-heading,
.panel-success > .panel-heading,
.panel-info    > .panel-heading,
.panel-warning > .panel-heading,
.panel-danger  > .panel-heading {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-card) 100%) !important;
  border-bottom: 1px solid var(--border-active) !important;
  color: var(--text-secondary) !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  padding: 7px 12px !important;
}

/* Farbige Typ-Striche */
.panel-primary > .panel-heading {
  border-left: 2px solid var(--accent-bright) !important;
  text-shadow: 0 0 12px rgba(77,159,255,0.4) !important;
}
.panel-success > .panel-heading {
  border-left: 2px solid var(--green-text) !important;
  text-shadow: 0 0 12px rgba(86,224,117,0.4) !important;
}
.panel-warning > .panel-heading {
  border-left: 2px solid var(--yellow-text) !important;
  text-shadow: 0 0 12px rgba(255,209,102,0.4) !important;
}
.panel-danger > .panel-heading {
  border-left: 2px solid var(--red-text) !important;
  text-shadow: 0 0 12px rgba(255,107,99,0.4) !important;
}
.panel-info > .panel-heading {
  border-left: 2px solid #3ab8d4 !important;
}

.panel-body {
  background-color: var(--bg-card) !important;
  color: var(--text-primary) !important;
  padding: 10px 12px !important;
}
.panel-footer {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-card) 100%) !important;
  border-top: 1px solid var(--border-subtle) !important;
  color: var(--text-secondary) !important;
  padding: 5px 12px !important;
}

/* ============================================================
   EINSATZLISTE – Command-Center-Style
   ============================================================ */
#mission_list .missionSideBarEntry,
.missionSideBarEntry {
  background-color: var(--bg-card) !important;
  border: none !important;
  border-left: 2px solid transparent !important;
  border-bottom: 2px solid #000000 !important;
  color: var(--text-primary) !important;
  padding: 6px 10px 6px 8px !important;
  font-size: 12px !important;
  position: relative !important;
}

/* Hover: Neon-Linie links + leichtes Aufleuchten */
.missionSideBarEntry:hover {
  background: linear-gradient(90deg, rgba(77,159,255,0.07) 0%, var(--bg-card) 100%) !important;
  border-left: 2px solid var(--accent-bright) !important;
}

/* ALARM-Einträge – pulsierend */
.missionSideBarEntry.alert-danger,
.alert-danger.missionSideBarEntry {
  background-color: rgba(217,48,37,0.08) !important;
  border-left: 2px solid var(--red) !important;
  animation: lss-pulse-red 2.5s ease-in-out infinite !important;
}
.missionSideBarEntry.alert-warning,
.alert-warning.missionSideBarEntry {
  background-color: rgba(184,134,11,0.08) !important;
  border-left: 2px solid var(--yellow-text) !important;
}
.missionSideBarEntry.alert-success,
.alert-success.missionSideBarEntry {
  background-color: rgba(30,122,54,0.08) !important;
  border-left: 2px solid var(--green-text) !important;
}

/* Status-Badges */
.missionSideBarEntry .label,
.label-danger, .label-warning, .label-success,
.label-info, .label-default, .label-primary {
  font-size: 9px !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  padding: 2px 6px !important;
  border: none !important;
  text-transform: uppercase !important;
}
.label-danger  {
  background-color: var(--red) !important;
  color: #fff !important;
  text-shadow: 0 0 6px rgba(255,107,99,0.6) !important;
}
.label-warning { background-color: var(--yellow) !important; color: #fff !important; }
.label-success {
  background-color: var(--green) !important;
  color: #fff !important;
  text-shadow: 0 0 6px rgba(86,224,117,0.4) !important;
}
.label-info    { background-color: var(--accent) !important; color: #fff !important; }
.label-default { background-color: var(--bg-overlay) !important; color: var(--text-secondary) !important; }
.label-primary { background-color: var(--accent) !important; color: #fff !important; }

/* Einsatz-Name */
.missionSideBarEntry a,
#mission_list a {
  color: var(--text-primary) !important;
  font-weight: 500 !important;
}
.missionSideBarEntry a:hover { color: var(--accent-bright) !important; }

/* Fortschrittsbalken – animiert */
.missionSideBarEntry .progress {
  height: 3px !important;
  background-color: #000 !important;
  margin: 4px 0 !important;
}
.missionSideBarEntry .progress-bar-danger  { background-color: var(--red) !important; }
.missionSideBarEntry .progress-bar-warning { background-color: var(--yellow-text) !important; }
.missionSideBarEntry .progress-bar-success { background-color: var(--green-text) !important; }
.missionSideBarEntry .progress-bar {
  background: linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent)) !important;
  background-size: 200% !important;
  animation: lss-shimmer 2.5s linear infinite !important;
}

/* Fehlende Fahrzeuge */
.missionSideBarEntry .alert,
.mission_missing {
  background-color: rgba(217,48,37,0.08) !important;
  border: none !important;
  border-left: 2px solid var(--red) !important;
  color: var(--red-text) !important;
  font-size: 11px !important;
  padding: 3px 8px !important;
  margin: 3px 0 !important;
}

/* Filter-Leiste */
#mission_list_top_filter,
#mission_list_filter_container,
.mission_list_filter {
  background: linear-gradient(90deg, #080e18 0%, var(--bg-surface) 100%) !important;
  border-bottom: 1px solid var(--border-active) !important;
  padding: 5px 8px !important;
}

/* Suchfeld */
#mission_list_search,
#search_input_field {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
  height: 28px !important;
  font-size: 12px !important;
  padding: 2px 10px !important;
  width: 100% !important;
}
#mission_list_search:focus,
#search_input_field:focus {
  border-color: var(--accent-bright) !important;
  box-shadow: 0 0 0 2px var(--accent-dim), 0 0 8px rgba(77,159,255,0.15) !important;
}

/* ============================================================
   WACHEN-PANEL (linke Spalte)
   ============================================================ */
#building_list,
#vehicle_list {
  background-color: #000000 !important;
}

/* Suchfeld */
#building_search,
#vehicle_search,
input[placeholder="Wachen suchen"] {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
  height: 28px !important;
  font-size: 12px !important;
  padding: 2px 10px !important;
}

/* Filter-Buttons */
#building_list_filter .btn,
#vehicle_list_filter .btn,
.building_list_filter_btn,
.vehicle_filter_btn {
  background-color: var(--bg-raised) !important;
  border: 1px solid var(--border-subtle) !important;
  color: var(--text-secondary) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  padding: 3px 9px !important;
  margin: 1px !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
}
#building_list_filter .btn:hover,
#vehicle_list_filter .btn:hover,
.building_list_filter_btn:hover {
  background: linear-gradient(135deg, var(--accent-dim), transparent) !important;
  color: var(--accent-bright) !important;
  border-color: var(--accent) !important;
}
#building_list_filter .btn.active,
#vehicle_list_filter .btn.active,
.building_list_filter_btn.active {
  background: linear-gradient(135deg, var(--accent-dim), rgba(77,159,255,0.05)) !important;
  border-color: var(--accent-bright) !important;
  color: var(--accent-bright) !important;
  text-shadow: 0 0 8px rgba(77,159,255,0.4) !important;
}

/* Wachen-Einträge */
.building_list_entry,
#building_list li,
#vehicle_list li {
  background-color: var(--bg-card) !important;
  border: none !important;
  border-left: 2px solid transparent !important;
  border-bottom: 2px solid #000000 !important;
  color: var(--text-primary) !important;
  padding: 5px 10px 5px 8px !important;
  font-size: 12px !important;
}

.building_list_entry:hover {
  background: linear-gradient(90deg, rgba(77,159,255,0.06) 0%, var(--bg-card) 100%) !important;
  border-left: 2px solid var(--accent) !important;
}

/* Wachen-Name */
.building_list_entry a,
#building_list a {
  color: var(--text-primary) !important;
  font-weight: 500 !important;
}
.building_list_entry a:hover { color: var(--accent-bright) !important; }

/* Details-Button */
.building_list_entry .btn-xs,
#building_list .btn-xs,
#vehicle_list .btn-xs {
  background-color: var(--bg-overlay) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-secondary) !important;
  font-size: 10px !important;
  padding: 1px 6px !important;
}
.building_list_entry .btn-xs:hover {
  color: var(--accent-bright) !important;
  border-color: var(--accent) !important;
  background: linear-gradient(135deg, var(--accent-dim), transparent) !important;
}

/* Rückalarmieren */
.btn[data-original-title="Rückalarmieren"],
a[href*="vehicle"][class*="btn-danger"],
.btn-danger.vehicle_alarm_btn {
  background: linear-gradient(135deg, #8b1a1a, var(--red)) !important;
  border-color: rgba(255,107,99,0.4) !important;
  color: #fff !important;
  font-size: 10px !important;
  padding: 1px 7px !important;
  text-shadow: 0 0 6px rgba(255,107,99,0.4) !important;
}

/* FMS-Status-Badges */
.building_list_fms,
.vehicle_fms_indicator,
.fms_indicator {
  font-size: 10px !important;
  font-weight: 800 !important;
  min-width: 20px !important;
  text-align: center !important;
  display: inline-block !important;
  padding: 1px 5px !important;
  border: 1px solid var(--border-active) !important;
  letter-spacing: 0.02em !important;
}

/* WACHEN-Tabs */
#building_list_tabs .nav-tabs,
#building_list .nav-tabs {
  border-bottom: 1px solid var(--border-active) !important;
  background-color: var(--bg-raised) !important;
}
#building_list_tabs .nav-tabs > li > a,
#building_list .nav-tabs > li > a {
  background-color: transparent !important;
  border: none !important;
  color: var(--text-secondary) !important;
  font-size: 11px !important;
  padding: 6px 12px !important;
  letter-spacing: 0.03em !important;
}
#building_list_tabs .nav-tabs > li.active > a,
#building_list .nav-tabs > li.active > a {
  background-color: var(--bg-surface) !important;
  border-bottom: 2px solid var(--accent-bright) !important;
  color: var(--accent-bright) !important;
  text-shadow: 0 0 10px rgba(77,159,255,0.4) !important;
}

/* ============================================================
   CHAT-BEREICH
   ============================================================ */
#chat_window, #chat-container, .chat_window, #chatContent {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
}

#chat_messages, #chatMessages {
  background-color: var(--bg-card) !important;
}

#chat_messages > div,
.chat-message,
#chatMessages > div {
  border-bottom: 1px solid rgba(28,46,71,0.5) !important;
  color: var(--text-primary) !important;
  font-size: 12px !important;
  padding: 4px 8px !important;
}

#chat_messages > div:hover,
#chatMessages > div:hover {
  background: linear-gradient(90deg, rgba(77,159,255,0.05) 0%, transparent 100%) !important;
}

.chat_username, .chat-username {
  color: var(--accent-bright) !important;
  font-weight: 700 !important;
  text-shadow: 0 0 6px rgba(77,159,255,0.3) !important;
}
.chat_time, .chat-time {
  color: var(--text-muted) !important;
  font-size: 10px !important;
}

#chat_head, .chat_head {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-card) 100%) !important;
  border-bottom: 1px solid var(--border-active) !important;
  color: var(--text-secondary) !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  padding: 7px 12px !important;
}

#chat_head .btn, .chat_head .btn {
  background-color: var(--bg-overlay) !important;
  border: 1px solid var(--border-subtle) !important;
  color: var(--text-secondary) !important;
  font-size: 10px !important;
  padding: 1px 7px !important;
}

#chat_message, #chatInput {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
  font-size: 12px !important;
}

/* ============================================================
   TABELLEN
   ============================================================ */
.table { color: var(--text-primary) !important; background-color: transparent !important; }

.table > thead > tr > th {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-card) 100%) !important;
  border-bottom: 1px solid var(--accent-dim) !important;
  color: var(--text-secondary) !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.10em !important;
  text-transform: uppercase !important;
  padding: 7px 10px !important;
}

.table > tbody > tr > td,
.table > tbody > tr > th {
  border-top: 1px solid var(--border-subtle) !important;
  background-color: transparent !important;
  padding: 5px 10px !important;
  vertical-align: middle !important;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: rgba(13,21,32,0.7) !important;
}
.table-hover > tbody > tr:hover > td {
  background: linear-gradient(90deg, rgba(77,159,255,0.05) 0%, transparent 100%) !important;
}

/* ============================================================
   BUTTONS – Premium-Style mit Glow
   ============================================================ */
.btn {
  font-size: 12px !important;
  font-weight: 600 !important;
  padding: 4px 12px !important;
  letter-spacing: 0.04em !important;
  cursor: pointer !important;
  text-transform: uppercase !important;
}

.btn-default {
  background-color: var(--bg-raised) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
}
.btn-default:hover {
  background-color: var(--bg-overlay) !important;
  border-color: var(--border-active) !important;
  color: var(--text-primary) !important;
}

.btn-primary {
  background: linear-gradient(135deg, #143d8c, var(--accent)) !important;
  border: 1px solid rgba(77,159,255,0.4) !important;
  color: #fff !important;
  text-shadow: 0 0 8px rgba(77,159,255,0.4) !important;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent), var(--accent-bright)) !important;
  border-color: var(--accent-bright) !important;
  box-shadow: 0 0 12px rgba(77,159,255,0.3) !important;
}

.btn-success {
  background: linear-gradient(135deg, #114724, var(--green)) !important;
  border: 1px solid rgba(86,224,117,0.3) !important;
  color: #fff !important;
  text-shadow: 0 0 6px rgba(86,224,117,0.3) !important;
}
.btn-success:hover {
  background: linear-gradient(135deg, var(--green), #2ea043) !important;
  box-shadow: 0 0 10px rgba(86,224,117,0.2) !important;
}

.btn-warning {
  background: linear-gradient(135deg, #5c3a00, var(--yellow)) !important;
  border: 1px solid rgba(255,209,102,0.3) !important;
  color: #fff !important;
}

.btn-danger {
  background: linear-gradient(135deg, #7a1010, var(--red)) !important;
  border: 1px solid rgba(255,107,99,0.3) !important;
  color: #fff !important;
  text-shadow: 0 0 6px rgba(255,107,99,0.3) !important;
}
.btn-danger:hover {
  background: linear-gradient(135deg, var(--red), #ff5050) !important;
  box-shadow: 0 0 10px rgba(255,107,99,0.2) !important;
}

.btn-info {
  background: linear-gradient(135deg, #0f4060, #1a6a8a) !important;
  border: 1px solid rgba(58,184,212,0.3) !important;
  color: #fff !important;
}

/* ============================================================
   FORMULARE / INPUTS
   ============================================================ */
input[type="text"], input[type="number"], input[type="email"],
input[type="password"], input[type="search"],
select, textarea, .form-control {
  background-color: var(--bg-input) !important;
  border: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
  font-size: 12px !important;
  font-family: var(--font-ui) !important;
}
input::placeholder, textarea::placeholder {
  color: var(--text-muted) !important;
  font-style: italic !important;
}
input:focus, select:focus, textarea:focus, .form-control:focus {
  border-color: var(--accent-bright) !important;
  box-shadow: 0 0 0 2px var(--accent-dim), 0 0 10px rgba(77,159,255,0.15) !important;
  outline: none !important;
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-content {
  background-color: var(--bg-surface) !important;
  border: 1px solid var(--border-active) !important;
  box-shadow: 0 20px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(77,159,255,0.06) !important;
}
.modal-header {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-surface) 100%) !important;
  border-bottom: 1px solid var(--accent-dim) !important;
  color: var(--text-primary) !important;
  padding: 12px 16px !important;
}
.modal-header h4, .modal-title {
  font-size: 13px !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
}
.modal-header .close {
  color: var(--text-secondary) !important;
  opacity: 1 !important;
  font-size: 18px !important;
  font-weight: 300 !important;
}
.modal-header .close:hover { color: var(--red-text) !important; }
.modal-body {
  color: var(--text-primary) !important;
  background-color: var(--bg-surface) !important;
  padding: 14px 16px !important;
}
.modal-footer {
  background: linear-gradient(90deg, #0d1826 0%, var(--bg-surface) 100%) !important;
  border-top: 1px solid var(--border-subtle) !important;
  padding: 10px 16px !important;
}
.modal-backdrop { background-color: #000 !important; opacity: 0.8 !important; }

/* ============================================================
   TABS
   ============================================================ */
.nav-tabs { border-bottom: 1px solid var(--border-active) !important; }
.nav-tabs > li > a {
  background-color: transparent !important;
  border: 1px solid transparent !important;
  color: var(--text-secondary) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  padding: 6px 14px !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
}
.nav-tabs > li > a:hover {
  background: linear-gradient(180deg, rgba(77,159,255,0.07) 0%, transparent 100%) !important;
  color: var(--text-primary) !important;
}
.nav-tabs > li.active > a,
.nav-tabs > li.active > a:focus {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border-active) !important;
  border-bottom-color: var(--bg-card) !important;
  border-top: 2px solid var(--accent-bright) !important;
  color: var(--accent-bright) !important;
  text-shadow: 0 0 8px rgba(77,159,255,0.3) !important;
}

/* ============================================================
   ALERTS
   ============================================================ */
.alert {
  border: none !important;
  border-left: 2px solid !important;
  padding: 6px 12px !important;
  font-size: 12px !important;
}
.alert-success {
  background-color: rgba(30,122,54,0.10) !important;
  border-color: var(--green-text) !important;
  color: var(--green-text) !important;
}
.alert-warning {
  background-color: rgba(184,134,11,0.10) !important;
  border-color: var(--yellow-text) !important;
  color: var(--yellow-text) !important;
}
.alert-danger {
  background-color: rgba(217,48,37,0.10) !important;
  border-color: var(--red-text) !important;
  color: var(--red-text) !important;
}
.alert-info {
  background-color: rgba(31,111,235,0.10) !important;
  border-color: var(--accent-bright) !important;
  color: var(--blue-text) !important;
}

/* ============================================================
   BADGES
   ============================================================ */
.badge {
  background: linear-gradient(135deg, var(--bg-overlay), var(--bg-raised)) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--border-active) !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  padding: 2px 6px !important;
  letter-spacing: 0.03em !important;
}

/* ============================================================
   FORTSCHRITTSBALKEN
   ============================================================ */
.progress {
  background-color: #000 !important;
  height: 6px !important;
  margin-bottom: 4px !important;
  border: 1px solid var(--border-subtle) !important;
}
.progress-bar {
  background: linear-gradient(90deg, var(--accent), var(--accent-bright), var(--accent)) !important;
  background-size: 200% !important;
  animation: lss-shimmer 3s linear infinite !important;
}
.progress-bar-success {
  background: linear-gradient(90deg, var(--green), var(--green-text)) !important;
}
.progress-bar-warning {
  background: linear-gradient(90deg, var(--yellow), var(--yellow-text)) !important;
}
.progress-bar-danger {
  background: linear-gradient(90deg, var(--red), var(--red-text)) !important;
}

/* ============================================================
   WELLS, THUMBNAILS, BREADCRUMBS
   ============================================================ */
.well {
  background: linear-gradient(135deg, #0d1826, var(--bg-card)) !important;
  border: 1px solid var(--border-active) !important;
  padding: 12px !important;
}
.breadcrumb {
  background: linear-gradient(90deg, #0d1826, var(--bg-card)) !important;
  color: var(--text-secondary) !important;
  font-size: 11px !important;
  padding: 5px 12px !important;
  border-bottom: 1px solid var(--border-active) !important;
  letter-spacing: 0.03em !important;
}
.breadcrumb > .active { color: var(--text-primary) !important; }
.breadcrumb > li + li::before { color: var(--text-muted) !important; }
.thumbnail {
  background-color: var(--bg-card) !important;
  border-color: var(--border-active) !important;
}

/* ============================================================
   KARTEN-CONTAINER
   ============================================================ */
#map_container,
#map-container {
  border: 1px solid var(--border-active) !important;
  box-shadow: 0 0 0 1px rgba(77,159,255,0.05) !important;
}

/* ============================================================
   FOOTER
   ============================================================ */
footer, #footer {
  background: linear-gradient(90deg, #0d1826, var(--bg-surface)) !important;
  border-top: 1px solid var(--border-active) !important;
  color: var(--text-muted) !important;
  font-size: 11px !important;
}

/* ============================================================
   CODE / PRE
   ============================================================ */
code, pre {
  background-color: #060c14 !important;
  color: #79c0ff !important;
  border: 1px solid var(--border-active) !important;
  font-size: 11px !important;
}

/* ============================================================
   CATCH-ALL: Weiße Reste neutralisieren
   ============================================================ */
[style*="background-color: white"],
[style*="background-color:#fff"],
[style*="background-color: #fff"],
[style*="background: white"],
[style*="background:#fff"] {
  background-color: var(--bg-surface) !important;
}

[style*="color: black"],
[style*="color:#000"],
[style*="color: #000"] {
  color: var(--text-primary) !important;
}

/* ============================================================
   TOOLTIPS & POPOVERS
   ============================================================ */
.tooltip-inner {
  background: linear-gradient(135deg, #0d1826, var(--bg-overlay)) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--accent-dim) !important;
  font-size: 11px !important;
  padding: 4px 10px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6) !important;
}
.tooltip.top    .tooltip-arrow { border-top-color: var(--accent-dim) !important; }
.tooltip.bottom .tooltip-arrow { border-bottom-color: var(--accent-dim) !important; }
.tooltip.left   .tooltip-arrow { border-left-color: var(--accent-dim) !important; }
.tooltip.right  .tooltip-arrow { border-right-color: var(--accent-dim) !important; }

.popover {
  background-color: var(--bg-raised) !important;
  border: 1px solid var(--border-active) !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.7) !important;
}
.popover-title {
  background: linear-gradient(90deg, #0d1826, var(--bg-raised)) !important;
  border-bottom: 1px solid var(--border-active) !important;
  color: var(--text-primary) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
}
.popover-content {
  color: var(--text-primary) !important;
  font-size: 12px !important;
}

/* ============================================================
   PAGINATION
   ============================================================ */
.pagination > li > a,
.pagination > li > span {
  background-color: var(--bg-raised) !important;
  border-color: var(--border-active) !important;
  color: var(--text-secondary) !important;
  font-size: 12px !important;
}
.pagination > li > a:hover {
  background: linear-gradient(135deg, var(--accent-dim), transparent) !important;
  color: var(--accent-bright) !important;
  border-color: var(--accent) !important;
}
.pagination > .active > a,
.pagination > .active > span {
  background: linear-gradient(135deg, var(--accent), #143d8c) !important;
  border-color: var(--accent) !important;
  color: #fff !important;
}
.pagination > .disabled > a {
  background-color: var(--bg-card) !important;
  color: var(--text-muted) !important;
}

/* ============================================================
   LIST GROUP
   ============================================================ */
.list-group-item {
  background-color: var(--bg-card) !important;
  border-color: var(--border-subtle) !important;
  border-bottom: 1px solid #000 !important;
  color: var(--text-primary) !important;
  font-size: 12px !important;
}
.list-group-item:hover {
  background: linear-gradient(90deg, rgba(77,159,255,0.06) 0%, var(--bg-card) 100%) !important;
  border-left: 2px solid var(--accent) !important;
}
.list-group-item.active {
  background: linear-gradient(90deg, var(--accent-dim), transparent) !important;
  border-left: 2px solid var(--accent-bright) !important;
  color: var(--accent-bright) !important;
}

/* INPUT GROUP ADDON */
.input-group-addon {
  background-color: var(--bg-raised) !important;
  border-color: var(--border-active) !important;
  color: var(--text-secondary) !important;
  font-size: 12px !important;
}

/* GLYPHICONS */
.glyphicon { color: var(--text-secondary) !important; }
a:hover .glyphicon,
.btn:hover .glyphicon { color: var(--accent-bright) !important; }

/* ============================================================
   SPEZIELLE EINSATZ-STATUS-FARBEN für FMS-Indikatoren
   ============================================================ */
/* FMS 1 – frei/Wache */
.fms-1, [class*="fms_1"] { background-color: #1a4020 !important; color: var(--green-text) !important; border-color: var(--green) !important; }
/* FMS 2 – einsatzbereit */
.fms-2, [class*="fms_2"] { background-color: #1a4020 !important; color: var(--green-text) !important; border-color: var(--green) !important; }
/* FMS 3 – Einsatz übernommen */
.fms-3, [class*="fms_3"] { background-color: #3a2800 !important; color: var(--yellow-text) !important; border-color: var(--yellow) !important; }
/* FMS 4 – Anfahrt */
.fms-4, [class*="fms_4"] { background-color: #3a2800 !important; color: var(--yellow-text) !important; border-color: var(--yellow) !important; }
/* FMS 5 – am Einsatz */
.fms-5, [class*="fms_5"] { background-color: rgba(77,159,255,0.12) !important; color: var(--accent-bright) !important; border-color: var(--accent) !important; }
/* FMS 6 – nicht einsatzbereit */
.fms-6, [class*="fms_6"] { background-color: rgba(217,48,37,0.12) !important; color: var(--red-text) !important; border-color: var(--red) !important; }

`);

})();