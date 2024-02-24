// const SaveBtn = document.getElementById("save");
const ResetBtn = document.getElementById("reset");
// const UserIdEl = document.getElementById("user_id");

const dailyGoalEl = document.getElementById("daily-goal");

// SaveBtn.addEventListener("click", () => {
//   const userId = UserIdEl.value;
//   console.log(userId);
//   chrome.storage.sync.set({ userId: userId });
// });

ResetBtn.addEventListener("click", () => {
  chrome.storage.sync.set({ todayCount: 0, postCount: 0, countDays: 1 });
});

dailyGoalEl.addEventListener("change", (e) => {
  chrome.storage.sync.set({
    dailyGoal: Number(e.target.value),
  });
});

chrome.storage.sync.get("dailyGoal", (data) => {
  const dailyGoal = data.dailyGoal || 0;
  dailyGoalEl.value = dailyGoal;
});
