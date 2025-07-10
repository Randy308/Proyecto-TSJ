import { createContext, useContext } from "react";
interface Post {
  id: number;
  name: string;
  user: number;
}

export interface PostContextType {
  posts: Post[] | undefined;
  setPosts: React.Dispatch<React.SetStateAction<Post[] | undefined>>;
  obtenerPosts: () => Promise<void>;
}

export const PostContext = createContext<PostContextType | undefined>(
  undefined
);

export function usePostContext(): PostContextType {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
}
