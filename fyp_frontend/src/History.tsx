import React, { useState, useEffect } from "react";
import { Trash2 } from 'lucide-react';

const API_BASE_URL = "https://fypbackend-b5gchph9byc4b8gt.canadacentral-01.azurewebsites.net";

interface FeedbackEntry {
  question_id: string;
  question_text: string;
  final_evaluation: {
    communication: string;
    problem_solving: string;
    technical_competency: string;
    examples_of_what_went_well: string;
  };
  detailed_feedback: {
    communication: string;
    problem_solving: string;
    technical_competency: string;
    examples_of_what_went_well: string;
  };
}

const History: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionToRemove, setQuestionToRemove] = useState(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const feedbackRes = await fetch(`${API_BASE_URL}/user-history`, {
          method: "GET",
          credentials: "include",
        });

        if (!feedbackRes.ok) throw new Error("Failed to fetch user history");

        const feedbackData = await feedbackRes.json();
        setFeedbackList(feedbackData.feedback || []);
      } catch (err) {
        console.error("❌ Error fetching user history:", err);
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, []);

  // const showRemoveConfirmation = (questionId) => {
  //   setQuestionToRemove(questionId);
  //   setShowConfirmModal(true);
  // };

  // Function to handle confirming the removal
  const confirmRemoveQuestion = () => {
    if (questionToRemove) {
      console.log(`Removing question with ID: ${questionToRemove}`);
      
      // Remove from local state
      // setFeedbackList(prev => prev.filter(entry => entry.question_id !== questionToRemove));
      
      // // Clear selection if removed item was selected
      // if (selectedFeedback && selectedFeedback.question_id === questionToRemove) {
      //   setSelectedFeedback(null);
      // }
    }
    
    // Close modal and reset
    setShowConfirmModal(false);
    setQuestionToRemove(null);
  };

  // Function to cancel removal
  const cancelRemoveQuestion = () => {
    setShowConfirmModal(false);
    setQuestionToRemove(null);
  };

  // Function to handle removing a question
  const handleRemoveQuestion = (questionId) => {
    // Prevent the click from bubbling up to the card click handler
    // e.stopPropagation();
    
    // Show confirmation instead of directly removing
    // showRemoveConfirmation(questionId);
    setQuestionToRemove(questionId);
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Your Interview History
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading feedback...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : feedbackList.length === 0 ? (
        <p className="text-center text-gray-600">You have no feedback yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...feedbackList].reverse().map((entry, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedFeedback(entry)}
            >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Question #{entry.question_id}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveQuestion(entry.question_id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
                title="Remove question"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
              <p className="text-gray-600 italic text-sm">{entry.question_text}</p>

              {/* Final Evaluation */}
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mt-3">
                <h3 className="text-md font-semibold text-blue-700 mb-2">
                  Final Evaluation
                </h3>
                <ul className="text-gray-800 text-sm space-y-1">
                  <li>
                    <strong>Communication:</strong> {entry.final_evaluation.communication}
                  </li>
                  <li>
                    <strong>Problem Solving:</strong> {entry.final_evaluation.problem_solving}
                  </li>
                  <li>
                    <strong>Technical:</strong> {entry.final_evaluation.technical_competency}
                  </li>
                  <li>
                    <strong>What Went Well:</strong> {entry.final_evaluation.examples_of_what_went_well}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove Question #{questionToRemove}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelRemoveQuestion}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveQuestion}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {/* Popup Modal */}
{selectedFeedback && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
    onClick={() => setSelectedFeedback(null)}
  >
    <div
      className="bg-white w-full max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-lg shadow-2xl p-8 relative flex flex-col max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
        Detailed Feedback – Question #{selectedFeedback.question_id}
      </h2>

      <ul className="text-gray-700 text-md space-y-4">
        <li>
          <strong>Communication:</strong> {selectedFeedback.detailed_feedback.communication}
        </li>
        <li>
          <strong>Problem Solving:</strong> {selectedFeedback.detailed_feedback.problem_solving}
        </li>
        <li>
          <strong>Technical:</strong> {selectedFeedback.detailed_feedback.technical_competency}
        </li>
        <li>
          <strong>What Went Well:</strong> {selectedFeedback.detailed_feedback.examples_of_what_went_well}
        </li>
      </ul>

      <button
        onClick={() => setSelectedFeedback(null)}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mx-auto block text-md"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default History;
