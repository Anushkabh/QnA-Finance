import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';

export default function QuestionDetails() {
  const { questionId } = useParams(); //
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);

  // Fetch question details
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log(questionId) // 
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/question/${questionId}/all`, {
          credentials: 'include',
          
        });
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setQuestion(data.question);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchQuestion();
  }, [questionId]);

  // Fetch recent questions
  
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 text-lg">Failed to load the question. Please try again.</p>
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Question Title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {question.title}
      </h1>

      {/* Category/Tag of the question */}
      <Link to={`/search?tag=${question.tag}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {question.tag}
        </Button>
      </Link>

      {/* Question Metadata */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
        <span className="italic">Asked by: {question.owner?.name || 'Anonymous'}</span>
      </div>

      {/* Question Description */}
      <div
        className="p-5 max-w-2xl mx-auto w-full post-content text-gray-700 bg-gray-100 rounded-lg shadow"
        dangerouslySetInnerHTML={{ __html: question.description }}
      ></div>

       {/* Comment Section */}
       <CommentSection questionId={question._id} />

      {/* Recent Questions Section */}
      
    </main>
  );
}

