import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon } from "lucide-react";
import authStore from "../store/authStore.js";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  addProblemToPlaylsit,
  deleteProblemFromList,
  deleteProblemFromPlaylist,
} from "../lib/axios.js";
import AddToPlaylistModalOpen from "./AddToPlaylistModalOpen.jsx";

const ProblemTable = ({ problemList = [], playlistId }) => {
  const { authUser } = authStore();
  const navigate = useNavigate();
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(problemList.length / itemsPerPage);
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  const paginatedProblems = problemList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { mutate: deleteProblemFromListMutate } = useMutation({
    mutationFn: (id) => deleteProblemFromList(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getAllProblem"] });
      toast.success("Problem Deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const { mutate: deleteProblemFromPlaylistMutate } = useMutation({
    mutationFn: (problemId) =>
      deleteProblemFromPlaylist({ playlistId, problemIds: problemId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getOnePlaylist"] });
      toast.success("Problem Deleted Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const isSheetPage = pathname.includes("/sheets");

  return (
    <>
      <div className="w-full mt-6 h-[calc(100dvh-180px)] overflow-y-auto">
        <div className="overflow-x-auto rounded-xl shadow-lg bg-base-100">
          <table className="w-full text-[14px] text-base-content">
            <thead className="bg-base-300 text-[16px] font-semibold">
              <tr>
                {isSheetPage ? null : <th className="px-4 py-3">Solved</th>}
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Companies</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = problem.solvedBy?.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <tr
                      key={problem.id}
                      className="hover:bg-base-200 transition-colors duration-150"
                    >
                      {isSheetPage ? null : (
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={isSolved}
                            readOnly
                            className="checkbox w-5 h-5"
                          />
                        </td>
                      )}
                      <td className="px-4 py-2">
                        <Link
                          to={`/problem/${problem.id}`}
                          className="text-[14px] font-semibold hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge bg-yellow-500/20 text-yellow-600 text-[13px] font-medium border-none px-2 py-1"
                            >
                              {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {(problem.companies || []).map((company, idx) => (
                            <span
                              key={idx}
                              className="badge bg-blue-500/20 text-blue-600 text-[13px] font-medium border-none px-2 py-1"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`badge text-[13px] font-bold border-0 px-2 py-1 ${
                            problem.difficulty === "EASY"
                              ? "bg-green-100 text-green-600"
                              : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {authUser?.role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => {
                                  !isSheetPage
                                    ? deleteProblemFromListMutate(problem.id)
                                    : deleteProblemFromPlaylistMutate(
                                        problem.id
                                      );
                                }}
                                className="btn bg-red-600 hover:bg-red-700 text-white text-[13px] rounded-full px-4 py-2"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                              {!isSheetPage ? (
                                <button
                                  className="btn bg-purple-600 hover:bg-purple-700 text-white text-[13px] rounded-full px-4 py-2"
                                  onClick={() =>
                                    navigate(`./edit/${problem.id}`)
                                  }
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                              ) : null}
                            </>
                          )}
                          {!isSheetPage ? (
                            <button
                              className="btn border-slate-600 hover:border-primary text-slate-300 hover:text-white text-[13px] rounded-full px-4 py-2"
                              onClick={() => handleAddToPlaylist(problem.id)}
                            >
                              <Bookmark className="w-5 h-5" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 text-[16px]"
                  >
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6">
          <div className="join">
            <button
              className="join-item btn bg-slate-700 hover:bg-slate-600 text-white text-[14px] px-4 py-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            <button className="join-item btn bg-slate-700 text-white text-[14px] px-4 py-2 btn-disabled">
              Page {currentPage} of {totalPages || 1}
            </button>
            <button
              className="join-item btn bg-slate-700 hover:bg-slate-600 text-white text-[14px] px-4 py-2"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AddToPlaylistModalOpen
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </>
  );
};

export default ProblemTable;
