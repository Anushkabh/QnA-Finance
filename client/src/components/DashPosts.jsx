import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashQuestions() {
  const { currentUser } = useSelector((state) => state.user);
  const [userQuestions, setUserQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user-associated questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/every`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch questions.');
          return;
        }
        setUserQuestions(data.questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Something went wrong. Please try again later.');
      }
    };

    if (currentUser) fetchQuestions();
  }, [currentUser]);

  // Delete a question
  const handleDeleteQuestion = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/${questionIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        setError(data.message || 'Failed to delete question.');
        return;
      }

      setUserQuestions((prev) => prev.filter((question) => question._id !== questionIdToDelete));
      setShowModal(false);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen p-5">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-center mb-6">My Questions</h1>

      {userQuestions.length > 0 ? (
        <div className="relative">
          {/* Table Section */}
          <Table hoverable className="shadow-md rounded-lg">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Tag</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {userQuestions.map((question) => (
                <Table.Row
                  key={question._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  onClick={() => navigate(`/question/${question._id}/all`)}
                >
                  <Table.Cell>{new Date(question.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{question.title}</Table.Cell>
                  <Table.Cell>{question.tag}</Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-question/${question._id}`}
                      onClick={(e) => e.stopPropagation()} // Prevent row click navigation
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click navigation
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
        </div>
      ) : (
        <p className="text-center text-gray-600">You have no questions.</p>
      )}

      {/* Error Alert */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Delete Confirmation Modal */}
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



