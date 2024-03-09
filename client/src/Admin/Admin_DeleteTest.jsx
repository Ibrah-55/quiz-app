import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier";

const Admin_DeleteTest = () => {
  const adminStatus = useSelector((state) => state.admin);

  const [testNameToDelete, setTestNameToDelete] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setTestNameToDelete(value);
  };

  const handleDeleteTest = async (e) => {
    e.preventDefault();

    if (confirm("Are you sure you want to delete this test?")) {
      setIsLoading(true);

      const token = adminStatus.token;

      if (testNameToDelete && token.length > 0) {
        try {
          const res = await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/delete-test/${testNameToDelete}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );

          if (res.data.success) {
            sendSuccessMessage(res.data.message);
            // window.location.href = "/admin-dashboard";

          } else {
            sendInfoMessage("Error deleting test");
            sendWarningMessage(res.data.error);
          }
        } catch (error) {
          sendErrorMessage("Error");
        }
      } else {
        sendWarningMessage("Test name is required");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-red-600">Delete Test</h2>
      <form onSubmit={handleDeleteTest}>
        <div className="mb-4">
          <label htmlFor="testNameToDelete" className="block text-gray-600">
            Test Name to Delete:
          </label>
          <input
            type="text"
            id="testNameToDelete"
            name="testNameToDelete"
            autoComplete="off"
            value={testNameToDelete}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-red-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300 text-white px-6 py-2 rounded-md hover:bg-red-600"
        >
          {isLoading ? (
            <div>
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
            </div>
          ) : (
            <span>Delete Test</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Admin_DeleteTest;
