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
      if (data.showTodayRate === undefined) data.showTodayRate = true;
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
