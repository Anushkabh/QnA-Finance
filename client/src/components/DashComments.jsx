import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function AdminAllQuestions() {
  const { currentUser } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState("");
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async (page = 1) => {
      try {
        const res = await fetch(`/api/v1/question/admin/questions?limit=10&page=${page}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to fetch questions.");
          return;
        }
        setQuestions(data.questions);
        setPagination({
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.currentPage,
        });
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Something went wrong. Please try again later.");
      }
    };

    if (currentUser.isAdmin) fetchQuestions();
  }, [currentUser]);

  // Delete a question
  const handleDeleteQuestion = async () => {
    try {
      const res = await fetch(`/api/v1/question/${questionIdToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        setError(data.message || "Failed to delete question.");
        return;
      }

      setQuestions((prev) => prev.filter((question) => question._id !== questionIdToDelete));
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/v1/question/admin/questions?limit=10&page=${page}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
          setPagination({
            totalPages: data.pagination.totalPages,
            currentPage: data.pagination.currentPage,
          });
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  };

  return (
    <div className="p-5 max-w-6xl mx-auto min-h-screen">
      {/* Page Heading */}
      <h1 className="text-center text-3xl font-bold mb-10">All Questions</h1>

      {/* Table Section */}
      {questions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable className="shadow-md mx-auto">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Tag</Table.HeadCell>
              <Table.HeadCell>Owner</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {questions.map((question) => (
                <Table.Row key={question._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(question.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{question.title}</Table.Cell>
                  <Table.Cell>{question.tag}</Table.Cell>
                  <Table.Cell>{question.owner?.name || "Unknown"}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setQuestionIdToDelete(question._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded-md transition-all ${
                  pagination.currentPage === index + 1
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 hover:bg-teal-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">No questions available.</p>
      )}

      {/* Error Alert */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this question?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteQuestion}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
