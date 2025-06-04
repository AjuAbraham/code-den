import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const GenerateSheet = ({ isOpen, onClose, onSubmit, createLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      days: 0,
      hoursPerDay: 0,
      targetCompany: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">🧠 Generate AI-Powered Sheet</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Title */}
          <div className="form-control">
            <label className="label font-medium">Sheet Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Ex: DSA Crash Sheet"
              {...register("title", { required: "Sheet title is required" })}
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label font-medium">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Brief description of the sheet..."
              {...register("description")}
            />
          </div>

          {/* Days */}
          <div className="form-control">
            <label className="label font-medium">Target Days</label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Number of days to complete"
              {...register("days", { min: 1 })}
            />
          </div>

          {/* Hours per day */}
          <div className="form-control">
            <label className="label font-medium">Hours Per Day</label>
            <input
              type="number"
              max={24}
              className="input input-bordered w-full"
              placeholder="e.g. 2"
              {...register("hoursPerDay", { max: 24 })}
            />
          </div>

          {/* Target Company */}
          <div className="form-control">
            <label className="label font-medium">
              Target Company (Optional)
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Google, Amazon"
              {...register("targetCompany")}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-error btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="btn btn-primary disabled:bg-gray-500 flex items-center gap-2"
            >
              {createLoading ? (
                <span className="loading loading-spinner"></span>
              ) : null}
              Generate Sheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateSheet;
