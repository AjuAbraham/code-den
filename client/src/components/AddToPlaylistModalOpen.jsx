import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Loader } from "lucide-react";
import { addProblemToPlaylsit, getAllSheets } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
const AddToPlaylistModalOpen = ({ isOpen, onClose, problemId }) => {
  const queryClient = useQueryClient();
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const { mutate: addProblemToPlaylistMutation } = useMutation({
    mutationFn: () =>
      addProblemToPlaylsit({
        playlistId: selectedPlaylist,
        problemIds: [problemId],
      }),
    onSuccess: (data) => {
      ["allSheets", "getAllProblem", "getOnePlaylist"].forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
      toast.success("Problem added Successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["allSheets"],
    queryFn: getAllSheets,
    staleTime: 1000 * 60 * 5,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;
    addProblemToPlaylistMutation([problemId]);
  };
  const playlists = data?.response || [];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">Add to Sheet</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Select Sheet</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a Sheet</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add to Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPlaylistModalOpen;
