import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deletePlaylist, getOnePlaylist } from "../lib/axios";
import { AlignJustify, Trash2 } from "lucide-react";
import moment from "moment";
import ProblemTable from "./ProblemTable";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const SheetPage = () => {
  const { playlistId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getOnePlaylist", playlistId],
    queryFn: () => getOnePlaylist(playlistId),
    staleTime: 1000 * 60 * 5,
  });
  const { mutate: deletePlaylistMutation } = useMutation({
    mutationFn: () => deletePlaylist(playlistId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allSheets"] });
      navigate(-1, { replace: true });
      toast.success("Problem Delted Successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
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
  const handleDownloadExcel = () => {
    const problems = playlist.problemInPlaylist || [];

    const worksheetData = problems.map((problem, index) => ({
      "SNo.": index + 1,
      Title: problem.title,
      Difficulty: problem.difficulty,
      Tags: problem.tags.join(", ") || "",
      Company: problem.companies.join(", ") || "",
    }));
    // Convert data to sheet format (header: 1 gives raw 2D array)
    const dataTable = XLSX.utils.sheet_to_json(
      XLSX.utils.json_to_sheet(worksheetData),
      { header: 1 }
    );

    // Playlist title row and an empty row after it
    const title = [[playlist.title]];
    const emptyRow = [[]];
    const combinedData = [...title, ...emptyRow, ...dataTable];

    const worksheet = XLSX.utils.aoa_to_sheet(combinedData);

    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    worksheet["A1"].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const headerRow = combinedData[2];
    headerRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: colIndex });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: "center" },
          AlignJustify: "center",
        };
      }
    });
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 60 },
      { wch: 10 },
      { wch: 40 },
      { wch: 40 },
    ];
    const headerCellKeys = Object.keys(worksheetData[0]);
    headerCellKeys.forEach((_, idx) => {
      const cellAddress = XLSX.utils.encode_cell({ c: idx, r: 0 });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DSA Sheet");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `${playlist.title}-sheet.xlsx`);
  };
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Playlist Header */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl relative">
          <button
            onClick={() => deletePlaylistMutation()}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={20} />
          </button>

          <h1 className="text-3xl font-bold text-orange-400">
            {playlist.title}
          </h1>
          <p className="text-slate-300 mt-2">{playlist.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 mt-1">
              Created on {moment(playlist.createdAt).format("DD MMMM, YYYY")}
            </p>
            <button
              onClick={handleDownloadExcel}
              disabled={playlist.problemInPlaylist.length === 0}
              className="btn btn-success btn-sm disabled:pointer-events-none disabled:bg-gray-600 md:btn-md text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <ProblemTable
          problemList={playlist.problemInPlaylist}
          playlistId={playlist.id}
        />
      </div>
    </div>
  );
};

export default SheetPage;
