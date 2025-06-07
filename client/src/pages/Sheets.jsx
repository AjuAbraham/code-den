import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generatePlaylist,
  getAllSheets,
  createPlaylist,
} from "../lib/axios.js";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import GenerateSheet from "../components/GenerateSheet.jsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import CreatePlaylistModal from "../components/CreatePlaylistModal.jsx";
const Sheets = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [playlistModelOpen, setPlaylistModelOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allSheets"],
    queryFn: getAllSheets,
    staleTime: 1000 * 60 * 5,
  });
  const {
    data: playlistData,
    mutate,
    isPending,
  } = useMutation({
    mutationFn: (formData) => generatePlaylist(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSheets"] });
      return toast.success("Playlist Created Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });

  const { mutate: createPlaylistMutation } = useMutation({
    mutationFn: (formData) => createPlaylist(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSheets"] });
      navigate("../sheets");
      return toast.success("Playlist Created Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading text-xl">Loading...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
        <p className="text-red-400 text-xl font-semibold">
          🚨 Oops! Something went wrong while loading data.
        </p>

        <button
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Retry List
        </button>
      </div>
    );
  }
  if (!data?.response?.length) {
    return (
      <div className="text-white text-center mt-10">No sheets available.</div>
    );
  }

  const handleCreatePlaylist = async (data) => {
    createPlaylistMutation(data);
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          📚 Explore All Coding Sheets
        </h1>
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0 sm:mr-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🤖 Generate Sheet with AI
              </h2>
              <p className="text-base text-slate-200 max-w-md">
                We also follow the hype train get a curated sheet as per your
                needs with good handpick problems
              </p>
            </div>
            <button
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-md"
              onClick={() => setPlaylistModelOpen(true)}
            >
              Generate with AI
            </button>
          </div>
        </div>
        <div className="flex w-full justify-end mb-4">
          <button
            className="btn btn-primary gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Playlist
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.response?.map((sheet) => {
            const { problemCounts } = sheet;
            return (
              <div
                key={sheet.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {sheet.title}
                  </h2>
                  {sheet.description && (
                    <p className="text-slate-400 text-sm mt-1">
                      {sheet.description}
                    </p>
                  )}
                </div>

                <div className="text-sm text-slate-400 mb-3">
                  Created on {moment(sheet.createAt).format("DD MMMM,YYYY")}
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                    Easy: {problemCounts?.easyCount || 0}
                  </span>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                    Medium: {problemCounts?.mediumCount || 0}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                    Hard: {problemCounts?.hardCount || 0}
                  </span>
                  <span className="ml-auto text-orange-400 font-semibold">
                    {sheet.problemInPlaylist?.length ?? 0} Questions
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/sheets/${sheet.id}`)}
                  className="mt-auto bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  View Sheet
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <GenerateSheet
        isOpen={playlistModelOpen}
        onClose={() => setPlaylistModelOpen(false)}
        onSubmit={(data) => mutate(data)}
        createLoading={isPending}
      />
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </>
  );
};

export default Sheets;
