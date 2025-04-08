import { useState, useEffect, useCallback, useRef } from "react";
import feedApi from "../api/feedApi";

const useFeed = (userId) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [stage, setStage] = useState("followings");

  const isValidUserId = typeof userId === "number" && !isNaN(userId);
  const didInitialFetch = useRef(false);

  const loadMorePosts = useCallback(async () => {
    if (!isValidUserId || fetchingMore || !hasMore || stage === "done") return;

    setFetchingMore(true);

    try {
      let data = [];
      let fetchOptions;
      let isMineStage = false;

      switch (stage) {
        case "followings":
          const followData = await feedApi.getFeeds(userId, page, 5, {
            sort: "latest",
            filter: "followings",
          });
          if (
            followData.length === 0 ||
            followData.every((p) => p.userId === userId)
          ) {
            // 팔로잉 게시물이 없거나, 결과가 모두 본인 게시물인 경우 -> 전체 피드로 이동
            setStage("all");
            setPage(0);
            return;
          }
          data = followData;
          break;
        case "all":
          const randomData = await feedApi.getFeeds(userId, page, 5, {
            sort: "random",
            filter: "all",
          });
          if (randomData.length === 0) {
            // 전체 피드에도 불러올 것이 없으면 -> 본인 피드로 이동
            setStage("mine");
            setPage(0);
            return;
          }
          // 팔로우한 유저의 게시물이 중복 포함된 경우 제외
          data = randomData;
          break;
        case "mine":
          const myData = await feedApi.getUserFeeds(userId, page, 5);
          if (myData.length === 0) {
            // 본인 피드도 더 불러올 것이 없음 -> 종료
            setStage("done");
            setHasMore(false);
            return;
          }
          data = myData;
          isMineStage = true;
          break;
      }
      // 중복된 feedId 제거 및 본인 게시물 필터링
      const newPosts = isMineStage
        ? data
        : data.filter((p) => p.userId !== userId);
      setPosts((prev) => {
        const merged = [...prev];
        newPosts.forEach((newPost) => {
          const index = merged.findIndex((p) => p.feedId === newPost.feedId);
          if (index === -1) {
            merged.push(newPost);
          } else {
            merged[index] = { ...merged[index], ...newPost };
          }
        });
        return merged;
      });
      // 다음 페이지 준비
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("❌ 피드 추가 로딩 실패", err);
    } finally {
      setFetchingMore(false);
    }
  }, [userId, page, stage, hasMore, fetchingMore]);

  const fetchInitialPosts = useCallback(async () => {
    if (!isValidUserId) return;
    setLoading(true);

    try {
      const data = await feedApi.getFeeds(userId, 0, 5, {
        sort: "latest",
        filter: "followings",
      });

      if (data.length === 0) {
        setStage("all");
        setPage(0);
        setPosts([]);

        setTimeout(() => {
          loadMorePosts();
        }, 0);

        return;
      }

      setPosts(data);
      setPage(1);
      setHasMore(true);
    } catch (err) {
      console.error("❌ 초기 피드 로딩 실패", err);
    } finally {
      setLoading(false);
    }
  }, [userId, isValidUserId, loadMorePosts]);

  useEffect(() => {
    if (isValidUserId && !didInitialFetch.current) {
      didInitialFetch.current = true;
      fetchInitialPosts();
    }
  }, [isValidUserId, fetchInitialPosts]);

  return {
    posts,
    setPosts,
    fetchInitialPosts,
    loadMorePosts,
    hasMore,
    loading,
    fetchingMore,
    page,
    setPage,
  };
};

export default useFeed;
