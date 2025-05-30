window.storyFormat({
  "name": "PyCube",
  "version": "0.2.3",
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
      padding: 24px 14px 24px 14px; /* more balanced padding */
      z-index: 50;
      display: none;
      flex-direction: column;
      font-size: 1em;
      gap: 0.5em;
    }
    #sidebar.open { display: flex; }
    #sidebar h3 { margin-top: 0; margin-bottom: 16px; font-size: 1.15em; }
    #sidebar .nav-buttons {
      position: absolute;
      top: 8px;
      left: 10px;
      display: flex;
      gap: 6px;
      margin-bottom: 0;
      margin-top: 0;
      justify-content: flex-start;
      z-index: 101;
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
      margin-top: 8px;
      cursor: pointer;
      transition: background 0.18s;
      font-size: 1em;
      width: 100%;
      box-sizing: border-box;
    }
    #sidebar .restart-btn:hover { background: #db5a5a; }
    #sidebar-story-title {
      font-weight: bold;
      font-size: 1.22em;
      margin-bottom: 2px;
      letter-spacing: 0.5px;
      color: #fff;
      text-shadow: 0 1px 4px #0006;
      padding-bottom: 0;
      line-height: 1.2;
      text-align: left;
      margin-top: 6px; /* add margin to separate from nav-buttons */
    }
    #sidebar-author-passage {
      font-size: 1em;
      color: #b1c1d0;
      margin-bottom: 8px;
      margin-top: 0;
      padding: 0 0 4px 0;
      border-bottom: 1px solid #23293a;
      text-align: left;
    }
    #sidebar-passage {
      background: #20222a;
      border-radius: 7px;
      margin: 10px 0 14px 0;
      padding: 12px 10px 12px 12px;
      color: #e2e2e2;
      font-size: 1em;
      box-shadow: 0 1px 4px #0002;
      text-align: left;
    }
    #save-section {
      margin-bottom: 18px;
      background: #20222a;
      padding: 12px 10px;
      border-radius: 8px;
      box-shadow: 0 1px 4px #0004;
      margin-top: 0;
    }
    #save-section summary {
      font-weight: bold;
      color: #85a9f3;
      font-size: 1em;
      cursor: pointer;
      outline: none;
      margin-bottom: 2px;
    }
    #save-section .slot-label {
      font-weight: bold;
      color: #b1c1d0;
      margin-right: 0.5em;
      font-size: 1em;
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
    /* Divider below author/title */
    #sidebar .sidebar-divider {
      border-bottom: 1.5px solid #23293a;
      margin: 8px 0 10px 0;
      width: 100%;
      height: 0;
    }
    /* Built-in button styling for passage-inserted buttons */
    .pycube-btn, .passage button, .sidebar-passage button, #sidebar button:not(.restart-btn):not(#sidebar-close):not(#back-btn):not(#forward-btn) {
      background: #23293a;
      color: #e2e2e2;
      border: none;
      border-radius: 5px;
      padding: 0.32em 1.1em;
      font-family: monospace;
      font-size: 1em;
      margin: 0.18em 0.12em 0.18em 0;
      cursor: pointer;
      transition: background 0.18s, color 0.18s;
      box-shadow: 0 1px 4px #0002;
      outline: none;
      display: inline-block;
    }
    .pycube-btn:hover, .passage button:hover, .sidebar-passage button:hover, #sidebar button:not(.restart-btn):not(#sidebar-close):not(#back-btn):not(#forward-btn):hover {
      background: #33445a;
      color: #fff;
    }
    .pycube-btn:active, .passage button:active, .sidebar-passage button:active, #sidebar button:not(.restart-btn):not(#sidebar-close):not(#back-btn):not(#forward-btn):active {
      background: #1a1f2a;
    }
    .pycube-btn:disabled, .passage button:disabled, .sidebar-passage button:disabled, #sidebar button:not(.restart-btn):not(#sidebar-close):not(#back-btn):not(#forward-btn):disabled {
      background: #191c22;
      color: #666;
      cursor: not-allowed;
    }
    #sidebar-close {
      position: absolute;
      top: 8px;
      right: 10px;
      background: #23293a;
      color: #e2e2e2;
      border: none;
      border-radius: 5px;
      padding: 0.18em 0.7em 0.18em 0.7em;
      font-size: 1.25em;
      font-family: monospace;
      cursor: pointer;
      transition: background 0.18s, color 0.18s;
      z-index: 102;
      box-shadow: 0 1px 4px #0002;
    }
    #sidebar-close:hover {
      background: #33445a;
      color: #fff;
    }
    /* Only add top margin to the first content element to avoid overlap with nav/close */
    #sidebar > #sidebar-story-title {
      margin-top: 48px;
    }
    /* Remove the previous rule that added margin to all elements */
    /* Restore default or smaller margins for other elements if needed */
    #sidebar > #sidebar-author-passage,
    #sidebar > #sidebar-passage,
    #sidebar > .sidebar-divider,
    #sidebar > .restart-btn,
    #sidebar > #save-section {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div id="error-banner"><button class="dismiss-btn" onclick="hideError()">✕</button><span id="error-text"></span></div>
  <button id="sidebar-toggle" title="Open menu">&#9776;</button>
  <div id="sidebar">
    <button id="sidebar-close" title="Close">&times;</button>
    <div class="nav-buttons">
      <button id="back-btn" title="Back">&#8592;</button>
      <button id="forward-btn" title="Forward">&#8594;</button>
    </div>
    <div id="sidebar-story-title"></div>
    <div id="sidebar-author-passage"></div>
    <div id="sidebar-passage"></div>
    <div class="sidebar-divider"></div>
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
    document.getElementById('sidebar-toggle').onclick = () => { sidebar.classList.add('open'); refreshSaveSlots(); updateNavButtons(); showSidebarPassage(); showAuthorPassage(); };
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
      if (window.story && window.story.startPassage) return window.story.startPassages;
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

    function isArray(val) {
      return Array.isArray(val);
    }
    function isObject(val) {
      return val && typeof val === "object" && !isArray(val);
    }    function formatVar(val, isObjectValue = false) {
      if (val === undefined || val === null) {
        return String(val);
      }
      if (isArray(val)) {
        return val.map(v => formatVar(v, false)).join(', ');
      } else if (isObject(val)) {
        // For nested objects, format each value
        return Object.entries(val).map(([k,v]) => 
          k + ': ' + (isObject(v) ? formatVar(v, false) : String(v))
        ).join(', ');
      }
      return String(val);
    }

    function parsePassage(text) {
      try {
        text = text.replace(/^[ \\t]*#.*$/gm, '');

        // Compound assignments (arrays/dicts/expressions)
        text = text.replace(/^\\s*\\$([a-zA-Z_][\\w\\[\\]'"\\.]*?)\\s*([+\\/*-])=\\s*(.+)$/gm, function(match, path, op, value) {
          try {
            // Parse the path to get base variable and any nested accesses
            const pathParts = path.match(/^([a-zA-Z_]\\w*)(.*)$/);
            if (!pathParts) return match;
            
            const baseVar = pathParts[1];
            const accessors = pathParts[2];
            
            // If no accessors, handle as a simple variable
            if (!accessors) {
              const currentVal = vars[baseVar] || 0;
              const val = safeEval(value);
              if (val !== undefined) {
                switch (op) {
                  case '+': vars[baseVar] = currentVal + val; break;
                  case '-': vars[baseVar] = currentVal - val; break;
                  case '*': vars[baseVar] = currentVal * val; break;
                  case '/': vars[baseVar] = currentVal / val; break;
                }
              }
              return '';
            }
            
            // Handle nested access
            const accessorMatches = [...accessors.matchAll(/\\[(.*?)\\]/g)];
            if (!accessorMatches.length) return match;
            
            let target = vars[baseVar];
            const keys = accessorMatches.map(m => safeEval(m[1]));
            
            // Navigate to the second-to-last key
            for (let i = 0; i < keys.length - 1; i++) {
              if (!target || typeof target !== 'object') return match;
              target = target[keys[i]];
            }
            
            // Get the final key
            const finalKey = keys[keys.length - 1];
            if (!target || typeof target !== 'object') return match;
            
            // Perform the compound operation
            const currentVal = target[finalKey] || 0;
            const val = safeEval(value);
            if (val !== undefined) {
              switch (op) {
                case '+': target[finalKey] = currentVal + val; break;
                case '-': target[finalKey] = currentVal - val; break;
                case '*': target[finalKey] = currentVal * val; break;
                case '/': target[finalKey] = currentVal / val; break;
              }
            }
            return '';
          } catch (e) {
            showError("Error in compound assignment: " + e.message);
            return match;
          }
        });
        // Simple assignments: arrays/dicts/expressions
        // First collect multi-line assignments
        const assignmentRegex = /^\\s*\\$([a-zA-Z_]\\w*)\\s*=\\s*(\\[|{)/gm;
        let match;
        while ((match = assignmentRegex.exec(text)) !== null) {
          const name = match[1];
          const startChar = match[2];
          const endChar = startChar === '[' ? ']' : '}';
          const startPos = match.index;
          let bracketCount = 1;
          let endPos = startPos + match[0].length;
          
          // Search for the matching closing bracket
          while (bracketCount > 0 && endPos < text.length) {
            if (text[endPos] === startChar) bracketCount++;
            if (text[endPos] === endChar) bracketCount--;
            endPos++;
          }
          
          if (bracketCount === 0) {
            const value = text.substring(startPos + match[0].length - 1, endPos);
            const val = safeEval(value);
            if (val !== undefined) {
              vars[name] = val;
            }
            // Clear the processed assignment
            text = text.substring(0, startPos) + '\\n' + text.substring(endPos);
            assignmentRegex.lastIndex = startPos;
          }
        }

        // Handle remaining single-line assignments
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
        }        output = output.replace(/\{([^{}]+)\}/g, function(match, expr) {
          try {
            let val;
            let varMatch = expr.match(/^([a-zA-Z_]\w*)\[(.*)\]$/);
            if (varMatch) {
              let base = vars[varMatch[1]];
              let keyExpr = varMatch[2].trim();
              let key = safeEval(keyExpr);
              if (base !== undefined) {
                if (isArray(base)) {
                  val = base[key];
                } else if (isObject(base)) {
                  // Handle numeric keys as nth key-value pair for objects
                  if (typeof key === 'number') {
                    let entries = Object.entries(base);
                    if (key >= 0 && key < entries.length) {
                      let [k, v] = entries[key];
                      return k + ": " + formatVar(v, true);
                    }
                  }
                  // Otherwise, try direct key access
                  val = base[key] !== undefined ? base[key] : base[String(key)];
                }
                return formatVar(val);
              }
            } else {
              val = safeEval(expr);
            }
            return formatVar(val);
          } catch (e) {
            return match;
          }
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
    }    function showPassage(name, pushHistory=true) {
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
          (stat.time ? "<br><span style=\'font-size:0.88em;color:#9ec;'>" + stat.time + "</span>" : "") +
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

    // Insert story title at the very top of the sidebar, only once
    function ensureSidebarTitle() {
      const sidebar = document.getElementById('sidebar');
      let storyTitleDiv = document.getElementById('sidebar-story-title');
      if (!storyTitleDiv) {
        storyTitleDiv = document.createElement('div');
        storyTitleDiv.id = 'sidebar-story-title';
        sidebar.insertBefore(storyTitleDiv, sidebar.firstChild.nextSibling);
      }
      storyTitleDiv.textContent = window.story && window.story.name ? window.story.name : document.title;
    }

    function showAuthorPassage() {
      const passages = getAllPassages();
      const authorKey = Object.keys(passages).find(k => k.toLowerCase() === "author");
      let authorDiv = document.getElementById('sidebar-author-passage');
      if (!authorDiv) {
        authorDiv = document.createElement('div');
        authorDiv.id = 'sidebar-author-passage';
        const sidebar = document.getElementById('sidebar');
        const storyTitleDiv = document.getElementById('sidebar-story-title');
        sidebar.insertBefore(authorDiv, storyTitleDiv.nextSibling);
      }
      if (authorKey) {
        const authorContent = parsePassage(passages[authorKey]);
        authorDiv.innerHTML = authorContent;
      } else {
        authorDiv.innerHTML = '';
      }
    }

    function showSidebarPassage() {
      const passages = getAllPassages();
      const sidebarKey = Object.keys(passages).find(k => k.toLowerCase() === "sidebar");
      let sidebarPassageDiv = document.getElementById('sidebar-passage');
      if (!sidebarPassageDiv) {
        sidebarPassageDiv = document.createElement('div');
        sidebarPassageDiv.id = 'sidebar-passage';
        const sidebar = document.getElementById('sidebar');
        const authorDiv = document.getElementById('sidebar-author-passage');
        sidebar.insertBefore(sidebarPassageDiv, authorDiv.nextSibling);
      }
      if (sidebarKey) {
        const sidebarContent = parsePassage(passages[sidebarKey]);
        sidebarPassageDiv.innerHTML = sidebarContent;
      } else {
        sidebarPassageDiv.innerHTML = '';
      }
    }

    // Patch sidebar-toggle to also show author passage and ensure title
    const origSidebarToggle = document.getElementById('sidebar-toggle').onclick;
    document.getElementById('sidebar-toggle').onclick = () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.add('open');
      ensureSidebarTitle();
      showAuthorPassage();
      showSidebarPassage();
      refreshSaveSlots();
      updateNavButtons();
    };

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
