import React, { useState, useEffect } from 'react';
import type { QuestionnaireQuestion, QuestionnaireAnswer } from '../types';
import { generateDailyQuestions, analyzeQuestionnaireAnswers } from '../services/geminiService';

interface DailyQuestionnaireProps {
  onQuestionnaireComplete: (mood: number | null, stress: number | null, energy: number | null, summary: string) => void;
  previousAnswers: QuestionnaireAnswer[];
}

const DailyQuestionnaire: React.FC<DailyQuestionnaireProps> = ({ onQuestionnaireComplete, previousAnswers }) => {
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      const todayStr = new Date().toLocaleDateString('en-CA');
      const hasAnsweredToday = previousAnswers.some(a => a.date === todayStr);

      if (hasAnsweredToday) {
        setSubmitted(true);
        setIsLoading(false);
        return;
      }

      const previousQuestionTexts = previousAnswers.map(pa => {
          const question = questions.find(q => q.id === pa.questionId);
          return question ? question.text : '';
      }).filter(Boolean);

      const generatedQuestions = await generateDailyQuestions(previousQuestionTexts);
      setQuestions(generatedQuestions);
      setIsLoading(false);
    };
    fetchQuestions();
  }, [previousAnswers]);

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const todayStr = new Date().toLocaleDateString('en-CA');
    const newAnswers: QuestionnaireAnswer[] = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        date: todayStr
    }));

    const analysis = await analyzeQuestionnaireAnswers(newAnswers);
    onQuestionnaireComplete(analysis.mood, analysis.stress, analysis.energy, analysis.summary);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (submitted) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Thanks for your submission!</h3>
            <p className="text-slate-500 dark:text-slate-400">Your insights have been saved. See you tomorrow!</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">AI Daily Reflection</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label htmlFor={q.id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {q.text}
            </label>
            <textarea
              id={q.id}
              rows={3}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
        ))}
        
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(answers).length < questions.length}
          className="w-full bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors disabled:bg-lime-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Analyzing...' : 'Submit Reflection'}
        </button>
      </form>
    </div>
  );
};

export default DailyQuestionnaire;