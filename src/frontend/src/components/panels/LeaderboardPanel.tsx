import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { formatFollowers, getLeaderboard } from "../../lib/gameEngine";

type SortKey = "followers" | "fame" | "hate";

export default function LeaderboardPanel() {
  const { state } = useGame();
  const [sortBy, setSortBy] = useState<SortKey>("followers");
  const leaderboard = getLeaderboard(state);

  const sorted = [...leaderboard]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="space-y-3">
      <h2 className="font-black text-xl gradient-text">🏆 Fame Leaderboard</h2>

      <div className="flex gap-2">
        {(["followers", "fame", "hate"] as SortKey[]).map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
              sortBy === key
                ? "bg-primary/30 text-primary"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {key === "followers"
              ? "👥 Most Followed"
              : key === "fame"
                ? "⭐ Fame"
                : "🔥 Controversial"}
          </button>
        ))}
      </div>

      <div
        className="glass rounded-xl overflow-hidden"
        data-ocid="leaderboard.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-xs w-10">#</TableHead>
              <TableHead className="text-xs">Creator</TableHead>
              <TableHead className="text-xs text-right">Followers</TableHead>
              <TableHead className="text-xs text-right">Fame</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((player) => {
              const isPlayer = player.username === state.username;
              return (
                <TableRow
                  key={player.username}
                  className={`border-border/30 ${isPlayer ? "bg-primary/10 font-bold" : ""}`}
                >
                  <TableCell className="text-xs font-mono">
                    {player.rank <= 3
                      ? ["", "🥇", "🥈", "🥉"][player.rank]
                      : player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{player.avatar}</span>
                      <span className="text-xs">{player.username}</span>
                      {isPlayer && (
                        <span className="text-xs text-primary">(You)</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-right text-cyan-400">
                    {formatFollowers(player.followers)}
                  </TableCell>
                  <TableCell className="text-xs text-right text-purple-400">
                    {player.fame}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
