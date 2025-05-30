window.storyFormat({
  "name": "PyCube",
  "version": "0.1.0",
  "description": "A Twine story format for Python-like syntax.",
  "author": "Brendon Sutherland",
  "image": "https://pycube.org/logo.svg",
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

    #passages {
      margin: 40px auto 0 auto;
      padding: 1.5em 1em 2em 1em;
      max-width: 600px;
      min-width: 300px;
      background: #222;
      border-radius: 8px;
      box-shadow: 0 2px 8px #000a;
    }

    .passage {
      margin-bottom: 1.8em;
    }

    a {
      color: #8ecafc;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
    a:hover {
      color: #fff;
    }

    ::selection {
      background: #444;
      color: #fff;
    }

    @media (max-width: 700px) {
      #passages {
        padding: 1em 0.2em 2em 0.2em;
        min-width: unset;
        max-width: 98vw;
      }
    }
  </style>
</head>
<body>
  <div id="passages"></div>
  <script>
    // --- Error trapping and startup debug ---
    window.onerror = function(message, source, lineno, colno, error) {
      const el = document.getElementById('passages');
      if (el) el.innerHTML = "<div style='color:red;'><b>PyCube ERROR:</b> " + message + " (at " + lineno + ":" + colno + ")</div>";
      console.log("JS ERROR:", message, "at", lineno + ":" + colno);
      return false;
    };
    console.log("PyCube script loaded!");

    // --- Variable storage ---
    const vars = {};

    // --- Read all Twine passages from window.story OR <tw-storydata> ---
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

    // --- Get the starting passage name ---
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

    // --- Evaluate expressions safely using only current vars ---
    function safeEval(expr) {
      try {
        const allowed = Object.assign({}, vars);
        const fn = new Function(...Object.keys(allowed), "return " + expr + ";");
        return fn(...Object.values(allowed));
      } catch (e) {
        return undefined;
      }
    }

    // --- Parser/interpreter (assignments, if/else, inline vars, links) ---
    function parsePassage(text) {
      text = text.replace(/^\\s*\\$([a-zA-Z_]\\w*)\\s*=\\s*(.+)$/gm, (match, name, value) => {
        const val = safeEval(value);
        vars[name] = val !== undefined ? val : value;
        return '';
      });

      // If/else parsing (Python-style indented blocks)
      const lines = text.split(/\\r?\\n/);
      let output = '';
      let i = 0;
      while (i < lines.length) {
        let line = lines[i];
        let ifMatch = line.match(/^if ([^:]+):\\s*$/);
        let elseMatch = line.match(/^else:\\s*$/);

        if (ifMatch) {
          let condition = ifMatch[1];
          let conditionResult = !!safeEval(condition);
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

      // Inline variable substitution {var}
      output = output.replace(/\\{([a-zA-Z_]\\w*)\\}/g, (match, name) =>
        vars[name] !== undefined ? vars[name] : match
      );

      // Twine-style links [[Go|Target]]
      output = output.replace(/\\[\\[([^\\]|]+)(\\|([^\\]]+))?\\]\\]/g, (match, text, _, target) => {
        target = target || text;
        return \`<a onclick="go('\${target.replace(/'/g, "\\'")}')">\${text}</a>\`;
      });

      return output.trim().replace(/\\n/g, "<br>");
    }

    // --- Show a passage by name ---
    function showPassage(name) {
      const passages = getAllPassages();
      if (!(name in passages)) {
        document.getElementById('passages').innerHTML =
          '<div class="passage">Passage not found: ' + name + '</div>';
        return;
      }
      document.getElementById('passages').innerHTML =
        '<div class="passage">' + parsePassage(passages[name]) + '</div>';
    }

    window.go = showPassage;

    // --- Run the Init passage (if it exists) ONCE before story starts ---
    function runInitIfExists(passages) {
      for (const key of Object.keys(passages)) {
        if (key.toLowerCase() === "init") {
          parsePassage(passages[key]);
          break;
        }
      }
    }

    // --- Wait for story data to be ready, then show the start passage ---
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

      // Debug: Show found passages in the console
      console.log("All Twine passages found:", Object.keys(passages));

      // Run Init passage first (if present)
      runInitIfExists(passages);

      const start = getStartPassage();
      if (start) {
        showPassage(start);
      } else {
        document.getElementById('passages').innerHTML = '<div class="passage">No starting passage found.</div>';
      }
    });

  </script>
</body>
</html>
`
});
