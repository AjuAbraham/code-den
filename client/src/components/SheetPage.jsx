import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOnePlaylist } from "../lib/axios";
import { Trash2 } from "lucide-react";
import moment from "moment";
import ProblemTable from "./ProblemTable";

const SheetPage = () => {
  const { playlistId } = useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getOnePlaylist", playlistId],
    queryFn: () => getOnePlaylist(playlistId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <span className="loading text-xl">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-red-400 text-xl font-semibold">
          🚨 Oops! Something went wrong while loading data.
        </p>

        <button
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  const playlist = data?.response;

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Playlist Header */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl relative">
          <button
            // onClick={handleDelete}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={20} />
          </button>

          <h1 className="text-3xl font-bold text-orange-400">
            {playlist.title}
          </h1>
          <p className="text-slate-300 mt-2">{playlist.description}</p>
          <p className="text-sm text-slate-500 mt-1">
            Created on {moment(playlist.createdAt).format("DD MMMM, YYYY")}
          </p>
        </div>

        {/* Problems Table */}
        <ProblemTable problemList={playlist.problemInPlaylist} />
      </div>
    </div>
  );
};

export default SheetPage;
