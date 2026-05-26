import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Camera,
  CheckCircle2,
  Download,
  ImagePlus,
  Menu,
  MessageCircle,
  PlayCircle,
  Plus,
  Search,
  Send,
  Settings,
  Smartphone,
  UserCircle2,
  Users,
  X,
} from "lucide-react";

const STORAGE_KEY = "seocheon_pact_demo_v1";

const members = [
  { id: "me", name: "희준", role: "방장", status: "서천결의의 중심", avatar: "정", color: "bg-me" },
  { id: "friend1", name: "친구 1", role: "멤버", status: "오늘도 한잔의 의리", avatar: "友1", color: "bg-f1" },
  { id: "friend2", name: "친구 2", role: "멤버", status: "추억 저장 담당", avatar: "友2", color: "bg-f2" },
  { id: "friend3", name: "친구 3", role: "멤버", status: "말보다 행동", avatar: "友3", color: "bg-f3" },
];

const initialRooms = [
  {
    id: "main",
    title: "서천결의 단체방",
    desc: "4인 전용 메인 대화방",
    unread: 2,
    messages: [
      { id: 1, sender: "friend1", text: "서천결의 앱 테스트 시작!", time: "09:10" },
      { id: 2, sender: "friend2", text: "사진첩도 같이 쓰면 좋겠다.", time: "09:12" },
      { id: 3, sender: "me", text: "좋아. 채팅, 사진첩, 공지까지 하나로 만들자.", time: "09:15" },
    ],
  },
  {
    id: "notice",
    title: "공지방",
    desc: "약속·모임·회비 공지",
    unread: 0,
    messages: [{ id: 4, sender: "me", text: "다음 모임 날짜를 정해봅시다.", time: "10:00" }],
  },
];

const sampleAlbums = [
  { id: "a1", type: "photo", title: "첫 모임 사진", owner: "희준", date: "2026.05.27", note: "밴드형 사진첩 카드 예시" },
  { id: "a2", type: "video", title: "라운딩 영상", owner: "친구 2", date: "2026.05.27", note: "영상 저장 카드 예시" },
  { id: "a3", type: "photo", title: "추억 앨범", owner: "친구 3", date: "2026.05.27", note: "실제 서비스에서는 클라우드 저장소 연결" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Button({ children, onClick, className = "", type = "button" }) {
  return <button type={type} onClick={onClick} className={`btn ${className}`}>{children}</button>;
}

function Avatar({ member, large = false }) {
  return <span className={`avatar ${large ? "large" : ""} ${member.color}`}>{member.avatar}</span>;
}

function AppIconPreview() {
  return (
    <div className="card icon-preview">
      <div className="app-icon">西</div>
      <div>
        <strong>서천결의</strong>
        <div className="muted">홈 화면 아이콘 시안</div>
      </div>
    </div>
  );
}

export default function App() {
  const saved = typeof window !== "undefined" ? loadState() : null;
  const [tab, setTab] = useState("chat");
  const [rooms, setRooms] = useState(saved?.rooms || initialRooms);
  const [albums, setAlbums] = useState(saved?.albums || sampleAlbums);
  const [activeRoomId, setActiveRoomId] = useState("main");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("테스트 준비 완료");
  const [profileOpen, setProfileOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const endRef = useRef(null);

  const activeRoom = rooms.find((room) => room.id === activeRoomId) || rooms[0];
  const memberMap = useMemo(() => Object.fromEntries(members.map((member) => [member.id, member])), []);
  const filteredRooms = rooms.filter((room) => room.title.includes(query) || room.desc.includes(query));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms, albums }));
  }, [rooms, albums]);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setIsStandalone(standalone);
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setNotice("홈 화면 설치 준비 완료");
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom?.messages?.length, activeRoomId]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const message = { id: Date.now(), sender: "me", text, time };
    setRooms((prev) => prev.map((room) => (room.id === activeRoomId ? { ...room, messages: [...room.messages, message], unread: 0 } : room)));
    setInput("");
    setNotice("메시지 전송 테스트 성공");
    if ("Notification" in window && Notification.permission === "granted") new Notification("서천결의 새 메시지", { body: text });
  };

  const simulateFriendMessage = () => {
    const friend = members[Math.floor(Math.random() * 3) + 1];
    const samples = ["확인했다!", "사진 올려줘.", "이번 주 모임 가능?", "좋다. 계속 만들어보자."];
    const text = samples[Math.floor(Math.random() * samples.length)];
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const message = { id: Date.now(), sender: friend.id, text, time };
    setRooms((prev) => prev.map((room) => (room.id === activeRoomId ? { ...room, messages: [...room.messages, message], unread: room.unread + 1 } : room)));
    setNotice(`${friend.name}의 새 메시지 알림 테스트`);
    if ("Notification" in window && Notification.permission === "granted") new Notification(`서천결의 - ${friend.name}`, { body: text });
  };

  const requestNotification = async () => {
    if (!("Notification" in window)) return setNotice("이 브라우저는 알림을 지원하지 않습니다.");
    const result = await Notification.requestPermission();
    setNotice(result === "granted" ? "알림 권한 허용됨" : "알림 권한이 허용되지 않았습니다.");
  };

  const addAlbum = () => {
    const next = { id: `a${Date.now()}`, type: Math.random() > 0.5 ? "photo" : "video", title: `새 추억 ${albums.length + 1}`, owner: "희준", date: "2026.05.27", note: "프로토타입 저장 카드" };
    setAlbums((prev) => [next, ...prev]);
    setNotice("사진첩 카드 추가 테스트 성공");
  };

  const installApp = async () => {
    if (!installPrompt) return setNotice("현재 환경에서는 자동 설치 버튼이 아직 활성화되지 않았습니다. 모바일 브라우저 메뉴에서 '홈 화면에 추가'를 선택하세요.");
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setNotice(choice.outcome === "accepted" ? "홈 화면 설치가 시작되었습니다." : "홈 화면 설치가 취소되었습니다.");
    setInstallPrompt(null);
  };

  return (
    <div className="app-shell">
      <div className="layout">
        <aside className="sidebar">
          <div className="card">
            <div className="hero">
              <div className="hero-top">
                <div><div className="eyebrow">4인 전용 커뮤니티 앱</div><h1>서천결의</h1></div>
                <Button onClick={() => setProfileOpen(true)}><Menu size={18} /></Button>
              </div>
              <div className="member-grid">
                {members.map((m) => <button key={m.id} className="member-mini" onClick={() => setProfileOpen(true)}><Avatar member={m} /><div>{m.name}</div></button>)}
              </div>
            </div>
            <div className="tabbar">
              <Button className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}><MessageCircle size={16} />채팅</Button>
              <Button className={tab === "album" ? "active" : ""} onClick={() => setTab("album")}><Camera size={16} />사진첩</Button>
              <Button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}><Users size={16} />홈</Button>
            </div>
          </div>

          <AppIconPreview />

          <div className="card panel">
            <div className="panel-title"><span><Smartphone size={18} /> PWA 설치 상태</span></div>
            <div className="status-row"><CheckCircle2 className={isStandalone ? "green" : "gray"} size={16} />{isStandalone ? "앱 모드로 실행 중" : "브라우저 실행 중"}</div>
            <div className="status-row"><CheckCircle2 className={installPrompt ? "green" : "gray"} size={16} />{installPrompt ? "설치 버튼 사용 가능" : "배포 후 설치 버튼 활성화"}</div>
            <Button className="primary full" onClick={installApp}><Download size={16} />홈 화면에 설치</Button>
          </div>

          <div className="card panel">
            <div className="panel-title"><span>테스트 패널</span><Settings size={16} /></div>
            <div className="status-box">{notice}</div>
            <Button className="primary full" onClick={requestNotification}><Bell size={16} />알림 권한 요청</Button>
            <Button className="full" onClick={simulateFriendMessage}>친구 메시지 수신 테스트</Button>
            <Button className="full" onClick={() => { setRooms(initialRooms); setAlbums(sampleAlbums); setNotice("데모 데이터 초기화 완료"); }}>초기화</Button>
          </div>
        </aside>

        <main className="main">
          {tab === "chat" && (
            <div className="chat-layout">
              <section className="room-list">
                <div className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="대화방 검색" /></div>
                {filteredRooms.map((room) => (
                  <button key={room.id} className={`room ${activeRoomId === room.id ? "active" : ""}`} onClick={() => setActiveRoomId(room.id)}>
                    <div className="room-title"><span>{room.title}</span>{room.unread > 0 && <span className="badge">{room.unread}</span>}</div>
                    <div className="room-desc">{room.desc}</div>
                    <div className="last-msg">{room.messages[room.messages.length - 1]?.text}</div>
                  </button>
                ))}
              </section>
              <section className="chat">
                <div className="chat-head"><div><div className="chat-title">{activeRoom.title}</div><div className="chat-sub">참여자 4명 · 직관형 단체 채팅</div></div><Button onClick={() => setProfileOpen(true)}>프로필</Button></div>
                <div className="messages">
                  {activeRoom.messages.map((msg) => {
                    const member = memberMap[msg.sender];
                    const mine = msg.sender === "me";
                    return <div key={msg.id} className={`message-row ${mine ? "mine" : ""}`}>{!mine && <Avatar member={member} />}<div className={`bubble ${mine ? "mine" : ""}`}>{!mine && <div className="sender">{member.name}</div>}<div>{msg.text}</div><div className="time">{msg.time}</div></div></div>;
                  })}
                  <div ref={endRef} />
                </div>
                <div className="inputbar"><Button onClick={addAlbum}><ImagePlus size={18} /></Button><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="메시지를 입력하세요" /><Button className="blue" onClick={sendMessage}><Send size={16} />전송</Button></div>
              </section>
            </div>
          )}

          {tab === "album" && <div className="page"><div className="page-head"><div><h2>서천결의 사진첩</h2><div className="muted">밴드형 사진·영상 저장 공간 프로토타입</div></div><Button className="primary" onClick={addAlbum}><Plus size={16} />사진/영상 카드 추가</Button></div><div className="album-grid">{albums.map((item) => <motion.div key={item.id} layout className="album-card"><div className="album-thumb">{item.type === "video" ? <PlayCircle size={64} /> : <Camera size={64} />}</div><div className="album-body"><strong>{item.title}</strong><div className="muted">{item.owner} · {item.date}</div><div className="status-box">{item.note}</div></div></motion.div>)}</div><div className="warning">현재 코드는 브라우저 localStorage 기반 데모입니다. 실제 사진·영상 저장은 Firebase Storage, Supabase Storage, AWS S3 같은 외부 저장소 연결이 필요합니다.</div></div>}

          {tab === "home" && <div className="page"><div className="home-hero"><div className="eyebrow">홈페이지 + 밴드 + 카톡 통합형</div><h2>서천결의</h2><p>4명의 친구가 채팅, 프로필, 사진첩, 영상, 공지, 모임 기록을 한 화면에서 관리하는 전용 커뮤니티 앱입니다.</p></div><div className="feature-grid">{[["카톡형 채팅", "직관적인 대화방, 읽지 않은 메시지, 실시간 알림 구조"],["밴드형 사진첩", "사진·영상 앨범, 추억 카드, 멤버별 기록"],["홈페이지형 메인", "공지, 소개, 모임 일정, 앱 아이콘 접속 구조"],["PWA 설치", "핸드폰 홈 화면 아이콘, 전체화면 실행, 앱 같은 접속"]].map(([title, desc]) => <div className="feature" key={title}><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div>)}</div><div className="next"><div className="next-title">다음 개발 단계</div><ol><li>GitHub Pages 또는 Netlify에 배포</li><li>휴대폰 브라우저에서 접속</li><li>홈 화면에 설치</li><li>Firebase 또는 Supabase로 로그인·실시간 채팅 연결</li><li>사진·영상 저장소와 푸시알림 연결</li></ol></div></div>}
        </main>
      </div>

      <AnimatePresence>{profileOpen && <motion.div className="drawer-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="drawer" initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}><div className="drawer-head"><h2>멤버 프로필</h2><Button onClick={() => setProfileOpen(false)}><X size={18} /></Button></div>{members.map((m) => <div className="profile" key={m.id}><Avatar member={m} large /><div style={{ flex: 1 }}><strong>{m.name}</strong> <span className="role">{m.role}</span><div className="muted">{m.status}</div></div><UserCircle2 size={20} /></div>)}<div className="status-box">실제 앱에서는 각자 프로필 사진, 상태 메시지, 전화번호 공개 여부, 관리자 권한 등을 DB에 저장합니다.</div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
