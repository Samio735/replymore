function createContainer() {
  const container = document.createElement("div");
  container.id = "stats-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.padding = "10px";
  container.style.backgroundColor = "rgb(29, 155, 240)";
  container.style.color = "#ffffff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.fontWeight = "bold";
  container.style.zIndex = "9999";
  container.style.borderBottomLeftRadius = "10px";
  container.style.display = "flex";
  container.style.flexDirection = "Column";
  container.style.alignItems = "center";

  document.body.prepend(container);
}

function createStatsElement() {
  const statsElement = document.createElement("div");
  statsElement.id = "post-stats";
  statsElement.style.display = "flex";
  statsElement.style.alignItems = "center";
  statsElement.style.justifyContent = "center";
  statsElement.style.gap = "5px";

  document.querySelector("#stats-container").appendChild(statsElement);

  updateStatsElement();
}

function createProgressBar() {
  const progressBarContainer = document.createElement("div");
  progressBarContainer.id = "post-progress-bar-container";
  progressBarContainer.style.height = "3px";
  progressBarContainer.style.width = "100%";
  progressBarContainer.style.minWidth = "100px";
  progressBarContainer.style.backgroundColor = " #106aa6";
  progressBarContainer.style.zIndex = "9999";
  progressBarContainer.style.margin = "0 10px";
  progressBarContainer.style.marginBottom = "5px";
  progressBarContainer.style.borderRadius = "20px";

  const progressBar = document.createElement("div");
  progressBar.id = "post-progress-bar";
  progressBar.style.width = "4px";
  progressBar.style.height = "100%";
  progressBar.style.backgroundColor = "#ffffff";
  progressBar.style.borderRadius = "20px";

  progressBarContainer.prepend(progressBar);
  document.querySelector("#stats-container").prepend(progressBarContainer);

  updateProgressBar();
}

function updateStatsElement() {
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
      const statsElement = document.getElementById("post-stats");
      if (data.postCount == undefined) data.postCount = 0;
      if (data.countDays == undefined) data.countDays = 1;
      if (data.todayCount == undefined) data.todayCount = 0;
      if (data.todayCount == undefined) data.todayCount = 0;
      if (data.todayCount == undefined) data.todayCount = 0;

      const dailyAverage = (data.postCount / data.countDays).toFixed(2);
      statsElement.innerHTML =
        // Replace with actual daily average of posts and comments
        `<span><svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1qtyvf0 r-o4n3w5" style="color: rgb(255, 255, 255); margin-right:2px;"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg></span>  
        ${
          data.showTodayCount
            ? `Today : ${data.todayCount} ${
                data.dailyGoal > 0 ? `/${data.dailyGoal}` : ""
              }
`
            : ``
        }
        ${data.showTodayCount && data.showTodayTime ? ` in` : ""}
        ${
          data.showTodayTime ? ` ${Math.round(data.timeSpentToday / 60)}m ` : ""
        }
         ${
           data.showTodayRate
             ? ` going ${(
                 data.todayCount /
                 (data.timeSpentToday / (60 * 60))
               ).toFixed(1)} r/h`
             : ""
         } 
        ${data.showTodayCount && data.showOverallCount ? "|" : ""}
        ${data.showOverallCount ? ` Total : ${data.postCount} ` : ""}
        ${
          (data.showTodayCount || data.showTodayTime) &&
          (data.showDailyAverage || data.showAverageTime)
            ? "|"
            : ""
        }
        ${
          data.showDailyAverage || data.showAverageTime || data.showTimePerTweet
            ? " Avg :"
            : ""
        }
        ${data.showDailyAverage ? ` ${dailyAverage} ` : ""} 
        ${data.showDailyAverage && data.showAverageTime ? `in` : ""}
        ${
          data.showAverageTime
            ? ` ${Math.round(data.timeSpent / (data.countDays * 60))}m `
            : ""
        }
      
        ${
          data.showTimePerTweet
            ? ` going ${(data.postCount / (data.timeSpent / (60 * 60))).toFixed(
                1
              )} r/h`
            : ""
        } 
      `;
    }
  );
}
function updateProgressBar() {
  chrome.storage.local.get(["postCount", "todayCount", "dailyGoal"], (data) => {
    if (!data.dailyGoal) {
      const progressBarContainer = document.getElementById(
        "post-progress-bar-container"
      );
      progressBarContainer.style.display = "none";
      return;
    }

    const progressBarContainer = document.getElementById(
      "post-progress-bar-container"
    );

    progressBarContainer.style.display = "block";
    const progressBar = document.getElementById("post-progress-bar");
    let progress = (data.todayCount / data.dailyGoal) * 100;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
  });
}

function reactToPost() {
  chrome.storage.local.get(
    ["postCount", "todayCount", "disaibleReplySound"],
    (data) => {
      postCount = data.postCount || 0;
      postCount++;
      todayCount = data.todayCount || 0;
      todayCount++;
      chrome.storage.local.set({
        postCount: postCount,
        todayCount: todayCount,
      });
      updateStatsUI();
      if (!data.disaibleReplySound) {
        playAudio();
      }
    }
  );
}
// Add event listener for detecting comment or post activity

// Function to play the audio
function playAudio() {
  audio.play();
}

function updateStatsUI() {
  updateProgressBar();
  updateStatsElement();
}
// update stats and post count on storage change

function init() {
  chrome.storage.local.get(["paid", "trial"], (data) => {
    if (!data.paid && !data.trial) return;

    const audio = new Audio(chrome.runtime.getURL("Ding.mp3"));

    createContainer();
    createStatsElement();
    createProgressBar();
    updateStatsUI();

    document.addEventListener("click", function (event) {
      if (
        event.target.closest('[data-testid="tweetButtonInline"]') ||
        event.target.closest('[data-testid="tweetButton"]') ||
        event.target.closest('[data-testid="reply"]')
      ) {
        // User clicked the tweet button to post
        reactToPost();
      }
    });

    // Add event listener for detecting comment or post activity by clicking cmd+enter

    document.addEventListener("keydown", function (event) {
      if (
        event.metaKey &&
        event.key === "Enter" &&
        event.target.closest("[role='textbox']")
      ) {
        // User clicked the tweet button to post
        console.log(event.target);
        console.log(event.target.value);

        reactToPost();
      }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      updateStatsUI();
    });

    // a timer of the time that the user is spending on the website
  });
}

init();
