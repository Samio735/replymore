const ResetBtn = document.getElementById("reset");
const dailyGoalEl = document.getElementById("daily-goal");
const maxTimeEl = document.getElementById("max-time");
const minReachEl = document.getElementById("min-reach");
const todayCountEl = document.getElementById("today-count");
const overallCountEl = document.getElementById("overall-count");
const dailyAverageEl = document.getElementById("daily-average");
const todayTimeEl = document.getElementById("today-time");
const averageTimeEl = document.getElementById("average-time");
const timePerTweetEl = document.getElementById("time-per-tweet");
const todayRateEl = document.getElementById("today-rate");
const showTodayCountEl = document.getElementById("show-today-count");
const showOverallCountEl = document.getElementById("show-overall-count");
const showDailyAverageEl = document.getElementById("show-daily-average");
const showTodayTimeEl = document.getElementById("show-today-time");
const showAverageTimeEl = document.getElementById("show-average-time");
const showTimePerTweetEl = document.getElementById("show-time-per-tweet");
const showTodayRateEl = document.getElementById("show-today-rate");

ResetBtn.addEventListener("click", () => {
  chrome.storage.local.set({ todayCount: 0, postCount: 0, countDays: 1 });
});

// add event listenes to each show button

showTodayCountEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayCount: e.target.checked });
});

showOverallCountEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showOverallCount: e.target.checked });
});

showDailyAverageEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showDailyAverage: e.target.checked });
});

showTodayTimeEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayTime: e.target.checked });
});

showAverageTimeEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showAverageTime: e.target.checked });
  console.log("hello");
});

showTimePerTweetEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTimePerTweet: e.target.checked });
});

showTodayRateEl.addEventListener("change", (e) => {
  chrome.storage.local.set({ showTodayRate: e.target.checked });
});

dailyGoalEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    dailyGoal: Number(e.target.value),
  });
});

maxTimeEl.addEventListener("change", (e) => {
  if (!e.target.value) e.target.value = Infinity;
  if (e.target.value < 0) e.target.value = Infinity;
  chrome.storage.local.set({
    maxTimePassed: Number(e.target.value),
  });
});

minReachEl.addEventListener("change", (e) => {
  chrome.storage.local.set({
    minViewsPerMinute: Number(e.target.value),
  });
});

chrome.storage.local.get(
  [
    "dailyGoal",
    "countDays",
    "todayCount",
    "postCount",
    "timeSpent",
    "timeSpentToday",
    "showTodayCount",
    "showOverallCount",
    "showDailyAverage",
    "showTodayTime",
    "showAverageTime",
    "showTimePerTweet",
    "showTodayRate",
    "maxTimePassed",
    "minViewsPerMinute",
  ],
  (data) => {
    const dailyGoal = data.dailyGoal || 0;
    const countDays = data.countDays || 1;
    const todayCount = data.todayCount || 0;
    const postCount = data.postCount || 0;
    const timeSpent = data.timeSpent || 0;
    const timeSpentToday = data.timeSpentToday || 0;
    const showTodayCount = !!data.showTodayCount ? "true" : "false";
    const showOverallCount = !!data.showOverallCount ? "true" : "false";
    const showDailyAverage = !!data.showDailyAverage ? "true" : "false";
    const showTodayTime = !!data.showTodayTime ? "true" : "false";
    const showAverageTime = !!data.showAverageTime ? "true" : "false";
    const showTimePerTweet = !!data.showTimePerTweet ? "true" : "false";
    const showTodayRate = !!data.showTodayRate ? "true" : "false";
    const maxTimePassed = data.maxTimePassed || Infinity;
    const minViewsPerMinute = data.minViewsPerMinute || 0;

    dailyGoalEl.value = dailyGoal;
    maxTimeEl.value = maxTimePassed;
    minReachEl.value = minViewsPerMinute;
    todayCountEl.textContent = todayCount;
    overallCountEl.textContent = postCount;
    dailyAverageEl.textContent = (postCount / countDays).toFixed(1);
    todayTimeEl.textContent = Math.round(timeSpentToday / 60);
    averageTimeEl.textContent = Math.round(timeSpent / 60 / countDays);
    timePerTweetEl.textContent = (postCount / (timeSpent / (60 * 60))).toFixed(
      1
    );
    todayRateEl.textContent = (
      data.todayCount /
      (data.timeSpentToday / (60 * 60))
    ).toFixed(1);
    showTodayCountEl.checked = showTodayCount === "true";
    showOverallCountEl.checked = showOverallCount === "true";
    showDailyAverageEl.checked = showDailyAverage === "true";
    showTodayTimeEl.checked = showTodayTime === "true";
    showAverageTimeEl.checked = showAverageTime === "true";
    showTimePerTweetEl.checked = showTimePerTweet === "true";
    showTodayRateEl.checked = showTodayRate === "true";
  }
);

// <div style="margin-bottom: 12px; display: flex; gap: 2px; height: 30px; align-items: center;">
// <h2 style="margin-right: 6px; text-wrap: nowrap;"> Daily Goal : </h2>
// <div           style="
//       height: 100%;
//       display: flex;
//       gap: 0.2rem;
//       background-color: aliceblue;
//       color: #1775b5;
//       border: 0.1rem solid;
//       border-color: aliceblue;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;
//       align-items: center;
//     ">
//   <input
//     type="number"
//     id="daily-goal"
//     placeholder="0"
//     style="
//       height: 100%;
//       width: 3rem;
//       background-color: #1775b5;
//       color: aliceblue;
//       border: 0;
//       padding: 2px 4px;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;

//     "
//   />
//           <!-- <button
//     id="save"

//   >
//     Save
//   </button> -->
//   <p style="padding-right: 0.2rem;text-wrap: nowrap;"> per day</p>
//   </div>
// </div>
//       <div style="margin-bottom: 12px; display: flex; gap: 2px; height: 30px; align-items: center;">
// <h2 style="margin-right: 6px; text-wrap: nowrap;"> Max post age : </h2>
// <div           style="
//       height: 100%;
//       display: flex;
//       gap: 0.2rem;
//       background-color: aliceblue;
//       color: #1775b5;
//       border: 0.1rem solid;
//       border-color: aliceblue;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;
//       align-items: center;
//     ">
//   <input
//     type="number"
//     id="max-time"
//     placeholder="0"
//     style="
//       height: 100%;
//       width: 3rem;
//       background-color: #1775b5;
//       color: aliceblue;
//       border: 0;
//       padding: 2px 4px;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;

//     "
//   />
//           <!-- <button
//     id="save"

//   >
//     Save
//   </button> -->
//   <p style="padding-right: 0.2rem;text-wrap: nowrap;"> hours</p>
//   </div>
// </div>
//       <div style="margin-bottom: 12px; display: flex; gap: 2px; height: 30px; align-items: center;">
// <h2 style="margin-right: 6px; text-wrap: nowrap;"> Min reach : </h2>
// <div           style="
//       height: 100%;
//       display: flex;
//       gap: 0.2rem;
//       background-color: aliceblue;
//       color: #1775b5;
//       border: 0.1rem solid;
//       border-color: aliceblue;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;
//       align-items: center;
//     ">
//   <input
//     type="number"
//     id="min-reach"
//     placeholder="0"
//     style="
//       height: 100%;
//       width: 3rem;
//       background-color: #1775b5;
//       color: aliceblue;
//       border: 0;
//       padding: 2px 4px;
//       border-radius: 8px;
//       transition: all 0.3s ease-in-out;

//     "
//   />
//           <!-- <button
//     id="save"

//   >
//     Save
//   </button> -->
//   <p style="padding-right: 0.2rem;text-wrap: nowrap;"> view / min</p>
//   </div>
// </div>
