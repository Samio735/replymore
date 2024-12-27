function init() {
  chrome.storage.local.get(
    [
      "postCount",
      "countDays",
      "todayCount",
      "dailyGoal",
      "showTodayCount",
      "showOverallCount",
      "showDailyAverage",
      "showTodayTime",
      "showAverageTime",
      "showTimePerTweet",
      "showTodayRate",
      "timeSpent",
      "timeSpentToday",
      "timeSpentEachDay",
    ],
    (data) => {
      if (data.dailyGoal === undefined) data.dailyGoal = 0;
      if (data.countDays === undefined) data.countDays = 1;
      if (data.todayCount === undefined) data.todayCount = 0;
      if (data.postCount === undefined) data.postCount = 0;
      if (data.timeSpent === undefined) data.timeSpent = 1;
      if (data.timeSpentToday === undefined) data.timeSpentToday = 1;
      if (data.showTodayCount === undefined) data.showTodayCount = true;
      if (data.showOverallCount === undefined) data.showOverallCount = false;
      if (data.showDailyAverage === undefined) data.showDailyAverage = false;
      if (data.showTodayTime === undefined) data.showTodayTime = true;
      if (data.showAverageTime === undefined) data.showAverageTime = false;
      if (data.showTimePerTweet === undefined) data.showTimePerTweet = false;
      if (data.showTodayRate === undefined) data.showTodayRate = false;
      if (data.countEachDay === undefined) data.countEachDay = [];

      chrome.storage.local.set({
        postCount: data.postCount,
        countDays: data.countDays,
        todayCount: data.todayCount,
        dailyGoal: data.dailyGoal,
        todayTime: data.todayTime,
        timeSpent: data.timeSpent,
        showTodayCount: data.showTodayCount,
        showOverallCount: data.showOverallCount,
        showDailyAverage: data.showDailyAverage,
        showTodayTime: data.showTodayTime,
        showAverageTime: data.showAverageTime,
        showTimePerTweet: data.showTimePerTweet,
        showTodayRate: data.showTodayRate,
      });
    }
  );
}

init();

let intervalIslocked = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "clock-in") {
    if (!intervalIslocked) {
      intervalIslocked = true;
      chrome.storage.local.get(["timeSpent", "timeSpentToday"], (data) => {
        let timeSpent = data.timeSpent || 0;
        let timeSpentToday = data.timeSpentToday || 0;
        timeSpent += 1;
        timeSpentToday += 1;
        chrome.storage.local.set({
          timeSpent: timeSpent,
          timeSpentToday: timeSpentToday,
        });
      });

      setTimeout(() => {
        intervalIslocked = false;
      }, 1000);
    }
  }
});

setInterval(() => {
  checkDateChange();
}, 1000);

function checkDateChange() {
  const today = new Date().toLocaleDateString();
  chrome.storage.local.get(
    ["currentDay", "countDays", "todayCount", "countEachDay"],
    (data) => {
      if (!data.countEachDay) data.countEachDay = [];
      if (!data.currentDay) chrome.storage.local.set({ currentDay: today });
      if (!data.todayCount) data.todayCount = 0;
      (!data.countDays || data.countDays == 0) && (data.countDays = 1);

      if (data.currentDay !== today) {
        chrome.storage.local.set({
          currentDay: today,
          todayCount: 0,
          countDays: data.countDays + 1,
          timeSpentToday: 0,
        });
      }
    }
  );
}
