import { useState } from 'react'
import luxLogo from '../assets/lux-automaton.png'
import lanaProfile from '../assets/lana-profile.png'

const LanaCoach = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'lana',
      text: 'Greetings. I am Lana, your Lux Agent AI host and strategy coach. Choose a topic below or enter a customized query to plan your GTA 6 money strategy.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const coachPrompts = [
    { label: 'Launch Week Route', query: 'How do I optimize my Launch Week money route?' },
    { label: 'Best Passive Income', query: 'What is the best legal passive income business?' },
    { label: 'Crew Splits', query: 'How should I structure crew payouts to retain members?' },
    { label: 'Server Hosting Spec', query: 'What hardware/hosting setup is best for a roleplay server?' },
  ]

  const getLanaResponse = (query) => {
    const q = query.toLowerCase()
    if (q.includes('launch') || q.includes('route')) {
      return 'Launch week is about rapid capital accumulation. Spend the first 10-15 hours completing story milestones to unlock Leonida properties. Reinvest 60% of incoming cash into passive vending assets immediately, and buy utility helicopters to cut cross-map traversal times in half.'
    }
    if (q.includes('passive') || q.includes('business')) {
      return 'Legal warehouse contracting yields the most reliable passive margin. Combine warehouses under a single manager role to minimize active transport cooldowns, generating up to $250k/hr in passive return.'
    }
    if (q.includes('split') || q.includes('crew') || q.includes('payout')) {
      return 'Structure crew splits fairly to retain players: offer a 50% split for trial members, scaling to 75% for crew specialists executing logistics. Displaying payout ledgers publicly builds trust and removes team friction.'
    }
    if (q.includes('host') || q.includes('server') || q.includes('hardware')) {
      return 'For FiveM or GTA RP hosting, target a dedicated Linux VPS with 8+ cores, 16GB RAM, and NVMe drives. Back up daily, and ensure all asset resources match license standards to bypass DMCA actions.'
    }
    return 'That strategy fits within our core business models. Focus on legal planning, stack routes to reduce idle time, and leverage our calculators to verify target returns. Avoid shortcuts that compromise accounts.'
  }

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return
    const userMsg = { sender: 'user', text: textToSend }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      setIsTyping(false)
      const lanaAnswer = { sender: 'lana', text: getLanaResponse(textToSend) }
      setMessages((prev) => [...prev, lanaAnswer])
    }, 800)
  }

  return (
    <div className="lana-coach-page grid lg:grid-cols-12 gap-8 items-start w-full text-left">
      {/* Interactive terminal chatbot column */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
        <span className="font-mono text-pink text-xs uppercase block mb-2">// Strategy Coach Desk</span>
        <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-4">Lana AI Coach</h1>
        <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xl">
          Welcome to GTA Money Team — the training hub for players, creators, and server owners who want to learn how to make money on GTA 6 the legit way. Build your plan, study the routes, track your goals, grow your crew, launch your server, and use Lana as your AI coach.
        </p>

        <div className="terminal-container w-full text-left">
          <div className="terminal-header">
            <div className="terminal-dot red" />
            <div className="terminal-dot yellow" />
            <div className="terminal-dot green" />
            <span className="terminal-title">LANA_COACH_INTERFACE_V1.2</span>
          </div>

          <div className="terminal-body bg-black/90 p-4">
            <div className="messages-log h-72 overflow-y-auto flex flex-col gap-4 mb-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${m.sender === 'lana' ? 'self-start' : 'self-end flex-row-reverse'}`}>
                  <img className="w-8 h-8 rounded-full border border-white/20" src={m.sender === 'lana' ? lanaProfile : luxLogo} alt="" />
                  <div className={`p-3 rounded-lg border text-sm ${m.sender === 'lana' ? 'bg-white/5 border-white/10 text-white' : 'bg-cyan/10 border-cyan/35 text-cyan'}`}>
                    <strong className="block text-[10px] uppercase text-pink font-semibold mb-1">{m.sender === 'lana' ? 'Lana | Coach' : 'User | Agent'}</strong>
                    <p className="m-0 leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 self-start">
                  <img className="w-8 h-8 rounded-full border border-white/20" src={lanaProfile} alt="" />
                  <div className="p-3 rounded-lg border bg-white/5 border-white/10 text-white text-sm">
                    <strong className="block text-[10px] uppercase text-pink font-semibold mb-1">Lana is planning...</strong>
                    <div className="flex gap-1 mt-1">
                      <span className="w-2 h-2 bg-pink rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-pink rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-pink rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="suggested-prompts-bar flex gap-2 flex-wrap mb-4 pt-3 border-t border-white/10">
              {coachPrompts.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.query)}
                  className="px-3 py-1 bg-black border border-white/20 rounded-full text-cyan text-xs font-semibold hover:bg-cyan/10 hover:border-cyan transition duration-300 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="terminal-input-bar flex gap-2">
              <input
                type="text"
                placeholder="Ask Lana about GTA 6 money strategy..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 bg-black border border-pink/40 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-pink"
              />
              <button
                onClick={() => handleSend(input)}
                className="bg-pink text-black px-4 py-2 rounded text-xs font-semibold uppercase hover:bg-coral transition duration-300 cursor-pointer"
              >
                EXECUTE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual illustration column */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 p-4 shadow-xl">
          <img src="./images/lucia-3.webp" alt="Lana Strategy holographic preview" className="w-full h-auto rounded object-cover aspect-[4/3]" />
          <div className="mt-4">
            <span className="font-mono text-pink text-[10px] uppercase block">// Agent Profile</span>
            <strong className="block text-white uppercase text-lg mt-1">Lana OS v1.2</strong>
            <p className="text-white/50 text-xs mt-2 leading-relaxed">
              Serving as the official interactive strategy guide for GTA Money Team operators. Programmed by Lux Automaton.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanaCoach
