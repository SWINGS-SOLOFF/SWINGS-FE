export const processFeed = (feed) => ({
  ...feed,
  liked: feed.liked || false,
  likes: feed.likes ?? feed.likeCount ?? 0,
  comments: (feed.comments ?? []).map((c) => ({
    ...c,
    username: c.username ?? "익명",
    userProfilePic: c.userProfilePic ?? null,
  })),
  username: feed.username ?? "익명",
  userProfilePic: feed.userProfilePic ?? null,
});
