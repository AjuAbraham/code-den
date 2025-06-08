import { Search, Filter, CircleX, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import ProblemTable from "./ProblemTable";
import CreatePlaylistModal from "./CreatePlaylistModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylist } from "../lib/axios";
import { toast } from "react-hot-toast";
import authStore from "../store/authStore";
const ProblemList = ({ problemList = [] }) => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [liveFilters, setLiveFilters] = useState({
    tags: [],
    companies: [],
    difficulty: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    tags: [],
    companies: [],
    difficulty: "",
    status: "",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { authUser } = authStore();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (formData) => createPlaylist(formData),
    onSuccess: () => {
      ["allSheets", "getAllProblem", "getOnePlaylist"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      return toast.success("Playlist Created Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const [tags, companies] = useMemo(() => {
    const tagsSet = new Set();
    const companiesSet = new Set();
    problemList.forEach((problem) => {
      problem.tags.map((tag) => tagsSet.add(tag));
      problem.companies.map((company) => companiesSet.add(company));
    });

    return [Array.from(tagsSet), Array.from(companiesSet)];
  }, [problemList]);

  const handleAdd = (type, value) => {
    if (type === "tag" && !liveFilters.tags.includes(value)) {
      setLiveFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, value],
      }));
    } else if (type === "company" && !liveFilters.companies.includes(value)) {
      setLiveFilters((prev) => ({
        ...prev,
        companies: [...prev.companies, value],
      }));
    }
  };

  const handleRemove = (type, value) => {
    if (type === "tag") {
      setLiveFilters((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== value),
      }));
    } else if (type === "company") {
      setLiveFilters((prev) => ({
        ...prev,
        companies: prev.companies.filter((company) => company !== value),
      }));
    }
  };

  const handleCreatePlaylist = async (data) => {
    mutate(data);
  };

  const handleApplyFilters = () => {
    // Apply live filters to applied filters
    setAppliedFilters(liveFilters);
    // Close the filter drawer
    document.getElementById("filter-drawer").checked = false;
  };

  const filteredProblemList = useMemo(
    () =>
      problemList.filter((problem) => {
        // Search text filter
        const matchesSearch = problem.title
          .toLowerCase()
          .includes(search.toLowerCase());

        // Tags filter: Include if no tags applied or problem has at least one applied tag
        const matchesTags =
          appliedFilters.tags.length === 0 ||
          appliedFilters.tags.some((tag) =>
            problem.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
          );

        // Companies filter: Include if no companies applied or problem has at least one applied company
        const matchesCompanies =
          appliedFilters.companies.length === 0 ||
          appliedFilters.companies.some((company) =>
            problem.companies
              .map((c) => c.toLowerCase())
              .includes(company.toLowerCase())
          );

        // Difficulty filter: Include if no difficulty applied or problem matches applied difficulty
        const matchesDifficulty =
          !appliedFilters.difficulty ||
          problem.difficulty?.toLowerCase() ===
            appliedFilters.difficulty.toLowerCase();

        const isSolved = problem.solvedBy?.some(
          (entry) => entry.userId === authUser?.id
        );

        const matchesStatus =
          !appliedFilters.status ||
          (appliedFilters.status.toLowerCase() === "solved" && isSolved) ||
          (appliedFilters.status.toLowerCase() === "unsolved" && !isSolved);

        // Return true only if all filters match
        return (
          matchesSearch &&
          matchesTags &&
          matchesCompanies &&
          matchesDifficulty &&
          matchesStatus
        );
      }),
    [
      problemList,
      search,
      appliedFilters.tags,
      appliedFilters.companies,
      appliedFilters.difficulty,
      appliedFilters.status,
    ]
  );
  return (
    <>
      <div className="drawer drawer-end">
        <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-6">
          <div className="p-4 flex items-center justify-between rounded-xl bg-gray-700">
            <h2 className="text-xl font-semibold">Problem List</h2>
            <div className="flex items-center gap-4">
              <label className="input input-bordered flex items-center gap-2 w-60">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={liveFilters.searchText}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label
                htmlFor="filter-drawer"
                className="btn btn-outline btn-square cursor-pointer"
              >
                <Filter className="w-5 h-5" />
              </label>
              <button
                className="btn btn-primary gap-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Playlist
              </button>
            </div>
          </div>
          {filteredProblemList.length > 0 ? (
            <ProblemTable problemList={filteredProblemList} />
          ) : (
            <div className="flex items-center justify-center mt-6">
              <img
                src="../src/assets/no_result.png"
                alt="no result found"
                className="w-80 h-80"
              />
            </div>
          )}
        </div>

        {/* Drawer */}
        <div className="drawer-side z-50">
          <label htmlFor="filter-drawer" className="drawer-overlay"></label>
          <div className="menu p-6 w-[30rem] min-h-full bg-base-100 space-y-4">
            <h3 className="text-lg font-bold mb-2">Filter Problems</h3>

            {/* Difficulty */}
            <div className="flex flex-col gap-3">
              <label className="label">Difficulty</label>
              <select
                className="select select-bordered w-full"
                value={liveFilters.difficulty}
                onChange={(e) =>
                  setLiveFilters((prev) => ({
                    ...prev,
                    difficulty: e.target.value,
                  }))
                }
              >
                <option value="">Select difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-3">
              <label className="label">Tags</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => handleAdd("tag", e.target.value)}
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
              <div className="flex flex-wrap mt-2 gap-2">
                {liveFilters.tags.map((tag) => (
                  <div key={tag} className="badge badge-outline gap-1">
                    {tag}
                    <CircleX
                      className="w-4 text-red-400 h-4 cursor-pointer"
                      onClick={() => handleRemove("tag", tag)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <label className="label">Company</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => handleAdd("company", e.target.value)}
              >
                <option disabled selected>
                  Select company
                </option>
                {companies?.map((company, i) => (
                  <option key={i} value={company.toLowerCase()}>
                    {company}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap mt-2 gap-2">
                {liveFilters.companies.map((company) => (
                  <div key={company} className="badge badge-outline gap-1">
                    {company}
                    <CircleX
                      className="w-4 h-4 text-red-400 cursor-pointer"
                      onClick={() => handleRemove("company", company)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-3">
              <label className="label">Status</label>
              <select
                className="select select-bordered w-full"
                value={liveFilters.status}
                onChange={(e) =>
                  setLiveFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="">Select status</option>
                <option>Solved</option>
                <option>Unsolved</option>
              </select>
            </div>

            <button
              className="btn btn-primary mt-4"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </>
  );
};

export default ProblemList;
