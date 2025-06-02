"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
interface CommentsSectionProps {
  videoId: string;
}

interface Comment {
  id: number;
  videoId: string;
  username: string;
  text: string;
  timestamp: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  videoId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch("/data/comments.json");
      const data: Comment[] = await res.json();

      const videoComments = data.filter(
        (comment) => comment.videoId === videoId
      );
      const shuffled = [...videoComments].sort(() => Math.random() - 0.5);

      setComments(shuffled);
    };

    fetchComments();
  }, [videoId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          Комментарии ({comments.length})
        </h3>
      </div>

      <div className=" overflow-y-auto custom-scrollbar pr-2">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            role="listitem"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="backdrop-blur rounded-lg p-3 hover:bg-white/10 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium">
                  {comment.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center ">
                  <div className="font-medium text-white truncate">
                    {comment.username}
                  </div>
                  <div className="text-sm text-gray-400 flex-shrink-0">
                    {formatDate(comment.timestamp)}
                  </div>
                </div>
                <p className="text-gray-200 break-words">{comment.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
