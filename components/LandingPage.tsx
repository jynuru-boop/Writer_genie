
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: (name: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="p-8 md:p-12">
          <header className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <span className="inline-block px-4 py-1.5 text-sm font-bold tracking-wider text-pink-600 uppercase bg-pink-100 rounded-full border border-pink-200">
                🍭 사탕반 글쓰기 교실
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              똑똑한 기술의 시대,<br />
              <span className="text-indigo-600">나만의 생각 정리하기</span>
            </h1>
          </header>

          <div className="space-y-6 text-slate-700 leading-relaxed text-center md:text-left bg-slate-50 p-6 md:p-8 rounded-2xl mb-8 border border-slate-100">
            <p className="text-base md:text-lg">
              요즘 우리는 컴퓨터와 인공지능이 도와주는 세상에서 살아가고 있습니다.
              덕분에 공부도 더 편리해지고, 궁금한 것을 빠르게 알 수 있게 되었죠.
            </p>
            <p className="text-base md:text-lg">
              하지만 기술이 많아질수록 우리가 한 번 더 생각해 보아야 할 점도 생깁니다.
            </p>
            <p className="text-base md:text-lg">
              이번 활동에서는 컴퓨터와 인공지능으로 인해 달라진 모습을 살펴보고,
              그 과정에서 생길 수 있는 문제와 우리가 지켜야 할 약속을
              차근차근 생각해 본 뒤 글로 정리해 보려고 합니다.
            </p>
            <p className="text-base md:text-lg font-bold text-indigo-700">
              정답을 찾는 활동이 아니라, 내 생각을 이유와 함께 정리하는 글쓰기 활동입니다.
            </p>
            <p className="text-base md:text-lg">
              질문을 따라가며 생각을 넓히고, 마지막에는 나만의 글을 완성해 봅시다.
            </p>
          </div>

          <div className="space-y-6">
            <div className="max-w-sm mx-auto">
              <label htmlFor="name" className="block text-center text-sm font-semibold text-slate-600 mb-2">
                친구의 이름을 알려줄래?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 적어줘"
                className="w-full px-6 py-4 bg-slate-100 border-2 border-transparent focus:border-indigo-400 focus:bg-white rounded-2xl text-center text-lg font-bold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={!name.trim()}
                className={`px-10 py-4 font-bold text-xl rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center mx-auto ${
                  name.trim() 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 cursor-pointer' 
                  : 'bg-slate-300 text-slate-100 cursor-not-allowed'
                }`}
              >
                활동 시작하기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="mt-4 text-[10px] text-slate-400">
                * 이 챗봇은 사탕반 4학년 글쓰기 활동을 위해 만들어졌어요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
