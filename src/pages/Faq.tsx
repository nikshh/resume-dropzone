
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "Как работает интервью с ИИ?",
    answer: "Интервью с ИИ проходит в формате диалога. После загрузки вашего резюме, система анализирует его и задает вам вопросы, релевантные вашему опыту и навыкам. Вы отвечаете на вопросы, а система дает обратную связь и рекомендации по улучшению ваших ответов."
  },
  {
    id: 2,
    question: "Какие форматы резюме поддерживаются?",
    answer: "Система поддерживает популярные форматы документов, включая PDF, DOCX, DOC и TXT. Для наилучших результатов рекомендуется использовать PDF формат, так как он сохраняет форматирование и легко обрабатывается нашей системой."
  },
  {
    id: 3,
    question: "Как подготовиться к интервью?",
    answer: "Для подготовки к интервью рекомендуется обновить ваше резюме, убедиться, что все достижения и навыки указаны четко. Также полезно подготовить краткий рассказ о себе и основных проектах, в которых вы участвовали. Подумайте заранее о примерах из вашего опыта, иллюстрирующих ваши навыки."
  },
  {
    id: 4,
    question: "Сколько длится интервью?",
    answer: "Длительность интервью может варьироваться от 15 до 30 минут в зависимости от вашего опыта и позиции, на которую вы претендуете. Вы можете сделать паузу в любой момент и продолжить интервью позже."
  },
  {
    id: 5,
    question: "Как получить обратную связь после интервью?",
    answer: "После завершения интервью система автоматически генерирует отчет с обратной связью. В нем будут указаны ваши сильные стороны, области для улучшения и конкретные рекомендации. Отчет будет доступен в вашем личном кабинете, также вы получите его копию на указанный email."
  }
];

const Faq: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { expandTelegram, isExpanded } = useTelegram();

  React.useEffect(() => {
    if (!isExpanded) {
      expandTelegram();
    }
  }, [isExpanded, expandTelegram]);

  const toggleQuestion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 sm:px-8 lg:px-12 pt-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-indigo-600 flex items-center">
            <ChevronLeft size={20} />
            <span>Назад</span>
          </Link>
          <div className="bg-blue-100 px-4 py-1.5 rounded-full flex items-center">
            <span className="text-blue-600 font-semibold tracking-wide opacity-85">Prointerview</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-6 sm:px-8 lg:px-12 py-6 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Ответы на вопросы</h1>
        
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 text-left"
                onClick={() => toggleQuestion(item.id)}
              >
                <span className="font-medium text-gray-800">{item.question}</span>
                {expandedId === item.id ? (
                  <ChevronUp className="text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {expandedId === item.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 animate-fade-in">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Faq;
