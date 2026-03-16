import { ScrollArea } from "@/components/ui/scroll-area";
import { useGame } from "../../context/GameContext";
import PostCard from "../PostCard";
import PostCreator from "../PostCreator";

export default function FeedPanel() {
  const { state } = useGame();

  return (
    <div className="space-y-4">
      <PostCreator />
      <div className="space-y-3">
        {state.posts.length === 0 ? (
          <div
            className="glass rounded-xl p-8 text-center text-muted-foreground"
            data-ocid="feed.empty_state"
          >
            <p className="text-3xl mb-2">📱</p>
            <p>No posts yet. Create your first post above!</p>
          </div>
        ) : (
          state.posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
