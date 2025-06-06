import { useMemo, useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import moment from "moment";

const formatLikes = (count) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return count.toString();
};

const SolutionList = ({ solutions, setSolutionId, onCreate }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [tagFilterOpen, setTagFilterOpen] = useState(false);

  const allTags = useMemo(() => {
    const seen = new Set();
    const tags = [];
    solutions.forEach((sol) => {
      sol.tags.forEach((tag) => {
        const key = tag.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          tags.push(tag.trim());
        }
      });
    });
    return tags;
  }, [solutions]);

  const filteredSolutions = useMemo(() => {
    return solutions.filter((sol) => {
      const matchesSearch = sol.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesTag = !selectedTag || sol.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [solutions, searchText, selectedTag]);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">All Solutions</h1>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
        {/* Search Input */}
        <div className="flex items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none border border-slate-600 focus:border-primary"
            />
          </div>
          <button
            onClick={() => setTagFilterOpen(!tagFilterOpen)}
            className="flex items-center text-sm text-slate-300 hover:text-white transition"
          >
            {tagFilterOpen ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Tags
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Tags
              </>
            )}
          </button>
        </div>
        {tagFilterOpen && (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-3 py-1 text-sm rounded-full border ${
                !selectedTag
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-700 text-slate-300 border-slate-600"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag, i) => (
              <button
                key={i}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  selectedTag === tag
                    ? "bg-primary text-white border-primary"
                    : "bg-slate-700 text-slate-300 border-slate-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredSolutions.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          No solutions found.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-primary cursor-pointer transition"
              onClick={() => setSolutionId(sol.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold text-white">
                  {sol.title}
                </h2>
                <span className="text-xs text-slate-400">
                  {moment(sol.createdAt).fromNow()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs mb-3">
                {sol.tags.slice(0, 5).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {sol.tags.length > 5 && (
                  <span className="text-slate-400">
                    +{sol.tags.length - 5} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-slate-300 text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatLikes(sol.likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{sol.solutionDiscussion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionList;
