import { ThumbsUp, MessageCircle } from "lucide-react";
import moment from "moment";

const formatLikes = (count) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + "k";
  return count.toString();
};

const SolutionList = ({ solutions }) => {
  return (
    <div className="p-1 grid gap-4">
      {solutions.map((sol) => (
        <div
          key={sol.id}
          className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-primary cursor-pointer transition"
          onClick={() => window.location.href = `/solutions/${sol.id}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-white">{sol.title}</h2>
            <span className="text-xs text-slate-400">
              {moment(sol.createdAt).fromNow()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs mb-3">
            {sol.tags.slice(0, 5).map((tag, i) => (
              <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {sol.tags.length > 5 && (
              <span className="text-slate-400">+{sol.tags.length - 5} more</span>
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
  );
};

export default SolutionList;
