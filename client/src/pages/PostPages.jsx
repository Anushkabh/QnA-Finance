import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';

import CommentSection from '../components/CommentSection'; // Assume this handles comment posting
import PostCard from '../components/PostCard';

export default function PostPages() {
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState(null);

  // Fetch question details
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/question/${questionId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setQuestion(data.question);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchQuestion();
  }, [questionId]);

  // Fetch recent questions
  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        const res = await fetch(`/api/v1/question/approved?limit=2`);
        const data = await res.json();
        if (res.ok) {
          setRecentQuestions(data.questions);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentQuestions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Question Title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {question && question.title}
      </h1>

      {/* Category/Tag of the question */}
      <Link to={`/search?category=${question && question.tag}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {question && question.tag}
        </Button>
      </Link>

      {/* Question Image (if any) */}
     

      {/* Question Metadata */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{question && new Date(question.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {question && (question.description.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Question Description */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content text-white bg-neutral-900"
        dangerouslySetInnerHTML={{ __html: question && question.description }}
      ></div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto w-full mt-4">
        
      </div>

      {/* Comment Section */}
      <CommentSection questionId={question._id} />

      {/* Recent Questions Section */}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Questions</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentQuestions &&
            recentQuestions.map((question) => (
              <PostCard key={question._id} question={question} />
            ))}
        </div>
      </div>
    </main>
  );
}
