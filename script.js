// Load resume data from JSON and render into the page using Fetch API [web:19][web:22]
fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load data.json");
    }
    return response.json();
  })
  .then((data) => {
    renderBasics(data.basics);
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderEducation(data.education);
    renderRecognition(data.recognition);
  })
  .catch((error) => {
    console.error(error);
  });

function renderBasics(basics) {
  document.getElementById("name").textContent = basics.name;

  const contactDiv = document.getElementById("contact");
  contactDiv.innerHTML = `
    <a href="mailto:${basics.email}" class="text-decoration-none me-2">${basics.email}</a>
    · 
    <a href="${basics.linkedin}" target="_blank" class="text-decoration-none mx-2">LinkedIn</a>
    · 
    <span class="ms-2">${basics.nationality}</span>
  `;

  document.getElementById("summary").textContent = basics.summary;
}

function renderExperience(experience) {
  const container = document.getElementById("experience");
  container.innerHTML = "";

  experience.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "timeline-item pb-2";

    const titleLine = document.createElement("div");
    titleLine.className = "d-flex justify-content-between align-items-baseline";

    const title = document.createElement("h6");
    title.className = "mb-0 fw-semibold";
    title.textContent = `${item.title} — ${item.company}`;

    const period = document.createElement("span");
    period.className = "badge bg-primary-subtle text-primary-emphasis badge-pill ms-2";
    period.textContent = item.period;

    titleLine.appendChild(title);
    titleLine.appendChild(period);

    const ul = document.createElement("ul");
    ul.className = "mb-1 small";
    item.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      ul.appendChild(li);
    });

    wrapper.appendChild(titleLine);
    wrapper.appendChild(ul);
    container.appendChild(wrapper);
  });
}

function renderSkills(skills) {
  const container = document.getElementById("skills");
  container.innerHTML = "";

  Object.keys(skills).forEach((category) => {
    const catTitle = document.createElement("div");
    catTitle.className = "fw-semibold small text-uppercase text-secondary mt-2 mb-1";
    catTitle.textContent = category;
    container.appendChild(catTitle);

    const list = document.createElement("div");
    skills[category].forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = skill;
      list.appendChild(chip);
    });
    container.appendChild(list);
  });
}

function renderEducation(education) {
  const container = document.getElementById("education");
  container.innerHTML = "";

  education.forEach((ed) => {
    const block = document.createElement("div");
    block.className = "mb-2";

    block.innerHTML = `
      <div class="fw-semibold">${ed.degree}</div>
      <div class="text-muted">${ed.school}</div>
      <div class="text-primary">${ed.period}</div>
    `;
    container.appendChild(block);
  });
}

function renderRecognition(recognition) {
  const container = document.getElementById("recognition");
  container.innerHTML = "";

  recognition.forEach((item) => {
    const block = document.createElement("div");
    block.className = "mb-2";

    block.innerHTML = `
      <div class="fw-semibold">${item.title}</div>
      <div class="text-primary">${item.period}</div>
      <div class="text-muted">${item.detail}</div>
    `;
    container.appendChild(block);
  });
}
