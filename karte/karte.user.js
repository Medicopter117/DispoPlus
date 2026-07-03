// ==UserScript==
// @name         LSS Karte
// @namespace    http://tampermonkey.net/
// @version      4.3.0
// @description  Karte mit Bundesländer, Regierungsbezirke und Gemeinden für DE und AT -- Mit Einstellung.
// @author       Jalibu, LennyPegauOfficial & AI
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/profile/*
// @match        https://polizei.leitstellenspiel.de/
// @match        https://polizei.leitstellenspiel.de/profile/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_PREFIX = 'LSS_KREIS_LVL_';
    const STYLE_KEY = 'LSS_KREIS_STYLES';
    const VISIBLE_PREFIX = 'LSS_KREIS_VISIBLE_';
    const LEGACY_COLOR_KEYS = { 1: 'LSS_COLOR_1', 2: 'LSS_COLOR_2', 3: 'LSS_COLOR_3' };
    // jsDelivr instead of raw.githubusercontent: CDN-cached, no aggressive rate limiting
    const BASE_URL = "https://cdn.jsdelivr.net/gh/Medicopter117/LSS-Karte@master/";
    const SOURCES = {
        1: { de: "karte/deutschland/bundeslander.json",     at: "karte/osterreich/bundeslander.json" },
        2: { de: "karte/deutschland/regierungbezirke.json", at: "karte/osterreich/regierungbezirke.json" },
        3: { de: "karte/deutschland/stadte.json",           at: "karte/osterreich/stadte.json" }
    };
    const LEVEL_NAMES = { 1: 'Länder', 2: 'Bezirke', 3: 'Städte' };
    const DEFAULT_STYLES = {
        1: { color: '#4361ee', weight: 3, opacity: 0.85, fillOpacity: 0.12 },
        2: { color: '#f72585', weight: 3, opacity: 0.85, fillOpacity: 0.12 },
        3: { color: '#4cc9f0', weight: 2, opacity: 0.85, fillOpacity: 0.18 }
    };

    // ---------- style loading (with migration from the old 3-key format) ----------
    function loadStyles() {
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(STYLE_KEY)); } catch (e) { stored = null; }
        if (!stored) {
            stored = JSON.parse(JSON.stringify(DEFAULT_STYLES));
            let hadLegacy = false;
            for (let l = 1; l <= 3; l++) {
                let legacy = localStorage.getItem(LEGACY_COLOR_KEYS[l]);
                if (legacy) { stored[l].color = legacy; hadLegacy = true; }
            }
            if (hadLegacy) localStorage.setItem(STYLE_KEY, JSON.stringify(stored));
        }
        for (let l = 1; l <= 3; l++) stored[l] = Object.assign({}, DEFAULT_STYLES[l], stored[l]);
        return stored;
    }
    let styles = loadStyles();

    function isVisible(level) {
        let v = localStorage.getItem(VISIBLE_PREFIX + level);
        return v === null ? true : v === 'true';
    }
    function setVisible(level, visible) {
        localStorage.setItem(VISIBLE_PREFIX + level, visible);
        let group = drawnLayers[level];
        if (!group || typeof map === 'undefined') return;
        if (visible) { if (!map.hasLayer(group)) group.addTo(map); }
        else { if (map.hasLayer(group)) map.removeLayer(group); }
        updateLegend();
    }

    // ---------- geoJSON request cache (fetched once, reused by picker AND map) ----------
    const geoCache = {};
    function fetchGeoJson(level, country) {
        const key = level + '_' + country;
        if (!geoCache[key]) geoCache[key] = $.getJSON(BASE_URL + SOURCES[level][country]);
        return geoCache[key];
    }
    function featureId(p, fallback) {
        return String(p.GID_4 || p.GID_3 || p.GID_2 || p.GID_1 || fallback);
    }
    function featureName(p) {
        return p.NAME_4 || p.NAME_3 || p.NAME_2 || p.NAME_1 || p.name || "Gebiet";
    }

    // ---------- styling ----------
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdn.rawgit.com/patosai/tree-multiselect/v2.4.1/dist/jquery.tree-multiselect.min.css'));
    $('head').append(`
        <style>
            #kreise-openBtn { display:block; width:26px; height:26px; background:#fff url(https://cdn-icons-png.flaticon.com/512/2838/2838912.png) center/16px no-repeat; border-bottom:1px solid #ccc; cursor:pointer; transition:background-color .15s ease; }
            #kreise-openBtn:hover { background-color:#f0f0f0; }

            #kreise-modal { width:70%; max-width:900px; height:80vh; position:fixed; top:10%; left:15%; background:#fff; z-index:99999;
                border-radius:10px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 12px 40px rgba(0,0,0,.35);
                font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }

            @media (max-width: 768px) {
                #kreise-modal { width:94%; left:3%; top:5%; height:90vh; }
            }

            #kreise-modal .kreise-header { background:linear-gradient(135deg,#3a0ca3,#4361ee); color:#fff; padding:14px 18px;
                display:flex; align-items:center; justify-content:space-between; font-weight:600; font-size:15px; }
            #kreise-modal .kreise-close { cursor:pointer; opacity:.85; font-size:20px; line-height:1; border:none; background:none; color:#fff; }
            #kreise-modal .kreise-close:hover { opacity:1; }

            .lss-tab-nav { display:flex; background:#f4f5f7; list-style:none; padding:0 10px; margin:0; border-bottom:1px solid #e2e2e2; }
            .lss-tab-nav li { padding:11px 16px; color:#555; cursor:pointer; font-weight:600; font-size:13px; position:relative;
                border-bottom:3px solid transparent; transition:color .15s ease, border-color .15s ease; display:flex; align-items:center; gap:6px; }
            .lss-tab-nav li:hover { color:#222; }
            .lss-tab-nav li.active { color:#3a0ca3; border-bottom-color:#3a0ca3; }
            .lss-tab-nav li .badge { background:#3a0ca3; color:#fff; font-size:10px; font-weight:700; border-radius:9px;
                padding:1px 6px; min-width:14px; text-align:center; display:none; }
            .lss-tab-nav li.active .badge { background:#4361ee; }

            #modal-body { flex:1; overflow-y:auto; background:#fff; }
            .tab-content-panel { display:none; padding:18px; color:#333; }
            .tab-content-panel.active { display:block; }
            .tab-hint { margin:0 0 12px; font-size:12px; color:#888; }

            .select-actions { display:flex; gap:10px; margin-bottom:12px; }
            .select-actions button { font-size:12px; font-weight:600; color:#3a0ca3; background:#f0edfb; border:1px solid #ddd6f7;
                border-radius:5px; padding:6px 12px; cursor:pointer; transition:background-color .15s ease; }
            .select-actions button:hover { background:#e2dcfa; }

            .style-card { display:flex; align-items:center; gap:16px; margin-bottom:14px; padding:14px 16px;
                background:#f9f9fb; border:1px solid #ececf1; border-radius:8px; flex-wrap:wrap; }
            .style-card .swatch { width:20px; height:20px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 1px #ddd; flex-shrink:0; }
            .style-card .style-label { font-weight:600; font-size:13px; min-width:100px; color:#222; }
            .style-card input[type=color] { width:36px; height:28px; border:none; border-radius:4px; padding:0; cursor:pointer; background:none; }
            .style-card .slider-group { display:flex; align-items:center; gap:6px; font-size:11px; color:#777; }
            .style-card .slider-group input[type=range] { width:80px; }
            .style-card .visible-toggle { display:flex; align-items:center; gap:5px; font-size:11px; color:#555; }
            .style-card .reset-btn { margin-left:auto; font-size:11px; color:#3a0ca3; background:none; border:none; cursor:pointer; text-decoration:underline; }
            .style-card .reset-btn:hover { color:#4361ee; }

            #kreise-modal .kreise-footer { padding:12px 18px; border-top:1px solid #eee; text-align:right; background:#fafafa; }
            #kreise-btn-save { padding:9px 22px; border:none; border-radius:6px; background:#3a0ca3; color:#fff; font-weight:600;
                font-size:13px; cursor:pointer; transition:background-color .15s ease; }
            #kreise-btn-save:hover { background:#4361ee; }
            #kreise-btn-save:disabled { opacity:.6; cursor:default; }

            .lss-legend { background:#fff; padding:8px 12px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,.25);
                font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; font-size:12px; color:#333; }
            .lss-legend-row { display:flex; align-items:center; gap:6px; padding:2px 0; }
            .lss-legend-swatch { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
        </style>
    `);

    $('body').append(`
        <div id="kreise-modal" style="display:none;">
            <div class="kreise-header">
                <span>Kreiskarte konfigurieren</span>
                <button class="kreise-close" title="Schließen">×</button>
            </div>
            <ul class="lss-tab-nav">
                <li class="active" data-tab="1">Länder <span class="badge"></span></li>
                <li data-tab="2">Bezirke <span class="badge"></span></li>
                <li data-tab="3">Städte <span class="badge"></span></li>
                <li data-tab="4">Farben</li>
            </ul>
            <div id="modal-body">
                <div id="panel-lvl-1" class="tab-content-panel active"></div>
                <div id="panel-lvl-2" class="tab-content-panel"></div>
                <div id="panel-lvl-3" class="tab-content-panel"></div>
                <div id="panel-lvl-4" class="tab-content-panel"></div>
            </div>
            <div class="kreise-footer">
                <button id="kreise-btn-save">Speichern & Anwenden</button>
            </div>
        </div>
    `);

    // ---------- Farben-Tab ----------
    function renderColorPanel() {
        let html = `<p class="tab-hint">Farbe, Rahmenbreite, Füllung und Sichtbarkeit je Ebene – wird sofort auf der Karte übernommen.</p>`;
        for (let l = 1; l <= 3; l++) {
            let s = styles[l];
            html += `
                <div class="style-card" data-level="${l}">
                    <span class="swatch" style="background:${s.color}"></span>
                    <span class="style-label">${LEVEL_NAMES[l]}</span>
                    <input type="color" id="color-${l}" value="${s.color}">
                    <div class="slider-group">Breite
                        <input type="range" id="weight-${l}" min="1" max="6" step="1" value="${s.weight}">
                    </div>
                    <div class="slider-group">Füllung
                        <input type="range" id="fill-${l}" min="0" max="0.6" step="0.02" value="${s.fillOpacity}">
                    </div>
                    <label class="visible-toggle">
                        <input type="checkbox" class="visible-checkbox" data-level="${l}" ${isVisible(l) ? 'checked' : ''}>
                        Sichtbar
                    </label>
                    <button class="reset-btn" data-level="${l}">Zurücksetzen</button>
                </div>`;
        }
        $('#panel-lvl-4').html(html);
    }

    $(document).on('input', '#panel-lvl-4 input[type=color]', function () {
        $(this).closest('.style-card').find('.swatch').css('background', this.value);
    });
    $(document).on('change', '#panel-lvl-4 .visible-checkbox', function () {
        setVisible($(this).data('level'), $(this).is(':checked'));
    });
    $(document).on('click', '#panel-lvl-4 .reset-btn', function () {
        let l = $(this).data('level');
        let d = DEFAULT_STYLES[l];
        $(`#color-${l}`).val(d.color);
        $(`#weight-${l}`).val(d.weight);
        $(`#fill-${l}`).val(d.fillOpacity);
        $(this).closest('.style-card').find('.swatch').css('background', d.color);
    });

    // ---------- Auswahl-Tabs ----------
    function updateBadges() {
        for (let l = 1; l <= 3; l++) {
            let saved = JSON.parse(localStorage.getItem(STORAGE_PREFIX + l)) || [];
            $(`.lss-tab-nav li[data-tab="${l}"] .badge`).text(saved.length).toggle(saved.length > 0);
        }
    }

    let treeMultiselectLoaded = false;
    function ensureTreeMultiselect(cb) {
        if (treeMultiselectLoaded || $.fn.treeMultiselect) { treeMultiselectLoaded = true; cb(); return; }
        $.getScript("https://cdn.rawgit.com/patosai/tree-multiselect/v2.4.1/dist/jquery.tree-multiselect.min.js", function () {
            treeMultiselectLoaded = true;
            cb();
        });
    }

    function loadTabLevel(level) {
        if (level == 4) { renderColorPanel(); return; }
        let panel = $(`#panel-lvl-${level}`);
        panel.html('<p class="tab-hint">Wird geladen…</p>');
        let saved = JSON.parse(localStorage.getItem(STORAGE_PREFIX + level)) || [];

        $.when(fetchGeoJson(level, 'de'), fetchGeoJson(level, 'at')).done(function (deRes, atRes) {
            let selectMarkup = `<select id="kreise-selection-lvl-${level}" multiple="multiple">`;
            [[deRes[0], "Deutschland"], [atRes[0], "Österreich"]].forEach(([data, countryName]) => {
                data.features.forEach(f => {
                    let p = f.properties || {};
                    let name = featureName(p);
                    let path = countryName + (level === 1 ? "/Bundesländer" : (level === 2 ? `/Regierungsbezirke/${p.NAME_1 || "Sonstige"}` : `/${p.NAME_1 || "Sonstige"}/${p.NAME_2 || "Ohne LK"}`));
                    let id = featureId(p, f.id || Math.random());
                    selectMarkup += `<option value="${id}" ${saved.includes(id) ? 'selected' : ''} data-section="${path}">${name}</option>`;
                });
            });
            selectMarkup += `</select>`;
            panel.html(`
                <p class="tab-hint">Auswahl wird beim Speichern direkt auf der Karte eingefärbt.</p>
                <div class="select-actions">
                    <button class="select-all-btn" data-level="${level}">Alle auswählen</button>
                    <button class="select-none-btn" data-level="${level}">Alle abwählen</button>
                </div>
            ` + selectMarkup);
            ensureTreeMultiselect(() => $(`#kreise-selection-lvl-${level}`).treeMultiselect({ searchable: true, startCollapsed: true }));
        }).fail(() => panel.html('<p class="tab-hint">Laden fehlgeschlagen. Bitte später erneut versuchen.</p>'));
    }

    $(document).on('click', '.select-all-btn, .select-none-btn', function () {
        let level = $(this).data('level');
        let selectAll = $(this).hasClass('select-all-btn');
        $.when(fetchGeoJson(level, 'de'), fetchGeoJson(level, 'at')).done(function (deRes, atRes) {
            let ids = [];
            [deRes[0], atRes[0]].forEach(data => data.features.forEach(f => ids.push(featureId(f.properties || {}, f.id || Math.random()))));
            localStorage.setItem(STORAGE_PREFIX + level, JSON.stringify(selectAll ? ids : []));
            loadTabLevel(level);
            updateBadges();
        });
    });

    // ---------- Kartendarstellung ----------
    let drawnLayers = { 1: null, 2: null, 3: null };
    let legendControl = null;

    function updateLegend() {
        if (typeof map === 'undefined') return;
        if (legendControl) { map.removeControl(legendControl); legendControl = null; }
        let active = [1, 2, 3].filter(l => isVisible(l) && (JSON.parse(localStorage.getItem(STORAGE_PREFIX + l)) || []).length > 0);
        if (!active.length) return;
        legendControl = L.control({ position: 'bottomright' });
        legendControl.onAdd = function () {
            let div = L.DomUtil.create('div', 'lss-legend');
            div.innerHTML = active.map(l => `<div class="lss-legend-row"><span class="lss-legend-swatch" style="background:${styles[l].color}"></span>${LEVEL_NAMES[l]}</div>`).join('');
            return div;
        };
        legendControl.addTo(map);
    }

    function drawLevel(level) {
        if (typeof map === 'undefined') return;
        if (drawnLayers[level]) { map.removeLayer(drawnLayers[level]); drawnLayers[level] = null; }
        let savedIds = new Set(JSON.parse(localStorage.getItem(STORAGE_PREFIX + level)) || []);
        if (!savedIds.size) { updateLegend(); return; }
        let s = styles[level];
        let group = L.layerGroup();
        drawnLayers[level] = group;
        if (isVisible(level)) group.addTo(map);
        ['de', 'at'].forEach(country => {
            fetchGeoJson(level, country).done(data => {
                L.geoJSON(data, {
                    filter: f => savedIds.has(featureId(f.properties, f.id)),
                    style: { color: s.color, fillColor: s.color, weight: s.weight, opacity: s.opacity, fillOpacity: s.fillOpacity },
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(featureName(feature.properties || {}));
                    }
                }).addTo(group);
                updateLegend();
            });
        });
    }
    function drawAll() { for (let l = 1; l <= 3; l++) drawLevel(l); }

    // ---------- Events ----------
    $(document).on('click', '#kreise-openBtn', (e) => {
        e.preventDefault();
        $('#kreise-modal').show();
        updateBadges();
        loadTabLevel(1);
    });
    $(document).on('click', '.kreise-close', () => $('#kreise-modal').hide());
    $(document).on('keydown', (e) => { if (e.key === 'Escape') $('#kreise-modal').hide(); });
    $(document).on('mousedown', (e) => {
        if ($('#kreise-modal').is(':visible') && !$(e.target).closest('#kreise-modal, #kreise-openBtn').length) {
            $('#kreise-modal').hide();
        }
    });
    $(document).on('click', '.lss-tab-nav li', function () {
        $('.lss-tab-nav li').removeClass('active'); $(this).addClass('active');
        $('.tab-content-panel').removeClass('active');
        let tab = $(this).data('tab');
        $(`#panel-lvl-${tab}`).addClass('active');
        loadTabLevel(tab);
    });

    $(document).on('click', '#kreise-btn-save', function () {
        let $btn = $(this).prop('disabled', true).text('Speichern…');
        for (let l = 1; l <= 3; l++) {
            let $select = $(`#kreise-selection-lvl-${l}`);
            if ($select.length) localStorage.setItem(STORAGE_PREFIX + l, JSON.stringify($select.val() || []));
            let $color = $(`#color-${l}`);
            if ($color.length) {
                styles[l].color = $color.val();
                styles[l].weight = parseInt($(`#weight-${l}`).val(), 10);
                styles[l].fillOpacity = parseFloat($(`#fill-${l}`).val());
            }
        }
        localStorage.setItem(STYLE_KEY, JSON.stringify(styles));
        drawAll();
        updateBadges();
        $btn.prop('disabled', false).text('Speichern & Anwenden');
        $('#kreise-modal').hide();
    });

    // ---------- Init (MutationObserver statt endlosem Polling) ----------
    function initButton() {
        if ($('#kreise-openBtn').length) return true;
        if ($('.leaflet-control-zoom').length) {
            $('.leaflet-control-zoom').append('<a id="kreise-openBtn" href="#" title="Kreiskarte konfigurieren"></a>');
            drawAll();
            return true;
        }
        return false;
    }
    if (!initButton()) {
        const observer = new MutationObserver(() => { if (initButton()) observer.disconnect(); });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 30000); // Sicherheitsnetz, falls die Karte nie erscheint
    }
})();
