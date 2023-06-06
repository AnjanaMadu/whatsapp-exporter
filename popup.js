document.addEventListener("DOMContentLoaded", function () {
  var nameEl = document.getElementById("name");
  var countEl = document.getElementById("count");
  var btnEl = document.getElementById("export");

  var contacts = [];

  btnEl.addEventListener("click", () => {
    let output = "";

    contacts.forEach((contact) => {
      if (!contact || !contact.startsWith("+")) return;
      output += `${contact.trim()}\n`;
    });

    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nameEl.innerText + ".txt";
    link.click();
  });

  function getContent() {
    const title = document.querySelector(
      "#main > header > div > div > div > span"
    ).innerText;
    const contacts = document.querySelector(
      "#main > header > div > div > span"
    ).innerText;
    return { title, contacts };
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        function: getContent,
      })
      .then((result) => {
        const data = result[0].result;
        nameEl.innerText = data.title;
        contacts = data.contacts.split(", ");

        countEl.innerText = contacts.length;
      });
  });
});
