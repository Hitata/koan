import { useState, useEffect, useRef } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";

const monthsData = [
  {
    month: "T1", fullMonth: "Tháng 1", gregorian: "17/2 – 17/3/2026", canChi: "Canh Dần", score: 7,
    element: "Kim / Mộc", thapThan: "Chính Tài + Ấn", emoji: "🌱",
    summary: "Khởi đầu ổn định",
    detail: "Chính Tài Canh Kim xuất hiện — có cơ hội kiếm tiền, thu nhập đến. Dần Mộc sinh Hỏa, năng lượng bản thân được hỗ trợ. Tiền đến nhưng giữ không dễ. Tranh thủ làm việc, tạo nền tảng cho cả năm.",
    advice: "Chủ động làm việc, tạo nền tảng.",
    taiLoc: 7, sucKhoe: 7, tinhCam: 6, suNghiep: 7,
  },
  {
    month: "T2", fullMonth: "Tháng 2", gregorian: "18/3 – 16/4/2026", canChi: "Tân Mão", score: 7.5,
    element: "Kim / Mộc", thapThan: "Thiên Tài + Chính Ấn", emoji: "💰",
    summary: "Tài lộc bất ngờ",
    detail: "Thiên Tài Tân Kim — tiền ngoài lương, thu nhập phụ, thưởng, may mắn. Mão trùng trụ tháng sinh, tạo cảm giác quen thuộc. Nhưng Mão Ngọ phá, giữa cơ hội có xáo trộn nhỏ.",
    advice: "Có tài lộc bất ngờ, nhưng đừng chủ quan.",
    taiLoc: 8, sucKhoe: 7, tinhCam: 7, suNghiep: 7,
  },
  {
    month: "T3", fullMonth: "Tháng 3", gregorian: "17/4 – 15/5/2026", canChi: "Nhâm Thìn", score: 5.5,
    element: "Thủy / Thổ", thapThan: "Chính Quan + Thực Thần", emoji: "😤",
    summary: "Áp lực, suy nghĩ nhiều",
    detail: "Chính Quan Nhâm Thủy — áp lực công việc tăng, sếp giao nhiều việc. Thìn trùng trụ giờ sinh tạo phục ngâm — liên quan con cái, hậu vận. Dễ suy nghĩ nhiều, mệt đầu.",
    advice: "Bình tĩnh, đừng quyết định vội.",
    taiLoc: 5, sucKhoe: 5, tinhCam: 6, suNghiep: 6,
  },
  {
    month: "T4", fullMonth: "Tháng 4", gregorian: "16/5 – 14/6/2026", canChi: "Quý Tỵ", score: 4,
    element: "Thủy / Hỏa", thapThan: "Thất Sát + Tỷ Kiếp", emoji: "⚠️",
    summary: "Tháng khó nhất năm",
    detail: "Thất Sát Quý Thủy — áp lực mạnh, tiểu nhân, đối đầu. Quý trùng đại vận, áp lực gấp đôi. Tỵ Hợi xung trực tiếp vào nhật chủ — sức khỏe và tinh thần đều bị ảnh hưởng nặng.",
    advice: "Tránh đối đầu, giữ sức khỏe, đừng ký hợp đồng lớn.",
    taiLoc: 3, sucKhoe: 4, tinhCam: 4, suNghiep: 5,
  },
  {
    month: "T5", fullMonth: "Tháng 5", gregorian: "15/6 – 13/7/2026", canChi: "Giáp Ngọ", score: 6,
    element: "Mộc / Hỏa", thapThan: "Chính Ấn + Kiếp Tài", emoji: "🔥",
    summary: "Có quý nhân, dễ nóng nảy",
    detail: "Giáp Chính Ấn — quý nhân xuất hiện, học hỏi điều mới. Nhưng Ngọ Hỏa cực vượng trong năm Hỏa — nóng nảy, bốc đồng. Phục ngâm Thái Tuế + trụ năm sinh. Có sức mạnh nhưng dễ quá đà.",
    advice: "Kiềm chế bản thân, tránh nóng giận.",
    taiLoc: 6, sucKhoe: 5, tinhCam: 5, suNghiep: 7,
  },
  {
    month: "T6", fullMonth: "Tháng 6", gregorian: "14/7 – 11/8/2026", canChi: "Ất Mùi", score: 6.5,
    element: "Mộc / Thổ", thapThan: "Thiên Ấn + Thực Thương", emoji: "🧘",
    summary: "Ổn định, suy ngẫm",
    detail: "Ất Kiêu Ấn — suy nghĩ nhiều, trực giác mạnh. Mùi trùng đại vận Quý Mùi, kích hoạt chủ đề đại vận. Mùi Thổ tiết Hỏa, giảm bớt sức nóng. Tương đối dễ thở, phù hợp lên kế hoạch.",
    advice: "Dùng thời gian suy nghĩ chiến lược.",
    taiLoc: 6, sucKhoe: 7, tinhCam: 6, suNghiep: 7,
  },
  {
    month: "T7", fullMonth: "Tháng 7", gregorian: "12/8 – 10/9/2026", canChi: "Bính Thân", score: 8,
    element: "Hỏa / Kim", thapThan: "Kiếp Tài + Tài tinh", emoji: "🌟",
    summary: "Tháng tốt nhất năm!",
    detail: "Bính Kiếp Tài + Thân Kim Tài tinh có gốc — tháng tốt nhất về tài lộc. Thân hợp Tỵ tạo liên kết tốt. Tiền bạc thực sự có cơ hội đến. Phải nhanh tay nắm bắt vì Kiếp Tài sẵn sàng tranh giành.",
    advice: "Tập trung kiếm tiền, ký hợp đồng, nắm cơ hội!",
    taiLoc: 9, sucKhoe: 7, tinhCam: 7, suNghiep: 9,
  },
  {
    month: "T8", fullMonth: "Tháng 8", gregorian: "11/9 – 10/10/2026", canChi: "Đinh Dậu", score: 6,
    element: "Hỏa / Kim", thapThan: "Tỷ Kiên + Chính Tài", emoji: "⚔️",
    summary: "Tiền có, quan hệ căng",
    detail: "Đinh trùng nhật chủ — phục ngâm nhật can, hoài nghi bản thân. Dậu Kim Chính Tài có gốc, tiền bạc vẫn ổn. Nhưng Mão Dậu xung — ảnh hưởng anh em, bạn bè. Mâu thuẫn với đồng nghiệp hoặc bạn thân.",
    advice: "Giữ hòa khí, tránh tranh cãi.",
    taiLoc: 7, sucKhoe: 6, tinhCam: 5, suNghiep: 6,
  },
  {
    month: "T9", fullMonth: "Tháng 9", gregorian: "11/10 – 8/11/2026", canChi: "Mậu Tuất", score: 6,
    element: "Thổ / Thổ", thapThan: "Thương Quan + Thực Thương", emoji: "💡",
    summary: "Sáng tạo, cẩn thận lời nói",
    detail: "Thương Quan Mậu Thổ — sáng tạo, nổi loạn, muốn thay đổi. Tuất Thổ khô tiết khí nhật chủ. Nhiều ý tưởng mới nhưng dễ gây mâu thuẫn với cấp trên. Freelance hoặc tự kinh doanh thì tốt.",
    advice: "Sáng tạo tốt, nhưng giữ mồm giữ miệng.",
    taiLoc: 6, sucKhoe: 6, tinhCam: 6, suNghiep: 7,
  },
  {
    month: "T10", fullMonth: "Tháng 10", gregorian: "9/11 – 8/12/2026", canChi: "Kỷ Hợi", score: 5.5,
    element: "Thổ / Thủy", thapThan: "Thực Thần + Quan tinh", emoji: "🌊",
    summary: "Tâm trạng bất ổn",
    detail: "Kỷ Thực Thần nhẹ nhàng, ăn uống vui vẻ. Nhưng Hợi trùng trụ ngày sinh — phục ngâm trụ ngày, tâm trạng lên xuống. Có thể có chuyện tình cảm xáo trộn.",
    advice: "Tập trung chăm sóc bản thân.",
    taiLoc: 5, sucKhoe: 5, tinhCam: 4, suNghiep: 6,
  },
  {
    month: "T11", fullMonth: "Tháng 11", gregorian: "9/12/2026 – 7/1/2027", canChi: "Canh Tý", score: 5,
    element: "Kim / Thủy", thapThan: "Chính Tài + Chính Quan", emoji: "🚨",
    summary: "Rủi ro cao, cẩn trọng",
    detail: "Canh Chính Tài + Tý Chính Quan — vừa có tiền vừa có áp lực. Làm nhiều thì được nhiều. Nhưng Tý Ngọ xung Thái Tuế — cẩn thận tai nạn nhỏ, va chạm, kiện tụng. Đừng mạo hiểm.",
    advice: "Lái xe cẩn thận, tránh mạo hiểm, giữ tiền.",
    taiLoc: 6, sucKhoe: 4, tinhCam: 5, suNghiep: 6,
  },
  {
    month: "T12", fullMonth: "Tháng 12", gregorian: "8/1 – 5/2/2027", canChi: "Tân Sửu", score: 7,
    element: "Kim / Thổ", thapThan: "Thiên Tài + Thực Thương", emoji: "🎊",
    summary: "Kết năm nhẹ nhàng",
    detail: "Thiên Tài Tân Kim — khoản thu bất ngờ cuối năm, thưởng tết, tiền từ nguồn phụ. Sửu Thổ ôn hòa, tạo sự ổn định. Không xung không phá gì nặng. Kết thúc năm tương đối êm đẹp.",
    advice: "Tận hưởng thành quả, chuẩn bị cho năm mới.",
    taiLoc: 7, sucKhoe: 7, tinhCam: 7, suNghiep: 7,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = monthsData.find((m) => m.month === label);
    if (!data) return null;
    return (
      <div style={{
        background: "#FFFDF7",
        border: "1px solid #E8D5B5",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(120,80,30,0.12)",
        minWidth: 180,
      }}>
        <p style={{ color: "#8B4513", fontWeight: 700, fontSize: 14, margin: 0 }}>
          {data.emoji} {data.fullMonth} — {data.canChi}
        </p>
        <p style={{ color: "#3D2B1F", fontSize: 24, fontWeight: 800, margin: "4px 0" }}>
          {data.score}/10
        </p>
        <p style={{ color: "#8B7355", fontSize: 12, margin: 0 }}>
          {data.summary}
        </p>
      </div>
    );
  }
  return null;
};

const SubBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 12, color: "#7A6B5D", letterSpacing: "0.5px", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: 700 }}>{value}/10</span>
    </div>
    <div style={{ height: 7, background: "#EDE4D6", borderRadius: 4, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${value * 10}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        borderRadius: 4,
        transition: "width 0.6s ease",
      }} />
    </div>
  </div>
);

const getScoreColor = (score) => {
  if (score >= 7.5) return "#2E8B57";
  if (score >= 6.5) return "#3A9D5C";
  if (score >= 5.5) return "#C8860A";
  if (score >= 4.5) return "#D4740E";
  return "#C0392B";
};

const getScoreLabel = (score) => {
  if (score >= 8) return "Rất tốt";
  if (score >= 7) return "Tốt";
  if (score >= 6) return "Khá";
  if (score >= 5) return "Trung bình";
  return "Cẩn thận";
};

export default function BatTu2026() {
  const [selected, setSelected] = useState(6);
  const cardRef = useRef(null);
  const current = monthsData[selected];
  const scoreColor = getScoreColor(current.score);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(175deg, #FFF8ED 0%, #FDF2E0 35%, #F7ECDA 65%, #FFF5E6 100%)",
      fontFamily: "'Georgia', 'Noto Serif', serif",
      color: "#3D2B1F",
      padding: "20px 16px",
      overflowX: "hidden",
    }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% 15%, rgba(218,165,32,0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 85%, rgba(178,100,40,0.05) 0%, transparent 50%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 11, letterSpacing: 5, color: "#B8956A", textTransform: "uppercase", marginBottom: 8,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Bát Tự Tử Bình · Đinh Hỏa
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, color: "#8B4513", letterSpacing: "1px" }}>
            Vận Trình 2026
          </h1>
          <div style={{
            width: 60, height: 2, background: "linear-gradient(90deg, transparent, #C8860A, transparent)",
            margin: "10px auto",
          }} />
          <div style={{ fontSize: 13, color: "#A0896E", marginTop: 4, fontStyle: "italic" }}>
            Năm Bính Ngọ 丙午 · Hỏa vượng
          </div>
        </div>

        {/* Chart */}
        <div style={{
          background: "#FFFDF7",
          border: "1px solid #E8D5B5",
          borderRadius: 16,
          padding: "20px 8px 8px 0",
          marginBottom: 22,
          boxShadow: "0 4px 20px rgba(120,80,30,0.06)",
        }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              onClick={(e) => { if (e && e.activeTooltipIndex !== undefined) setSelected(e.activeTooltipIndex); }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8860A" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#DAA520" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#C8860A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5B5" />
              <XAxis dataKey="month" tick={{ fill: "#8B7355", fontSize: 12, fontFamily: "Segoe UI, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis domain={[2, 10]} tick={{ fill: "#B8A590", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={6} stroke="#D4C4A8" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="score" stroke="#8B4513" strokeWidth={3} fill="url(#scoreGrad)" dot={(props) => {
                const { cx, cy, index } = props;
                const isSelected = index === selected;
                return (
                  <circle
                    key={index} cx={cx} cy={cy}
                    r={isSelected ? 8 : 4}
                    fill={isSelected ? "#DAA520" : "#8B4513"}
                    stroke={isSelected ? "#5C3310" : "none"}
                    strokeWidth={isSelected ? 2 : 0}
                    style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    onClick={() => setSelected(index)}
                  />
                );
              }}
              activeDot={{ r: 6, fill: "#DAA520", stroke: "#5C3310", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Month selector pills */}
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 22,
          WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
        }}>
          {monthsData.map((m, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{
              flex: "0 0 auto",
              padding: "8px 14px",
              borderRadius: 20,
              border: selected === i ? "2px solid #C8860A" : "1px solid #D9C9AE",
              background: selected === i
                ? "linear-gradient(135deg, #FFF1D0, #FFEAB8)"
                : "#FFFDF7",
              color: selected === i ? "#7A4A0A" : "#8B7355",
              fontSize: 13,
              fontWeight: selected === i ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
              fontFamily: "'Segoe UI', sans-serif",
              boxShadow: selected === i ? "0 2px 8px rgba(200,134,10,0.2)" : "none",
            }}>
              <div>{m.emoji} {m.month}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.75 }}>{m.gregorian}</div>
            </button>
          ))}
        </div>

        {/* Detail Card */}
        <div ref={cardRef} style={{
          background: "#FFFDF7",
          border: `1px solid ${scoreColor}33`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 22,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(120,80,30,0.08)",
        }}>
          <div style={{
            position: "absolute", top: -50, right: -50, width: 140, height: 140,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${scoreColor}12, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{
                fontSize: 11, color: "#B8956A", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                {current.canChi} · {current.element}
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#3D2B1F" }}>
                {current.emoji} {current.fullMonth}
              </h2>
              <div style={{ fontSize: 12, color: "#8B6A3E", marginTop: 3, fontFamily: "'Segoe UI', sans-serif", fontStyle: "italic" }}>
                {current.gregorian}
              </div>
              <div style={{ fontSize: 12, color: "#A0896E", marginTop: 2, fontFamily: "'Segoe UI', sans-serif" }}>
                {current.thapThan}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 46, fontWeight: 900, color: scoreColor,
                lineHeight: 1, transition: "color 0.3s ease",
                fontFamily: "'Georgia', serif",
              }}>
                {current.score}
              </div>
              <div style={{
                fontSize: 10, color: scoreColor, fontWeight: 700,
                letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                {getScoreLabel(current.score)}
              </div>
            </div>
          </div>

          <div style={{
            background: "#FAF4E8",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 18,
            borderLeft: `3px solid ${scoreColor}`,
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#5A4633", margin: 0 }}>
              {current.detail}
            </p>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SubBar label="Tài Lộc 💰" value={current.taiLoc} color="#C8860A" />
            <SubBar label="Sức Khỏe 💪" value={current.sucKhoe} color="#2E8B57" />
            <SubBar label="Tình Cảm ❤️" value={current.tinhCam} color="#C0392B" />
            <SubBar label="Sự Nghiệp 📈" value={current.suNghiep} color="#4A6FA5" />
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${scoreColor}10, ${scoreColor}06)`,
            border: `1px solid ${scoreColor}22`,
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🔮</span>
            <p style={{ fontSize: 13, color: "#5A4633", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
              {current.advice}
            </p>
          </div>
        </div>

        {/* Year summary bar */}
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
            Tổng quan cả năm
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 64, marginBottom: 8 }}>
            {monthsData.map((m, i) => (
              <div key={i} onClick={() => setSelected(i)} style={{
                flex: 1,
                height: `${(m.score / 10) * 100}%`,
                background: selected === i
                  ? `linear-gradient(180deg, ${getScoreColor(m.score)}, ${getScoreColor(m.score)}88)`
                  : `linear-gradient(180deg, #D4C4A8, #E8D5B5)`,
                borderRadius: "5px 5px 0 0",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              title={`${m.fullMonth}: ${m.score}/10`}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {monthsData.map((m, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center",
                fontSize: 9,
                color: selected === i ? "#8B4513" : "#B8A590",
                fontWeight: selected === i ? 700 : 400,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                {m.month}
              </div>
            ))}
          </div>
        </div>

        {/* Key events */}
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
            Mốc quan trọng
          </div>
          {[
            { month: "T4", label: "Đáy năm — Thất Sát + Tỵ Hợi xung", color: "#C0392B", icon: "📉" },
            { month: "T7", label: "Đỉnh năm — Tài tinh có gốc, cơ hội lớn", color: "#2E8B57", icon: "📈" },
            { month: "T11", label: "Cảnh báo — Tý Ngọ xung Thái Tuế", color: "#D4740E", icon: "⚡" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 0",
              borderBottom: i < 2 ? "1px solid #EDE4D6" : "none",
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: item.color,
                  fontFamily: "'Segoe UI', sans-serif",
                }}>{item.month}</span>
                <span style={{ fontSize: 12, color: "#7A6B5D", marginLeft: 8 }}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "12px 0 24px",
          fontSize: 11, color: "#C4B49A", fontStyle: "italic",
        }}>
          Bát Tự Tử Bình · Đinh Hợi · Nhật chủ Đinh Hỏa · Năm sinh 1990
        </div>
      </div>
    </div>
  );
}
