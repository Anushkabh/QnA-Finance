import moment from 'moment';

export default function Comment({ comment }) {
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {comment.user?.name || 'Anonymous User'}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
}

