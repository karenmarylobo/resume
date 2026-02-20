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
    renderCertification(data.certifiction);
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
function renderCertification(certification) {
  const container = document.getElementById("certification");
  container.innerHTML = "";

  certification.forEach((item) => {
    const block = document.createElement("div");
    block.className = "mb-2";

    const title = document.createElement("div");
    title.className = "fw-semibold";
    title.textContent = item.title;

    const link = document.createElement("a");
    link.href = item.detail;
    link.target = "_blank";
    link.className = "text-primary text-decoration-none";
    link.textContent = item.detail;

    block.appendChild(title);
    block.appendChild(link);
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


// Updated generateDoc - fetches from data.json automatically
 function generateDoc() {
    try {
        // Fetch data.json (same structure as your render functions expect)
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Failed to load data.json");
        const data = await response.json();
        
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
        const children = [];

        // 1. Basics Section
        children.push(
            new Paragraph({
                children: [new TextRun({ text: data.basics.name, bold: true, size: 48 })],
                alignment: AlignmentType.CENTER
            }),
            new Paragraph({
                children: [new TextRun({
                    text: `${data.basics.email} | ${data.basics.linkedin} | ${data.basics.nationality}`,
                    size: 24
                })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
            }),
            new Paragraph({
                children: [new TextRun(data.basics.summary)],
                spacing: { after: 400 }
            })
        );

        // 2. Experience Section (matches renderExperience structure)
        children.push(new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
        }));
        
        data.experience.forEach(item => {
            children.push(new Paragraph({
                children: [new TextRun({
                    text: `${item.title} — ${item.company}     ${item.period}`,
                    bold: true,
                    size: 28
                })]
            }));
            
            item.bullets.forEach(bullet => {
                children.push(new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun(bullet)]
                }));
            });
            children.push(new Paragraph("")); // Spacer
        });

        // 3. Skills Section (matches renderSkills structure)
        children.push(new Paragraph({
            text: "TECHNICAL SKILLS",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
        }));
        Object.keys(data.skills).forEach(category => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: category.toUpperCase() + ":", bold: true }),
                    new TextRun(` ${data.skills[category].join(", ")}`)
                ]
            }));
        });

        // 4. Education Section (matches renderEducation structure)
        children.push(new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
        }));
        data.education.forEach(ed => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: ed.degree, bold: true }),
                    new TextRun(`\n${ed.school} — ${ed.period}`)
                ]
            }));
        });

        // 5. Recognition Section (matches renderRecognition structure)
        children.push(new Paragraph({
            text: "RECOGNITION",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
        }));
        data.recognition.forEach(item => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: item.title, bold: true }),
                    new TextRun(`\n${item.period}`),
                    new TextRun(`\n${item.detail}`)
                ]
            }));
        });

        // Generate & Download
        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${data.basics.name.replace(/\s+/g, '_')}_Resume.docx`);
        
        alert('✅ DOCX Generated from data.json!');
        
    } catch (error) {
        console.error(error);
        alert('❌ Error: ' + error.message);
    }
}
