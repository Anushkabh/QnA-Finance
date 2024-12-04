import { useEffect, useState } from 'react';
import PostCard from '../components/QuestionCard';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/question/approved?page=${page}&limit=5`
      );
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions);
        setTotalPages(data.totalPages);
      } else {
        console.error(data.message || 'Failed to fetch questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Intro Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to the Q&A App</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Browse and explore finance-related questions posted by our community. 
          Post your own questions or engage by commenting.
        </p>
      </div>

      {/* Questions Section */}
      <div className="max-w-4xl mx-auto p-3 flex flex-col gap-8 py-7">
        {loading ? (
          <p className="text-center text-gray-500">Loading questions...</p>
        ) : (
          questions && questions.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">Recent Questions</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {questions.map((question) => (
                  <PostCard key={question._id} question={question} />
                ))}
              </div>
            </div>
          )
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange('prev')}
            className={`px-4 py-2 text-white bg-teal-500 rounded ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange('next')}
            className={`px-4 py-2 text-white bg-teal-500 rounded ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}



