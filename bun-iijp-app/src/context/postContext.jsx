import { createContext, useState, useContext, useEffect } from "react";
import PostService from "../services/PostService";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    obtenerPosts();
  }, []);

  const obtenerPosts = async () => {
    try {
      const { data } = await PostService.obtenerPublicaciones();
      setPosts(data);
    } catch (err) {
      console.error("Existe un error:", err);
      setPosts([]);
    }
  };

  const valor = { posts, setPosts , obtenerPosts };

  return <PostContext.Provider value={valor}>{children}</PostContext.Provider>;
};

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
}
