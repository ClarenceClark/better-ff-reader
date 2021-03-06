var enableRegexes = [];

function fail(e) {
  console.log(e)
}

function toggleReadingMode(tab) {
  // The tabs api default to current tab if id is not provided
  var tabid = tab ? tab.id : null

  browser.tabs.executeScript(tabid, {
    file: "/libs/Readability.js",
    runAt: "document_end"
  }).then(() => {
    browser.tabs.executeScript(tabid, {
      file: "/scripts/content.js",
      runAt: "document_end"
    })
  })
  console.log("Toggle reading mode")
}

function processCommand(cmd) {
  if (cmd == "toggle-reader-mode") {
    toggleReadingMode()
  }
}

function onTabUpdate(id, info, tab) {
  if (info.status != "complete") {
    return
  }

  var match = enableRegexes.map(function (e) {
    return e.test(tab.url)
  }).reduce(function (x, y) {
    return x || y
  }, false)

  if (match) {
    toggleReadingMode(null)
  }
}

function onOptionsUpdate(changes, area) {
  if (changes.enableRegexes && changes.enableRegexes.newValue.length > 0) {
    enableRegexes = changes.enableRegexes.newValue.map(function (e) {
      return new RegExp(e)
    })
  }
  console.log(enableRegexes)
}

browser.commands.onCommand.addListener(processCommand)
browser.pageAction.onClicked.addListener(toggleReadingMode)
browser.browserAction.onClicked.addListener(toggleReadingMode)
browser.tabs.onUpdated.addListener(onTabUpdate)
browser.storage.onChanged.addListener(onOptionsUpdate)