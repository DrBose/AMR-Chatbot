import { useState, useCallback } from 'react';
import type { Message } from '../types';
import { faqData } from '../faqData';

interface UseFaqProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const FAQ_TOPICS = faqData.map(t => t.topic);
const FAQ_BACK_TO_TOPICS = '⬅️ Back to topics';
const FAQ_EXIT = 'Exit FAQ';

export const useFaq = ({ setMessages }: UseFaqProps) => {
  const [isFaqActive, setIsFaqActive] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);

  const exitFaq = useCallback(() => {
    setIsFaqActive(false);
    setCurrentTopic(null);
    setMessages((prev) => [...prev, {
      id: `faq-exit-${Date.now()}`,
      text: "You've exited the FAQ section. How else can I help you?",
      sender: 'bot'
    }]);
  }, [setMessages]);

  const showTopics = useCallback(() => {
    setIsFaqActive(true);
    setCurrentTopic(null);
    setMessages((prev) => [...prev, {
      id: `faq-topics-${Date.now()}`,
      text: "Here are our Frequently Asked Questions. Please select a topic to see the questions.",
      sender: 'bot',
      suggestions: [...FAQ_TOPICS, FAQ_EXIT]
    }]);
  }, [setMessages]);

  const handleFaqSelection = useCallback((selection: string) => {
    if (selection === FAQ_EXIT) {
      exitFaq();
      return;
    }

    if (selection === FAQ_BACK_TO_TOPICS) {
      showTopics();
      return;
    }

    // If a topic is selected
    if (FAQ_TOPICS.includes(selection)) {
      const topicData = faqData.find(t => t.topic === selection);
      if (topicData) {
        setCurrentTopic(selection);
        const questionSuggestions = topicData.questions.map(q => q.question);
        setMessages((prev) => [...prev, {
          id: `faq-questions-${selection}-${Date.now()}`,
          text: `Great! Here are the questions for the topic: **${selection}**`,
          sender: 'bot',
          suggestions: [...questionSuggestions, FAQ_BACK_TO_TOPICS]
        }]);
      }
    } else if (currentTopic) {
      // If a question is selected
      const topicData = faqData.find(t => t.topic === currentTopic);
      const questionData = topicData?.questions.find(q => q.question === selection);

      if (questionData) {
        setMessages((prev) => [...prev, {
          id: `faq-answer-${Date.now()}`,
          text: questionData.answer,
          sender: 'bot',
          suggestions: [FAQ_BACK_TO_TOPICS, FAQ_EXIT]
        }]);
      }
    }
  }, [currentTopic, exitFaq, showTopics, setMessages]);


  const startFaq = useCallback(() => {
     setMessages((prev) => [...prev, {
      id: `faq-start-${Date.now()}`,
      text: "You've entered the FAQ section.",
      sender: 'bot'
    }]);
    showTopics();
  }, [setMessages, showTopics]);

  return { isFaqActive, startFaq, handleFaqSelection };
};
