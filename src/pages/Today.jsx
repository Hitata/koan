import { useState, useEffect } from 'react';
import { getTodayData, solarToLunar, lunarDateString, ELEMENT_COLORS, ELEMENT_BG } from '../utils/lunar.js';

const WEEKDAYS = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const WEEKDAYS_SHORT = ['CN','T2','T3','T4','T5','T6','T7'];
const MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

const QUALITY_CONFIG = {
  excellent: { label: 'Đại Cát', color: '#1B7A3D', bg: '#E6F4EA', icon: '🌟' },
  good: { label: 'Cát', color: '#2E7D32', bg: '#E8F5E9', icon: '✨' },
  neutral: { label: 'Bình', color: '#B8860B', bg: '#FFF8E1', icon: '☯️' },
  bad: { label: 'Hung', color: '#C62828', bg: '#FFEBEE', icon: '⚠️' },
};

function CanChiPillar({ label, canChi, size = 'normal' }) {
  const color = canChi.color;
  const bg = canChi.bgColor;
  const isLarge = size === 'large';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <div style={{
        fontSize: isLarge ? 10 : 9,
        color: '#B8956A',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        {label}
      </div>
      <div style={{
        background: bg,
        border: `2px solid ${color}44`,
        borderRadius: isLarge ? 16 : 12,
        padding: isLarge ? '12px 16px' : '8px 12px',
        textAlign: 'center',
        minWidth: isLarge ? 80 : 64,
      }}>
        <div style={{
          fontSize: isLarge ? 22 : 16,
          fontWeight: 800,
          color,
          fontFamily: "'Georgia', serif",
          lineHeight: 1.1,
        }}>
          {canChi.stemHan}{canChi.branchHan}
        </div>
        <div style={{
          fontSize: isLarge ? 13 : 11,
          color,
          fontWeight: 600,
          marginTop: 3,
        }}>
          {canChi.stem} {canChi.branch}
        </div>
        <div style={{
          fontSize: isLarge ? 10 : 8,
          color: '#8B7355',
          marginTop: 2,
          fontFamily: "'Segoe UI', sans-serif",
        }}>
          {canChi.stemElement} · {canChi.yinYang}
        </div>
      </div>
    </div>
  );
}

function ActivityTag({ text, type }) {
  const isGood = type === 'good';
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 500,
      background: isGood ? '#E6F4EA' : '#FFEBEE',
      color: isGood ? '#1B7A3D' : '#C62828',
      border: `1px solid ${isGood ? '#A5D6A7' : '#EF9A9A'}`,
      margin: '3px 4px 3px 0',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {text}
    </span>
  );
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getLunarDayLabel(sY, sM, sD) {
  const lunar = solarToLunar(sY, sM, sD);
  if (lunar.lunarDay === 1) {
    const ls = lunarDateString(lunar);
    return ls.monthStr;
  }
  const ls = lunarDateString(lunar);
  return ls.dayStr;
}

function CalendarGrid({ selectedDate, onSelectDate }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    onSelectDate(d);
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    onSelectDate(d);
  };

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div style={{
      background: '#FFFDF7',
      border: '1px solid #E8D5B5',
      borderRadius: 20,
      padding: '16px 12px',
      marginBottom: 16,
      boxShadow: '0 4px 20px rgba(120,80,30,0.06)',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: 3, color: '#B8956A', textTransform: 'uppercase',
        marginBottom: 12, textAlign: 'center', fontFamily: "'Segoe UI', sans-serif",
      }}>
        Lịch Tháng
      </div>

      {/* Month navigation */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12, padding: '0 4px',
      }}>
        <button onClick={prevMonth} style={{
          background: 'none', border: '1px solid #D9C9AE', borderRadius: 8,
          padding: '4px 12px', cursor: 'pointer', fontSize: 16, color: '#8B7355',
        }}>‹</button>
        <div style={{
          fontSize: 15, fontWeight: 700, color: '#5C3310',
          fontFamily: "'Georgia', serif",
        }}>
          {MONTHS_VI[month]} · {year}
        </div>
        <button onClick={nextMonth} style={{
          background: 'none', border: '1px solid #D9C9AE', borderRadius: 8,
          padding: '4px 12px', cursor: 'pointer', fontSize: 16, color: '#8B7355',
        }}>›</button>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
        marginBottom: 4,
      }}>
        {WEEKDAYS_SHORT.map((w, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#B8956A',
            padding: '4px 0', fontFamily: "'Segoe UI', sans-serif",
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
      }}>
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={i} />;
          }
          const cellDate = new Date(year, month, day);
          const isSelected = isSameDay(cellDate, selectedDate);
          const isToday = isSameDay(cellDate, today);
          const lunarLabel = getLunarDayLabel(year, month + 1, day);
          const isSunday = cellDate.getDay() === 0;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(cellDate)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, #FFF1D0, #FFEAB8)'
                  : isToday ? '#FAF4E8' : 'transparent',
                border: isSelected
                  ? '2px solid #8B4513'
                  : isToday ? '1px solid #D9C9AE' : '1px solid transparent',
                borderRadius: 10,
                padding: '6px 2px 4px',
                cursor: 'pointer',
                textAlign: 'center',
                minHeight: 48,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                fontSize: 14, fontWeight: isSelected ? 800 : 600,
                color: isSelected ? '#7A4A0A' : isSunday ? '#C62828' : '#3D2B1F',
                lineHeight: 1.2,
              }}>
                {day}
              </div>
              <div style={{
                fontSize: 8, color: isSelected ? '#8B6A3E' : '#B8956A',
                lineHeight: 1.2, marginTop: 2,
                fontFamily: "'Segoe UI', sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {lunarLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Today() {
  const [now, setNow] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(() => getTodayData(new Date()));
  const isToday = isSameDay(selectedDate, new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setData(getTodayData(selectedDate));
  }, [selectedDate]);

  const goToDay = (offset) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const quality = QUALITY_CONFIG[data.officer.quality];
  const dayColor = data.day.color;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(175deg, #FFF8ED 0%, #FDF2E0 35%, #F7ECDA 65%, #FFF5E6 100%)',
      fontFamily: "'Georgia', 'Noto Serif', serif",
      color: '#3D2B1F',
      padding: '20px 16px',
      overflowX: 'hidden',
    }}>
      {/* Subtle decorative background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 30% 15%, rgba(218,165,32,0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 85%, rgba(178,100,40,0.05) 0%, transparent 50%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>

        {/* ===== HEADER: Live Clock ===== */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontSize: 11, letterSpacing: 5, color: '#B8956A', textTransform: 'uppercase',
            marginBottom: 8, fontFamily: "'Segoe UI', sans-serif",
          }}>
            Lịch Vạn Niên · {isToday ? 'Hôm Nay' : WEEKDAYS[selectedDate.getDay()]}
          </div>
          <div style={{
            fontSize: 56, fontWeight: 300, color: '#5C3310',
            fontFamily: "'Georgia', serif", lineHeight: 1,
            letterSpacing: 2,
          }}>
            {String(now.getHours()).padStart(2, '0')}
            <span style={{ opacity: now.getSeconds() % 2 === 0 ? 1 : 0.3 }}>:</span>
            {String(now.getMinutes()).padStart(2, '0')}
          </div>
          <div style={{
            fontSize: 13, color: '#8B7355', marginTop: 6,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            {String(now.getSeconds()).padStart(2, '0')} giây
          </div>
        </div>

        {/* ===== DAY NAVIGATION ===== */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 12, marginBottom: 12,
        }}>
          <button onClick={() => goToDay(-1)} style={{
            background: 'none', border: '1px solid #D9C9AE', borderRadius: 12,
            padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: '#8B7355', fontFamily: "'Segoe UI', sans-serif",
            transition: 'all 0.15s ease',
          }}>
            ‹ Hôm qua
          </button>
          {!isToday && (
            <button onClick={goToToday} style={{
              background: 'linear-gradient(135deg, #FFF1D0, #FFEAB8)',
              border: '2px solid #8B4513', borderRadius: 12,
              padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              color: '#7A4A0A', fontFamily: "'Segoe UI', sans-serif",
            }}>
              Hôm nay
            </button>
          )}
          <button onClick={() => goToDay(1)} style={{
            background: 'none', border: '1px solid #D9C9AE', borderRadius: 12,
            padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: '#8B7355', fontFamily: "'Segoe UI', sans-serif",
            transition: 'all 0.15s ease',
          }}>
            Ngày mai ›
          </button>
        </div>

        {/* ===== CALENDAR GRID ===== */}
        <CalendarGrid selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* ===== DATE CARD ===== */}
        <div style={{
          background: '#FFFDF7',
          border: '1px solid #E8D5B5',
          borderRadius: 20,
          padding: '24px 20px',
          marginBottom: 16,
          boxShadow: '0 6px 24px rgba(120,80,30,0.08)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative corner */}
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 120, height: 120,
            borderRadius: '50%', background: `radial-gradient(circle, ${dayColor}12, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Weekday */}
          <div style={{
            fontSize: 14, color: '#A0896E', fontFamily: "'Segoe UI', sans-serif",
            marginBottom: 4,
          }}>
            {WEEKDAYS[now.getDay()]}
          </div>

          {/* Big date number */}
          <div style={{
            fontSize: 72, fontWeight: 900, color: dayColor,
            lineHeight: 1, margin: '4px 0',
            fontFamily: "'Georgia', serif",
          }}>
            {data.gregorian.day}
          </div>

          {/* Gregorian month/year */}
          <div style={{
            fontSize: 15, color: '#5A4633', fontWeight: 600,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            {MONTHS_VI[data.gregorian.month - 1]} · {data.gregorian.year}
          </div>

          {/* Divider */}
          <div style={{
            width: 60, height: 2, margin: '14px auto',
            background: 'linear-gradient(90deg, transparent, #C8860A, transparent)',
          }} />

          {/* Lunar date */}
          <div style={{ fontSize: 18, fontWeight: 700, color: '#8B4513', marginBottom: 4 }}>
            {data.lunarStr.dayStr}
          </div>
          <div style={{ fontSize: 14, color: '#A0896E' }}>
            {data.lunarStr.monthStr} · Năm {data.year.label} ({data.year.labelHan})
          </div>
          <div style={{
            fontSize: 12, color: '#B8956A', marginTop: 4,
            fontFamily: "'Segoe UI', sans-serif",
          }}>
            Năm con {data.year.animal} · {data.year.stemElement} {data.year.yinYang}
          </div>
        </div>

        {/* ===== CAN CHI PILLARS ===== */}
        <div style={{
          background: '#FFFDF7',
          border: '1px solid #E8D5B5',
          borderRadius: 20,
          padding: '20px 16px',
          marginBottom: 16,
          boxShadow: '0 4px 20px rgba(120,80,30,0.06)',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: '#B8956A', textTransform: 'uppercase',
            marginBottom: 16, textAlign: 'center', fontFamily: "'Segoe UI', sans-serif",
          }}>
            Can Chi · Thiên Can Địa Chi
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <CanChiPillar label="Năm" canChi={data.year} />
            <CanChiPillar label="Tháng" canChi={data.month} />
            <CanChiPillar label="Ngày" canChi={data.day} size="large" />
          </div>

          {/* Nạp Âm */}
          <div style={{
            marginTop: 16,
            textAlign: 'center',
            padding: '10px 16px',
            background: ELEMENT_BG[data.napAm.element],
            borderRadius: 12,
            border: `1px solid ${ELEMENT_COLORS[data.napAm.element]}22`,
          }}>
            <div style={{
              fontSize: 11, color: '#B8956A', letterSpacing: 1,
              fontFamily: "'Segoe UI', sans-serif", marginBottom: 4,
            }}>
              NẠP ÂM
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: ELEMENT_COLORS[data.napAm.element],
            }}>
              {data.napAm.name}
            </div>
            <div style={{
              fontSize: 12, color: '#7A6B5D', marginTop: 3,
              fontStyle: 'italic',
            }}>
              {data.napAm.desc}
            </div>
          </div>
        </div>

        {/* ===== DAY QUALITY & OFFICER ===== */}
        <div style={{
          background: '#FFFDF7',
          border: `1px solid ${quality.color}33`,
          borderRadius: 20,
          padding: '22px 20px',
          marginBottom: 16,
          boxShadow: '0 6px 24px rgba(120,80,30,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, left: -30, width: 100, height: 100,
            borderRadius: '50%', background: `radial-gradient(circle, ${quality.color}10, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            <div>
              <div style={{
                fontSize: 11, color: '#B8956A', letterSpacing: 2,
                textTransform: 'uppercase', marginBottom: 6,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                Thập Nhị Trực · {data.officer.han}
              </div>
              <h2 style={{
                fontSize: 28, fontWeight: 700, margin: 0, color: '#3D2B1F',
              }}>
                {quality.icon} Ngày {data.officer.name}
              </h2>
              <div style={{
                fontSize: 12, color: '#8B6A3E', marginTop: 4,
                fontFamily: "'Segoe UI', sans-serif", fontStyle: 'italic',
              }}>
                {data.officer.meaning}
              </div>
            </div>
            <div style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: quality.bg,
              border: `1px solid ${quality.color}44`,
            }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: quality.color,
              }}>
                {quality.label}
              </span>
            </div>
          </div>

          <div style={{
            background: '#FAF4E8',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 16,
            borderLeft: `3px solid ${quality.color}`,
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#5A4633', margin: 0 }}>
              {data.officer.desc}
            </p>
          </div>

          {/* Auspicious activities */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: '#1B7A3D',
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                宜 Nên làm
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.officer.good.map((item, i) => (
                <ActivityTag key={i} text={item} type="good" />
              ))}
            </div>
          </div>

          {/* Inauspicious activities */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
            }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: '#C62828',
                fontFamily: "'Segoe UI', sans-serif",
              }}>
                忌 Nên tránh
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.officer.bad.map((item, i) => (
                <ActivityTag key={i} text={item} type="bad" />
              ))}
            </div>
          </div>
        </div>

        {/* ===== HOURLY FORTUNE ===== */}
        <div style={{
          background: '#FFFDF7',
          border: '1px solid #E8D5B5',
          borderRadius: 20,
          padding: '20px 16px',
          marginBottom: 16,
          boxShadow: '0 4px 20px rgba(120,80,30,0.06)',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: '#B8956A', textTransform: 'uppercase',
            marginBottom: 14, textAlign: 'center', fontFamily: "'Segoe UI', sans-serif",
          }}>
            Giờ Hoàng Đạo · Hắc Đạo
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 8,
          }}>
            {data.hours.map((h, i) => {
              const currentHour = now.getHours();
              const isCurrent = (h.hourStart === 23 && (currentHour >= 23 || currentHour < 1))
                || (h.hourStart !== 23 && currentHour >= h.hourStart && currentHour < h.hourStart + 2);

              return (
                <div key={i} style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: isCurrent
                    ? `2px solid ${h.isAuspicious ? '#2E7D32' : '#C62828'}`
                    : `1px solid ${h.isAuspicious ? '#C8E6C9' : '#FFCDD2'}`,
                  background: isCurrent
                    ? (h.isAuspicious ? '#E6F4EA' : '#FFEBEE')
                    : (h.isAuspicious ? '#FAFFF5' : '#FFFAFA'),
                  position: 'relative',
                }}>
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 6, right: 8,
                      fontSize: 8, fontWeight: 700, color: '#B8956A',
                      letterSpacing: 1, fontFamily: "'Segoe UI', sans-serif",
                    }}>
                      HIỆN TẠI
                    </div>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{
                      fontSize: 14, fontWeight: 700,
                      color: h.isAuspicious ? '#2E7D32' : '#C62828',
                    }}>
                      {h.han}
                    </span>
                    <span style={{
                      fontSize: 12, color: '#5A4633', fontWeight: 600,
                      fontFamily: "'Segoe UI', sans-serif",
                    }}>
                      {h.canChi.stem} {h.canChi.branch}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 10, color: '#8B7355', marginTop: 3,
                    fontFamily: "'Segoe UI', sans-serif",
                  }}>
                    {h.hours}
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, marginTop: 3,
                    color: h.isAuspicious ? '#2E7D32' : '#B71C1C',
                    fontFamily: "'Segoe UI', sans-serif",
                  }}>
                    {h.isAuspicious ? '🟢 Hoàng Đạo' : '🔴 Hắc Đạo'}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 12, padding: '8px 12px',
            background: '#FAF4E8', borderRadius: 10,
            fontSize: 11, color: '#8B7355', textAlign: 'center',
            fontFamily: "'Segoe UI', sans-serif", fontStyle: 'italic',
          }}>
            Giờ Hoàng Đạo (🟢) là giờ tốt, thích hợp khởi sự. Giờ Hắc Đạo (🔴) nên tránh việc quan trọng.
          </div>
        </div>

        {/* ===== DAY PERSONALITY / SUMMARY ===== */}
        <div style={{
          background: '#FFFDF7',
          border: '1px solid #E8D5B5',
          borderRadius: 20,
          padding: '20px',
          marginBottom: 16,
          boxShadow: '0 4px 16px rgba(120,80,30,0.05)',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: 3, color: '#B8956A', textTransform: 'uppercase',
            marginBottom: 14, textAlign: 'center', fontFamily: "'Segoe UI', sans-serif",
          }}>
            Tính Cách Ngày
          </div>

          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: 14,
          }}>
            {[
              { label: 'Ngũ Hành', value: data.day.stemElement, color: ELEMENT_COLORS[data.day.stemElement] },
              { label: 'Âm/Dương', value: data.day.yinYang, color: data.day.yinYang === 'Dương' ? '#C8860A' : '#6A5ACD' },
              { label: 'Con Giáp', value: data.day.animal, color: '#5A4633' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '8px 16px',
                borderRadius: 12,
                background: '#FAF4E8',
                border: '1px solid #EDE4D6',
                textAlign: 'center',
                minWidth: 80,
              }}>
                <div style={{
                  fontSize: 9, color: '#B8956A', letterSpacing: 1,
                  fontFamily: "'Segoe UI', sans-serif", marginBottom: 3,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <DayPersonality day={data.day} napAm={data.napAm} officer={data.officer} />
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center', padding: '12px 0 24px',
          fontSize: 11, color: '#C4B49A', fontStyle: 'italic',
        }}>
          Lịch Vạn Niên · {data.year.label} ({data.year.labelHan}) · {data.year.animal}
        </div>
      </div>
    </div>
  );
}

function DayPersonality({ day, napAm, officer }) {
  const traits = [];

  // Based on day element
  const elementTraits = {
    'Mộc': 'Ngày mang năng lượng Mộc — sáng tạo, phát triển, mở rộng. Phù hợp cho lên kế hoạch và trồng trọt.',
    'Hỏa': 'Ngày mang năng lượng Hỏa — nhiệt huyết, sôi nổi, rõ ràng. Phù hợp cho giao tiếp và thể hiện.',
    'Thổ': 'Ngày mang năng lượng Thổ — ổn định, chắc chắn, nuôi dưỡng. Phù hợp cho xây dựng và tích lũy.',
    'Kim': 'Ngày mang năng lượng Kim — quyết đoán, sắc bén, công bằng. Phù hợp cho quyết định và hoàn thành.',
    'Thủy': 'Ngày mang năng lượng Thủy — linh hoạt, sâu sắc, trí tuệ. Phù hợp cho học tập và nghiên cứu.',
  };
  traits.push(elementTraits[day.stemElement]);

  // Based on yin/yang
  if (day.yinYang === 'Dương') {
    traits.push('Dương khí chủ đạo — năng lượng hướng ngoại, chủ động, mạnh mẽ.');
  } else {
    traits.push('Âm khí chủ đạo — năng lượng hướng nội, kiên nhẫn, tinh tế.');
  }

  return (
    <div>
      {traits.map((t, i) => (
        <div key={i} style={{
          padding: '10px 14px',
          background: i === 0 ? ELEMENT_BG[day.stemElement] : '#FAF4E8',
          borderRadius: 10,
          marginBottom: i < traits.length - 1 ? 8 : 0,
          borderLeft: `3px solid ${i === 0 ? ELEMENT_COLORS[day.stemElement] : '#D4C4A8'}`,
        }}>
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: '#5A4633', margin: 0,
          }}>
            {t}
          </p>
        </div>
      ))}
    </div>
  );
}
