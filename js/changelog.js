const changelogData = [
    {
      version: "1.0",
      date: "Feb 5, 2025",
      description: "Initial version release. Introducing AxionOS!",
    },
  ];
  
  function createChangelogItems() {
    const changelogContainer = document.getElementById("changelog-list");
    changelogData.forEach((item) => {
      const changelogItem = document.createElement("div");
      changelogItem.classList.add("changelog-item");
      const changelogTitle = document.createElement("h3");
      changelogTitle.classList.add("changelog-title");
      changelogTitle.innerHTML = `${item.version} <span class="changelog-date">- ${item.date}</span>`;
      const changelogDescription = document.createElement("p");
      changelogDescription.classList.add("changelog-description");
      changelogDescription.textContent = item.description;
      changelogItem.appendChild(changelogTitle);
      changelogItem.appendChild(changelogDescription);
      changelogContainer.appendChild(changelogItem);
    });
  }