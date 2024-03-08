let filter = 5;
let timout = true;
function filterPosts() {
  console.log("filterPosts");
  // get page url
  if (filter < 0) return;
  if (!timout) return;
  filter = filter - 1;
  setTimeout(() => {
    timout = true;
  }, 50);
  timout = false;
  setTimeout(() => {
    filter = 5;
  }, 500);
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
      console.log("data", data);
      const minViewsPerMinute = data.minViewsPerMinute || 0;
      const maxTimePassed = data.maxTimePassed || Infinity;
      const hideLikedPosts = data.hideLikedPosts || false;
      const maxReplyCount = data.maxReplyCount || Infinity;
      const hideViewsPerMinute = data.hideViewsPerMinute || false;
      // console.log(
      //   "minViewsPerMinute",
      //   minViewsPerMinute,
      //   "maxTimePassed",
      //   maxTimePassed,
      //   "hideLikedPosts",
      //   hideLikedPosts,
      //   "maxReplyCount",
      //   maxReplyCount,
      //   "hideLikedPosts",
      //   hideLikedPosts,
      //   "hideViewsPerMinute",
      //   hideViewsPerMinute,
      //   "activateFilterPosts",
      //   data.activateFilterPosts
      // );
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
        // console.log("likes", likes, "retweets", retweets, "replies", replies);
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
    document.addEventListener("scroll", () => {
      getAndHideAds();
      filterPosts();
    });
  });

  new PerformanceObserver((entryList) => {
    filterPosts();
    getAndHideAds();
  }).observe({ type: "largest-contentful-paint", buffered: true });
}
init();
document.addEventListener("load", () => init());

var adsHidden = 0;
var adSelector = "div[data-testid=placementTracking]";
var trendSelector = "div[data-testid=trend]";
var userSelector = "div[data-testid=UserCell]";
var articleSelector = "article[data-testid=tweet]";

var sponsoredSvgPath =
  "M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z";
var sponsoredBySvgPath =
  "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z";
var youMightLikeSvgPath =
  "M12 1.75c-5.11 0-9.25 4.14-9.25 9.25 0 4.77 3.61 8.7 8.25 9.2v2.96l1.15-.17c1.88-.29 4.11-1.56 5.87-3.5 1.79-1.96 3.17-4.69 3.23-7.97.09-5.54-4.14-9.77-9.25-9.77zM13 14H9v-2h4v2zm2-4H9V8h6v2z";
var adsSvgPath =
  "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z";
var peopleFollowSvgPath =
  "M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z";
var xAd = ">Ad<";
var removePeopleToFollow = false;
const promotedTweetTextSet = new Set(["Promoted Tweet", "プロモツイート"]);

function getAds() {
  return Array.from(document.querySelectorAll("div")).filter(function (el) {
    var filteredAd;

    if (el.innerHTML.includes(sponsoredSvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(sponsoredBySvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(youMightLikeSvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(adsSvgPath)) {
      filteredAd = el;
    } else if (
      removePeopleToFollow &&
      el.innerHTML.includes(peopleFollowSvgPath)
    ) {
      filteredAd = el;
    } else if (el.innerHTML.includes(xAd)) {
      filteredAd = el;
    } else if (promotedTweetTextSet.has(el.innerText)) {
      // TODO: bring back multi-lingual support from git history
      filteredAd = el;
    }

    return filteredAd;
  });
}

function hideAd(ad) {
  if (ad.closest(adSelector) !== null) {
    // Promoted tweets
    ad.closest(adSelector).remove();
    adsHidden += 1;
  } else if (ad.closest(trendSelector) !== null) {
    ad.closest(trendSelector).remove();
    adsHidden += 1;
  } else if (ad.closest(userSelector) !== null) {
    ad.closest(userSelector).remove();
    adsHidden += 1;
  } else if (ad.closest(articleSelector) !== null) {
    ad.closest(articleSelector).remove();
    adsHidden += 1;
  } else if (promotedTweetTextSet.has(ad.innerText)) {
    ad.remove();
    adsHidden += 1;
  }

  console.log("Twitter ads hidden: ", adsHidden.toString());
}

function getAndHideAds() {
  getAds().forEach(hideAd);
}
