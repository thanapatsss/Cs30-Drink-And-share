import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Beer,
  Wine,
  Users,
  Receipt,
  Shuffle,
  Plus,
  X,
  Timer,
  Sparkles,
  RotateCcw,
  Check,
  ChevronRight,
  Save,
  History,
  Trash2,
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS — nightlife bar palette
--------------------------------------------------------- */
const C = {
  void: "#15121C",
  surface: "#1F1B29",
  surface2: "#282234",
  line: "#3A3348",
  amber: "#E8A33D",
  red: "#E8574B",
  teal: "#4FD1C5",
  cream: "#F4EFE6",
  muted: "#9C96AC",
  paper: "#F3EEE0",
  paperLine: "#D8CFB8",
  ink: "#2B2418",
  inkMuted: "#7A7263",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
    .bn-display { font-family: 'Bebas Neue', 'Inter', sans-serif; letter-spacing: 0.03em; }
    .bn-body { font-family: 'Inter', sans-serif; }
    .bn-mono { font-family: 'Space Mono', monospace; }
    .bn-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .bn-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
  `}</style>
);

/* ---------------------------------------------------------
   GAME CONTENT
--------------------------------------------------------- */
const NHIE = [
  "แอบชอบเพื่อนสนิทของตัวเอง",
  "โกหกอาจารย์เพื่อลาหยุด",
  "ร้องไห้ในหนัง",
  "แอบส่องโซเชียลแฟนเก่า",
  "หลับในคลาสเรียน",
  "โดดเรียนทั้งวัน",
  "แกล้งป่วยเพื่อไม่ไปเรียน",
  "เมาแล้วโทรหาแฟนเก่า",
  "ลืมวันเกิดเพื่อนสนิท",
  "เต้นบนโต๊ะในร้านเหล้า",
  "แอบชอบเเฟนเพื่อน",
  "มีFWB",
];

const MOST_LIKELY = [
  "รวยที่สุดในวงใน 10 ปีข้างหน้า",
  "แต่งงานคนแรกในกลุ่มนี้",
  "ลืมกระเป๋าสตางค์ไว้ที่ร้าน",
  "เมาไม่ได้สติก่อนใครในวงนี้",
  "ใครมีแนวโน้มจะ จูบคนในกลุ่มก่อน",
  "หนีไปเที่ยวต่างประเทศแบบไม่บอกใคร",
  "ตอบแชทงานตอนตีสาม",
  "เผลอกดไลก์รูปแฟนเก่าย้อนหลัง",
  "จะเป็นคนจ่ายบิลทั้งวงถ้าเมามาก",
  "หลงทางกลับบ้านคืนนี้",
  "ใครมีแนวโน้มจะ แอบมีใจให้คนในวง",
  "ใครมีแนวโน้มจะ ไปเดตกับเพื่อนในกลุ่ม",
  "ใครมีแนวโน้มจะ เผลอทำอะไรเกินคำว่าเพื่อนก่อน",
  "ใครมีแนวโน้มจะ หวั่นไหวง่ายเวลาโดนอ้อน",
  "ใครมีแนวโน้มจะ ตกหลุมรักเพราะสบตา",
  "ใครมีแนวโน้มจะเป็นคนแรกที่สารภาพว่าชอบใครในวงนี้",
  "ใครมีแนวโน้มจะ โสดนานที่สุด",
  "ใครมีแนวโน้มจะ กลับไปคุยกับแฟนเก่า",
  "ใครมีแนวโน้มจะ อกหักแล้วร้องไห้หนักที่สุด",
  "ใครมีแนวโน้มจะ เจ้าชู้ที่สุด",
  "ใครมีแนวโน้มจะ มีคนคุยหลายคนที่สุด",
  "ใครมีแนวโน้มจะ ส่องสตอล์กคนที่ชอบหนักที่สุด",
  "ใครมีแนวโน้มจะ บอกว่าลืมแฟนเก่าแล้ว แต่จริง ๆ ยังไม่ลืม",
  "ใครมีแนวโน้มจะ มีความลับเยอะที่สุด",
  "ใครมีแนวโน้มจะ นอนทั้งวันโดยไม่ออกจากห้อง",
  "ใครมีแนวโน้มจะจูบเพื่อนเพราะบรรยากาศพาไป",
  "ใครมีแนวโน้มจะเผลอสารภาพความรู้สึกตอนเมา?",
  "ใครมีแนวโน้มจะเปลี่ยนสถานะจากเพื่อนเป็นคนคุย",
  "ใครในวงนี้มีแนวโน้มจะเคยคิดเกินเพื่อนกับคนในกลุ่มมากที่สุด",
  "ใครมีแนวโน้มจะเลือกเพื่อนคนหนึ่งไปอยู่ด้วยกันสองต่อสองถ้ามีโอกาส",
  "ใครมีแนวโน้มจะหวั่นไหวที่สุด ถ้าต้องใกล้ชิดกับคนที่ตรงสเปก",
  "ครมีแนวโน้มจะเป็นคนแรกที่ “เผลอใจ” ให้เพื่อน?",
  "ใครมีแนวโน้มจะทำให้วงแตกเพราะเรื่องความรัก",
  ""
];

const TRUTH = [
  "เรื่องที่น่าอายที่สุดที่เคยทำตอนเมา",
  "แอบชอบใครในsecตอนนี้ไหม",
  "เคยโกหกเรื่องอะไรที่ใหญ่ที่สุด",
  "ความลับที่ไม่เคยบอกใครในวงนี้",
  "เรื่องที่เสียใจที่สุดในความสัมพันธ์ที่ผ่านมา",
  "ในกลุ่มนี้ใครตรงสเปกคุณที่สุด?",
  "เคยแอบอ่านข้อความในมือถือแฟนไหม",
  "ถ้าเลือกคนในวงนี้ไปเดตได้ 1 คนจะเลือกใคร",
  "ถ้าต้องจูบคนในกลุ่ม 1 คน จะเลือกใคร",
  "เคยคิดเกินเพื่อนกับใครในวงนี้ไหม",
  "ใครในกลุ่มที่คุณคิดว่าเซ็กซี่ที่สุด",
 "ถ้าต้องนอนเตียงเดียวกับคนในนี้ จะเลือกใคร",
 "ในกลุ่มนี้ใครที่คุณอยากลองคุยด้วย ถ้าไม่มีคำว่า “เพื่อน” ",
 "ใครในกลุ่มที่คุณคิดว่าจูบน่าจะเก่งที่สุด",
 "คนในกลุ่มนี้คนไหนที่คุณไว้ใจให้อยู่ด้วยกันสองต่อสองมากที่สุด",
 "ถ้าต้องไปเที่ยวต่างจังหวัดกับคนเดียวในวง จะเลือกใคร",
 "ใครในกลุ่มที่คุณคิดว่าถ้าแต่งตัวจัดเต็มแล้วจะดูดีสุด",
 "ถ้าต้องให้คะแนนความน่าดึงดูดของคนในกลุ่ม ใครได้ 10/10",
 "คนล่าสุดที่คุณแอบคิดถึงคือใคร",
 "ถ้าต้องแลกโทรศัพท์กับคนในกลุ่ม 1 คน คุณกลัวของใครที่สุด",
 "ถ้าต้องจับมือกับคนในกลุ่มตลอดทั้งวัน จะเลือกใคร",
 "ถ้าให้เลือกคนหนึ่งมากอดตอนนี้ จะเลือกใคร",
 "ถ้าคนในกลุ่ม 2 คนต้องคบกัน คุณจะจับคู่ใคร",
 "ถ้าต้องสารภาพความลับ 1 เรื่องที่ไม่มีใครรู้ จะเป็นอะไร",
 "ในกลุ่มนี้ใครที่คุณคิดว่ามีเสน่ห์เวลาอยู่ใกล้ ๆ",
 "ถ้าต้องให้คะแนนความน่าดึงดูดของคนในกลุ่ม ใครได้ 10/10",
 "ถ้าคนที่คุณชอบโทรมาตอนนี้ คุณจะทิ้งเกมไปคุยไหม",
 "เคยมีโมเมนต์กับเพื่อนคนไหนที่ทำให้คิดว่า “นี่เราเกินเพื่อนหรือเปล่า”",
 "ในกลุ่มนี้ใครที่คุณคิดว่า “อันตรายต่อใจ” ที่สุด",
 "ใครในกลุ่มที่คุณอยากรู้จักให้ลึกกว่านี้",
 "ถ้าต้องสารภาพความลับ 1 เรื่องที่ไม่มีใครรู้ จะเป็นอะไร",

];

const CATEGORIES = [
  "ชื่อจังหวัดในไทย",
  "ยี่ห้อรถยนต์",
  "ชื่อดาราไทย",
  "เมนูอาหารทะเล",
  "ชื่อประเทศ",
  "แบรนด์เบียร์",
  "ชื่อเพลงลูกทุ่ง",
  "ชื่อผลไม้",
  "ยี่ห้อมือถือ",
  "ชื่อซีรีส์เกาหลี",
  "ชื่อวงดนตรี",
  "ชื่อสัตว์",
  "ชื่ออาหาร",
  "ชื่อเครื่องดื่ม",
  "ชื่อดาราต่างประเทศ",
  "ชื่อแอปมือถือ",
  "ชื่อสถานที่ท่องเที่ยว",
  "ชื่อเกม",
  "ชื่อดอกไม้",
  "ชื่อเครื่องดนตรี",
  "ชื่อเทศกาล",
  "ชื่อกีฬา",
  "ชื่อเครื่องใช้ไฟฟ้า",
  "sex toy",
  "ชื่อเพื่อนใน sec",
  "ชื่อเพื่อนในกลุ่ม",
  "ชื่อเพื่อนในมหาลัย",
  "ชื่อคนที่ชอบ",
];

const KING_RULES = {
  A: "ทุกคนดื่มพร้อมกัน",
  "2": "คุณ = ชี้ให้ใครดื่มก็ได้ 1 คน",
  "3": "คนจั่วดื่มเอง",
  "4": "ทุกคนแตะพื้น คนสุดท้ายดื่ม",
  "5": "ผู้ชายทุกคนดื่ม (หรือเปลี่ยนกติกาตามวง)",
  "6": "ผู้หญิงทุกคนดื่ม (หรือเปลี่ยนกติกาตามวง)",
  "7": "ทุกคนยกมือขึ้น คนสุดท้ายดื่ม",
  "8": "เลือกคู่หู ต้องดื่มด้วยกันตลอดเกม",
  "9": "พูดคำว่า 'ตู้ม' ใครพูดช้าสุดดื่ม",
  "10": "ตั้งกฎใหม่ ใครทำผิดกฎดื่ม",
  J: "ตั้งกฎประจำเกม (เช่น ห้ามพูดชื่อใครในวง)",
  Q: "ตั้งคำถาม คนตอบไม่ได้ดื่ม",
  K: "King's Cup! คนจั่วเทเหล้าตัวเองใส่แก้วกลาง ใครจั่วใบสุดท้ายดื่มแก้วกลางทั้งหมด",
};
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function buildDeck() {
  const deck = [];
  RANKS.forEach((r) => SUITS.forEach((s) => deck.push({ rank: r, suit: s })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------------------------------------------------
   localStorage helpers
--------------------------------------------------------- */
const LS_BILL_KEY = "barnight_current_bill_v1";
const LS_HISTORY_KEY = "barnight_bill_history_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore, app still works in-memory */
  }
}

/* ---------------------------------------------------------
   SHARED UI BITS
--------------------------------------------------------- */
function Chip({ children, active, onClick, style }) {
  return (
    <button
      onClick={onClick}
      className="bn-body"
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${active ? C.amber : C.line}`,
        background: active ? "rgba(232,163,61,0.15)" : "transparent",
        color: active ? C.amber : C.muted,
        cursor: "pointer",
        transition: "all .15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, color = C.amber, style, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="bn-body"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 22px",
        borderRadius: 12,
        border: "none",
        background: color,
        color: C.void,
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: `0 4px 14px ${color}44`,
        ...style,
      }}
    >
      {Icon && <Icon size={17} />}
      {children}
    </button>
  );
}

/* ---------------------------------------------------------
   PROMPT-STYLE GAME (NHIE / Most Likely / Truth)
--------------------------------------------------------- */
function PromptGame({ prompts, label, accent }) {
  const [order, setOrder] = useState(() => shuffle(prompts.map((_, i) => i)));
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(1);

  const next = () => {
    if (idx + 1 >= order.length) {
      setOrder(shuffle(prompts.map((_, i) => i)));
      setIdx(0);
    } else {
      setIdx(idx + 1);
    }
    setCount((c) => c + 1);
  };

  const text = prompts[order[idx]];

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: "40px 28px",
          minHeight: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <p className="bn-body" style={{ color: C.cream, fontSize: 20, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
          {label} {text}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <span className="bn-mono" style={{ color: C.muted, fontSize: 12 }}>
          ข้อที่ {count}
        </span>
        <PrimaryButton onClick={next} color={accent} icon={ChevronRight}>
          ข้อถัดไป
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CATEGORIES GAME (spin + timer)
--------------------------------------------------------- */
function CategoriesGame() {
  const [cat, setCat] = useState(null);
  const CATEGORY_TIME = 30; 
  const [seconds, setSeconds] = useState(CATEGORY_TIME);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const spin = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setCat(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    setSeconds(CATEGORY_TIME);
  };

  const start = () => {
    if (!cat || running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: "36px 28px",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {cat ? (
          <>
            <span className="bn-body" style={{ color: C.muted, fontSize: 13 }}>
              หมวดหมู่คือ
            </span>
            <p className="bn-display" style={{ color: C.amber, fontSize: 34, margin: 0 }}>
              {cat}
            </p>
          </>
        ) : (
          <p className="bn-body" style={{ color: C.muted, margin: 0 }}>
            กดสุ่มหมวดหมู่เพื่อเริ่มเกม
          </p>
        )}
        {cat && (
          <div
            className="bn-mono"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: seconds <= 3 ? C.red : C.teal,
              marginTop: 6,
            }}
          >
            00:{String(seconds).padStart(2, "0")}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <PrimaryButton onClick={spin} icon={Shuffle} color={C.amber}>
          สุ่มหมวดหมู่
        </PrimaryButton>
        <PrimaryButton onClick={start} icon={Timer} color={C.teal} style={{ opacity: cat && !running ? 1 : 0.5 }}>
          เริ่มจับเวลา
        </PrimaryButton>
      </div>
      <p className="bn-body" style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>
        ผลัดกันพูดชื่อในหมวดนั้นห้ามซ้ำ ใครนึกไม่ออกก่อนเวลาหมดโดนดื่ม
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   COUNT-TO-7 GAME (นับเลขข้าม 7)
--------------------------------------------------------- */
function CountSevenGame() {
  const [num, setNum] = useState(1);
  const [fails, setFails] = useState(0);

  const isTrap = (n) => n % 7 === 0 || n.toString().includes("7");

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: C.surface2,
          border: `1px solid ${isTrap(num) ? C.red : C.line}`,
          borderRadius: 20,
          padding: "36px 28px",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 18,
        }}
      >
        <p className="bn-display" style={{ fontSize: 64, margin: 0, color: isTrap(num) ? C.red : C.cream }}>
          {num}
        </p>
        {isTrap(num) ? (
          <p className="bn-body" style={{ color: C.red, fontWeight: 700, fontSize: 15, margin: 0 }}>
            เลขนี้ต้องพูดว่า "ปุ๊ก" ห้ามพูดตัวเลข!
          </p>
        ) : (
          <p className="bn-body" style={{ color: C.muted, fontSize: 13, margin: 0 }}>
            พูดตัวเลขนี้แล้วส่งต่อให้คนถัดไป
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <PrimaryButton onClick={() => setNum((n) => n + 1)} icon={ChevronRight} color={C.amber}>
          ถัดไป
        </PrimaryButton>
        <button
          onClick={() => {
            setFails((f) => f + 1);
            setNum(1);
          }}
          className="bn-body"
          style={{
            padding: "12px 22px",
            borderRadius: 12,
            border: `1px solid ${C.red}`,
            background: "transparent",
            color: C.red,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          พูดพลาด! ดื่ม + เริ่มใหม่
        </button>
      </div>
      <p className="bn-mono" style={{ color: C.muted, fontSize: 12, marginTop: 12 }}>
        จำนวนครั้งที่พลาดในวงนี้: {fails}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   KING'S CUP GAME
--------------------------------------------------------- */
function KingsCupGame() {
  const [deck, setDeck] = useState(() => buildDeck());
  const [current, setCurrent] = useState(null);

  const draw = () => {
    if (deck.length === 0) return;
    const [top, ...rest] = deck;
    setCurrent(top);
    setDeck(rest);
  };

  const reset = () => {
    setDeck(buildDeck());
    setCurrent(null);
  };

  const isRed = current && (current.suit === "♥" || current.suit === "♦");

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          background: C.surface2,
          border: `1px solid ${C.line}`,
          borderRadius: 20,
          padding: "32px 28px",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {current ? (
          <>
            <div
              style={{
                width: 90,
                height: 128,
                borderRadius: 10,
                background: C.paper,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              <span className="bn-display" style={{ fontSize: 30, color: isRed ? C.red : C.ink }}>
                {current.rank}
              </span>
              <span style={{ fontSize: 30, color: isRed ? C.red : C.ink }}>{current.suit}</span>
            </div>
            <p className="bn-body" style={{ color: C.cream, fontSize: 15, maxWidth: 380, margin: 0 }}>
              {KING_RULES[current.rank]}
            </p>
          </>
        ) : (
          <p className="bn-body" style={{ color: C.muted, margin: 0 }}>
            กดจั่วไพ่เพื่อเริ่มเกม — เหลือในกอง {deck.length} ใบ
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {deck.length > 0 ? (
          <PrimaryButton onClick={draw} icon={Sparkles} color={C.amber}>
            จั่วไพ่ ({deck.length} ใบเหลือ)
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={reset} icon={RotateCcw} color={C.red}>
            หมดกอง! เริ่มใหม่
          </PrimaryButton>
        )}
        {current && deck.length > 0 && (
          <button
            onClick={reset}
            className="bn-body"
            style={{
              padding: "12px 22px",
              borderRadius: 12,
              border: `1px solid ${C.line}`,
              background: "transparent",
              color: C.muted,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            สับกองใหม่
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   GAMES TAB
--------------------------------------------------------- */
const GAME_LIST = [
  { id: "nhie", name: "ฉันไม่เคย", icon: Wine, desc: "เผยความลับในวง" },
  { id: "mostlikely", name: "ใครมีแนวโน้มจะ...", icon: Users, desc: "ชี้นิ้วหาคำตอบ" },
  { id: "truth", name: "Truth or Drink", icon: Sparkles, desc: "ตอบตรงๆ หรือดื่ม" },
  { id: "categories", name: "บอกหมวดหมู่", icon: Timer, desc: "จับเวลาแข่งไหวพริบ" },
  { id: "count7", name: "นับเลขข้าม 7", icon: Beer, desc: "ปุ๊กให้ทัน ห้ามพลาด" },
  { id: "kingscup", name: "ไพ่ราชา", icon: Sparkles, desc: "จั่วไพ่ลุ้นกติกา" },
];

function GamesTab() {
  const [active, setActive] = useState("nhie");

  const renderGame = () => {
    switch (active) {
      case "nhie":
        return <PromptGame prompts={NHIE} label="ฉันไม่เคย..." accent={C.amber} />;
      case "mostlikely":
        return <PromptGame prompts={MOST_LIKELY} label="ใครในวงมีแนวโน้มจะ" accent={C.teal} />;
      case "truth":
        return <PromptGame prompts={TRUTH} label="" accent={C.red} />;
      case "categories":
        return <CategoriesGame />;
      case "count7":
        return <CountSevenGame />;
      case "kingscup":
        return <KingsCupGame />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div
        className="bn-scroll"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 14,
          marginBottom: 20,
        }}
      >
        {GAME_LIST.map((g) => {
          const Icon = g.icon;
          const isActive = active === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className="bn-body"
              style={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 6,
                width: 140,
                padding: "14px 14px",
                borderRadius: 16,
                border: `1px solid ${isActive ? C.amber : C.line}`,
                background: isActive ? "rgba(232,163,61,0.12)" : C.surface,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon size={20} color={isActive ? C.amber : C.muted} />
              <span style={{ color: isActive ? C.amber : C.cream, fontWeight: 700, fontSize: 13.5 }}>
                {g.name}
              </span>
              <span style={{ color: C.muted, fontSize: 11 }}>{g.desc}</span>
            </button>
          );
        })}
      </div>
      {renderGame()}
    </div>
  );
}

/* ---------------------------------------------------------
   BILL SPLITTER TAB — receipt-styled, persisted to localStorage
--------------------------------------------------------- */
let uid = 0;
const newId = () => `id_${Date.now()}_${uid++}`;

const DEFAULT_BILL = {
  people: [
    { id: newId(), name: "คนที่ 1" },
    { id: newId(), name: "คนที่ 2" },
  ],
  items: [],
  servicePct: 0,
  vatPct: 0,
  splitMode: "even", // "even" = หารรวมเท่ากันทุกคน (แบบเดิม) | "items" = หารแยกตามคนที่กิน
};

function BillTab() {
  const [bill, setBill] = useState(() => loadJSON(LS_BILL_KEY, DEFAULT_BILL));
  const [history, setHistory] = useState(() => loadJSON(LS_HISTORY_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const { people, items, servicePct, vatPct } = bill;
  const splitMode = bill.splitMode || "even"; // fallback for bills saved before this field existed

  useEffect(() => {
    saveJSON(LS_BILL_KEY, bill);
  }, [bill]);

  const update = (patch) => setBill((b) => ({ ...b, ...patch }));
  const setSplitMode = (mode) => update({ splitMode: mode });

  const addPerson = () => {
    const name = newPersonName.trim() || `คนที่ ${people.length + 1}`;
    update({ people: [...people, { id: newId(), name }] });
    setNewPersonName("");
  };

  const removePerson = (id) => {
    update({
      people: people.filter((p) => p.id !== id),
      items: items.map((it) => ({ ...it, assignedTo: it.assignedTo.filter((pid) => pid !== id) })),
    });
  };

  const addItem = () => {
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price) || price <= 0) return;
    update({
      items: [
        ...items,
        {
          id: newId(),
          name: itemName.trim(),
          price,
          shareAll: true,
          assignedTo: people.map((p) => p.id),
        },
      ],
    });
    setItemName("");
    setItemPrice("");
  };

  const removeItem = (id) => update({ items: items.filter((it) => it.id !== id) });

  const toggleShareAll = (id) => {
    update({
      items: items.map((it) => {
        if (it.id !== id) return it;
        const shareAll = !it.shareAll;
        return { ...it, shareAll, assignedTo: shareAll ? people.map((p) => p.id) : [] };
      }),
    });
  };

  const togglePersonOnItem = (itemId, personId) => {
    update({
      items: items.map((it) => {
        if (it.id !== itemId) return it;
        const has = it.assignedTo.includes(personId);
        const assignedTo = has ? it.assignedTo.filter((id) => id !== personId) : [...it.assignedTo, personId];
        return { ...it, assignedTo, shareAll: assignedTo.length === people.length };
      }),
    });
  };

  const totals = useMemo(() => {
    const map = {};
    people.forEach((p) => (map[p.id] = { subtotal: 0, lines: [] }));
    let grandSubtotal = 0;

    if (splitMode === "even") {
      // หารรวมเท่ากันทุกคน — ไม่สนใจว่าใครกินอะไร ทุกรายการหารเฉลี่ยให้ทุกคนในวงเท่าๆ กัน
      const n = people.length;
      items.forEach((it) => {
        grandSubtotal += it.price;
        if (n === 0) return;
        const share = it.price / n;
        people.forEach((p) => {
          map[p.id].subtotal += share;
          map[p.id].lines.push({ name: it.name, share, splitCount: n });
        });
      });
    } else {
      // หารแยกตามคนที่กิน — แต่ละรายการหารเฉพาะคนที่ถูกเลือกไว้
      items.forEach((it) => {
        const targets = it.assignedTo.length ? it.assignedTo : [];
        if (targets.length === 0) return;
        const share = it.price / targets.length;
        grandSubtotal += it.price;
        targets.forEach((pid) => {
          if (!map[pid]) return;
          map[pid].subtotal += share;
          map[pid].lines.push({ name: it.name, share, splitCount: targets.length });
        });
      });
    }

    const svc = Number(servicePct) || 0;
    const vat = Number(vatPct) || 0;
    const extraPct = (svc + vat) / 100;
    let grandTotal = 0;
    people.forEach((p) => {
      const t = map[p.id];
      t.extra = t.subtotal * extraPct;
      t.total = t.subtotal + t.extra;
      grandTotal += t.total;
    });
    return { map, grandSubtotal, grandTotal };
  }, [people, items, servicePct, vatPct, splitMode]);

  const saveBillToHistory = () => {
    if (items.length === 0) return;
    const snapshot = {
      id: newId(),
      date: new Date().toISOString(),
      people: people.map((p) => ({ name: p.name, total: totals.map[p.id]?.total || 0 })),
      grandTotal: totals.grandTotal,
    };
    const nextHistory = [snapshot, ...history].slice(0, 30);
    setHistory(nextHistory);
    saveJSON(LS_HISTORY_KEY, nextHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    saveJSON(LS_HISTORY_KEY, []);
  };

  const startNewBill = () => {
    const fresh = {
      people: [
        { id: newId(), name: "คนที่ 1" },
        { id: newId(), name: "คนที่ 2" },
      ],
      items: [],
      servicePct: 0,
      vatPct: 0,
      splitMode: "even",
    };
    setBill(fresh);
  };

  return (
    <div>
      {/* People manager */}
      <div style={{ marginBottom: 20 }}>
        <p className="bn-body" style={{ color: C.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
          คนในวง
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {people.map((p) => (
            <span
              key={p.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 10px 7px 14px",
                borderRadius: 999,
                background: C.surface2,
                border: `1px solid ${C.line}`,
                color: C.cream,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {p.name}
              <button
                onClick={() => removePerson(p.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
            placeholder="ชื่อเพื่อนในวง"
            className="bn-body"
            style={{
              flex: 1,
              background: C.surface2,
              border: `1px solid ${C.line}`,
              borderRadius: 10,
              padding: "10px 14px",
              color: C.cream,
              fontSize: 14,
              outline: "none",
            }}
          />
          <PrimaryButton onClick={addPerson} icon={Plus} color={C.teal} style={{ padding: "10px 16px" }}>
            เพิ่มคน
          </PrimaryButton>
        </div>
      </div>

      {/* Split mode toggle */}
      <div style={{ marginBottom: 20 }}>
        <p className="bn-body" style={{ color: C.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
          วิธีหารบิล
        </p>
        <div
          style={{
            display: "flex",
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: 4,
            gap: 4,
          }}
        >
          {[
            { id: "even", label: "หารรวมเท่ากันทุกคน" },
            { id: "items", label: "หารแยกตามคนที่กิน" },
          ].map((m) => {
            const isActive = splitMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSplitMode(m.id)}
                className="bn-body"
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: 10,
                  border: "none",
                  background: isActive ? C.amber : "transparent",
                  color: isActive ? C.void : C.muted,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        <p className="bn-body" style={{ color: C.muted, fontSize: 11.5, margin: "8px 0 0" }}>
          {splitMode === "even"
            ? "ทุกรายการที่เพิ่ม จะถูกหารเฉลี่ยให้ทุกคนในวงเท่าๆ กัน"
            : "เลือกได้ว่าแต่ละรายการใครกินบ้าง ระบบจะหารเฉพาะคนที่เลือกไว้"}
        </p>
      </div>

      {/* Item add form */}
      <div style={{ marginBottom: 20 }}>
        <p className="bn-body" style={{ color: C.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
          เพิ่มรายการอาหาร/เครื่องดื่ม
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="เช่น เฟรนช์ฟราย"
            className="bn-body"
            style={{
              flex: "2 1 160px",
              background: C.surface2,
              border: `1px solid ${C.line}`,
              borderRadius: 10,
              padding: "10px 14px",
              color: C.cream,
              fontSize: 14,
              outline: "none",
            }}
          />
          <input
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="ราคา"
            type="number"
            className="bn-mono"
            style={{
              flex: "1 1 90px",
              background: C.surface2,
              border: `1px solid ${C.line}`,
              borderRadius: 10,
              padding: "10px 14px",
              color: C.cream,
              fontSize: 14,
              outline: "none",
            }}
          />
          <PrimaryButton onClick={addItem} icon={Plus} color={C.amber} style={{ padding: "10px 16px" }}>
            เพิ่มรายการ
          </PrimaryButton>
        </div>
      </div>

      {/* Items list w/ assignment */}
      {items.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <span style={{ color: C.cream, fontWeight: 700, fontSize: 14.5 }}>{it.name}</span>{" "}
                  <span className="bn-mono" style={{ color: C.amber, fontSize: 14 }}>
                    ฿{it.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}
                >
                  <X size={16} />
                </button>
              </div>
              {splitMode === "items" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Chip active={it.shareAll} onClick={() => toggleShareAll(it.id)}>
                      หารทุกคน
                    </Chip>
                    <span style={{ color: C.muted, fontSize: 12 }}>หรือเลือกเฉพาะคนที่กิน 👇</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {people.map((p) => {
                      const on = it.assignedTo.includes(p.id);
                      return (
                        <Chip key={p.id} active={on} onClick={() => togglePersonOnItem(it.id, p.id)} style={{ fontSize: 12, padding: "5px 11px" }}>
                          {on && <Check size={11} style={{ marginRight: 3, verticalAlign: -1 }} />}
                          {p.name}
                        </Chip>
                      );
                    })}
                  </div>
                  {it.assignedTo.length > 0 && (
                    <p className="bn-mono" style={{ color: C.muted, fontSize: 11.5, marginTop: 8, marginBottom: 0 }}>
                      หารกัน {it.assignedTo.length} คน ➜ คนละ ฿{(it.price / it.assignedTo.length).toFixed(2)}
                    </p>
                  )}
                  {it.assignedTo.length === 0 && (
                    <p className="bn-body" style={{ color: C.red, fontSize: 11.5, marginTop: 8, marginBottom: 0 }}>
                      ยังไม่มีใครถูกเลือกสำหรับรายการนี้
                    </p>
                  )}
                </>
              ) : (
                people.length > 0 && (
                  <p className="bn-mono" style={{ color: C.muted, fontSize: 11.5, marginTop: 2, marginBottom: 0 }}>
                    หารเท่ากัน {people.length} คน ➜ คนละ ฿{(it.price / people.length).toFixed(2)}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* Service/VAT */}
      <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <label className="bn-body" style={{ color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          Service charge %
          <input
            type="number"
            value={servicePct}
            onChange={(e) => update({ servicePct: e.target.value })}
            style={{
              width: 60,
              background: C.surface2,
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              padding: "6px 8px",
              color: C.cream,
              fontSize: 13,
            }}
          />
        </label>
        <label className="bn-body" style={{ color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          VAT %
          <input
            type="number"
            value={vatPct}
            onChange={(e) => update({ vatPct: e.target.value })}
            style={{
              width: 60,
              background: C.surface2,
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              padding: "6px 8px",
              color: C.cream,
              fontSize: 13,
            }}
          />
        </label>
      </div>

      {/* RECEIPT SUMMARY */}
      {items.length > 0 && (
        <div
          style={{
            background: C.paper,
            borderRadius: 4,
            padding: "26px 22px 34px",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            marginBottom: 18,
          }}
        >
          <p className="bn-display" style={{ color: C.ink, fontSize: 26, textAlign: "center", margin: "0 0 2px" }}>
            สรุปบิล
          </p>
          <p className="bn-mono" style={{ color: C.inkMuted, fontSize: 11, textAlign: "center", margin: "0 0 18px" }}>
            {new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <div style={{ borderTop: `1px dashed ${C.paperLine}`, marginBottom: 14 }} />

          {people.map((p) => {
            const t = totals.map[p.id];
            if (!t) return null;
            return (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="bn-body" style={{ color: C.ink, fontWeight: 700, fontSize: 14 }}>
                    {p.name}
                  </span>
                  <span className="bn-mono" style={{ color: C.ink, fontWeight: 700, fontSize: 14 }}>
                    ฿{t.total.toFixed(2)}
                  </span>
                </div>
                {t.lines.map((l, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span className="bn-mono" style={{ color: C.inkMuted, fontSize: 11.5 }}>
                      {l.name}
                      {l.splitCount > 1 ? ` (÷${l.splitCount})` : ""}
                    </span>
                    <span className="bn-mono" style={{ color: C.inkMuted, fontSize: 11.5 }}>
                      ฿{l.share.toFixed(2)}
                    </span>
                  </div>
                ))}
                {(Number(servicePct) > 0 || Number(vatPct) > 0) && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="bn-mono" style={{ color: C.inkMuted, fontSize: 11.5 }}>
                      + service/VAT
                    </span>
                    <span className="bn-mono" style={{ color: C.inkMuted, fontSize: 11.5 }}>
                      ฿{t.extra.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ borderTop: `1px dashed ${C.paperLine}`, margin: "10px 0 14px" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="bn-body" style={{ color: C.ink, fontWeight: 700, fontSize: 15 }}>
              รวมทั้งบิล
            </span>
            <span className="bn-mono" style={{ color: C.ink, fontWeight: 700, fontSize: 15 }}>
              ฿{totals.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Actions: save / new bill / history */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <PrimaryButton onClick={saveBillToHistory} icon={Save} color={C.teal} style={{ opacity: items.length ? 1 : 0.5 }}>
          บันทึกบิลนี้
        </PrimaryButton>
        <button
          onClick={startNewBill}
          className="bn-body"
          style={{
            padding: "12px 22px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: "transparent",
            color: C.muted,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          เริ่มบิลใหม่
        </button>
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="bn-body"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            background: "transparent",
            color: C.amber,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <History size={16} />
          ประวัติบิล ({history.length})
        </button>
      </div>

      {showHistory && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
          {history.length === 0 ? (
            <p className="bn-body" style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              ยังไม่มีบิลที่บันทึกไว้
            </p>
          ) : (
            <>
              {history.map((h) => (
                <div key={h.id} style={{ borderBottom: `1px solid ${C.line}`, padding: "10px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="bn-mono" style={{ color: C.muted, fontSize: 11.5 }}>
                      {new Date(h.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="bn-mono" style={{ color: C.amber, fontSize: 13, fontWeight: 700 }}>
                      ฿{h.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="bn-body" style={{ color: C.cream, fontSize: 12.5, margin: "4px 0 0" }}>
                    {h.people.map((p) => `${p.name} ฿${p.total.toFixed(0)}`).join(" · ")}
                  </p>
                </div>
              ))}
              <button
                onClick={clearHistory}
                className="bn-body"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 12,
                  background: "none",
                  border: "none",
                  color: C.red,
                  fontSize: 12.5,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <Trash2 size={14} />
                ล้างประวัติทั้งหมด
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   ROOT APP
--------------------------------------------------------- */
export default function App() {
  const [tab, setTab] = useState("games");

  return (
    <div
      className="bn-body"
      style={{
        background: C.void,
        minHeight: "100vh",
        padding: "26px 20px 60px",
      }}
    >
      {FONTS}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <p className="bn-display" style={{ color: C.amber, fontSize: 42, margin: 0, lineHeight: 1 }}>
            หารค่าเหล้า + มินิเกม CS 30
          </p>
          <p className="bn-body" style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>
            CS 30 พร้อมลั่นทุกร้าน
          </p>
        </div>

        <div
          style={{
            display: "flex",
            background: C.surface,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: 4,
            marginBottom: 24,
          }}
        >
          {[
            { id: "games", label: "มินิเกม", icon: Beer },
            { id: "bill", label: "หารบิล", icon: Receipt },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="bn-body"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "none",
                  background: isActive ? C.amber : "transparent",
                  color: isActive ? C.void : C.muted,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "games" ? <GamesTab /> : <BillTab />}
      </div>
    </div>
  );
}
