import { createContext, useState, useContext, useEffect } from "react";
import PostService from "../services/PostService";
import type { ContextProviderProps } from "../types";
interface Post {
  id: number;
  name: string;
  user: number;
}

interface ValueContextType {
  posts: Post[] | undefined;
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>;
  obtenerPosts: () => Promise<void>;
}

export const PostContext = createContext<ValueContextType | undefined>(
  undefined
);

export const PostContextProvider = ({ children }: ContextProviderProps) => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);

  useEffect(() => {
    obtenerPosts();
  }, []);

  const obtenerPosts = async (): Promise<void> => {
    try {
      const { data } = await PostService.obtenerPublicaciones();
      setPosts(data);
    } catch (err) {
      console.error("Existe un error:", err);
      setPosts([]);
    }
  };

  const valor: ValueContextType = { posts, setPosts, obtenerPosts };

  return <PostContext.Provider value={valor}>{children}</PostContext.Provider>;
};

export function usePostContext(): ValueContextType {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
}
