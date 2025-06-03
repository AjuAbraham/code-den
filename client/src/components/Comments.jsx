import moment from "moment";

const Comments = ({ comment }) => {
  console.log("comments", comment);
  return (
   <div className="relative pl-6 border-l border-slate-700">
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4 shadow-md">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        <img
          src={
            comment.user.avatar ||
            "https://avatar.iran.liara.run/public/boy"
          }
          alt="User Avatar"
          className="h-10 w-10 rounded-full object-cover border border-slate-700"
        />
        <span className="text-base font-semibold text-slate-100">
          {comment.user.username || "Guest"}
        </span>
      </div>
      <p className="text-sm text-gray-400">
        {moment(comment.createdAt).format("MMM D, YYYY")}
      </p>
    </div>
    <p className="text-slate-200 ml-2">{comment.content}</p>
  </div>
</div>

  );
};

export default Comments;
