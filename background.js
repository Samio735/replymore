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
      if (data.showTodayRate === undefined) data.showTodayRate = true;
      if (data.countEachDay === undefined) data.countEachDay = [];
      console.log(data.countEachDay);
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

// background.js

importScripts("ExtPay.js");

var extpay = ExtPay("replymore");
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then((user) => {
  const now = new Date();
  const threeDays = 1000 * 60 * 24 * 3; // in milliseconds
  console.log(user);

  if (user.paid) {
    chrome.storage.local.set({ paid: true });
  } else {
    chrome.storage.local.set({ paid: false });
    if (!user.trialStartedAt) extpay.openTrialPage("3-day");
    if (user.trialStartedAt && now - user.trialStartedAt < threeDays) {
      chrome.storage.local.set({ trial: true });
    }
  }
});

extpay.onPaid.addListener((user) => {
  chrome.storage.local.set({ paid: true });
  console.log("user paid!");
});

extpay.onTrialStarted.addListener((user) => {
  chrome.storage.local.set({ trial: true, trialStarted: true });
  console.log("user started trial!");
});

// on message open free trial

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "start-free-trial") {
    var extpay = ExtPay("replymore");
    extpay.openTrialPage("3-day");
  }
});

// on message pay

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("paypage");
  if (request.type === "pay") {
    var extpay = ExtPay("replymore");
    extpay.openPaymentPage();
  }
});

setInterval(() => {
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
}, 1000);
