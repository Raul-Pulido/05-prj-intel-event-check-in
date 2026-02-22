//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Team keys for localStorage
const teamKeys = ["water", "zero", "power"];

// Helper: get attendee list from localStorage
function getAttendeeList(team) {
  const data = localStorage.getItem(team + "List");
  return data ? JSON.parse(data) : [];
}

// Helper: save attendee list to localStorage
function saveAttendeeList(team, list) {
  localStorage.setItem(team + "List", JSON.stringify(list));
}

// Load counts from localStorage
function loadCounts() {
  const savedCount = localStorage.getItem("attendanceCount");
  count = savedCount ? parseInt(savedCount) : 0;
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;
  // Update progress bar
  const progressBar = document.getElementById("progressBar");
  const percent = Math.round((count / maxCount) * 100);
  progressBar.style.width = percent + "%";
  if (percent >= 100) {
    progressBar.style.background = "#0071c5";
    progressBar.textContent = "Goal reached!";
  } else {
    progressBar.style.background = "#2196f3";
    progressBar.textContent = "";
  }
  // Load team counts and attendee lists
  teamKeys.forEach(function (team) {
    const savedTeamCount = localStorage.getItem(team + "Count");
    const teamCounter = document.getElementById(team + "Count");
    teamCounter.textContent = savedTeamCount ? savedTeamCount : "0";
    // Load attendee names
    const attendeeList = getAttendeeList(team);
    const listElem = document.getElementById(team + "List");
    listElem.innerHTML = "";
    attendeeList.forEach(function (attendee) {
      const li = document.createElement("li");
      li.textContent = attendee;
      listElem.appendChild(li);
    });
  });
}

// Save counts to localStorage
function saveCounts() {
  localStorage.setItem("attendanceCount", count);
  teamKeys.forEach(function (team) {
    const teamCounter = document.getElementById(team + "Count");
    localStorage.setItem(team + "Count", teamCounter.textContent);
    // Save attendee list
    const listElem = document.getElementById(team + "List");
    const attendees = [];
    for (let i = 0; i < listElem.children.length; i++) {
      attendees.push(listElem.children[i].textContent);
    }
    saveAttendeeList(team, attendees);
  });
}

// Load counts on page load
window.addEventListener("DOMContentLoaded", loadCounts);

//Handle form submissions
form.addEventListener("submit", function (event) {
  event.preventDefault(); //Prevent form from submitting normally

  //Get input values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total Attendees: " + count);

  // Update attendee count display
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = count;

  // Update progress bar
  const progressBar = document.getElementById("progressBar");
  const percent = Math.round((count / maxCount) * 100);
  progressBar.style.width = percent + "%";
  if (percent >= 100) {
    progressBar.style.background = "#0071c5";
    progressBar.textContent = "Goal reached!";
  } else {
    progressBar.style.background = "#2196f3";
    progressBar.textContent = "";
  }

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Add attendee name to list
  const listElem = document.getElementById(team + "List");
  const li = document.createElement("li");
  li.textContent = name;
  listElem.appendChild(li);

  // Save updated counts and attendee lists
  saveCounts();

  // Show personalized greeting message in modal popup
  const greeting = document.getElementById("greeting");
  const message = `Welcome ${name}! You have checked in with ${teamName}.`;
  greeting.textContent = message;
  // Modal popup
  const modal = document.getElementById("greetingModal");
  const modalMsg = document.getElementById("modalMessage");
  modalMsg.textContent = message;
  modal.style.display = "block";
  // Show confetti
  showBlueConfetti();
  // Close modal on click X or outside
  const closeModal = document.getElementById("closeModal");
  let modalTimeout;
  function closeGreetingModal() {
    modal.style.display = "none";
    if (modalTimeout) {
      clearTimeout(modalTimeout);
    }
  }
  closeModal.onclick = closeGreetingModal;
  window.onclick = function (event) {
    if (event.target === modal) {
      closeGreetingModal();
    }
  };
  // Auto-close modal after 3 seconds
  modalTimeout = setTimeout(closeGreetingModal, 3000);
  console.log(message);
  // Simple blue confetti effect
  function showBlueConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    const confetti = [];
    const colors = ["#0071c5", "#2196f3", "#42a5f5", "#90caf9"];
    for (let i = 0; i < 30; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        r: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 2 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 2,
      });
    }
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < confetti.length; i++) {
        let c = confetti[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.y += c.speed;
        c.x += c.drift;
        if (c.y > canvas.height) {
          c.y = Math.random() * -20;
          c.x = Math.random() * canvas.width;
        }
      }
      frame++;
      if (frame < 50) {
        requestAnimationFrame(draw);
      } else {
        canvas.style.display = "none";
      }
    }
    draw();
  }

  form.reset(); //Reset form for next entry
});
