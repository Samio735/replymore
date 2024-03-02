function filerPosts() {
  // get page url

  const url = window.location.href;
  chrome.storage.local.get(
    [
      "minViewsPerMinute",
      "maxTimePassed",
      "hideLikedPosts",
      "maxReplyCount",
      "hideLikedPosts",
      "hideViewsPerMinute",
      "activateFilterPosts",
    ],
    (data) => {
      const minViewsPerMinute = data.minViewsPerMinute || 0;
      const maxTimePassed = data.maxTimePassed || Infinity;
      const hideLikedPosts = data.hideLikedPosts || false;
      const maxReplyCount = data.maxReplyCount || Infinity;
      const hideViewsPerMinute = data.hideViewsPerMinute || false;
      console.log(
        "minViewsPerMinute",
        minViewsPerMinute,
        "maxTimePassed",
        maxTimePassed,
        "hideLikedPosts",
        hideLikedPosts,
        "maxReplyCount",
        maxReplyCount,
        "hideLikedPosts",
        hideLikedPosts,
        "hideViewsPerMinute",
        hideViewsPerMinute,
        "activateFilterPosts",
        data.activateFilterPosts
      );
      const posts = document.querySelectorAll("article");
      posts.forEach((post) => {
        if (post.querySelector("#views-per-minute")) return;
        const postStatsEl = post.querySelector('[role="group"]');
        const statsText = postStatsEl?.getAttribute("aria-label") || "";
        if (!statsText) return;
        const statsArray = statsText.split(", ");
        // get the number of likes, retweets, and quote tweets and replies
        let likes = 0;
        let retweets = 0;
        let views = 0;
        let replies = 0;
        let liked = false;
        statsArray.forEach((stat) => {
          if (stat.includes("likes") || stat.includes("like")) {
            likes = parseInt(stat);
          } else if (stat.includes("retweet") || stat.includes("retweet")) {
            retweets = parseInt(stat);
          } else if (stat.includes("reply") || stat.includes("replies")) {
            replies = parseInt(stat);
          } else if (stat.includes("views") || stat.includes("view")) {
            views = parseInt(stat);
          } else if (stat.includes("Liked")) {
            liked = true;
          }
        });
        console.log("likes", likes, "retweets", retweets, "replies", replies);
        // hide liked posts on lists and communities
        if (
          (url.includes("https://twitter.com/i/lists") ||
            url.includes("https://twitter.com/i/communities") ||
            url.includes("https://twitter.com/home")) &&
          liked &&
          hideLikedPosts
        ) {
          post.remove();
        }

        const timeEl = post.querySelector("time");
        if (!timeEl) return;
        const time = timeEl?.getAttribute("datetime") || "";
        const timePassed = getTimePassed(time);
        const timePassedInMinutes = timePassed / 1000 / 60;

        const viewsPerMinute = Math.round(views / timePassedInMinutes);
        post.style.position = "relative";
        if (!hideViewsPerMinute) {
          const vewsPerMinuteEl = document.createElement("div");
          vewsPerMinuteEl.id = "views-per-minute";
          vewsPerMinuteEl.innerHTML = viewsPerMinute + " views / min";
          vewsPerMinuteEl.classList.add("views-per-minute");
          vewsPerMinuteEl.style.fontFamily =
            " BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;";
          vewsPerMinuteEl.style.position = "absolute";
          vewsPerMinuteEl.style.top = "0";
          vewsPerMinuteEl.style.right = "4rem";
          vewsPerMinuteEl.style.color = "blue";
          if (viewsPerMinute > 20) vewsPerMinuteEl.style.color = "green";
          if (viewsPerMinute > 40) vewsPerMinuteEl.style.color = "gold";
          if (viewsPerMinute > 60) vewsPerMinuteEl.style.color = "orange";
          if (viewsPerMinute > 100) vewsPerMinuteEl.style.color = "red";
          // vewsPerMinuteEl.style.color = "white";
          vewsPerMinuteEl.style.padding = "5px";
          vewsPerMinuteEl.style.borderBottomLeftRadius = "10px";
          vewsPerMinuteEl.style.borderBottomRightRadius = "10px";
          vewsPerMinuteEl.style.fontFamily = "Arial, sans-serif";
          vewsPerMinuteEl.style.fontWeight = "bold";
          if (viewsPerMinute) post.appendChild(vewsPerMinuteEl);
        }
        if (!data.activateFilterPosts) return;
        if (
          url.includes("https://twitter.com/home") ||
          url.includes("https://twitter.com/explore") ||
          url.includes("https://twitter.com/i/lists") ||
          url.includes("https://twitter.com/i/communities")
        ) {
          if (viewsPerMinute < minViewsPerMinute) {
            post.remove();
          } else if (
            timePassedInMinutes / 60 > maxTimePassed ||
            replies > maxReplyCount
          ) {
            if (url.includes("https://twitter.com/home")) {
              post.remove();
            }
            post.style.opacity = "0";
            // if (timePassedInMinutes > 60 * 10) {
            //   post.style.opacity = "0";
            // }
          }
        }
      });
    }
  );
}

function getTimePassed(time) {
  const currentTime = new Date();
  const postTime = new Date(time);
  const timePassed = currentTime - postTime;
  return timePassed;
}
function init() {
  chrome.storage.local.get(["paid", "trial"], (data) => {
    if (!data.paid && !data.trial) return;

    setTimeout(setInterval(filerPosts, 500), 2000);
  });
}

init();
