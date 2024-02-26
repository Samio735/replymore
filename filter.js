function filerPosts() {
  // get page url

  const url = window.location.href;

  // if the page is the home page, a list or a community filter the posts

  const posts = document.querySelectorAll("article");
  posts.forEach((post) => {
    const postStatsEl = post.querySelector('[role="group"]');
    const statsText = postStatsEl.getAttribute("aria-label");
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
        //   } else if (stat.includes("Quote Tweet")) {
        //     quoteTweets = parseInt(stat);
      } else if (stat.includes("reply") || stat.includes("replies")) {
        replies = parseInt(stat);
      } else if (stat.includes("views") || stat.includes("view")) {
        views = parseInt(stat);
      } else if (stat.includes("liked")) {
        liked = true;
      }
    });

    // hide liked posts on lists and communities
    if (
      (url.includes("https://twitter.com/i/lists") ||
        url.includes("https://twitter.com/i/communities")) &&
      liked
    ) {
      post.style.display = "none";
    }

    const timeEl = post.querySelector("time");
    const time = timeEl.getAttribute("datetime");
    const timePassed = getTimePassed(time);
    const timePassedInMinutes = timePassed / 1000 / 60;

    const viewsPerMinute = Math.round(views / timePassedInMinutes);
    post.style.position = "relative";
    const vewsPerMinuteEl = document.createElement("div");
    vewsPerMinuteEl.innerHTML = viewsPerMinute + " views / min";
    vewsPerMinuteEl.style.position = "absolute";
    vewsPerMinuteEl.style.top = "0";
    vewsPerMinuteEl.style.right = "0";
    //   vewsPerMinuteEl.style.backgroundColor = "red";
    vewsPerMinuteEl.style.color = "red";
    vewsPerMinuteEl.style.padding = "5px";
    vewsPerMinuteEl.style.borderRadius = "5px";
    if (timePassedInMinutes / 60 < 24) post.appendChild(vewsPerMinuteEl);
    if (
      url.includes("https://twitter.com/home") ||
      url.includes("https://twitter.com/explore") ||
      url.includes("https://twitter.com/i/lists") ||
      url.includes("https://twitter.com/i/communities")
    ) {
      if (viewsPerMinute < 50) {
        post.style.display = "none";
      } else if (timePassedInMinutes > 60 * 5) {
        post.style.opacity = "0.7";
        if (timePassedInMinutes > 60 * 15) {
          post.style.opacity = "0";
        }
      }
    }
  });
}

function getTimePassed(time) {
  const currentTime = new Date();
  const postTime = new Date(time);
  const timePassed = currentTime - postTime;
  return timePassed;
}

setTimeout(setInterval(filerPosts, 500), 100);
