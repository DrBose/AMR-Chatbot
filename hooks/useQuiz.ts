import { useState, useCallback } from 'react';
import type { Message } from '../types';
import { quizQuestions } from '../quizData';

interface UseQuizProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const useQuiz = ({ setMessages }: UseQuizProps) => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const showNextQuestion = useCallback((index: number) => {
    const question = quizQuestions[index];
    const quizMessage: Message = {
      id: `quiz-${index}`,
      text: `Question ${index + 1}: ${question.question}`,
      sender: 'bot',
      isQuizQuestion: true,
      options: question.options,
      originalText: question.correctAnswer, // Storing correct answer for later check
    };
    setMessages((prev) => [...prev, quizMessage]);
  }, [setMessages]);

  const endQuiz = useCallback((finalScore: number) => {
    const totalQuestions = quizQuestions.length;
    let summaryMessage = `Quiz complete! You scored ${finalScore} out of ${totalQuestions}. `;

    if (finalScore === totalQuestions) {
        summaryMessage += "Excellent work! You have a great understanding of the One Health concept.";
    } else if (finalScore >= totalQuestions / 2) {
        summaryMessage += "Good job! You're well on your way to becoming an Antibiotic Steward.";
    } else {
        summaryMessage += "Thanks for playing! Keep learning about AMR and responsible antibiotic use.";
    }

    setMessages((prev) => [...prev, {
        id: 'quiz-end',
        text: summaryMessage,
        sender: 'bot',
        suggestions: ['Start Over'],
    }]);
    setIsQuizActive(false);
  }, [setMessages]);


  const handleQuizAnswer = useCallback((messageId: string, selectedOption: string) => {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    // Update the question message to show the selected answer
    setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, selectedAnswer: selectedOption } : msg
    ));
    
    if (isCorrect) {
        setScore(prev => prev + 1);
    }
    
    // Add feedback message
    setTimeout(() => {
        const feedbackMessage: Message = {
            id: `feedback-${currentQuestionIndex}`,
            text: isCorrect 
                ? `Correct!\n\n${question.explanation}` 
                : `Not quite. The correct answer is: ${question.correctAnswer}\n\n${question.explanation}`,
            sender: 'bot',
        };
        setMessages(prev => [...prev, feedbackMessage]);

        // Move to next question or end quiz
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < quizQuestions.length) {
            setCurrentQuestionIndex(nextIndex);
            setTimeout(() => showNextQuestion(nextIndex), 1200);
        } else {
            // Calculate final score based on this last answer
            const finalScore = isCorrect ? score + 1 : score;
            setTimeout(() => endQuiz(finalScore), 1200);
        }
    }, 500);
  }, [currentQuestionIndex, score, setMessages, showNextQuestion, endQuiz]);


  const startQuiz = useCallback(() => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setMessages((prev) => [...prev, {
        id: 'quiz-start',
        text: "Great! Let's begin the quiz on the One Health Initiative.",
        sender: 'bot'
    }]);
    setTimeout(() => showNextQuestion(0), 500);
  }, [setMessages, showNextQuestion]);

  return { isQuizActive, startQuiz, handleQuizAnswer };
};