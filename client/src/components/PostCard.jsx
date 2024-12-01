import { Link } from 'react-router-dom';

export default function PostCard({ question }) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[200px] overflow-hidden rounded-lg sm:w-[300px] transition-all p-3">
      <div className="flex flex-col gap-2">
        {/* Question Title */}
        <p className="text-md font-semibold line-clamp-2">{question.title}</p>

        {/* Tags */}
        <div className="text-xs text-gray-500 flex gap-2">
          {question.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-teal-100 text-teal-500 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <span className="italic text-xs">
          Asked by: {question.owner?.name || 'Anonymous'}
        </span>

        {/* Link to Question Details */}
        <Link
          to={`/question/${question._id}`}
          className="absolute bottom-3 left-3 right-3 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-1 rounded-md"
        >
          View Question
        </Link>
      </div>
    </div>
  );
}
