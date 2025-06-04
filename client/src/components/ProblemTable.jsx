import { Link, useLocation } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon } from "lucide-react";
import authStore from "../store/authStore.js";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  deleteProblemFromList,
  deleteProblemFromPlaylist,
} from "../lib/axios.js";
const ProblemTable = ({ problemList = [], playlistId }) => {
  const { authUser } = authStore();
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
      toast.success("Problem Delted Successfully");
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
      toast.success("Problem Delted Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const isSheetPage = pathname.includes("/sheets");
  return (
    <div className="w-full  mt-6">
      <div className="overflow-x-auto rounded-xl shadow-lg bg-base-100">
        <table className="table table-lg text-base-content">
          <thead className="bg-base-300 text-base font-semibold">
            <tr>
              <th className="px-4 py-3">Solved</th>
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
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge badge-sm bg-warning/20 text-warning font-medium border-none"
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 mi py-2">
                      <div className="flex flex-wrap gap-1">
                        {(problem.companies || []).map((company, idx) => (
                          <span
                            key={idx}
                            className="badge badge-sm bg-info/20 text-info font-medium border-none"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`badge badge-sm font-bold border-0 ${
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
                                console.log("here");
                                !isSheetPage
                                  ? deleteProblemFromListMutate(problem.id)
                                  : deleteProblemFromPlaylistMutate(problem.id);
                              }}
                              className="btn btn-sm btn-error btn-circle"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            {!isSheetPage ? (
                              <button
                                className="btn btn-sm btn-warning btn-circle"
                                disabled
                              >
                                <PencilIcon className="w-4 h-4 text-white" />
                              </button>
                            ) : null}
                          </>
                        )}
                        {!isSheetPage ? (
                          <button className="btn btn-sm btn-outline btn-circle">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
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
            className="join-item btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>
          <button className="join-item btn btn-sm btn-disabled">
            Page {currentPage} of {totalPages || 1}
          </button>
          <button
            className="join-item btn btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemTable;
