import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useGame } from "../context/GameContext";
import type { Post } from "../types/game";

const TYPE_CONFIG: Record<
  Post["type"],
  { emoji: string; label: string; placeholder: string }
> = {
  text: { emoji: "📝", label: "Text", placeholder: "What's on your mind?" },
  meme: { emoji: "😂", label: "Meme", placeholder: "Meme caption here..." },
  selfie: {
    emoji: "🤳",
    label: "Selfie",
    placeholder: "Caption your selfie...",
  },
  video: { emoji: "🎬", label: "Video", placeholder: "Describe your video..." },
};

export default function PostCreator() {
  const { state, submitPost } = useGame();
  const [activeType, setActiveType] = useState<Post["type"]>("text");
  const [content, setContent] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handlePost = () => {
    if (!content.trim()) return;
    setPosting(true);
    submitPost(activeType, content, videoTitle, selectedHashtags);
    setTimeout(() => {
      setContent("");
      setVideoTitle("");
      setSelectedHashtags([]);
      setPosting(false);
    }, 500);
  };

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{state.avatar}</span>
        <div>
          <p className="font-bold text-sm">{state.username}</p>
          {state.verifiedBadge && (
            <span className="text-xs text-blue-400">✓ Verified</span>
          )}
        </div>
      </div>

      <Tabs
        value={activeType}
        onValueChange={(v) => setActiveType(v as Post["type"])}
      >
        <TabsList className="w-full bg-secondary/50">
          {(
            Object.entries(TYPE_CONFIG) as [
              Post["type"],
              (typeof TYPE_CONFIG)[Post["type"]],
            ][]
          ).map(([type, cfg]) => (
            <TabsTrigger
              key={type}
              value={type}
              className="flex-1 text-xs"
              data-ocid="post.type.tab"
            >
              {cfg.emoji} {cfg.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(
          Object.entries(TYPE_CONFIG) as [
            Post["type"],
            (typeof TYPE_CONFIG)[Post["type"]],
          ][]
        ).map(([type, cfg]) => (
          <TabsContent key={type} value={type} className="space-y-2 mt-2">
            {type === "selfie" && (
              <div className="text-4xl text-center py-2">🤳📸</div>
            )}
            {type === "video" && (
              <Input
                placeholder="Video title..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="bg-secondary/50 border-border text-sm"
              />
            )}
            <Textarea
              placeholder={cfg.placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-secondary/50 border-border resize-none text-sm"
              rows={3}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div>
        <p className="text-xs text-muted-foreground mb-1.5">
          📈 Trending Hashtags
        </p>
        <div className="flex flex-wrap gap-1.5">
          {state.trendingHashtags.slice(0, 6).map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleHashtag(tag)}
              className={`text-xs px-2 py-1 rounded-full border transition-all ${
                selectedHashtags.includes(tag)
                  ? "bg-primary/30 border-primary text-primary"
                  : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedHashtags.length > 0 && (
          <p className="text-xs text-primary mt-1">
            +{selectedHashtags.length * 5}% viral chance!
          </p>
        )}
      </div>

      <Button
        onClick={handlePost}
        disabled={!content.trim() || posting}
        className="w-full font-bold"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.28 310), oklch(0.7 0.25 200))",
        }}
        data-ocid="post.creator.submit_button"
      >
        {posting ? "🚀 Posting..." : "📤 Post It!"}
      </Button>
    </div>
  );
}
