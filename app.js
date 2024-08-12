const main = document.querySelector(".main");
const filtersDiv = document.querySelector(".filters_wrapper");
const clearAll = document.querySelector(".clearBtn");

let jobs = [];
let filters = [];

clearAll.addEventListener("click", () => {
  filters = []; // Reset the filters array
  updateFiltersUI(); // Update the filters UI to remove all filter tags
  renderJobs(jobs); // Render all jobs again to reset the job list
});

async function getData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    jobs = data;
    console.log(jobs);
    renderJobs(jobs); // Render all jobs initially
    updateFiltersUI(); // Update filters UI initially
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getData();

function addFilter(tag) {
  const tagText = tag.innerText;

  if (filters.includes(tagText)) {
    return; // Do nothing if the filter is already present
  }

  filters.push(tagText);

  updateFiltersUI();

  document.querySelectorAll(".tags_div").forEach((element) => {
    if (!element.innerText.includes(tagText)) {
      element.closest('.container').style.transition = "all 0.5s ease";
      element.closest('.container').style.opacity = "0";
    }
  });

  setTimeout(() => {
    updateContainers(); // Update the containers based on active filters
  }, 800);
}

function renderJobs(jobsToRender) {
  main.innerHTML = jobsToRender
    .map((job) => {
      // Combine languages and tools into one array
      const tags = [job.level, job.role, ...job.languages, ...job.tools];

      return `
          <div class="container">
            <img src=${job.logo} alt="${job.company} logo" class="logo">
            <div class="content">
              <p class="company">
                <span class="name">${job.company}</span>
                ${job.new ? '<span class="new">New!</span>' : ""}
                ${job.featured ? '<span class="featured">Featured</span>' : ""}
              </p>
              <h2 class="position">${job.position}</h2>
              <ul class="details">
                <li>${job.postedAt}</li>
                <li>${job.contract}</li>
                <li>${job.location}</li>
              </ul>
            </div>
            <div class="tags_div">
              ${tags
                .map(
                  (tag) =>
                    `<div class="tag" onclick="addFilter(this)">${tag}</div>`
                )
                .join("")}
            </div>
          </div>`;
    })
    .join(""); // Join the array into a single string to assign to innerHTML
}

function updateContainers() {
  // Filter the data based on active filters
  const filteredData = jobs.filter((item) => {
    const tags = [item.level, item.role, ...item.languages, ...item.tools].map(
      (tag) => tag.toLowerCase().trim()
    );
    return filters.every((filter) =>
      tags.includes(filter.toLowerCase().trim())
    );
  });
  renderJobs(filteredData); // Render the filtered jobs
}

function updateFiltersUI() {
  if (filters.length === 0) {
    document.querySelector(".filters_div").style.display = "none";
  } else {
    document.querySelector(".filters_div").style.display = "flex";
  }

  // Remove only the dynamically created filter tags (but not the static content)
  const dynamicTags = filtersDiv.querySelectorAll(".filter-tag");
  dynamicTags.forEach((tag) => tag.remove());

  // Create and append new divs for each filter
  filters.forEach((filter, index) => {
    const filterTag = document.createElement("div");
    filterTag.className = "filter-tag";
    filterTag.innerText = filter;

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";

    // Create the remove icon (img element)
    const removeIcon = document.createElement("img");
    removeIcon.src = "./images/icon-remove.svg";
    removeIcon.alt = "Remove";

    // Append the icon to the button
    removeButton.appendChild(removeIcon);

    // Append the button to the filterTag
    filterTag.appendChild(removeButton);

    // Append the filterTag to the filtersDiv
    filtersDiv.appendChild(filterTag);

    // Add event listener to the remove button
    removeButton.addEventListener("click", () => removeFilter(index));
  });
}

function removeFilter(index) {
  filters.splice(index, 1); // Remove the filter from the array
  updateFiltersUI();
  updateContainers(); // Update the containers based on the remaining filters
}
