import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/v1/question/approved');
        const data = await res.json();
        if (res.ok) {
          setQuestions(data.questions);
        } else {
          console.error(data.message || 'Failed to fetch questions.');
        }
      } catch (error) {
        console.error('Error fetching questions:', error.message);
      }
    };
    fetchQuestions();
  }, []);

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
        {questions && questions.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Questions</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((question) => (
                <PostCard key={question._id} question={question} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


