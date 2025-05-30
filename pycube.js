window.storyFormat({
  "name": "PyCube",
  "version": "0.2.0",
  "description": "A Twine story format for Python-like syntax.",
  "author": "Brendon Sutherland",
  "image": "https://pycube.org/icon.svg",
  "url": "https://pycube.org",
  "license": "BSD-2-Clause",
  "proofing": false,
  "source":
`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>{{STORY_NAME}}</title>
  {{STORY_DATA}}
  <style>
    body {
      background: #232323;
      color: #f1f1f1;
      font-family: monospace;
      font-size: 1.1rem;
      margin: 0;
      padding: 0;
    }
    #error-banner {
      display: none;
      background: #cb3131;
      color: #fff;
      font-family: monospace;
      font-size: 1em;
      padding: 1em 1.5em 1em 1.5em;
      border-radius: 0 0 10px 10px;
      position: fixed;
      top: 0; left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      box-shadow: 0 4px 16px #000a;
      max-width: 500px;
      min-width: 250px;
      text-align: left;
      animation: errorfadein 0.2s;
    }
    @keyframes errorfadein { from { opacity: 0; top: -40px;} to { opacity: 1; top: 0; } }
    #error-banner .dismiss-btn {
      background: #9b2222;
      border: none;
      color: #fff;
      float: right;
      font-size: 1.1em;
      border-radius: 4px;
      cursor: pointer;
      padding: 0.2em 0.7em;
      margin-left: 16px;
    }
    #passages {
      margin: 60px auto 0 auto;
      padding: 1.5em 1em 2em 1em;
      max-width: 600px;
      min-width: 300px;
    }
    .passage { margin-bottom: 1.8em; }
    a {
      color: #8ecafc;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
    a:hover { color: #fff; }
    ::selection { background: #444; color: #fff; }
    #sidebar-toggle {
      position: fixed;
      left: 0; top: 45%;
      background: #333;
      color: #fff;
      font-size: 1.3em;
      border-radius: 0 8px 8px 0;
      border: none;
      padding: 0.45em 0.8em;
      cursor: pointer;
      z-index: 10;
      opacity: 0.85;
      transition: background 0.2s;
    }
    #sidebar-toggle:hover { background: #444; }
    #sidebar {
      position: fixed;
      left: 0; top: 0; bottom: 0;
      width: 240px;
      background: #191c22;
      border-right: 1.5px solid #333;
      box-shadow: 2px 0 16px #0007;
      padding: 24px 18px 24px 12px;
      z-index: 50;
      display: none;
      flex-direction: column;
      font-size: 1em;
    }
    #sidebar.open { display: flex; }
    #sidebar h3 { margin-top: 0; margin-bottom: 16px; font-size: 1.15em; }
    #sidebar .nav-buttons {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }
    #sidebar .nav-buttons button {
      padding: 0.33em 0.7em;
      background: #24272c;
      color: #e2e2e2;
      font-size: 1.18em;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: background 0.18s;
    }
    #sidebar .nav-buttons button:disabled {
      color: #555;
      background: #191c22;
      cursor: default;
      border: none;
    }
    #sidebar .nav-buttons button:hover:not(:disabled) { background: #334; }
    #sidebar .restart-btn {
      background: #b44949;
      color: #fff;
      padding: 0.29em 0.75em;
      border-radius: 4px;
      border: none;
      margin-bottom: 14px;
      cursor: pointer;
      transition: background 0.18s;
      font-size: 1em;
    }
    #sidebar .restart-btn:hover { background: #db5a5a; }
    #save-section {
      margin-bottom: 18px;
      background: #20222a;
      padding: 12px 10px;
      border-radius: 8px;
      box-shadow: 0 1px 4px #0004;
    }
    #save-section summary {
      font-weight: bold;
      color: #85a9f3;
      font-size: 1em;
      cursor: pointer;
      outline: none;
    }
    #save-section .slot-label {
      font-weight: bold;
      color: #b1c1d0;
      margin-right: 0.5em;
    }
    #save-section .slot-status {
      font-size: 0.93em;
      color: #8ea9c4;
      margin-bottom: 6px;
      margin-left: 1.2em;
    }
    #save-section .save-actions {
      margin-bottom: 9px;
      margin-left: 1.2em;
    }
    #save-section .save-actions button,
    #save-section .save-actions input[type="file"] {
      margin: 2px 2px 2px 0;
      font-family: monospace;
      background: #292d34;
      color: #e2e2e2;
      border: none;
      border-radius: 4px;
      padding: 0.23em 0.55em;
      font-size: 1em;
      cursor: pointer;
      transition: background 0.15s;
      width: 76px;
      display: inline-block;
    }
    #save-section .save-actions button:hover { background: #323842; }
    #save-section .save-actions input[type="file"] {
      background: #232323;
      color: #bbb;
      padding: 0.15em 0.1em;
      border: 1px solid #444;
      width: 100px;
      display: block;
    }
    #sidebar-close {
      position: absolute;
      right: 6px; top: 7px;
      background: transparent;
      color: #888;
      font-size: 1.3em;
      border: none;
      cursor: pointer;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="error-banner"><button class="dismiss-btn" onclick="hideError()">✕</button><span id="error-text"></span></div>
  <button id="sidebar-toggle" title="Open menu">&#9776;</button>
  <div id="sidebar">
    <button id="sidebar-close" title="Close">&times;</button>
    <h3>PyCube Menu</h3>
    <div class="nav-buttons">
      <button id="back-btn" title="Back">&#8592;</button>
      <button id="forward-btn" title="Forward">&#8594;</button>
    </div>
    <button class="restart-btn" onclick="restartGame()">Restart</button>
    <details id="save-section">
      <summary>Save/Load Slots</summary>
      <div id="save-slots"></div>
    </details>
  </div>
  <div id="passages"></div>
  <script>
    // --- Error Display ---
    function showError(msg) {
      var banner = document.getElementById('error-banner');
      var txt = document.getElementById('error-text');
      if (txt) txt.textContent = msg;
      if (banner) banner.style.display = "block";
    }
    function hideError() {
      var banner = document.getElementById('error-banner');
      if (banner) banner.style.display = "none";
    }
    // Trap JS runtime errors
    window.onerror = function(message, source, lineno, colno, error) {
      showError(message + (lineno ? " (line " + lineno + ")" : ""));
      return false;
    };

    const sidebar = document.getElementById('sidebar');
    document.getElementById('sidebar-toggle').onclick = () => { sidebar.classList.add('open'); refreshSaveSlots(); updateNavButtons(); };
    document.getElementById('sidebar-close').onclick = () => sidebar.classList.remove('open');

    const vars = {};
    let currentPassage = null;
    const SLOT_COUNT = 5;
    const SLOT_PREFIX = "pycube_slot_";
    let importInputs = [];

    // --- History Stack ---
    let backStack = [];
    let forwardStack = [];

    function getAllPassages() {
      if (window.story && window.story.passages) {
        const result = {};
        window.story.passages.forEach(function(p) {
          result[p.title] = p.text;
        });
        return result;
      }
      const result = {};
      const storydata = document.querySelector('tw-storydata');
      if (storydata) {
        const passageElements = storydata.querySelectorAll('tw-passagedata');
        passageElements.forEach(el => {
          result[el.getAttribute('name')] = el.textContent;
        });
      }
      return result;
    }

    function getStartPassage() {
      if (window.story && window.story.startPassage) return window.story.startPassage;
      const storydata = document.querySelector('tw-storydata');
      if (storydata) {
        const startPid = storydata.getAttribute('startnode');
        const passageElements = storydata.querySelectorAll('tw-passagedata');
        for (let el of passageElements) {
          if (el.getAttribute('pid') === startPid) {
            return el.getAttribute('name');
          }
        }
        if (passageElements.length > 0) return passageElements[0].getAttribute('name');
      }
      const passages = getAllPassages();
      const keys = Object.keys(passages);
      if (keys.length > 0) return keys[0];
      return null;
    }

    function safeEval(expr) {
      try {
        const allowed = Object.assign({}, vars);
        const fn = new Function(...Object.keys(allowed), "return " + expr + ";");
        return fn(...Object.values(allowed));
      } catch (e) {
        showError("Error evaluating expression: " + expr);
        return undefined;
      }
    }

    function parsePassage(text) {
      try {
        text = text.replace(/^[ \\t]*#.*$/gm, '');

        // Compound assignments
        text = text.replace(/^\\s*\\$([a-zA-Z_]\\w*)\\s*([+\\/*-])=\\s*(.+)$/gm, function(match, name, op, value) {
          const currentVal = vars[name] || 0;
          const val = safeEval(value);
          if (val !== undefined) {
            switch (op) {
              case '+': vars[name] = currentVal + val; break;
              case '-': vars[name] = currentVal - val; break;
              case '*': vars[name] = currentVal * val; break;
              case '/': vars[name] = currentVal / val; break;
            }
          }
          return '';
        });

        text = text.replace(/^\\s*\\$([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/gm, function(match, name, value) {
          const val = safeEval(value);
          vars[name] = val !== undefined ? val : value;
          return '';
        });

        const lines = text.split(/\\r?\\n/);
        let output = '';
        let i = 0;
        while (i < lines.length) {
          let line = lines[i];
          let ifMatch = line.match(/^if ([^:]+):\\s*$/);
          let elseMatch = line.match(/^else:\\s*$/);

          if (ifMatch) {
            let condition = ifMatch[1]
              .replace(/([^=!<>])=([^=])/g, '$1==$2')
              .replace(/!==/g, '!=')
              .replace(/===/g, '==');
            let conditionResult = false;
            try { conditionResult = !!safeEval(condition); }
            catch(e) { showError("Error in 'if' condition: " + condition); }
            let blockLines = [];
            i++;
            while (i < lines.length && /^\\s+/.test(lines[i])) {
              blockLines.push(lines[i].replace(/^\\s{4}|^\\t/, ''));
              i++;
            }
            let elseBlock = [];
            if (i < lines.length && /^else:\\s*$/.test(lines[i])) {
              i++;
              while (i < lines.length && /^\\s+/.test(lines[i])) {
                elseBlock.push(lines[i].replace(/^\\s{4}|^\\t/, ''));
                i++;
              }
            }
            if (conditionResult) {
              output += blockLines.join('\\n') + '\\n';
            } else {
              output += elseBlock.join('\\n') + '\\n';
            }
            continue;
          } else if (elseMatch) {
            i++;
            while (i < lines.length && /^\\s+/.test(lines[i])) i++;
            continue;
          } else {
            output += line + '\\n';
            i++;
          }
        }

        output = output.replace(/\\{([a-zA-Z_]\\w*)\\}/g, function(match, name) {
          return vars[name] !== undefined ? vars[name] : match;
        });

        output = output.replace(/\\[\\[([^\\]|]+)(\\|([^\\]]+))?\\]\\]/g, function(match, text, _, target) {
          target = target || text;
          return '<a onclick="go(\\'' + target.replace(/'/g, "\\'") + '\\')">' + text + '</a>';
        });

        hideError();
        return output.trim().replace(/\\n/g, "<br>");
      } catch(e) {
        showError("Parser error: " + (e && e.message ? e.message : e));
        return "<div style='color:red;'>Error parsing passage.</div>";
      }
    }

    function showPassage(name, pushHistory=true) {
      const passages = getAllPassages();
      if (!(name in passages)) {
        document.getElementById('passages').innerHTML =
          '<div class="passage">Passage not found: ' + name + '</div>';
        showError("Passage not found: " + name);
        return;
      }
      if (pushHistory && currentPassage && name !== currentPassage) {
        backStack.push({passage: currentPassage, vars: JSON.stringify(vars)});
        forwardStack = [];
      }
      currentPassage = name;
      document.getElementById('passages').innerHTML =
        '<div class="passage">' + parsePassage(passages[name]) + '</div>';
      updateNavButtons();
    }

    window.go = showPassage;

    // --- History navigation ---
    function back() {
      if (backStack.length === 0) return;
      const state = backStack.pop();
      forwardStack.push({passage: currentPassage, vars: JSON.stringify(vars)});
      Object.keys(vars).forEach(k => delete vars[k]);
      Object.assign(vars, JSON.parse(state.vars));
      showPassage(state.passage, false);
      updateNavButtons();
    }
    function forward() {
      if (forwardStack.length === 0) return;
      const state = forwardStack.pop();
      backStack.push({passage: currentPassage, vars: JSON.stringify(vars)});
      Object.keys(vars).forEach(k => delete vars[k]);
      Object.assign(vars, JSON.parse(state.vars));
      showPassage(state.passage, false);
      updateNavButtons();
    }
    function updateNavButtons() {
      document.getElementById('back-btn').disabled = (backStack.length === 0);
      document.getElementById('forward-btn').disabled = (forwardStack.length === 0);
    }
    document.getElementById('back-btn').onclick = back;
    document.getElementById('forward-btn').onclick = forward;

    // --- Restart functionality ---
    function restartGame() {
      if (!confirm("Restart the story? All progress will be lost.")) return;
      Object.keys(vars).forEach(k => delete vars[k]);
      backStack = [];
      forwardStack = [];
      runInitIfExists(getAllPassages());
      const start = getStartPassage();
      showPassage(start, false);
      sidebar.classList.remove('open');
    }
    window.restartGame = restartGame;

    // --- Save/Load/Export/Import System with slots ---
    function getSaveData() {
      return JSON.stringify({
        vars: vars,
        passage: currentPassage || getStartPassage(),
        time: new Date().toISOString()
      });
    }
    function setSaveData(data) {
      try {
        const obj = typeof data === 'string' ? JSON.parse(data) : data;
        Object.keys(vars).forEach(k => { delete vars[k]; });
        Object.assign(vars, obj.vars || {});
        showPassage(obj.passage || getStartPassage(), false);
        backStack = [];
        forwardStack = [];
        return true;
      } catch (e) {
        showError("Failed to load save data.");
        return false;
      }
    }
    function saveSlot(slot) {
      localStorage.setItem(SLOT_PREFIX + slot, getSaveData());
      refreshSaveSlots();
    }
    function loadSlot(slot) {
      const data = localStorage.getItem(SLOT_PREFIX + slot);
      if (!data) return showError("No saved game in this slot.");
      setSaveData(data);
      sidebar.classList.remove('open');
    }
    function exportSlot(slot) {
      const data = localStorage.getItem(SLOT_PREFIX + slot);
      if (!data) return showError("No saved game in this slot.");
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pycube_save_slot" + (Number(slot)+1) + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    function importSlot(slot) {
      importInputs[slot].click();
    }
    function setupImportInputs() {
      const slotsDiv = document.getElementById('save-slots');
      importInputs = [];
      for (let i = 0; i < SLOT_COUNT; ++i) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.style.display = "none";
        input.addEventListener('change', function(event) {
          const file = event.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function(e) {
            localStorage.setItem(SLOT_PREFIX + i, e.target.result);
            refreshSaveSlots();
          };
          reader.readAsText(file);
          input.value = "";
        });
        slotsDiv.appendChild(input);
        importInputs.push(input);
      }
    }
    function slotStatus(slot) {
      const data = localStorage.getItem(SLOT_PREFIX + slot);
      if (!data) return { status: "Empty", time: "" };
      try {
        const obj = JSON.parse(data);
        const date = obj.time ? new Date(obj.time) : null;
        return {
          status: "Saved",
          time: date ? ("Last saved: " + date.toLocaleString()) : ""
        };
      } catch {
        return { status: "Corrupt", time: "" };
      }
    }
    function refreshSaveSlots() {
      const div = document.getElementById('save-slots');
      div.innerHTML = "";
      for (let i = 0; i < SLOT_COUNT; ++i) {
        const sdiv = document.createElement("div");
        sdiv.className = "save-slot";
        const stat = slotStatus(i);
        sdiv.innerHTML =
          '<span class="slot-label">Slot ' + (i+1) + '</span>' +
          '<span class="slot-status">' + stat.status +
          (stat.time ? "<br><span style=\'font-size:0.88em;color:#9ec;\'>" + stat.time + "</span>" : "") +
          '</span>' +
          '<div class="save-actions">' +
            '<button onclick="saveSlot(' + i + ')">Save</button> ' +
            '<button onclick="loadSlot(' + i + ')">Load</button> ' +
            '<button onclick="exportSlot(' + i + ')">Export</button> ' +
            '<button onclick="importSlot(' + i + ')">Import</button>' +
          '</div>';
        div.appendChild(sdiv);
      }
    }
    window.saveSlot = saveSlot;
    window.loadSlot = loadSlot;
    window.exportSlot = exportSlot;
    window.importSlot = importSlot;

    setupImportInputs();

    function runInitIfExists(passages) {
      for (const key of Object.keys(passages)) {
        if (key.toLowerCase() === "init") {
          parsePassage(passages[key]);
          break;
        }
      }
    }

    function waitForStoryData(callback) {
      const tryInit = () => {
        const hasStoryObj = (window.story && window.story.passages && window.story.passages.length > 0);
        const hasStoryData = document.querySelector('tw-storydata') && document.querySelector('tw-storydata').querySelectorAll('tw-passagedata').length > 0;
        if (hasStoryObj || hasStoryData) {
          callback();
        } else {
          setTimeout(tryInit, 50);
        }
      };
      tryInit();
    }

    waitForStoryData(() => {
      const passages = getAllPassages();
      runInitIfExists(passages);
      const start = getStartPassage();
      if (start) {
        showPassage(start, false);
      } else {
        document.getElementById('passages').innerHTML = '<div class="passage">No starting passage found.</div>';
        showError("No starting passage found.");
      }
      updateNavButtons();
    });

  </script>
</body>
</html>
`
});
