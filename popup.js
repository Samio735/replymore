const SaveBtn = document.getElementById("save");
const ResetBtn = document.getElementById("reset");
const UserIdBtn = document.getElementById("user_id");

SaveBtn.addEventListener("click", () => {
  const userId = UserIdBtn.value;
  console.log(userId);
  chrome.storage.sync.set({ userId: userId });
});

ResetBtn.addEventListener("click", () => {
  chrome.storage.sync.set({ todayCount: 0, postCount: 0, countDays: 1 });
});
