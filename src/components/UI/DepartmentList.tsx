import { useState } from "react";
import toast from "react-hot-toast";

interface DepartmentManagerProps {
  initialDepartments?: string[];
  onAddDepartment?: (depts: string[]) => Promise<void>;
}

export default function DepartmentManager({
  initialDepartments = [],
  onAddDepartment,
}: DepartmentManagerProps) {
  const [departments, setDepartments] = useState(initialDepartments);
  const [input, setInput] = useState("");
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed || !onAddDepartment) return;

    setInput("");
    setLoadingIndex(-1); // -1 means adding

    try {
      // Call backend with the new department added
      const newDepartments = [...departments, trimmed];
      await onAddDepartment(newDepartments);
      // Update frontend state after success
      setDepartments(newDepartments);
    } catch (err) {
      toast.error("Failed to add department: " + err.message);
      console.error("Failed to add department:", err);
      // Optionally show toast/error here
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleRemove = async (index: number) => {
    if (!onAddDepartment) return;

    setLoadingIndex(index);

    try {
      const newDepartments = departments.filter((_, i) => i !== index);
      await onAddDepartment(newDepartments);

      setDepartments(newDepartments);
    } catch (err) {
      console.error("Failed to remove department:", err);
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="w-full  mx-auto py-4 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">
        Company Department
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new department..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          disabled={loadingIndex === -1}
          className={`px-4 py-2 rounded-lg transition ${
            loadingIndex === -1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loadingIndex === -1 ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className=" max-h-44 flex flex-wrap gap-4 overflow-auto">
        {departments.map((dept, index) => (
          <li
            key={index}
            className="flex justify-between min-w-fit gap-4 items-center bg-gray-100 px-3 py-2 rounded-lg"
          >
            <span>{dept}</span>
            <button
              onClick={() => handleRemove(index)}
              disabled={loadingIndex === index || loadingIndex === -1}
              className={`font-bold transition ${
                loadingIndex === index
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700"
              }`}
            >
              {loadingIndex === index ? "Removing..." : "✕"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
