import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPendingQuestions() {
  const { currentUser } = useSelector((state) => state.user); // Get current user
  const [pendingQuestions, setPendingQuestions] = useState([]); // Store pending questions
  const [showModal, setShowModal] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch pending questions
  useEffect(() => {
    const fetchPendingQuestions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/pending`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // Pass token if required
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPendingQuestions(data.questions || []);
        } else {
          console.error('Failed to fetch pending questions:', data.message);
        }
      } catch (error) {
        console.error('Error fetching pending questions:', error);
      }
    };

    if (currentUser) fetchPendingQuestions();
  }, [currentUser]);

  // Handle deleting a question
  const handleDeleteQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/${questionIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser?.token}`, // Pass token if required
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPendingQuestions((prev) =>
          prev.filter((question) => question._id !== questionIdToDelete)
        );
        setShowModal(false);
      } else {
        console.error('Failed to delete question:', data.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen p-5">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-center mb-6">My Pending Questions</h1>

      {pendingQuestions.length > 0 ? (
        <div className="relative">
          {/* Table Section */}
          <Table hoverable className="shadow-md rounded-lg">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Tags</Table.HeadCell>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {pendingQuestions.map((question) => (
              <Table.Body className="divide-y" key={question._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{question.title}</Table.Cell>
                  <Table.Cell>{question.tag}</Table.Cell>
                  <Table.Cell>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </Table.Cell>
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
              </Table.Body>
            ))}
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No pending questions found!</p>
      )}

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this question?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteQuestion}
                disabled={loading}
              >
                {loading ? 'Deleting...' : "Yes, I'm sure"}
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

