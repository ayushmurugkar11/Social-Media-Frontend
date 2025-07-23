import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [fetched, setFetched] = useState(false); // prevents re-fetch

  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const setAllPosts = (allPosts) => {
    setPosts(allPosts);
    setFetched(true);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, setAllPosts, fetched }}>
      {children}
    </PostContext.Provider>
  );
};
