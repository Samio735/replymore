let inserted = false;
function updatePostCountUI(postCount) {
  const followersEL = document.querySelector(
    `a[href="/${userId}/verified_followers"]`
  );
  if (!followersEL) return;
  if (inserted) {
    document.getElementById(
      "replies-count"
    ).innerHTML = `<span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${postCount}</span></span><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-n6v787 r-fxxt2n" style="text-overflow: unset; color: rgb(139, 152, 165);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;"> Replies</span></span>`;
    return;
  }
  console.log("inserted");
  followersEL.classList.add("r-le9fof");
  followersEL.parentElement.insertAdjacentHTML(
    "afterend",
    `<div class="css-175oi2r"><a href="twitter.com/Samyrahim7" id="replies-count" dir="ltr" role="link" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-hjklzo r-16dba41 r-1loqt21" style="text-overflow: unset; color: rgb(247, 249, 249);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-n6v787 r-fxxt2n r-b88u0q" style="text-overflow: unset; color: rgb(247, 249, 249);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-n6v787 r-fxxt2n r-b88u0q" style="text-overflow: unset; color: rgb(247, 249, 249);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${postCount}</span></span><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-n6v787 r-fxxt2n" style="text-overflow: unset; color: rgb(139, 152, 165);"><span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;"> Replies</span></span></a></div>`
  );
  inserted = true;
}

let postCount = chrome.storage.sync.get("postCount", (data) => {
  postCount = data.postCount || 0;
});

let todayCount = chrome.storage.sync.get("todayCount", (data) => {
  todayCount = data.todayCount || 0;
});

function createStatsElement() {
  const statsElement = document.createElement("div");
  statsElement.id = "post-stats";
  statsElement.style.position = "fixed";
  statsElement.style.top = "0";
  statsElement.style.right = "0";
  statsElement.style.padding = "10px";
  statsElement.style.backgroundColor = "rgb(29, 155, 240)";
  statsElement.style.color = "#ffffff";
  statsElement.style.fontFamily = "Arial, sans-serif";
  statsElement.style.fontSize = "14px";
  statsElement.style.fontWeight = "bold";
  statsElement.style.zIndex = "9999";
  statsElement.style.display = "flex";
  statsElement.style.alignItems = "center";
  statsElement.style.gap = "5px";
  statsElement.style.borderBottomLeftRadius = "10px";

  document.body.prepend(statsElement);
}

function updateStatsElement() {
  chrome.storage.sync.get(["postCount", "countDays", "todayCount"], (data) => {
    const statsElement = document.getElementById("post-stats");
    const dailyAverage = (data.postCount / data.countDays).toFixed(2);
    statsElement.innerHTML =
      // Replace with actual daily average of posts and comments
      `<span><svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1qtyvf0 r-o4n3w5" style="color: rgb(255, 255, 255); margin-right:2px;"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path></g></svg></span>  Today : ${data.todayCount}   | Avg : ${dailyAverage} / day `;
  });
}

async function requestPlaySound() {
  const response = await chrome.runtime.sendMessage({ action: "playAudio" });
}

// Add event listener for detecting comment or post activity
document.addEventListener("click", function (event) {
  if (
    event.target.closest('[data-testid="tweetButtonInline"]') ||
    event.target.closest('[data-testid="tweetButton"]') ||
    event.target.closest('[data-testid="reply"]')
  ) {
    // User clicked the tweet button to post
    playAudio();
    chrome.storage.sync.get(["postCount", "todayCount"], (data) => {
      postCount = data.postCount || 0;
      postCount++;
      todayCount = data.todayCount || 0;
      todayCount++;
      chrome.storage.sync.set({ postCount: postCount, todayCount: todayCount });
      updateStatsElement();
      updatePostCountUI(postCount);
    });
  }
});

let userId;
chrome.storage.sync.get("userId", (data) => {
  userId = data.userId;
  console.log(userId);
});
console.log(userId);

// check if the day has changed
const today = new Date().toLocaleDateString();
chrome.storage.sync.get(["currentDay", "countDays"], (data) => {
  (!data.countDays || data.countDays == 0) && (data.countDays = 1);
  if (data.currentDay !== today) {
    chrome.storage.sync.set({
      currentDay: today,
      todayCount: 0,
      countDays: data.countDays + 1,
    });
  }
});

chrome.storage.sync.get("postCount", (data) => {
  let postCount = data.postCount || 0;
  createStatsElement();
  updateStatsElement(postCount);
});

// Select the followers element and update the text

setTimeout(() => {
  setInterval(() => {
    chrome.storage.sync.get("postCount", (data) => {
      let postCount = data.postCount || 0;
      updatePostCountUI(postCount);
    });
  }, 100);
}, 200);

const audio = new Audio(chrome.runtime.getURL("Ding.mp3"));

// Function to play the audio
function playAudio() {
  audio.play();
}

// update stats and post count on storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.postCount) {
    updateStatsElement();
    updatePostCountUI(changes.postCount.newValue);
  }
});

// update user id on storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.userId) {
    userId = changes.userId.newValue;
  }
});
