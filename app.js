const storageKey = "shared-schedule-events";

const form = document.querySelector("#event-form");
const eventList = document.querySelector("#event-list");
const clearButton = document.querySelector("#clear-btn");

let events = loadEvents();
renderEvents();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const newEvent = {
    id: createEventId(),
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    members: formData.get("members"),
    note: formData.get("note"),
  };

  events.push(newEvent);
  persistEvents();
  renderEvents();
  form.reset();
});

clearButton.addEventListener("click", () => {
  events = [];
  persistEvents();
  renderEvents();
});

function loadEvents() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function persistEvents() {
  localStorage.setItem(storageKey, JSON.stringify(events));
}

function renderEvents() {
  if (events.length === 0) {
    eventList.innerHTML = "<li>아직 등록된 일정이 없습니다.</li>";
    return;
  }

  const sortedEvents = [...events].sort((a, b) => {
    const aDate = `${a.date}T${a.time}`;
    const bDate = `${b.date}T${b.time}`;
    return aDate.localeCompare(bDate);
  });

  eventList.innerHTML = sortedEvents
    .map(
      (item) => `
      <li class="event-item">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <small>🕒 ${item.date} ${item.time}</small>
          <small>👥 ${escapeHtml(item.members || "참여자 미지정")}</small>
          <small>📝 ${escapeHtml(item.note || "메모 없음")}</small>
        </div>
        <button class="delete" data-id="${item.id}">삭제</button>
      </li>
    `,
    )
    .join("");

  eventList.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", () => {
      events = events.filter((event) => event.id !== button.dataset.id);
      persistEvents();
      renderEvents();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEventId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // 서비스 워커 등록 실패 시 앱 기능에는 영향 없도록 무시
    });
  });
}
