import moment from "moment";
import { ThumbsUp, MessageCircle, ChevronLeft } from "lucide-react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Comments from "./Comments";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createComment, likeSolution } from "../lib/axios";
import { toast } from "react-hot-toast";
const SolutionPreview = ({ solution, setSolutionId, refetch }) => {
  const {
    title,
    tags,
    content,
    createdAt,
    likes,
    solutionDiscussion = [],
  } = solution;
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(solution.isLiked);
  const formatLikes = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count?.toString();
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => createComment(formData),
    onSuccess: (data) => {
      if (data.success) {
        setNewComment("");
        refetch();
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const { mutate: likeMutate } = useMutation({
    mutationFn: (solutionId) => likeSolution(solutionId),
    onSuccess: (data) => {
      if (data.success) {
        setNewComment("");
        refetch();
      }
    },
    onError: (error) => {
      setLiked((prev) => !prev);
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  return (
    <div className=" space-y-6 text-white">
      <p
        onClick={() => setSolutionId(null)}
        className="text-white cursor-pointer flex items-center gap-1 font-semibold text-lg hover:text-orange-400 transition"
      >
        <ChevronLeft className="w-6 h-6" />
        Solutions
      </p>

      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="text-sm text-slate-400 mt-1">
          <span className="font-bold mr-1">Posted On </span>{" "}
          {moment(createdAt).format("MM/DD/YYYY")}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full hover:text-orange-400 hover:border-orange-400 border border-slate-900"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose prose-invert  bg-slate-900 border border-slate-700 rounded-lg  overflow-x-auto">
        <MarkdownPreview source={content} className="p-4" />
      </div>
      <div className="flex items-center ml-2 gap-6 text-slate-300">
        <div
          className="flex items-center gap-1 group cursor-pointer"
          onClick={() => {
            setLiked(!liked);
            likeMutate(solution.id);
          }}
          title={liked ? "Unlike" : "Like"}
        >
          <span className="font-bold mr-1">Likes:</span>
          <ThumbsUp
            className={`w-4 h-4 transition-all duration-150 ${
              liked ? "text-orange-400" : "text-slate-400"
            } group-hover:scale-110`}
          />
          <span className="transition-colors">{formatLikes(likes.length)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold mr-1">Comments: </span>
          <MessageCircle className="w-4 h-4" />
          <span>{solutionDiscussion.length}</span>
        </div>
      </div>
      <div className="mb-6">
        <textarea
          className="w-full bg-slate-800 text-white border border-slate-600 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows={3}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="text-end mt-2">
          <button
            onClick={() => {
              const payload = {
                content: newComment,
                solutionId: solution.id,
              };
              mutate(payload);
            }}
            className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            disabled={!newComment.trim() || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : null}
            Post
          </button>
        </div>
      </div>
      <div className="mt-6 border-t border-slate-700 pt-4">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        {solutionDiscussion.length === 0 && (
          <p className="text-slate-400 text-sm">No comments yet.</p>
        )}
        {solutionDiscussion.map((comment) => (
          <Comments key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default SolutionPreview;
