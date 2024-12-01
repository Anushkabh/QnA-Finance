import { Table, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Questionstatus() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingQuestions, setPendingQuestions] = useState([]); // Store pending questions
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all pending questions
  useEffect(() => {
    const fetchPendingQuestions = async () => {
      try {
        const res = await fetch('/api/v1/question/admin/pending', {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch pending questions.');
          return;
        }
        setPendingQuestions(data.questions);
      } catch (err) {
        console.error('Error fetching pending questions:', err);
        setError('Something went wrong. Please try again later.');
      }
    };

    if (currentUser?.isAdmin) fetchPendingQuestions();
  }, [currentUser]);

  // Handle status update
  const handleUpdateStatus = async (questionId, status) => {
    try {
      const res = await fetch(`/api/v1/question/admin/${questionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        setError(data.message || 'Failed to update question status.');
        return;
      }

      // Update the local state
      setPendingQuestions((prev) =>
        prev.filter((question) => question._id !== questionId)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto min-h-screen">
      {/* Page Heading */}
      <h1 className="text-center text-3xl font-bold mb-10">Manage Question Status</h1>

      {/* Table Section */}
      {pendingQuestions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable className="shadow-md mx-auto">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Tag</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {pendingQuestions.map((question) => (
                <Table.Row
                  key={question._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  onClick={() => navigate(`/question/${question._id}/all`)}
                >
                  <Table.Cell>{new Date(question.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{question.title}</Table.Cell>
                  <Table.Cell>{question.tag}</Table.Cell>
                  <Table.Cell>
                    <Select
                      onChange={(e) => handleUpdateStatus(question._id, e.target.value)}
                      className="w-40"
                      defaultValue="pending"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </Select>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">No pending questions available.</p>
      )}

      {/* Error Alert */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
