import { useState } from 'react'

const plannerRoutes = {
  Solo: [
    {
      name: 'Starter Courier Flow',
      yield: 'Low Risk / Fast Cash',
      desc: 'Optimized batch delivery routes across Vice City. Minimizes travel time by stacking deliveries chronologically.',
      steps: ['Purchase basic utility motorcycle', 'Map the delivery hubs', 'Cycle routes during cooldowns'],
    },
    {
      name: 'Legal Cargo Batching',
      yield: 'Medium Risk / High Yield',
      desc: 'Secure contracts for legal warehouses. Run supply operations using optimal highway splits.',
      steps: ['Invest in cargo truck', 'Acquire warehouse licenses', 'Stack route contracts to reduce dry runs'],
    },
  ],
  Crew: [
    {
      name: 'Organized Shipments',
      yield: 'Coordinated Logistics',
      desc: 'Form a transport line with multiple crew trucks. Protect shipments without relying on aggressive exploits.',
      steps: ['Designate lead security scouts', 'Run double-cargo transports', 'Divide cuts evenly based on progression rules'],
    },
    {
      name: 'Leonida Keys Logistics',
      yield: 'Passive Team Wealth',
      desc: 'Establish multi-business shipping lanes. Coordinate routes so cargo trucks arrive sequentially, bypassing backup delays.',
      steps: ['Establish active shipping lanes', 'Stack vehicle classes', 'Run team checkpoints'],
    },
  ],
  'Launch Week': [
    {
      name: 'Story Speedrun Progression',
      yield: 'Maximizing Basic Capital',
      desc: 'Prioritize story missions to unlock the map and basic purchasing options as fast as possible.',
      steps: ['Avoid early supercar purchases', 'Redirect 60% of capital to basic assets', 'Unlock passive properties by hour 15'],
    },
    {
      name: 'Utility Helicopter Acquisition',
      yield: 'Efficiency Multiplier',
      desc: 'Save all starter capital to buy a legal helicopter to bypass Vice City traffic and cut mission times by 50%.',
      steps: ['Save starter funds', 'Acquire flight license early', 'Coordinate helicopter pick-ups'],
    },
  ],
}

function MoneyCalculator() {
  const [runs, setRuns] = useState(4)
  const [payout, setPayout] = useState(42000)
  const [hours, setHours] = useState(10)
  const [bonus, setBonus] = useState(15)

  const weekly = Math.round(runs * payout * hours * (1 + bonus / 100))
  const monthly = weekly * 4

  return (
    <article className="money-calc-card p-6 border border-cyan/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// In-game route calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">Route Profit Estimator</h3>
        <p className="text-white/60 text-xs mb-4">Estimate legal in-game cash potential from routes, mission cycles, and crew bonuses.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Runs/hour 
          <input value={runs} min="1" max="12" type="number" onChange={(event) => setRuns(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Payout/run 
          <input value={payout} step="1000" min="0" type="number" onChange={(event) => setPayout(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Hours/week 
          <input value={hours} min="1" max="80" type="number" onChange={(event) => setHours(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Bonus % 
          <input value={bonus} min="0" max="100" type="number" onChange={(event) => setBonus(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-cyan/5">
        <strong className="block text-xl text-green font-round-bold">${weekly.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50 mb-2">estimated weekly in-game cash</span>
        <strong className="block text-xl text-green font-round-bold">${monthly.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">estimated 4-week plan</span>
      </div>
    </article>
  )
}

function RevenueCalculator() {
  const [members, setMembers] = useState(250)
  const [price, setPrice] = useState(19)
  const [affiliate, setAffiliate] = useState(900)
  const [services, setServices] = useState(2400)

  const mrr = members * price
  const monthly = mrr + affiliate + services

  return (
    <article className="money-calc-card p-6 border border-cyan/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// Business calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">Subscriber Revenue Model</h3>
        <p className="text-white/60 text-xs mb-4">Show customers and partners how GTA Money Team can earn from memberships, services, and trusted offers.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Members 
          <input value={members} min="0" type="number" onChange={(event) => setMembers(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Monthly price 
          <input value={price} min="0" type="number" onChange={(event) => setPrice(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Affiliate/mo 
          <input value={affiliate} min="0" type="number" onChange={(event) => setAffiliate(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Services/mo 
          <input value={services} min="0" type="number" onChange={(event) => setServices(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-cyan/5">
        <strong className="block text-xl text-green font-round-bold">${mrr.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50 mb-2">membership MRR</span>
        <strong className="block text-xl text-green font-round-bold">${monthly.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">projected monthly revenue</span>
      </div>
    </article>
  )
}

function ServerRevenueEstimator() {
  const [slots, setSlots] = useState(64)
  const [vipRate, setVipRate] = useState(12)
  const [vipPrice, setVipPrice] = useState(19)
  const [templates, setTemplates] = useState(8)
  const [templatePrice, setTemplatePrice] = useState(79)
  const [costs, setCosts] = useState(180)

  const vipMembers = Math.round(slots * (vipRate / 100))
  const vipRevenue = vipMembers * vipPrice
  const templateRevenue = templates * templatePrice
  const monthlyRevenue = vipRevenue + templateRevenue
  const net = monthlyRevenue - costs

  return (
    <article className="money-calc-card p-6 border border-green/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// Server business calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">Server Revenue Estimator</h3>
        <p className="text-white/60 text-xs mb-4">Model legal VIP memberships, template sales, and hosting costs before launch.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Server slots
          <input value={slots} min="1" type="number" onChange={(event) => setSlots(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          VIP conversion %
          <input value={vipRate} min="0" max="100" type="number" onChange={(event) => setVipRate(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          VIP price
          <input value={vipPrice} min="0" type="number" onChange={(event) => setVipPrice(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Templates/mo
          <input value={templates} min="0" type="number" onChange={(event) => setTemplates(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Template price
          <input value={templatePrice} min="0" type="number" onChange={(event) => setTemplatePrice(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Hosting/tools cost
          <input value={costs} min="0" type="number" onChange={(event) => setCosts(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-green/5">
        <strong className="block text-xl text-green font-round-bold">${monthlyRevenue.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50 mb-2">monthly gross estimate</span>
        <strong className="block text-xl text-green font-round-bold">${net.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">monthly net after listed costs</span>
      </div>
    </article>
  )
}

function StreamingEarningsProjector() {
  const [streams, setStreams] = useState(16)
  const [avgViews, setAvgViews] = useState(140)
  const [subRate, setSubRate] = useState(4)
  const [subValue, setSubValue] = useState(3)
  const [sponsors, setSponsors] = useState(300)

  const paidSubs = Math.round(streams * avgViews * (subRate / 100))
  const subRevenue = paidSubs * subValue
  const monthly = subRevenue + sponsors

  return (
    <article className="money-calc-card p-6 border border-yellow/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// Creator business calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">Streaming Earnings Projector</h3>
        <p className="text-white/60 text-xs mb-4">Estimate RP stream income from live views, subscribers, and sponsor or affiliate offers.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Streams/mo
          <input value={streams} min="0" type="number" onChange={(event) => setStreams(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Avg viewers
          <input value={avgViews} min="0" type="number" onChange={(event) => setAvgViews(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Sub conversion %
          <input value={subRate} min="0" max="100" type="number" onChange={(event) => setSubRate(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Net/sub
          <input value={subValue} min="0" type="number" onChange={(event) => setSubValue(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold col-span-2">
          Sponsors/affiliate
          <input value={sponsors} min="0" type="number" onChange={(event) => setSponsors(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-yellow/5">
        <strong className="block text-xl text-green font-round-bold">{paidSubs.toLocaleString()} subs</strong>
        <span className="block text-[10px] text-white/50 mb-2">projected monthly paid subs</span>
        <strong className="block text-xl text-green font-round-bold">${monthly.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">projected creator income</span>
      </div>
    </article>
  )
}

function TemplateProfitCalculator() {
  const [sales, setSales] = useState(25)
  const [price, setPrice] = useState(79)
  const [fees, setFees] = useState(6)
  const [supportHours, setSupportHours] = useState(8)
  const [hourlyCost, setHourlyCost] = useState(35)

  const gross = sales * price
  const platformFees = gross * (fees / 100)
  const supportCost = supportHours * hourlyCost
  const net = Math.round(gross - platformFees - supportCost)

  return (
    <article className="money-calc-card p-6 border border-cyan/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// Template shop calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">Template Profit Calculator</h3>
        <p className="text-white/60 text-xs mb-4">Estimate digital product profit after checkout fees and support time.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Sales/mo
          <input value={sales} min="0" type="number" onChange={(event) => setSales(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Price
          <input value={price} min="0" type="number" onChange={(event) => setPrice(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Fee %
          <input value={fees} min="0" max="100" type="number" onChange={(event) => setFees(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Support hours
          <input value={supportHours} min="0" type="number" onChange={(event) => setSupportHours(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold col-span-2">
          Internal hourly cost
          <input value={hourlyCost} min="0" type="number" onChange={(event) => setHourlyCost(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-cyan/5">
        <strong className="block text-xl text-green font-round-bold">${gross.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50 mb-2">monthly gross</span>
        <strong className="block text-xl text-green font-round-bold">${net.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">estimated net</span>
      </div>
    </article>
  )
}

function DfyPipelineCalculator() {
  const [leads, setLeads] = useState(18)
  const [closeRate, setCloseRate] = useState(22)
  const [deposit, setDeposit] = useState(149)
  const [builds, setBuilds] = useState(2)
  const [buildPrice, setBuildPrice] = useState(499)

  const deposits = Math.round(leads * (closeRate / 100)) * deposit
  const buildRevenue = builds * buildPrice
  const monthly = deposits + buildRevenue

  return (
    <article className="money-calc-card p-6 border border-pink/25 rounded-lg bg-black/85 backdrop-blur-md flex flex-col justify-between">
      <div>
        <span className="font-mono text-pink text-[10px] uppercase block mb-1">// DFY services calculator</span>
        <h3 className="font-round-bold text-2xl uppercase my-2 text-white">DFY Pipeline Calculator</h3>
        <p className="text-white/60 text-xs mb-4">Estimate revenue from service leads, deposits, and custom build closes.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Leads/mo
          <input value={leads} min="0" type="number" onChange={(event) => setLeads(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Close %
          <input value={closeRate} min="0" max="100" type="number" onChange={(event) => setCloseRate(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Deposit
          <input value={deposit} min="0" type="number" onChange={(event) => setDeposit(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold">
          Builds/mo
          <input value={builds} min="0" type="number" onChange={(event) => setBuilds(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
        <label className="flex flex-col text-white/50 text-[11px] font-semibold col-span-2">
          Avg build price
          <input value={buildPrice} min="0" type="number" onChange={(event) => setBuildPrice(Number(event.target.value))} className="mt-1 bg-black border border-white/20 rounded px-2 py-1 text-white text-xs" />
        </label>
      </div>
      <div className="p-3 border border-dashed border-white/20 rounded bg-pink/5">
        <strong className="block text-xl text-green font-round-bold">${deposits.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50 mb-2">deposit revenue</span>
        <strong className="block text-xl text-green font-round-bold">${monthly.toLocaleString()}</strong>
        <span className="block text-[10px] text-white/50">projected service revenue</span>
      </div>
    </article>
  )
}

const Calculators = () => {
  const [plannerMode, setPlannerMode] = useState('Solo')

  return (
    <div className="calculators-page grid lg:grid-cols-12 gap-8 items-start w-full text-left">
      
      {/* Interactive calculators column */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
        <span className="font-mono text-pink text-xs uppercase block mb-2">// Yield Tools</span>
        <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-4">Profit Estimators</h1>
        <p className="text-white/70 text-sm mb-8 leading-relaxed max-w-xl">
          Estimate legal route splits and calculate subscriber revenue projections side-by-side using fully customized templates.
        </p>

        <div className="grid md:grid-cols-2 gap-4 w-full mb-8">
          <MoneyCalculator />
          <RevenueCalculator />
          <ServerRevenueEstimator />
          <StreamingEarningsProjector />
          <TemplateProfitCalculator />
          <DfyPipelineCalculator />
        </div>

        {/* Strategy Routes Mode Planner */}
        <div className="p-6 border border-white/10 rounded-lg bg-white/5 w-full text-left" id="route-planner">
          <span className="font-mono text-yellow text-xs uppercase block mb-3">// Yield Strategy Routes</span>
          <div className="flex gap-2 mb-6">
            {['Solo', 'Crew', 'Launch Week'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPlannerMode(mode)}
                className={`px-4 py-2 border rounded font-semibold text-xs uppercase transition duration-300 ${plannerMode === mode ? 'bg-yellow text-black border-yellow' : 'bg-black border-white/20 text-white hover:bg-white/5'}`}
              >
                {mode} Mode
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {plannerRoutes[plannerMode].map((route) => (
              <div key={route.name} className="p-5 border border-white/10 rounded-lg bg-black/60">
                <small className="font-mono text-yellow text-[10px] uppercase block mb-1">{route.yield}</small>
                <strong className="block text-lg text-white uppercase mb-2">{route.name}</strong>
                <p className="text-white/60 text-xs mb-4">{route.desc}</p>
                <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
                  {route.steps.map((step, idx) => (
                    <li key={idx}>Step {idx + 1}: {step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual illustration column */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 p-4 shadow-xl">
          <img src="./images/jason-1.webp" alt="GTA Map visual preview" className="w-full h-auto rounded object-cover aspect-[4/3]" />
          <div className="mt-4">
            <span className="font-mono text-pink text-[10px] uppercase block">// Graphics Spec</span>
            <strong className="block text-white uppercase text-lg mt-1">Estimations & GPS maps</strong>
            <p className="text-white/50 text-xs mt-2 leading-relaxed">
              Verify all target projections legitimately prior to running team cargo sessions or launching server assets.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Calculators
