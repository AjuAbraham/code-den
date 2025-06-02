import { useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { useState } from "react";
import { CircleX, Send } from "lucide-react";
import stateStore from "../store/stateStore";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { submitSolution } from "../lib/axios";
const CreateSolution = () => {
  const { id } = useParams();
  const { tags } = stateStore();
  const [addTags, setAddedTags] = useState([]);
  const { state } = useLocation();
  const code = state.code;
  const skeleton = `# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->

# Approach
<!-- Describe your approach to solving the problem. -->

# Complexity
- Time complexity:  
<!-- Add your time complexity here, e.g. $$O(n)$$ -->

- Space complexity:  
<!-- Add your space complexity here, e.g. $$O(n)$$ -->

# Code
\`\`\`cpp []
${code || ""}
\`\`\`
`;
  const navigate = useNavigate();
  const [markdownVal, setMarkdownVal] = useState(skeleton);
  const [title, setTitle] = useState("");
  const handleAdd = (tag) => {
    console.log(tag);
    setAddedTags((prev) => [...prev, tag]);
  };
  const handleRemove = (tag) => {
    setAddedTags((prev) => prev.filter((prevTag) => prevTag !== tag));
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => submitSolution(formData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Successfully created solution");
        navigate(-1);
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const handleSubmit = () => {
    const payload = {
      tags,
      content: markdownVal,
      problemId: id,
      title,
    };
    mutate(payload);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] px-8 pb-4">
      <div className="w-full py-4 px-2 flex justify-between items-center gap-4 border-b border-slate-700">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title"
          className="flex-1 px-4 py-2 rounded-md text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("../", { replace: true })}
            className="px-4 py-2 text-gray-100 bg-gray-500 rounded-lg hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={title.length === 0}
            onClick={handleSubmit}
            className="flex items-center disabled:bg-green-900 gap-2 px-4 py-2 hover:bg-green-400 text-white rounded-md bg-green-500  transition-colors"
          >
            {isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Post
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 max-w-[30%]">
        <label className="label">Tags</label>
        <select
          className="select select-bordered w-full"
          onChange={(e) => handleAdd(e.target.value)}
        >
          <option disabled selected>
            Select Tags
          </option>
          {tags?.map((tag, i) => (
            <option key={i} value={tag.toLowerCase()}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap mb-2 mt-2 gap-2">
        {addTags.map((tag) => (
          <div key={tag} className="badge badge-outline gap-1">
            {tag}
            <CircleX
              className="w-4 text-red-400 h-4 cursor-pointer"
              onClick={() => handleRemove(tag)}
            />
          </div>
        ))}
      </div>
      <div className="flex-1 ">
        <MarkdownEditor
          value={markdownVal}
          onChange={(value) => setMarkdownVal(value)}
          height="550px"
          visible
        />
      </div>
    </div>
  );
};

export default CreateSolution;
