"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonalIcon } from "lucide-react";

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
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const username = "Siz";

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch("/data/comments.json");
      const data: Comment[] = await res.json();

      const videoComments = data.filter((c) => c.videoId === videoId);
      const shuffled = [...videoComments].sort(() => Math.random() - 0.5);

      setAllComments(shuffled);
      setVisibleComments(shuffled.slice(0, 3));
      setNextIndex(3);
    };

    fetchComments();
  }, [videoId]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextComment = () => {
      const delay = Math.floor(Math.random() * (20000 - 4000 + 1)) + 4000; // от 4000 до 20000 мс

      timeoutId = setTimeout(() => {
        if (allComments.length === 0) return;

        const newComment = allComments[nextIndex % allComments.length];

        setVisibleComments((prev) => {
          const updated = [newComment, ...prev];
          return updated.slice(0, 5);
        });

        setNextIndex((prev) => (prev + 1) % allComments.length);
        scheduleNextComment(); // запланировать следующий комментарий
      }, delay);
    };

    scheduleNextComment(); // первый запуск

    return () => clearTimeout(timeoutId); // очистка при размонтировании
  }, [allComments, nextIndex]);

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      videoId,
      username,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setVisibleComments((prev) => {
      const updated = [newComment, ...prev];
      return updated.slice(0, 5);
    });

    setInputText("");
  };

  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString("ru-RU", {
  //     day: "numeric",
  //     month: "numeric",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Sharhlar</h3>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Написать комментарий..."
          className="w-full pr-10 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition"
        >
          <SendHorizonalIcon className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {visibleComments.map((comment) => (
            <motion.div
              layout
              key={comment.id + "-" + comment.timestamp}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 20,
                transition: { duration: 0.3, delay: 0.1 }, // задержка выхода
              }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur bg-transparent rounded-lg p-1 lg:p-3 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">
                    {comment.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-white truncate">
                      {comment.username}
                    </div>
                    {/* <div className="text-sm text-gray-400 flex-shrink-0">
                      {formatDate(comment.timestamp)}
                    </div> */}
                  </div>
                  <p className="text-gray-200 break-words">{comment.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
