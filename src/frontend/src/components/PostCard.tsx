import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Reply, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import { formatFollowers } from "../lib/gameEngine";
import type { Comment, Post } from "../types/game";

const TYPE_EMOJI: Record<Post["type"], string> = {
  text: "📝",
  meme: "😂",
  selfie: "🤳",
  video: "🎬",
};

const COMMENT_COLORS: Record<Comment["type"], string> = {
  fan: "text-pink-400",
  positive: "text-green-400",
  neutral: "text-muted-foreground",
  troll: "text-orange-400",
};

export default function PostCard({ post }: { post: Post }) {
  const { deleteComment, replyToComment } = useGame();
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const isRival = post.authorId !== "player";
  const visibleComments = post.comments.filter((c) => !c.deleted);

  const submitReply = (commentId: string) => {
    if (!replyText.trim()) return;
    replyToComment(post.id, commentId, replyText);
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div
      className={`glass rounded-xl p-4 space-y-3 ${post.isViral ? "ring-1 ring-primary/50" : ""} ${isRival ? "opacity-90" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{post.authorAvatar}</span>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">{post.authorName}</span>
              {isRival && (
                <span className="text-xs text-red-400 bg-red-400/10 px-1 rounded">
                  Rival
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {TYPE_EMOJI[post.type]} {post.type} •{" "}
              {new Date(post.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
        {post.isViral && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full viral-flash"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.25 25), oklch(0.7 0.2 55))",
              color: "white",
            }}
          >
            🔥 VIRAL
          </span>
        )}
      </div>

      {post.title && <p className="font-bold text-sm">{post.title}</p>}
      <p className="text-sm">{post.content}</p>

      {post.hashtags.length > 0 && (
        <p className="text-xs text-primary">{post.hashtags.join(" ")}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-2">
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-400" />
          {formatFollowers(post.likes)}
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="w-3 h-3 text-cyan-400" />
          {formatFollowers(post.shares)}
        </span>
        <button
          type="button"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-3 h-3" />
          {visibleComments.length} comments
        </button>
        {!isRival && post.followersGained !== 0 && (
          <span
            className={
              post.followersGained > 0 ? "text-green-400" : "text-red-400"
            }
          >
            {post.followersGained > 0 ? "+" : ""}
            {formatFollowers(post.followersGained)} followers
          </span>
        )}
      </div>

      {showComments && (
        <div className="space-y-2 pt-1">
          {visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-secondary/30 rounded-lg p-2 space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium">{comment.author}</span>
                  <p className={`text-xs ${COMMENT_COLORS[comment.type]}`}>
                    {comment.text}
                  </p>
                  {comment.reply && (
                    <p className="text-xs text-cyan-400 mt-1">
                      💬 {comment.reply}
                    </p>
                  )}
                </div>
                {!isRival && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id,
                        )
                      }
                      className="text-muted-foreground hover:text-foreground p-1"
                      title="Reply"
                    >
                      <Reply className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteComment(post.id, comment.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              {replyingTo === comment.id && (
                <div className="flex gap-1 mt-1">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Your reply..."
                    className="h-7 text-xs bg-secondary/50"
                    onKeyDown={(e) =>
                      e.key === "Enter" && submitReply(comment.id)
                    }
                  />
                  <Button
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => submitReply(comment.id)}
                  >
                    Send
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
