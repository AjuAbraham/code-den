import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOneProblem } from "../lib/axios";
import CreateProblemForm from "../forms/CreateProblemForm";

const EditProblem = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getAllProblem", id],
    queryFn: () => getOneProblem(id),
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
  return (
    <div>
      <CreateProblemForm data={data?.response} />
    </div>
  );
};

export default EditProblem;
