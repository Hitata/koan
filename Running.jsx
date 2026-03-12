import { useState } from "react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, ReferenceLine,
} from "recharts";

const weeklyData = [
  { week: "T1W1", km: 12, pace: "6:10", runs: 3 },
  { week: "T1W2", km: 18, pace: "6:05", runs: 4 },
  { week: "T1W3", km: 15, pace: "6:08", runs: 3 },
  { week: "T1W4", km: 22, pace: "5:58", runs: 4 },
  { week: "T2W1", km: 20, pace: "6:00", runs: 4 },
  { week: "T2W2", km: 25, pace: "5:52", runs: 5 },
  { week: "T2W3", km: 19, pace: "5:55", runs: 4 },
  { week: "T2W4", km: 28, pace: "5:48", runs: 5 },
  { week: "T3W1", km: 10, pace: "6:20", runs: 2 },
  { week: "T3W2", km: 14, pace: "6:15", runs: 3 },
  { week: "T3W3", km: 30, pace: "5:45", runs: 5 },
  { week: "T3W4", km: 32, pace: "5:40", runs: 6 },
];

const recentRuns = [
  { date: "12/03/2026", distance: 10.5, pace: "5:42", time: "59:51", type: "Tempo", feel: 4 },
  { date: "10/03/2026", distance: 6.2,  pace: "6:10", time: "38:22", type: "Phục hồi", feel: 5 },
  { date: "08/03/2026", distance: 21.1, pace: "5:48", time: "2:02:23", type: "Long run", feel: 3 },
  { date: "06/03/2026", distance: 8.0,  pace: "5:55", time: "47:20", type: "Interval", feel: 4 },
  { date: "04/03/2026", distance: 5.0,  pace: "6:30", time: "32:30", type: "Phục hồi", feel: 5 },
  { date: "02/03/2026", distance: 12.0, pace: "5:50", time: "1:10:00", type: "Tempo", feel: 4 },
];

const monthStats = [
  { month: "T1", km: 67, runs: 14, avgPace: "6:05", longest: 18 },
  { month: "T2", km: 92, runs: 18, avgPace: "5:54", longest: 25 },
  { month: "T3", km: 86, runs: 16, avgPace: "5:48", longest: 32 },
];

const totalKm = monthStats.reduce((s, m) => s + m.km, 0);
const totalRuns = monthStats.reduce((s, m) => s + m.runs, 0);
const longestEver = Math.max(...monthStats.map((m) => m.longest));

const typeColors = {
  "Tempo": "#C8860A",
  "Phục hồi": "#2E8B57",
  "Long run": "#4A6FA5",
  "Interval": "#C0392B",
};

const feelStars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: "#FFFDF7",
        border: "1px solid #E8D5B5",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(120,80,30,0.12)",
        minWidth: 160,
      }}>
        <p style={{ color: "#8B4513", fontWeight: 700, fontSize: 13, margin: 0 }}>{label}</p>
        <p style={{ color: "#3D2B1F", fontSize: 22, fontWeight: 800, margin: "4px 0 2px" }}>
          {d.km} km
        </p>
        <p style={{ color: "#8B7355", fontSize: 12, margin: 0 }}>
          Pace TB: {d.pace} /km &nbsp;·&nbsp; {d.runs} buổi
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon, label, value, sub }) => (
  <div style={{
    flex: 1,
    background: "#FFFDF7",
    border: "1px solid #E8D5B5",
    borderRadius: 16,
    padding: "16px 14px",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(120,80,30,0.05)",
  }}>
    <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#8B4513", lineHeight: 1, fontFamily: "'Georgia', serif" }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: "#B8956A", fontWeight: 600, letterSpacing: 1, marginTop: 4, fontFamily: "'Segoe UI', sans-serif" }}>
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: 10, color: "#C4B49A", marginTop: 3, fontFamily: "'Segoe UI', sans-serif" }}>
        {sub}
      </div>
    )}
  </div>
);

export default function RunningPage() {
  const [selectedMonth, setSelectedMonth] = useState(2);
  const current = monthStats[selectedMonth];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg, #FFF8ED 0%, #FDF2E0 35%, #F7ECDA 65%, #FFF5E6 100%)",
      fontFamily: "'Georgia', 'Noto Serif', serif",
      color: "#3D2B1F",
      padding: "20px 16px",
      overflowX: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 25% 20%, rgba(218,165,32,0.07) 0%, transparent 50%), radial-gradient(ellipse at 75% 80%, rgba(46,139,87,0.05) 0%, transparent 50%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 11, letterSpacing: 5, color: "#B8956A", textTransform: "uppercase", marginBottom: 8,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Nhật Ký Chạy Bộ · 2026
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: "#8B4513", letterSpacing: "1px" }}>
            🏃 Vận Động 2026
          </h1>
          <div style={{
            width: 60, height: 2,
            background: "linear-gradient(90deg, transparent, #2E8B57, transparent)",
            margin: "10px auto",
          }} />
          <div style={{ fontSize: 13, color: "#A0896E", marginTop: 4, fontStyle: "italic" }}>
            Mục tiêu: 1,000 km · Tiến độ: {totalKm} km ({Math.round(totalKm / 10)}%)
          </div>
          {/* Progress bar */}
          <div style={{
            height: 6, background: "#EDE4D6", borderRadius: 4, overflow: "hidden",
            maxWidth: 320, margin: "10px auto 0",
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min(totalKm / 10, 100)}%`,
              background: "linear-gradient(90deg, #2E8B57, #3A9D5C)",
              borderRadius: 4,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <StatCard icon="🛣️" label="TỔNG KM" value={`${totalKm}`} sub="km năm 2026" />
          <StatCard icon="👟" label="BUỔI CHẠY" value={totalRuns} sub="tổng số buổi" />
          <StatCard icon="⚡" label="XA NHẤT" value={`${longestEver}`} sub="km / buổi" />
        </div>

        {/* Weekly chart */}
        <div style={{
          background: "#FFFDF7",
          border: "1px solid #E8D5B5",
          borderRadius: 16,
          padding: "20px 8px 8px 0",
          marginBottom: 22,
          boxShadow: "0 4px 20px rgba(120,80,30,0.06)",
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "#B8956A", textTransform: "uppercase",
            marginBottom: 12, paddingLeft: 20,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Km theo tuần
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="kmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E8B57" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2E8B57" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B5" />
              <XAxis dataKey="week" tick={{ fill: "#8B7355", fontSize: 10, fontFamily: "Segoe UI, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 40]} tick={{ fill: "#B8A590", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={20} stroke="#D4C4A8" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="km" stroke="#2E8B57" strokeWidth={3} fill="url(#kmGrad)"
                dot={{ r: 4, fill: "#2E8B57", stroke: "none" }}
                activeDot={{ r: 6, fill: "#3A9D5C", stroke: "#1A5C37", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Month selector + stats */}
        <div style={{
          background: "#FFFDF7",
          border: "1px solid #E8D5B5",
          borderRadius: 16,
          padding: "18px 20px",
          marginBottom: 22,
          boxShadow: "0 4px 16px rgba(120,80,30,0.05)",
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "#B8956A", textTransform: "uppercase", marginBottom: 14,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Thống kê theo tháng
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {monthStats.map((m, i) => (
              <button key={i} onClick={() => setSelectedMonth(i)} style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 20,
                border: selectedMonth === i ? "2px solid #2E8B57" : "1px solid #D9C9AE",
                background: selectedMonth === i
                  ? "linear-gradient(135deg, #E8F5EE, #D4EDDE)"
                  : "#FFFDF7",
                color: selectedMonth === i ? "#1A5C37" : "#8B7355",
                fontSize: 13,
                fontWeight: selectedMonth === i ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontFamily: "'Segoe UI', sans-serif",
                boxShadow: selectedMonth === i ? "0 2px 8px rgba(46,139,87,0.2)" : "none",
              }}>
                {m.month}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Tổng km", value: `${current.km} km`, color: "#2E8B57" },
              { label: "Số buổi", value: `${current.runs} buổi`, color: "#4A6FA5" },
              { label: "Pace TB", value: current.avgPace + " /km", color: "#C8860A" },
              { label: "Xa nhất", value: `${current.longest} km`, color: "#C0392B" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#FAF4E8",
                borderRadius: 12,
                padding: "12px 14px",
                borderLeft: `3px solid ${item.color}`,
              }}>
                <div style={{ fontSize: 11, color: "#A0896E", marginBottom: 4, fontFamily: "'Segoe UI', sans-serif" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color, fontFamily: "'Georgia', serif" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent runs */}
        <div style={{
          background: "#FFFDF7",
          border: "1px solid #E8D5B5",
          borderRadius: 16,
          padding: "18px 20px",
          marginBottom: 22,
          boxShadow: "0 4px 16px rgba(120,80,30,0.05)",
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "#B8956A", textTransform: "uppercase", marginBottom: 14,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Buổi chạy gần đây
          </div>
          {recentRuns.map((run, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 0",
              borderBottom: i < recentRuns.length - 1 ? "1px solid #EDE4D6" : "none",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `linear-gradient(135deg, ${typeColors[run.type]}22, ${typeColors[run.type]}11)`,
                border: `1px solid ${typeColors[run.type]}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                🏃
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: "#3D2B1F",
                    fontFamily: "'Segoe UI', sans-serif",
                  }}>
                    {run.distance} km
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: typeColors[run.type],
                    background: `${typeColors[run.type]}15`,
                    padding: "2px 8px", borderRadius: 20,
                    fontFamily: "'Segoe UI', sans-serif",
                  }}>
                    {run.type}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#A0896E", fontFamily: "'Segoe UI', sans-serif" }}>
                  {run.date} &nbsp;·&nbsp; {run.time} &nbsp;·&nbsp; {run.pace} /km
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#C8860A", letterSpacing: -1 }}>
                {feelStars(run.feel)}
              </div>
            </div>
          ))}
        </div>

        {/* Pace zones */}
        <div style={{
          background: "#FFFDF7",
          border: "1px solid #E8D5B5",
          borderRadius: 16,
          padding: "18px 20px",
          marginBottom: 22,
          boxShadow: "0 4px 16px rgba(120,80,30,0.05)",
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: "#B8956A", textTransform: "uppercase", marginBottom: 14,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Vùng pace
          </div>
          {[
            { label: "Dễ / Phục hồi", range: "> 6:30 /km", pct: 40, color: "#2E8B57" },
            { label: "Aerobic nhẹ", range: "6:00–6:30 /km", pct: 35, color: "#3A9D5C" },
            { label: "Tempo / Ngưỡng", range: "5:30–6:00 /km", pct: 18, color: "#C8860A" },
            { label: "Interval / VO2", range: "< 5:30 /km", pct: 7, color: "#C0392B" },
          ].map((zone, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#7A6B5D", fontWeight: 500, fontFamily: "'Segoe UI', sans-serif" }}>
                  {zone.label}
                </span>
                <span style={{ fontSize: 11, color: "#A0896E", fontFamily: "'Segoe UI', sans-serif" }}>
                  {zone.range} &nbsp;<strong style={{ color: zone.color }}>{zone.pct}%</strong>
                </span>
              </div>
              <div style={{ height: 7, background: "#EDE4D6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${zone.pct}%`,
                  background: `linear-gradient(90deg, ${zone.color}, ${zone.color}cc)`,
                  borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "12px 0 24px",
          fontSize: 11, color: "#C4B49A", fontStyle: "italic",
        }}>
          Nhật Ký Chạy Bộ · 2026 · Mục tiêu 1,000 km
        </div>
      </div>
    </div>
  );
}
