import { useState } from 'react';
import axios from 'axios';
import { usePostContext } from '../Context/postcontext.jsx';
import { toast } from 'react-toastify';
import axiosInstance from '../config/axiosinstance.jsx'; // Adjust the import path as necessary

const PostForm = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { addPost } = usePostContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axiosInstance.post(
        'posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addPost(res.data.post); // update context
      toast.success('Post created!');
      setContent('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading || !content.trim()}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostForm;
