const audio = new Audio("Ding.mp3");

// Function to play the audio
function playAudio() {
  audio.play();
}

// Load the stored comment count on extension startup
let commentCount = 0;
chrome.storage.sync.get("commentCount", (data) => {
  commentCount = data.commentCount || 0;
});

// Listen for messages from content script indicating a comment was posted
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "commentPosted") {
    // Increment comment count
    commentCount++;
    // Save updated count to storage
    chrome.storage.sync.set({ commentCount: commentCount });
  }
  if (message.action === "playAudio") {
    playAudio();
  }
});

// Function to retrieve comment count
function getCommentCount() {
  return commentCount;
}
