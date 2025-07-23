import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePostContext } from '../Context/postcontext.jsx';

const CACHE_KEY = 'postsCache';
const CACHE_TIME_KEY = 'postsCacheTime';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms

const FeedList = () => {
  const { posts, setAllPosts, fetched } = usePostContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fetched) return; // already fetched once

    const getCachedPosts = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      if (cached && cachedTime) {
        const age = Date.now() - Number(cachedTime);
        if (age < CACHE_DURATION) {
          try {
            return JSON.parse(cached);
          } catch {
            return null;
          }
        }
      }
      return null;
    };

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllPosts(res.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    const cachedPosts = getCachedPosts();
    if (cachedPosts) {
      setAllPosts(cachedPosts);
    } else {
      fetchPosts();
    }

    // Set up timer to refresh cache after 10 minutes
    const timer = setTimeout(() => {
      fetchPosts();
    }, CACHE_DURATION);

    return () => clearTimeout(timer);
  }, [fetched, setAllPosts]);

  if (loading) return <p>Loading feed...</p>;
  if (!posts.length) return <p className="text-muted">No posts yet.</p>;

  return (
    <div className="list-group">
      {posts.map((post) => (
        <div key={post._id} className="list-group-item mb-3 border rounded position-relative">
          <h6 className="mb-1">{post.author?.email || 'Unknown User'}</h6>
          <p className="mb-1">{post.content}</p>
          <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
          <div
            className="d-flex align-items-center position-absolute"
            style={{ bottom: 10, right: 15 }}
          >
            <button
              type="button"
              className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
              style={{ width: 90, height: 30, fontSize: '1rem', padding: 0, marginRight: 10 }}
              onClick={async () => {
                const token = localStorage.getItem('authToken');
                try {
                  if (!post.likedByCurrentUser) {
                    await axios.post(
                      'http://localhost:5000/api/likes',
                      { postId: post._id },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                  } else {
                    await axios.delete(
                      'http://localhost:5000/api/likes',
                      {
                        headers: { Authorization: `Bearer ${token}` },
                        data: { postId: post._id }
                      }
                    );
                  }
                  // Refetch posts after like/unlike and update cache
                  const res = await axios.get('http://localhost:5000/api/posts', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setAllPosts(res.data);
                  localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
                  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
                } catch (err) {
                  console.error('Error updating like:', err.message);
                }
              }}
            >
              <span
                className="me-2"
                style={{
                  color: post.likedByCurrentUser ? 'blue' : 'black',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                &#128077;
              </span>
              {post.likedByCurrentUser ? 'Unlike' : 'Like'}
            </button>
            <span>{typeof post.likes === 'number' ? post.likes : 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedList;
