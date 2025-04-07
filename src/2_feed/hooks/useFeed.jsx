import { useState, useEffect, useCallback, useRef } from "react";
import feedApi from "../api/feedApi";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

const useFeed = (userId, sortMethod, filterOption) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  const addCommentsToFeed = async (feedData) => {
    return Promise.all(
      feedData.map(async (post) => {
        const comments = await feedApi.getCommentsByFeedId(post.feedId);
        return {
          ...post,
          comments,
          showComments: false,
        };
      })
    );
  };

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      const options = { sort: sortMethod, filter: filterOption };
      const data = await feedApi.getFeeds(userId, 0, ITEMS_PER_PAGE, options);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      const sortedData =
        sortMethod === "random" ? shuffleArray([...data]) : data;
      const postsWithComments = await addCommentsToFeed(sortedData);

      setPosts(postsWithComments);
      setPage(1);
    } catch (err) {
      console.error("피드 초기 로딩 실패", err);
      toast.error("게시물을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || fetchingMore) return;
    try {
      setFetchingMore(true);
      const data = await feedApi.getFeeds(userId, page, ITEMS_PER_PAGE, {
        sort: sortMethod,
      });
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      const sortedData =
        sortMethod === "random" ? shuffleArray([...data]) : data;
      const postsWithComments = await addCommentsToFeed(sortedData);

      setPosts((prev) => [...prev, ...postsWithComments]);
      setPage((prev) => prev + 1);
    } catch (err) {
      toast.error("추가 게시물을 불러오지 못했습니다.");
    } finally {
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchInitialPosts();
    }
  }, [userId, sortMethod, filterOption]);

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
