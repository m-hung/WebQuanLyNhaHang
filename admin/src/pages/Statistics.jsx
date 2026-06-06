import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, TrendingUp, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
 
/* ══════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
 
.st { --c: #F7F2EA; --cb: #EDE4D3; --cbr: #D8CCBA; --g: #B8955A; --gl: #D4AF72;
  --gp: #F0E6D0; --dk: #28201A; --mu: #8A7B6C; --tx: #3D3022; --wh: #FFFFFF;
  --ok: #4A7C59; --hs: 0 2px 20px rgba(44,32,18,.07);
  font-family:'DM Sans',sans-serif; color:var(--tx); }
.st *{box-sizing:border-box;margin:0;padding:0;}
 
/* PAGE */
.st-pg{background:var(--c);min-height:100vh;padding:2.5rem 3rem;}
 
/* ── HEADER ── */
.st-hd{margin-bottom:3rem;}
.st-hd-row{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
.st-ey{font-size:.62rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:var(--g);margin-bottom:.4rem;display:flex;align-items:center;gap:.4rem;}
.st-ey::before{content:'✦';font-size:.45rem;}
.st-ti{font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:400;
  color:var(--dk);line-height:1;letter-spacing:-.02em;}
.st-ti span{font-style:italic;color:var(--g);}
.st-dt{font-size:.72rem;color:var(--mu);letter-spacing:.06em;
  background:var(--wh);border:1px solid var(--cbr);padding:.4rem 1rem;border-radius:99px;}
 
/* ── RIBBON ── */
.st-ribbon{
  display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;
  margin-bottom:2.5rem;
}
@media(min-width:900px){.st-ribbon{grid-template-columns:repeat(4,1fr);}}
 
.st-kpi{
  background:var(--wh);border-radius:20px;padding:1.75rem 1.75rem 1.5rem;
  box-shadow:var(--hs);position:relative;overflow:hidden;
  opacity:0;transform:translateY(22px) scale(.97);
  transition:opacity .55s ease,transform .55s ease,box-shadow .25s;
}
.st-kpi.vis{opacity:1;transform:translateY(0) scale(1);}
.st-kpi:hover{box-shadow:0 8px 32px rgba(44,32,18,.13);}
 
/* soft blob behind each card */
.st-kpi::before{
  content:'';position:absolute;border-radius:50%;
  background:var(--gp);opacity:.6;
  transition:transform .4s ease;
}
.st-kpi:nth-child(1)::before{width:120px;height:120px;right:-30px;bottom:-30px;}
.st-kpi:nth-child(2)::before{width:100px;height:100px;right:-20px;top:-20px;}
.st-kpi:nth-child(3)::before{width:90px;height:90px;left:-20px;bottom:-20px;}
.st-kpi:nth-child(4)::before{width:110px;height:110px;left:-25px;top:-25px;}
.st-kpi:hover::before{transform:scale(1.25);}
 
.st-kpi-lbl{font-size:.62rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
  color:var(--mu);margin-bottom:.9rem;display:flex;align-items:center;gap:.4rem;}
.st-kpi-dot{width:6px;height:6px;border-radius:50%;background:var(--g);flex-shrink:0;}
.st-kpi-val{font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:500;
  color:var(--dk);line-height:1;letter-spacing:-.02em;}
.st-kpi-unit{font-family:'DM Sans',sans-serif;font-size:.7rem;font-weight:400;
  color:var(--mu);margin-left:.3rem;}
.st-kpi-bar{height:3px;background:var(--cb);border-radius:99px;margin-top:1.2rem;overflow:hidden;}
.st-kpi-fill{height:100%;background:linear-gradient(90deg,var(--gp),var(--g));
  border-radius:99px;width:0;transition:width 1.2s cubic-bezier(.4,0,.2,1);}
 
/* ── BODY GRID ── */
.st-body{display:grid;grid-template-columns:1fr 340px;gap:1.5rem;align-items:start;}
@media(max-width:1050px){.st-body{grid-template-columns:1fr;}}
 
/* ── CHART CARD ── */
.st-chart-card{
  background:var(--wh);border-radius:24px;padding:2rem;
  box-shadow:var(--hs);
  opacity:0;transform:translateY(20px);
  transition:opacity .6s ease .1s,transform .6s ease .1s;
}
.st-chart-card.vis{opacity:1;transform:translateY(0);}
 
.st-ch-hd{display:flex;align-items:flex-start;justify-content:space-between;
  flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem;}
.st-ch-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:400;color:var(--dk);}
.st-ch-sub{font-size:.72rem;color:var(--mu);margin-top:.2rem;}
 
/* week nav pill */
.st-nav{display:flex;align-items:center;gap:.3rem;
  background:var(--c);border:1px solid var(--cbr);border-radius:99px;padding:.3rem .4rem;}
.st-nb{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:none;border:none;cursor:pointer;color:var(--mu);transition:all .2s;}
.st-nb:hover{background:var(--gp);color:var(--g);}
.st-nt{padding:0 .75rem;height:28px;background:none;border:none;
  font-family:'DM Sans',sans-serif;font-size:.7rem;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--g);cursor:pointer;
  border-radius:99px;transition:background .2s;}
.st-nt:hover{background:var(--gp);}
 
/* tooltip */
.st-tt{background:var(--dk);border-radius:10px;padding:.65rem 1rem;
  box-shadow:0 4px 20px rgba(0,0,0,.25);}
.st-tt-d{font-size:.65rem;letter-spacing:.1em;color:var(--mu);margin-bottom:.2rem;}
.st-tt-v{font-family:'Cormorant Garamond',serif;font-size:1.3rem;color:var(--gl);}
 
/* ── DISHES CARD ── */
.st-dishes-card{
  background:var(--wh);border-radius:24px;overflow:hidden;
  box-shadow:var(--hs);
  opacity:0;transform:translateY(20px);
  transition:opacity .6s ease .25s,transform .6s ease .25s;
}
.st-dishes-card.vis{opacity:1;transform:translateY(0);}
 
.st-dc-hd{padding:1.5rem 1.5rem 1.25rem;
  background:linear-gradient(135deg,var(--gp) 0%,var(--wh) 60%);
  border-bottom:1px solid var(--cb);}
.st-dc-ey{font-size:.6rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--g);margin-bottom:.3rem;display:flex;align-items:center;gap:.3rem;}
.st-dc-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:400;color:var(--dk);}
 
.st-dishes-list{padding:.5rem 0;max-height:400px;overflow-y:auto;}
.st-dishes-list::-webkit-scrollbar{width:3px;}
.st-dishes-list::-webkit-scrollbar-track{background:transparent;}
.st-dishes-list::-webkit-scrollbar-thumb{background:var(--cbr);border-radius:99px;}
 
.st-di{
  display:flex;align-items:center;gap:1rem;padding:.9rem 1.5rem;
  border-radius:0;transition:background .15s;
  opacity:0;transform:translateX(14px);
  transition:opacity .4s ease,transform .4s ease,background .15s;
}
.st-di.vis{opacity:1;transform:translateX(0);}
.st-di:hover{background:#FDFAF5;}
.st-di + .st-di{border-top:1px solid var(--c);}
 
/* rank circle */
.st-rk{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:600;
  background:var(--c);color:var(--mu);
}
.st-rk.r1{background:linear-gradient(135deg,#F0E6D0,#D4AF72);color:#7A5520;font-size:1.1rem;}
.st-rk.r2{background:linear-gradient(135deg,#EAEAEA,#C0C0C0);color:#555;font-size:1rem;}
.st-rk.r3{background:linear-gradient(135deg,#F5EDE0,#C8956C);color:#7A4A2A;font-size:1rem;}
 
.st-di-info{flex:1;min-width:0;}
.st-di-name{font-size:.84rem;font-weight:500;color:var(--dk);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.st-di-en{font-size:.68rem;color:var(--mu);font-style:italic;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:.1rem;}
/* mini progress */
.st-di-prog{height:3px;background:var(--cb);border-radius:99px;margin-top:.55rem;overflow:hidden;}
.st-di-prog-fill{height:100%;border-radius:99px;
  background:linear-gradient(90deg,var(--gp),var(--g));
  width:0;transition:width .9s cubic-bezier(.4,0,.2,1);}
 
.st-di-right{text-align:right;flex-shrink:0;}
.st-di-qty{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:500;
  color:var(--dk);line-height:1;}
.st-di-qlb{font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:var(--mu);}
.st-di-rev{font-size:.68rem;color:var(--ok);margin-top:.2rem;font-weight:500;}
 
.st-di-empty{color:var(--cbr);font-size:.78rem;text-align:center;padding:.5rem 0;}
`;
 
/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}
 
function AnimNum({ target, dur = 1300 }) {
  const [n, setN] = useState(0);
  const r = useRef();
  useEffect(() => {
    const num = parseInt(String(target).replace(/[^0-9]/g, ""), 10) || 0;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(num * e));
      if (p < 1) r.current = requestAnimationFrame(tick);
    };
    r.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r.current);
  }, [target, dur]);
  return <>{n.toLocaleString("vi-VN")}</>;
}
 
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="st-tt">
      <div className="st-tt-d">{label}</div>
      <div className="st-tt-v">{payload[0].value.toLocaleString("vi-VN")} đ</div>
    </div>
  );
}
 
/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
export default function Statistics({ invoices = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
 
  const ribbonRef = useRef(); const ribbonVis = useInView(ribbonRef);
  const chartRef  = useRef(); const chartVis  = useInView(chartRef);
  const dishRef   = useRef(); const dishVis   = useInView(dishRef);
 
  /* ── nav (unchanged) ── */
  const handlePrevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const handleNextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
 
  /* ── BACKEND LOGIC (unchanged) ── */
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth(), currentYear = now.getFullYear();
    const viewedMonth  = currentDate.getMonth(), viewedYear = currentDate.getFullYear();
    const dow = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0,0,0,0); startOfWeek.setDate(currentDate.getDate() - dow);
 
    const weeklyData = Array.from({length:7}).map((_,i)=>{
      const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate()+i);
      return { name:`${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`, revenue:0 };
    });
 
    let todayOrders=0,todayRevenue=0,monthlyOrders=0,monthlyRevenue=0;
    const dishMap={}, monthlyDailyRevenues={};
 
    invoices.forEach(order=>{
      if(!order.orderDate) return;
      const isPaid = order.status==="Paid"||order.status==="Completed"||order.status==="Đã thanh toán";
      if(!isPaid) return;
      let invoiceDate;
      if(Array.isArray(order.orderDate)){
        const [y,mo,d,h=0,mi=0,s=0]=order.orderDate; invoiceDate=new Date(y,mo-1,d,h,mi,s);
      } else { invoiceDate=new Date(order.orderDate); }
      if(isNaN(invoiceDate.getTime())) return;
      const amount=Number(order.totalAmount)||0;
 
      if(invoiceDate.getMonth()===viewedMonth&&invoiceDate.getFullYear()===viewedYear){
        const dk=invoiceDate.getDate();
        if(!monthlyDailyRevenues[dk]) monthlyDailyRevenues[dk]=0;
        monthlyDailyRevenues[dk]+=amount;
      }
      if(invoiceDate.toDateString()===now.toDateString()){ todayOrders++; todayRevenue+=amount; }
      if(invoiceDate.getMonth()===currentMonth&&invoiceDate.getFullYear()===currentYear){
        monthlyOrders++; monthlyRevenue+=amount;
        (order.orderItems||[]).forEach(item=>{
          const nVi=item.menuItem?.nameVi||item.nameVi||item.name||"Món chưa rõ tên";
          const nEn=item.menuItem?.nameEn||item.nameEn||(nVi!=="Món chưa rõ tên"?"":item.name||"");
          const dk=item.menuItem?.itemId||item.itemId||nVi||nEn;
          if(!dishMap[dk]) dishMap[dk]={nameVi:nVi,nameEn:nEn,qty:0,revenue:0};
          const qty=Number(item.quantity)||Number(item.qty)||0;
          const sub=Number(item.subtotal)||((Number(item.menuItem?.price)||Number(item.price)||0)*qty);
          dishMap[dk].qty+=qty; dishMap[dk].revenue+=sub;
        });
      }
      const d2=new Date(invoiceDate); d2.setHours(0,0,0,0);
      const diff=Math.round((d2-startOfWeek)/(86400000));
      if(diff>=0&&diff<7) weeklyData[diff].revenue+=amount;
    });
 
    const topDishes=Object.values(dishMap).sort((a,b)=>b.qty-a.qty).slice(0,10)
      .map((d,i)=>({rank:i+1,nameVi:d.nameVi,nameEn:d.nameEn,qty:d.qty,revenue:d.revenue.toLocaleString()}));
    while(topDishes.length<10) topDishes.push({rank:topDishes.length+1,nameVi:"-",nameEn:"",qty:0,revenue:"0"});
 
    const endW=new Date(startOfWeek); endW.setDate(startOfWeek.getDate()+6);
    const weekLabel=`${String(startOfWeek.getDate()).padStart(2,"0")}/${String(startOfWeek.getMonth()+1).padStart(2,"0")} — ${String(endW.getDate()).padStart(2,"0")}/${String(endW.getMonth()+1).padStart(2,"0")}`;
 
    return { todayOrders, todayRevenue:todayRevenue.toLocaleString(),
      monthlyOrders, monthlyRevenue:monthlyRevenue.toLocaleString(),
      weeklyData, topDishes, weekLabel };
  }, [invoices, currentDate]);
 
  const maxQty = Math.max(...stats.topDishes.map(d=>d.qty), 1);
  const todayStr = new Date().toLocaleDateString("vi-VN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
 
  /* kpi max for bar fill */
  const kpis = [
    { lbl:"Doanh thu hôm nay", val:stats.todayRevenue, unit:"VNĐ", pct:45 },
    { lbl:"Doanh thu tháng",   val:stats.monthlyRevenue, unit:"VNĐ", pct:72 },
    { lbl:"Hóa đơn hôm nay",  val:String(stats.todayOrders), unit:"hóa đơn", pct:30 },
    { lbl:"Hóa đơn tháng",    val:String(stats.monthlyOrders), unit:"hóa đơn", pct:60 },
  ];
 
  return (
    <div className="st">
      <style>{css}</style>
      <div className="st-pg">
 
        {/* ── HEADER ── */}
        <div className="st-hd">
          <div className="st-hd-row">
            <div>
              <div className="st-ey">Celeste House · Báo cáo</div>
              <h1 className="st-ti">Tổng <span>quan</span></h1>
            </div>
            <div className="st-dt">{todayStr}</div>
          </div>
        </div>
 
        {/* ── KPI RIBBON ── */}
        <div className="st-ribbon" ref={ribbonRef}>
          {kpis.map((k,i) => (
            <div key={i} className={`st-kpi ${ribbonVis?"vis":""}`}
                 style={{transitionDelay:`${i*0.1}s`}}>
              <div className="st-kpi-lbl"><span className="st-kpi-dot"/>  {k.lbl}</div>
              <div className="st-kpi-val">
                {ribbonVis ? <AnimNum target={k.val}/> : "0"}
                <span className="st-kpi-unit">{k.unit}</span>
              </div>
              <div className="st-kpi-bar">
                <div className="st-kpi-fill" style={{width: ribbonVis ? `${k.pct}%`:"0%", transitionDelay:`${i*0.1+0.4}s`}}/>
              </div>
            </div>
          ))}
        </div>
 
        {/* ── BODY GRID ── */}
        <div className="st-body">
 
          {/* AREA CHART */}
          <div className={`st-chart-card ${chartVis?"vis":""}`} ref={chartRef}>
            <div className="st-ch-hd">
              <div>
                <div className="st-ch-title">Doanh thu trong tuần</div>
                <div className="st-ch-sub">{stats.weekLabel}</div>
              </div>
              <div className="st-nav">
                <button className="st-nb" onClick={handlePrevWeek}><ChevronLeft size={14}/></button>
                <button className="st-nt" onClick={()=>setCurrentDate(new Date())}>Tuần này</button>
                <button className="st-nb" onClick={handleNextWeek}><ChevronRight size={14}/></button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={stats.weeklyData} margin={{top:10,right:10,left:5,bottom:0}}>
                <defs>
                  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#B8955A" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#B8955A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 5" vertical={false} stroke="#EDE4D3"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{fill:"#8A7B6C",fontSize:11,fontFamily:"DM Sans"}} dy={8}/>
                <YAxis width={80} axisLine={false} tickLine={false}
                  tick={{fill:"#8A7B6C",fontSize:11,fontFamily:"DM Sans"}}
                  domain={[0,"dataMax + 20000"]}
                  tickFormatter={v=>v===0?"0":new Intl.NumberFormat("vi-VN").format(v)}/>
                <Tooltip content={<CustomTooltip/>} cursor={{stroke:"#D4AF72",strokeWidth:1,strokeDasharray:"3 3"}}/>
                <Area type="monotone" dataKey="revenue" stroke="#B8955A" strokeWidth={2}
                  fill="url(#gGold)" dot={{r:4,fill:"#fff",stroke:"#B8955A",strokeWidth:2}}
                  activeDot={{r:5,fill:"#B8955A",stroke:"#fff",strokeWidth:2}}
                  isAnimationActive animationDuration={1000} animationEasing="ease-out"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
 
          {/* TOP DISHES */}
          <div className={`st-dishes-card ${dishVis?"vis":""}`} ref={dishRef}>
            <div className="st-dc-hd">
              <div className="st-dc-ey"><TrendingUp size={11}/> Tháng này</div>
              <div className="st-dc-title">Món phổ biến</div>
            </div>
            <div className="st-dishes-list">
              {stats.topDishes.map((d,i) => (
                <div key={i} className={`st-di ${dishVis?"vis":""}`}
                     style={{transitionDelay:`${i*0.055}s`}}>
                  <div className={`st-rk ${i===0?"r1":i===1?"r2":i===2?"r3":""}`}>
                    {d.rank}
                  </div>
                  <div className="st-di-info">
                    {d.nameVi==="-"
                      ? <span className="st-di-empty">—</span>
                      : <>
                          <div className="st-di-name">{d.nameVi}</div>
                          {d.nameEn && <div className="st-di-en">{d.nameEn}</div>}
                          <div className="st-di-prog">
                            <div className="st-di-prog-fill"
                              style={{width: dishVis?`${(d.qty/maxQty)*100}%`:"0%",
                                      transitionDelay:`${i*0.055+0.35}s`}}/>
                          </div>
                        </>
                    }
                  </div>
                  {d.nameVi!=="-" && (
                    <div className="st-di-right">
                      <div className="st-di-qty">{d.qty}</div>
                      <div className="st-di-qlb">phần</div>
                      <div className="st-di-rev">{d.revenue}đ</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
 