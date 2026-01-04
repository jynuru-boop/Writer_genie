
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { Message, Suggestion } from '../types';
import { INITIAL_SUGGESTIONS, WRITING_GUIDE } from '../constants';

interface ChatInterfaceProps {
  userName: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `안녕, ${userName} 친구! 👋 사탕반 글쓰기 도우미야.\n\n요즘 학교나 집에서 컴퓨터나 인공지능(AI)의 도움을 받아 본 적이 있니? 어떤 점이 가장 편리했는지 들려줄래?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    geminiRef.current = new GeminiService();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showTips]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || isFinished) return;

    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const modelMsg: Message = { role: 'model', text: '', timestamp: new Date() };
      setMessages((prev) => [...prev, modelMsg]);

      let fullText = "";
      const personalizedPrompt = `(학생 이름: ${userName}) ${text}`;
      const stream = geminiRef.current?.sendMessageStream(personalizedPrompt);
      
      if (stream) {
        for await (const chunk of stream) {
          fullText += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...modelMsg, text: fullText };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsFinished(true);
    setShowTips(true);

    const finishPrompt = "지금까지 우리가 나눈 대화를 바탕으로, 내가 5문단 글쓰기를 할 수 있게 '나의 글쓰기 계획표'를 요약해줘. 각 문단에 들어갈 핵심 내용을 짧게 정리해주고, 마지막엔 나를 응원하는 따뜻한 한마디를 남겨줘. 강조 기호(**)는 쓰지 말고 작은따옴표만 사용해줘.";
    
    try {
      const modelMsg: Message = { role: 'model', text: '', timestamp: new Date() };
      setMessages((prev) => [...prev, modelMsg]);

      let fullText = "";
      const stream = geminiRef.current?.sendMessageStream(finishPrompt);
      
      if (stream) {
        for await (const chunk of stream) {
          fullText += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...modelMsg, text: fullText };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setIsFinished(false);
    setShowTips(false);
  };

  const onSuggestionClick = (suggestion: Suggestion) => {
    handleSend(suggestion.prompt);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 p-4 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">사탕반 글쓰기 도우미</h2>
            <p className="text-xs text-indigo-100 mt-1 italic">{userName} 친구의 생각을 문장으로!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded text-white font-medium transition-colors ${showTips ? 'bg-pink-500' : 'bg-indigo-500'}`}>
            {showTips ? '글쓰기 가이드' : '생각 나누기'}
          </span>
          <div className={`w-3 h-3 rounded-full animate-pulse ${showTips ? 'bg-pink-300' : 'bg-green-400'}`}></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth"
      >
        {!showTips ? (
          <>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] mr-2 shrink-0 shadow-sm font-bold">
                      샘
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none ml-2' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none mr-2'
                  }`}>
                    {msg.text || (isLoading && idx === messages.length - 1 ? '작성 중...' : '')}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-500 space-y-8 pb-10">
            {/* AI Summary Section */}
            <div className="bg-white border-2 border-pink-200 rounded-3xl shadow-lg p-6 ring-8 ring-pink-50/50">
               <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-pink-100">
                  <span className="text-2xl">📝</span>
                  <h3 className="text-xl font-bold text-pink-600">나의 글쓰기 계획표</h3>
               </div>
               <div className="text-slate-800 leading-relaxed text-sm md:text-base whitespace-pre-wrap italic bg-pink-50/30 p-4 rounded-xl">
                 {messages[messages.length - 1].text || "계획표를 정리하는 중입니다..."}
               </div>
            </div>

            {/* Writing Tips Structure */}
            <div className="space-y-6">
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2 text-sm">📌</span>
                  글의 큰 흐름 한눈에 보기
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WRITING_GUIDE.flow.map((step, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">
                      {step}
                    </div>
                  ))}
                </div>
              </section>

              {WRITING_GUIDE.paragraphs.map((para, i) => (
                <section key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-indigo-600 px-6 py-3 text-white flex justify-between items-center">
                    <h4 className="font-bold">{para.title}</h4>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{para.topic}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-indigo-500 uppercase mb-1">🤖 챗봇 질문</p>
                      <p className="text-sm md:text-base text-slate-800 leading-relaxed">{para.question}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 mb-2">✍️ 쓰기 도움말</p>
                        <ul className="space-y-2">
                          {para.help.map((h, j) => (
                            <li key={j} className="text-sm text-slate-700 font-medium">{h}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <p className="text-xs font-bold text-orange-600 mb-2">👉 설명 포인트</p>
                        <p className="text-sm text-slate-700">{para.point}</p>
                      </div>
                    </div>
                  </div>
                </section>
              ))}

              <section className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🌱</span>
                  글쓰기 전체 TIP
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WRITING_GUIDE.overallTips.map((tip, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm md:text-base text-green-900 font-medium">
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {isLoading && messages[messages.length - 1].text === '' && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl shadow-sm text-sm border border-slate-200 animate-pulse flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                <span className="ml-2 text-slate-500 font-medium">생각을 정리하고 있어요...</span>
             </div>
          </div>
        )}
      </div>

      {/* Bottom Interface */}
      <div className="shrink-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {!showTips ? (
          <>
            {/* Action Buttons & Suggestions */}
            <div className="px-4 py-3 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">추천 답변</p>
                <button 
                  onClick={handleFinish}
                  className="px-4 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-full border border-pink-200 transition-all flex items-center space-x-1 shadow-sm active:scale-95"
                >
                  <span>이제 내 글을 써볼게요</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                {INITIAL_SUGGESTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSuggestionClick(s)}
                    className="inline-block px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 pt-0">
              <div className="relative flex items-center">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="자유롭게 네 생각을 적어줘..."
                  className="w-full pl-4 pr-14 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 resize-none max-h-32 transition-all outline-none"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 p-2 rounded-xl transition-all ${
                    !input.trim() || isLoading 
                      ? 'text-slate-300' 
                      : 'text-indigo-600 hover:bg-indigo-50 active:scale-90'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-tighter font-medium">
                사탕반 4학년 전용 도우미 • 정답 대신 생각을 나눠요
              </p>
            </div>
          </>
        ) : (
          <div className="p-6 bg-slate-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-1">멋진 글쓰기 준비가 끝났어요! 🎊</h3>
              <p className="text-sm text-slate-500">위의 계획표와 팁을 보며 공책에 글을 써보세요.</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleGoBack}
                className="px-6 py-2.5 bg-white hover:bg-slate-100 text-indigo-600 text-sm font-bold rounded-xl transition-all border border-indigo-200 shadow-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                이전으로 돌아가기
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-300"
              >
                처음부터 다시 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
