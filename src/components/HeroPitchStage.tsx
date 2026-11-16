import { useState } from 'react';

const CHATS: readonly (readonly [string, string])[] = [
  [
    '爸爸，禁区前面那个小半圆是干嘛用的？站到别人门前等球为什么算越位？',
    '绿茵场上的每条白线和每声哨响都藏着门道，你问一个，咱们就拆开讲透一个！',
  ],
  [
    '为什么高手停球像脚上有磁铁，接球前还要像拨浪鼓一样回头看身后？',
    '那叫「有方向的第一脚触球」和「抬头扫描」！它们正是区分普通踢球和顶尖高手的秘密。',
  ],
  [
    '咱们回龙观周边居然藏着这么多片森林球场，还有二十多年的「回超」联赛？',
    '对！从家门口的小回超、百队杯、京少联赛一直到职业梯队，整张足球地图都在这儿啦。',
  ],
  [
    '香蕉球为什么会在半空拐大弯，不转的电梯球反而忽左忽右乱飘？',
    '那是空气和旋转在变魔术！点进下面的主题或者战术沙盘，咱们亲眼看看球怎么飞。',
  ],
];

export function HeroPitchStage() {
  const [chatIdx, setChatIdx] = useState(0);
  const [ballToNian, setBallToNian] = useState(true);

  const talk = () => {
    setBallToNian((prev) => !prev);
    setChatIdx((prev) => (prev + 1) % CHATS.length);
  };

  const [nianLine, dadLine] = CHATS[chatIdx];

  return (
    <div
      className="hero-stage"
      onClick={talk}
      role="region"
      aria-label="小念和爸爸在绿茵场上聊足球，点击换一组对话"
    >
      <svg className="hero-pitch-svg" viewBox="0 0 1080 330" aria-hidden="true">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dff3ff" />
            <stop offset="52%" stopColor="#f8fcee" />
            <stop offset="53%" stopColor="#6ed07d" />
            <stop offset="100%" stopColor="#3ca861" />
          </linearGradient>
        </defs>

        <rect width="1080" height="330" fill="url(#skyGrad)" />
        <circle cx="945" cy="56" r="30" fill="#ffe066" opacity="0.9" />
        <path
          d="M0 172 Q180 128 390 164 T820 152 T1080 170 L1080 186 L0 186 Z"
          fill="#b7e4c7"
          opacity="0.72"
        />

        {/* 远处 13 号线列车与树影 */}
        <line x1="0" y1="164" x2="1080" y2="164" stroke="#9ec5ab" strokeWidth="3" />
        <g transform="translate(460, 148)" opacity="0.86">
          <rect x="0" y="0" width="146" height="14" rx="5" fill="#fff9eb" stroke="#e09f3e" strokeWidth="2" />
          <rect x="8" y="3" width="18" height="6" rx="2" fill="#7ec8e3" />
          <rect x="32" y="3" width="18" height="6" rx="2" fill="#7ec8e3" />
          <rect x="56" y="3" width="18" height="6" rx="2" fill="#7ec8e3" />
          <rect x="82" y="3" width="18" height="6" rx="2" fill="#7ec8e3" />
          <rect x="106" y="3" width="18" height="6" rx="2" fill="#7ec8e3" />
        </g>

        {/* 草坪条纹 */}
        <rect x="0" y="172" width="1080" height="158" fill="#49b665" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <polygon
            key={i}
            points={`${110 + i * 170},172 ${205 + i * 170},172 ${245 + i * 185},330 ${70 + i * 185},330`}
            fill="#57c472"
            opacity="0.45"
          />
        ))}

        {/* 球场标线 */}
        <path
          d="M70 322 L170 188 L910 188 L1010 322 Z"
          fill="none"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="3.5"
        />
        <line x1="540" y1="188" x2="540" y2="322" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
        <ellipse cx="540" cy="255" rx="82" ry="30" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
        <circle cx="540" cy="255" r="4.5" fill="#fff" />

        <g stroke="#fff" strokeWidth="4" fill="none">
          <path d="M98 280 L122 220 L152 220 L132 280" opacity="0.9" />
          <path d="M982 280 L958 220 L928 220 L948 280" opacity="0.9" />
        </g>

        {/* 传球弧线 */}
        <path
          d={ballToNian ? 'M355 272 Q540 220 710 276' : 'M710 276 Q540 226 355 272'}
          fill="none"
          stroke="#fff8d6"
          strokeWidth="3"
          strokeDasharray="8 7"
          opacity="0.9"
        />

        {/* 爸爸 */}
        <g transform="translate(310, 180)">
          <ellipse cx="32" cy="105" rx="24" ry="7" fill="rgba(0,0,0,0.18)" />
          <rect x="20" y="72" width="9" height="28" rx="4" fill="#234e3c" />
          <rect x="35" y="72" width="9" height="28" rx="4" fill="#234e3c" />
          <rect x="14" y="42" width="36" height="34" rx="10" fill="#2f7a58" />
          <rect x="17" y="10" width="30" height="31" rx="10" fill="#eab892" />
          <path d="M15 21c-1-10 5-15 17-15s18 5 17 15c-3-5-8-7-15-7-5 0-9 1-12 4z" fill="#2a1c14" />
          <circle cx="26" cy="25" r="2" fill="#2e1d14" />
          <circle cx="38" cy="25" r="2" fill="#2e1d14" />
          <circle cx="26" cy="25" r="4.6" fill="none" stroke="#24242c" strokeWidth="1.6" />
          <circle cx="38" cy="25" r="4.6" fill="none" stroke="#24242c" strokeWidth="1.6" />
          <line x1="30.6" y1="25" x2="33.4" y2="25" stroke="#24242c" strokeWidth="1.6" />
          <path d="M28 33c2.5 2 6.5 2 9 0" stroke="#2e1d14" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>

        {/* 小念 */}
        <g transform="translate(705, 200)">
          <ellipse cx="28" cy="85" rx="20" ry="6" fill="rgba(0,0,0,0.18)" />
          <rect x="17" y="58" width="8" height="22" rx="4" fill="#f5c9a6" />
          <rect x="31" y="58" width="8" height="22" rx="4" fill="#f5c9a6" />
          <rect x="15" y="76" width="11" height="6" rx="3" fill="#ff9f43" />
          <rect x="30" y="76" width="11" height="6" rx="3" fill="#ff9f43" />
          <rect x="13" y="34" width="30" height="26" rx="9" fill="#ff8a5c" />
          <text x="28" y="51" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff8e7">
            10
          </text>
          <rect x="14" y="6" width="28" height="27" rx="10" fill="#f5c9a6" />
          <path d="M12 17c0-9 6-14 16-14s16 5 16 14c-4-4-8-6-13-6 0 2-5 3-9 3-4 0-6 0-10 3z" fill="#5a3a22" />
          <circle cx="23" cy="20" r="2" fill="#3a2418" />
          <circle cx="33" cy="20" r="2" fill="#3a2418" />
          <ellipse cx="19" cy="24" rx="2.6" ry="1.5" fill="#ff8fa0" opacity="0.6" />
          <ellipse cx="37" cy="24" rx="2.6" ry="1.5" fill="#ff8fa0" opacity="0.6" />
          <path d="M24.5 26c2 1.8 5 1.8 7 0" stroke="#3a2418" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>

        {/* 足球 */}
        <g
          className="hero-ball"
          style={{
            transform: `translate(${ballToNian ? 682 : 366}px, ${ballToNian ? 274 : 270}px)`,
          }}
        >
          <ellipse cx="0" cy="14" rx="13" ry="4" fill="rgba(0,0,0,0.22)" />
          <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#2b332e" strokeWidth="2" />
          <polygon points="0,-6 5.5,-2 3.5,4.8 -3.5,4.8 -5.5,-2" fill="#2b332e" />
        </g>
      </svg>

      <button
        type="button"
        className="hero-bubble is-dad"
        onClick={(e) => {
          e.stopPropagation();
          talk();
        }}
      >
        <b>爸爸</b>
        {dadLine}
      </button>

      <button
        type="button"
        className="hero-bubble is-nian"
        onClick={(e) => {
          e.stopPropagation();
          talk();
        }}
      >
        <b>小念</b>
        {nianLine}
      </button>
    </div>
  );
}
