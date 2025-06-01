import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import problemSchema from "../schema/problemSchema";
import { toast } from "react-hot-toast";
import { sampledpData, sampleStringProblem } from "../lib/sampleData";
import { useMutation } from "@tanstack/react-query";
import { createProblem } from "../lib/axios";
const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: ["problem-create"],
    mutationFn: (formData) => createProblem(formData),
    onSuccess: (data) => {
      if (data.success) {
        toast.error("Problem Created Successfully");
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      hints: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: hintFields,
    append: appendHint,
    remove: removeHint,
    replace: replaceHints,
  } = useFieldArray({
    control,
    name: "hints",
  });

  const onSubmit = async (formData) => mutate(formData);
  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceHints(sampleData.hints.map((hint) => hint));
    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestcases(sampleData.testcases.map((tc) => tc));

    reset(sampleData);
  };
  const disableCreateButton = Object.keys(dirtyFields).length > 0;
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="card bg-base-100 shadow-2xl rounded-xl overflow-hidden">
        <div className="card-body p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-base-200">
            <h2 className="card-title text-3xl md:text-4xl font-bold text-primary flex items-center gap-4">
              <FileText className="w-8 h-8 text-primary" />
              Create Problem
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0">
              <div className="join shadow-sm">
                <button
                  type="button"
                  className={`btn join-item px-6 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
                    sampleType === "DP"
                      ? "btn-primary"
                      : "btn-ghost bg-base-200"
                  }`}
                  onClick={() => setSampleType("DP")}
                  aria-pressed={sampleType === "DP"}
                >
                  DP Problem
                </button>
                <button
                  type="button"
                  className={`btn join-item px-6 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
                    sampleType === "string"
                      ? "btn-primary"
                      : "btn-ghost bg-base-200"
                  }`}
                  onClick={() => setSampleType("string")}
                  aria-pressed={sampleType === "string"}
                >
                  String Problem
                </button>
              </div>
              <button
                type="button"
                className="btn btn-secondary gap-2 px-6 py-2 text-sm font-medium hover:bg-secondary-focus transition-colors duration-200"
                onClick={loadSampleData}
                aria-label="Load sample data"
              >
                <Download className="w-5 h-5" />
                Load Sample
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-lg font-semibold text-base-content">
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                  {...register("title")}
                  placeholder="Enter problem title"
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error text-sm">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-lg font-semibold text-base-content">
                    Description
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered min-h-36 w-full text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg p-4"
                  {...register("description")}
                  placeholder="Enter problem description"
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error text-sm">
                      {errors.description.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold text-base-content">
                    Difficulty
                  </span>
                </label>
                <select
                  className="select select-bordered w-full text-base bg-base-50 border-base-300  transition-all duration-200 rounded-lg"
                  {...register("difficulty")}
                  aria-invalid={!!errors.difficulty}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-error text-sm">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="card bg-base-200/50 shadow-md rounded-xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-base-content flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4 py-2 text-sm font-medium hover:bg-primary-focus transition-colors duration-200"
                  onClick={() => appendTag("")}
                  aria-label="Add new tag"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                      {...register(`tags.${index}`)}
                      placeholder="Enter tag"
                      aria-invalid={!!errors.tags?.[index]}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm hover:bg-error/10 transition-colors duration-200"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length === 1}
                      aria-label="Remove tag"
                    >
                      <Trash2 className="w-5 h-5 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <div className="mt-3">
                  <span className="text-error text-sm">
                    {errors.tags.message}
                  </span>
                </div>
              )}
            </div>

            {/* Test Cases */}
            <div className="card bg-base-200/50 shadow-md rounded-xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-base-content flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4 py-2 text-sm font-medium hover:bg-primary-focus transition-colors duration-200"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                  aria-label="Add new test case"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>
              <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="card bg-base-100 shadow-md rounded-lg"
                  >
                    <div className="card-body p-5 md:p-6">
                      <div className="flex justify-between items-center mb-5">
                        <h4 className="text-lg md:text-xl font-semibold text-base-content">
                          Test Case #{index + 1}
                        </h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10 transition-colors duration-200"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                          aria-label="Remove test case"
                        >
                          <Trash2 className="w-5 h-5 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-28 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                            {...register(`testcases.${index}.input`)}
                            placeholder="Enter test case input"
                            aria-invalid={!!errors.testcases?.[index]?.input}
                          />
                          {errors.testcases?.[index]?.input && (
                            <label className="label">
                              <span className="label-text-alt text-error text-sm">
                                {errors.testcases[index].input.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-base-content">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-28 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                            {...register(`testcases.${index}.output`)}
                            placeholder="Enter expected output"
                            aria-invalid={!!errors.testcases?.[index]?.output}
                          />
                          {errors.testcases?.[index]?.output && (
                            <label className="label">
                              <span className="label-text-alt text-error text-sm">
                                {errors.testcases[index].output.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <div className="mt-3">
                  <span className="text-error text-sm">
                    {errors.testcases.message}
                  </span>
                </div>
              )}
            </div>

            {/* Code Editor Sections */}
            <div className="space-y-10">
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                <div
                  key={language}
                  className="card bg-base-200/50 shadow-md rounded-xl p-6 lg:p-8"
                >
                  <h3 className="text-xl lg:text-2xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-primary" />
                    {language}
                  </h3>

                  <div className="space-y-8">
                    {/* Starter Code */}
                    <div className="card bg-base-100 shadow-md rounded-lg">
                      <div className="card-body p-5 md:p-6">
                        <h4 className="font-semibold text-lg md:text-xl text-base-content mb-4">
                          Starter Code Template
                        </h4>
                        <div className="border border-base-300 rounded-lg overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && (
                          <div className="mt-3">
                            <span className="text-error text-sm">
                              {errors.codeSnippets[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reference Solution */}
                    <div className="card bg-base-100 shadow-md rounded-lg">
                      <div className="card-body p-5 md:p-6">
                        <h4 className="font-semibold text-lg md:text-xl text-base-content mb-4 flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                          Reference Solution
                        </h4>
                        <div className="border border-base-300 rounded-lg overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                          <div className="mt-3">
                            <span className="text-error text-sm">
                              {errors.referenceSolutions[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="card bg-base-100 shadow-md rounded-lg">
                      <div className="card-body p-5 md:p-6">
                        <h4 className="font-semibold text-lg md:text-xl text-base-content mb-4">
                          Example
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium text-base-content">
                                Input
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                              {...register(`examples.${language}.input`)}
                              placeholder="Example input"
                              aria-invalid={
                                !!errors.examples?.[language]?.input
                              }
                            />
                            {errors.examples?.[language]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error text-sm">
                                  {errors.examples[language].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium text-base-content">
                                Output
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                              {...register(`examples.${language}.output`)}
                              placeholder="Example output"
                              aria-invalid={
                                !!errors.examples?.[language]?.output
                              }
                            />
                            {errors.examples?.[language]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error text-sm">
                                  {errors.examples[language].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text font-medium text-base-content">
                                Explanation
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-28 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                              {...register(`examples.${language}.explanation`)}
                              placeholder="Explain the example"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="card bg-base-200/50 shadow-md rounded-xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-semibold text-base-content mb-6 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-warning" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Constraints
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-28 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                    aria-invalid={!!errors.constraints}
                  />
                  {errors.constraints && (
                    <label className="label">
                      <span className="label-text-alt text-error text-sm">
                        {errors.constraints.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Hints Section */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-4">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">
                        Hints (Optional)
                      </span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm px-4 py-2 text-sm font-medium hover:bg-primary-focus transition-colors duration-200"
                      onClick={() => appendHint("")}
                      aria-label="Add new hint"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Hint
                    </button>
                  </div>
                  <div className="space-y-4">
                    {hintFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-center">
                        <textarea
                          className="textarea textarea-bordered min-h-20 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                          {...register(`hints.${index}`)}
                          placeholder={`Enter hint #${index + 1}`}
                          aria-invalid={!!errors.hints?.[index]}
                        />
                        <button
                          type="button"
                          className="btn btn-ghost btn-square btn-sm hover:bg-error/10 transition-colors duration-200"
                          onClick={() => removeHint(index)}
                          disabled={hintFields.length === 1}
                          aria-label="Remove hint"
                        >
                          <Trash2 className="w-5 h-5 text-error" />
                        </button>
                        {errors.hints?.[index] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {errors.hints[index].message}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.hints && !Array.isArray(errors.hints) && (
                    <div className="mt-3">
                      <span className="text-error text-sm">
                        {errors.hints.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">
                      Editorial (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-36 w-full p-4 text-base bg-base-50 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                  />
                </div>
              </div>
            </div>

            <div className="card-actions justify-end pt-6 border-t border-base-200">
              <button
                type="submit"
                className="btn btn-primary cursor-pointer disabled:bg-gray-200 btn-lg px-8 py-3 text-base font-semibold gap-3 hover:bg-primary-focus transition-colors duration-200"
                aria-label="Create problem"
                disabled={!disableCreateButton || isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
                Create Problem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemForm;
