// =============================================================================
// Vietnamese Lunar Calendar Utility
// Provides: Gregorian↔Lunar conversion, Can Chi (Heavenly Stems & Earthly
// Branches), 12-day officers, auspicious/inauspicious activities, hourly
// fortunes, and Nạp Âm (sound element) for the day.
// =============================================================================

// ---------------------------------------------------------------------------
// Lunar year data table (1900–2100)
// Encoding per year (17-bit hex):
//   Bit 16      : leap month is big (30 days) or small (29 days)
//   Bits 15–4   : months 1–12 size (1 = 30, 0 = 29), bit 15 = month 1
//   Bits 3–0    : leap month number (0 = no leap month)
// ---------------------------------------------------------------------------
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920
  0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0, // 2050
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252, // 2090
  0x0d520,                                                                             // 2100
];

// Base date: Lunar New Year 1900 falls on January 31, 1900 (Gregorian)
const BASE_DATE = new Date(1900, 0, 31);

// ---------------------------------------------------------------------------
// 天干 Heavenly Stems / Thiên Can
// ---------------------------------------------------------------------------
const STEMS = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const STEMS_HAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const STEM_ELEMENTS = ['Mộc','Mộc','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Thủy','Thủy'];
const STEM_YIN_YANG = ['Dương','Âm','Dương','Âm','Dương','Âm','Dương','Âm','Dương','Âm'];

// ---------------------------------------------------------------------------
// 地支 Earthly Branches / Địa Chi
// ---------------------------------------------------------------------------
const BRANCHES = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const BRANCHES_HAN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_ANIMALS = ['Chuột','Trâu','Hổ','Mèo','Rồng','Rắn','Ngựa','Dê','Khỉ','Gà','Chó','Lợn'];
const BRANCH_ELEMENTS = ['Thủy','Thổ','Mộc','Mộc','Thổ','Hỏa','Hỏa','Thổ','Kim','Kim','Thổ','Thủy'];

// ---------------------------------------------------------------------------
// Element colours (五行 / Ngũ Hành)
// ---------------------------------------------------------------------------
export const ELEMENT_COLORS = {
  'Mộc': '#228B22',
  'Hỏa': '#C0392B',
  'Thổ': '#B8860B',
  'Kim': '#B8860B',
  'Thủy': '#1A5276',
};

export const ELEMENT_BG = {
  'Mộc': '#E8F5E9',
  'Hỏa': '#FDEDEC',
  'Thổ': '#FFF8E1',
  'Kim': '#FFF8E1',
  'Thủy': '#E8F0FE',
};

// ---------------------------------------------------------------------------
// Lunar month names in Vietnamese
// ---------------------------------------------------------------------------
const LUNAR_MONTH_NAMES = [
  'Giêng','Hai','Ba','Tư','Năm','Sáu',
  'Bảy','Tám','Chín','Mười','Mười Một','Chạp',
];

const LUNAR_DAY_NAMES = [
  'Mồng Một','Mồng Hai','Mồng Ba','Mồng Bốn','Mồng Năm',
  'Mồng Sáu','Mồng Bảy','Mồng Tám','Mồng Chín','Mồng Mười',
  'Mười Một','Mười Hai','Mười Ba','Mười Bốn','Mười Lăm',
  'Mười Sáu','Mười Bảy','Mười Tám','Mười Chín','Hai Mươi',
  'Hăm Mốt','Hăm Hai','Hăm Ba','Hăm Bốn','Hăm Lăm',
  'Hăm Sáu','Hăm Bảy','Hăm Tám','Hăm Chín','Ba Mươi',
];

// ---------------------------------------------------------------------------
// 12-day officers (建除十二神 / Kiến Trừ Thập Nhị Thần)
// ---------------------------------------------------------------------------
const OFFICERS = [
  {
    name: 'Kiến', han: '建', meaning: 'Lập',
    quality: 'neutral',
    good: ['Khởi công','Họp mặt','Khai trương','Xuất hành'],
    bad: ['Kiện tụng','Phẫu thuật','Di dời'],
    desc: 'Ngày khởi đầu, thích hợp bắt đầu việc mới.',
  },
  {
    name: 'Trừ', han: '除', meaning: 'Dẹp bỏ',
    quality: 'good',
    good: ['Dọn dẹp','Chữa bệnh','Tẩy trần','Giải trừ xui rủi'],
    bad: ['Cưới hỏi','Khai trương','Ký hợp đồng'],
    desc: 'Ngày dẹp bỏ, tốt cho dọn dẹp và chữa trị.',
  },
  {
    name: 'Mãn', han: '滿', meaning: 'Đầy đủ',
    quality: 'good',
    good: ['Cưới hỏi','Ăn mừng','Thu hoạch','Nhập kho'],
    bad: ['Kiện tụng','Phá dỡ','Đào đất'],
    desc: 'Ngày tràn đầy, phù hợp cho tiệc tùng và lễ hội.',
  },
  {
    name: 'Bình', han: '平', meaning: 'Bằng phẳng',
    quality: 'neutral',
    good: ['Sửa đường','Vá lỗi','Trang trí','Học tập'],
    bad: ['Cưới hỏi','Khởi công lớn'],
    desc: 'Ngày bình thường, không tốt không xấu.',
  },
  {
    name: 'Định', han: '定', meaning: 'Ổn định',
    quality: 'good',
    good: ['Ký hợp đồng','Đám cưới','Xây dựng','An táng'],
    bad: ['Kiện tụng','Di dời','Xuất hành xa'],
    desc: 'Ngày an định, thích hợp cho các thỏa thuận quan trọng.',
  },
  {
    name: 'Chấp', han: '執', meaning: 'Nắm giữ',
    quality: 'neutral',
    good: ['Xây dựng','Trồng cây','Bắt giữ','Thu nợ'],
    bad: ['Di dời','Du lịch xa','Khai trương'],
    desc: 'Ngày nắm giữ, tốt cho xây dựng và thu hoạch.',
  },
  {
    name: 'Phá', han: '破', meaning: 'Phá vỡ',
    quality: 'bad',
    good: ['Phá dỡ','Chữa bệnh','Tẩy trần'],
    bad: ['Cưới hỏi','Khai trương','Ký hợp đồng','Xuất hành','Xây dựng'],
    desc: 'Ngày phá, nên tránh khởi đầu việc mới.',
  },
  {
    name: 'Nguy', han: '危', meaning: 'Nguy hiểm',
    quality: 'bad',
    good: ['Cúng bái','Cầu nguyện','Thiền định'],
    bad: ['Xuất hành','Leo cao','Đi thuyền','Ký kết'],
    desc: 'Ngày nguy hiểm, nên ở nhà và tĩnh tâm.',
  },
  {
    name: 'Thành', han: '成', meaning: 'Thành công',
    quality: 'excellent',
    good: ['Mọi việc đều tốt','Cưới hỏi','Khai trương','Ký hợp đồng','Xây dựng','Xuất hành'],
    bad: ['Kiện tụng'],
    desc: 'Ngày đại cát, mọi việc đều thuận lợi!',
  },
  {
    name: 'Thu', han: '收', meaning: 'Thu hoạch',
    quality: 'good',
    good: ['Thu nợ','Thu hoạch','Nhập kho','Cưới hỏi'],
    bad: ['Phẫu thuật','Phá dỡ','An táng'],
    desc: 'Ngày thu hoạch, tốt cho tài chính và tích lũy.',
  },
  {
    name: 'Khai', han: '開', meaning: 'Mở ra',
    quality: 'excellent',
    good: ['Khai trương','Khởi công','Xuất hành','Nhậm chức','Cưới hỏi','Ký hợp đồng'],
    bad: ['An táng','Phá dỡ'],
    desc: 'Ngày khai mở, rất tốt cho kinh doanh và khởi đầu!',
  },
  {
    name: 'Bế', han: '閉', meaning: 'Đóng lại',
    quality: 'bad',
    good: ['An táng','Đóng cửa','Kết thúc','Thiền định'],
    bad: ['Khai trương','Cưới hỏi','Xuất hành','Khởi công'],
    desc: 'Ngày đóng lại, nên kết thúc việc cũ, tránh bắt đầu mới.',
  },
];

// ---------------------------------------------------------------------------
// Nạp Âm (纳音) – 30 poetic sound-elements for each pair of stem-branches
// The 60 sexagenary cycle pairs into 30 Nạp Âm, each shared by 2 consecutive
// stem-branch combinations.
// ---------------------------------------------------------------------------
const NAP_AM = [
  { name: 'Hải Trung Kim', element: 'Kim', desc: 'Vàng trong biển — ẩn mình, tiềm năng lớn.' },
  { name: 'Lư Trung Hỏa', element: 'Hỏa', desc: 'Lửa trong lò — ấm áp, bền bỉ.' },
  { name: 'Đại Lâm Mộc', element: 'Mộc', desc: 'Gỗ rừng lớn — vững chãi, che chở.' },
  { name: 'Lộ Bàng Thổ', element: 'Thổ', desc: 'Đất bên đường — bình dị, phục vụ.' },
  { name: 'Kiếm Phong Kim', element: 'Kim', desc: 'Vàng mũi kiếm — sắc bén, quyết đoán.' },
  { name: 'Sơn Đầu Hỏa', element: 'Hỏa', desc: 'Lửa đầu núi — rực rỡ, nổi bật.' },
  { name: 'Giản Hạ Thủy', element: 'Thủy', desc: 'Nước dưới suối — thanh khiết, yên bình.' },
  { name: 'Thành Đầu Thổ', element: 'Thổ', desc: 'Đất đầu thành — vững chắc, bảo vệ.' },
  { name: 'Bạch Lạp Kim', element: 'Kim', desc: 'Vàng nến trắng — tinh tế, cao quý.' },
  { name: 'Dương Liễu Mộc', element: 'Mộc', desc: 'Gỗ liễu — uyển chuyển, linh hoạt.' },
  { name: 'Tuyền Trung Thủy', element: 'Thủy', desc: 'Nước trong suối — trong sáng, dồi dào.' },
  { name: 'Ốc Thượng Thổ', element: 'Thổ', desc: 'Đất trên mái — che chở, an toàn.' },
  { name: 'Tích Lịch Hỏa', element: 'Hỏa', desc: 'Lửa sấm sét — mãnh liệt, bất ngờ.' },
  { name: 'Tùng Bách Mộc', element: 'Mộc', desc: 'Gỗ tùng bách — trường thọ, kiên cường.' },
  { name: 'Trường Lưu Thủy', element: 'Thủy', desc: 'Nước sông dài — bền bỉ, không ngừng.' },
  { name: 'Sa Trung Kim', element: 'Kim', desc: 'Vàng trong cát — ẩn giấu giá trị.' },
  { name: 'Sơn Hạ Hỏa', element: 'Hỏa', desc: 'Lửa dưới núi — tiềm ẩn sức mạnh.' },
  { name: 'Bình Địa Mộc', element: 'Mộc', desc: 'Gỗ đồng bằng — phát triển tự do.' },
  { name: 'Bích Thượng Thổ', element: 'Thổ', desc: 'Đất trên tường — trang trí, làm đẹp.' },
  { name: 'Kim Bạch Kim', element: 'Kim', desc: 'Vàng ròng bạc — quý giá, tinh khiết.' },
  { name: 'Phúc Đăng Hỏa', element: 'Hỏa', desc: 'Lửa đèn phật — soi sáng tâm linh.' },
  { name: 'Thiên Hà Thủy', element: 'Thủy', desc: 'Nước sông Ngân — bao la, huyền bí.' },
  { name: 'Đại Trạch Thổ', element: 'Thổ', desc: 'Đất trên nóc — che chở lớn lao.' },
  { name: 'Thoa Xuyến Kim', element: 'Kim', desc: 'Vàng trang sức — nhỏ nhắn, tinh xảo.' },
  { name: 'Tang Đố Mộc', element: 'Mộc', desc: 'Gỗ dâu tằm — nuôi dưỡng, cống hiến.' },
  { name: 'Đại Khê Thủy', element: 'Thủy', desc: 'Nước suối lớn — mạnh mẽ, cuồn cuộn.' },
  { name: 'Sa Trung Thổ', element: 'Thổ', desc: 'Đất trong cát — phù du, biến đổi.' },
  { name: 'Thiên Thượng Hỏa', element: 'Hỏa', desc: 'Lửa trên trời — rực rỡ nhất.' },
  { name: 'Thạch Lựu Mộc', element: 'Mộc', desc: 'Gỗ thạch lựu — hoa trái đẹp.' },
  { name: 'Đại Hải Thủy', element: 'Thủy', desc: 'Nước biển lớn — bao trùm vạn vật.' },
];

// ---------------------------------------------------------------------------
// 12 time periods (時辰 / Thời Thần)
// ---------------------------------------------------------------------------
const TIME_PERIODS = [
  { name: 'Tý',   han: '子', hours: '23:00–01:00', hourStart: 23 },
  { name: 'Sửu',  han: '丑', hours: '01:00–03:00', hourStart: 1 },
  { name: 'Dần',  han: '寅', hours: '03:00–05:00', hourStart: 3 },
  { name: 'Mão',  han: '卯', hours: '05:00–07:00', hourStart: 5 },
  { name: 'Thìn', han: '辰', hours: '07:00–09:00', hourStart: 7 },
  { name: 'Tỵ',   han: '巳', hours: '09:00–11:00', hourStart: 9 },
  { name: 'Ngọ',  han: '午', hours: '11:00–13:00', hourStart: 11 },
  { name: 'Mùi',  han: '未', hours: '13:00–15:00', hourStart: 13 },
  { name: 'Thân', han: '申', hours: '15:00–17:00', hourStart: 15 },
  { name: 'Dậu',  han: '酉', hours: '17:00–19:00', hourStart: 17 },
  { name: 'Tuất', han: '戌', hours: '19:00–21:00', hourStart: 19 },
  { name: 'Hợi',  han: '亥', hours: '21:00–23:00', hourStart: 21 },
];

// Yellow Road (黄道) auspicious hour patterns keyed by the day's branch index.
// For each day branch, 6 of the 12 time periods are auspicious (Yellow Road).
// This is the traditional Thanh Long / Minh Đường / Kim Quỹ / Thiên Đức /
// Ngọc Đường / Tư Mệnh system.
const YELLOW_ROAD = {
  0:  [0,1,4,5,8,9],    // Tý day
  1:  [2,3,6,7,10,11],  // Sửu day
  2:  [0,1,4,5,8,9],    // Dần day
  3:  [2,3,6,7,10,11],  // Mão day
  4:  [0,1,4,5,8,9],    // Thìn day
  5:  [2,3,6,7,10,11],  // Tỵ day
  6:  [0,1,4,5,8,9],    // Ngọ day
  7:  [2,3,6,7,10,11],  // Mùi day
  8:  [0,1,4,5,8,9],    // Thân day
  9:  [2,3,6,7,10,11],  // Dậu day
  10: [0,1,4,5,8,9],    // Tuất day
  11: [2,3,6,7,10,11],  // Hợi day
};

// ---------------------------------------------------------------------------
// Internal helpers for lunar data
// ---------------------------------------------------------------------------
function leapMonth(y) {
  return LUNAR_INFO[y - 1900] & 0xf;
}

function leapMonthDays(y) {
  if (leapMonth(y) === 0) return 0;
  return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
}

function monthDays(y, m) {
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

function yearTotalDays(y) {
  let sum = 348; // 12 × 29
  let info = LUNAR_INFO[y - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }
  return sum + leapMonthDays(y);
}

// ---------------------------------------------------------------------------
// Gregorian → Lunar conversion
// ---------------------------------------------------------------------------
export function solarToLunar(sY, sM, sD) {
  const target = new Date(sY, sM - 1, sD);
  let offset = Math.round((target - BASE_DATE) / 86400000);

  // Find lunar year
  let lunarYear = 1900;
  for (let i = 1900; i < 2100 && offset > 0; i++) {
    const days = yearTotalDays(i);
    if (offset < days) { lunarYear = i; break; }
    offset -= days;
    lunarYear = i + 1;
  }

  // Find lunar month
  let lunarMonth = 1;
  let isLeap = false;
  const leap = leapMonth(lunarYear);

  for (let i = 1; i <= 12; i++) {
    let days = monthDays(lunarYear, i);
    if (!isLeap && offset < days) { lunarMonth = i; break; }
    if (!isLeap) offset -= days;

    if (!isLeap && i === leap) {
      days = leapMonthDays(lunarYear);
      if (offset < days) { lunarMonth = i; isLeap = true; break; }
      offset -= days;
    }
    if (!isLeap) lunarMonth = i + 1;
  }

  const lunarDay = offset + 1;
  return { lunarYear, lunarMonth, lunarDay, isLeap };
}

// ---------------------------------------------------------------------------
// Lunar date display string
// ---------------------------------------------------------------------------
export function lunarDateString(lunar) {
  const monthStr = lunar.isLeap ? `Nhuận ${LUNAR_MONTH_NAMES[lunar.lunarMonth - 1]}` : `${LUNAR_MONTH_NAMES[lunar.lunarMonth - 1]}`;
  const dayStr = LUNAR_DAY_NAMES[lunar.lunarDay - 1] || `Ngày ${lunar.lunarDay}`;
  return { monthStr: `Tháng ${monthStr}`, dayStr };
}

// ---------------------------------------------------------------------------
// Can Chi calculations
// ---------------------------------------------------------------------------

// Year Can Chi (based on lunar year)
export function yearCanChi(lunarYear) {
  const stemIdx = (lunarYear - 4) % 10;
  const branchIdx = (lunarYear - 4) % 12;
  return makeCanChi(stemIdx, branchIdx);
}

// Month Can Chi
// Month branch: month 1 = Dần (idx 2), month 2 = Mão (idx 3), … month 11 = Tý (idx 0), month 12 = Sửu (idx 1)
// Month stem depends on year stem (五虎遁月 rule):
//   Year stem 0,5 (Giáp/Kỷ)  → month 1 stem = 2 (Bính)
//   Year stem 1,6 (Ất/Canh)   → month 1 stem = 4 (Mậu)
//   Year stem 2,7 (Bính/Tân)  → month 1 stem = 6 (Canh)
//   Year stem 3,8 (Đinh/Nhâm) → month 1 stem = 8 (Nhâm)
//   Year stem 4,9 (Mậu/Quý)  → month 1 stem = 0 (Giáp)
const MONTH_STEM_START = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];

export function monthCanChi(lunarYear, lunarMonth) {
  const yearStem = (lunarYear - 4) % 10;
  const stemIdx = (MONTH_STEM_START[yearStem] + lunarMonth - 1) % 10;
  const branchIdx = (lunarMonth + 1) % 12; // month 1 → Dần (idx 2)
  return makeCanChi(stemIdx, branchIdx);
}

// Day Can Chi (using Julian Day Number approach)
export function dayCanChi(sY, sM, sD) {
  const jdn = julianDayNumber(sY, sM, sD);
  // Offsets verified: JDN 2451551 (2000-01-07) = 甲子 (Giáp Tý, stem=0, branch=0)
  // (2451551 + 9) % 10 = 0  ✓  (2451551 + 1) % 12 = 0  ✓
  const stemIdx = (jdn + 9) % 10;
  const branchIdx = (jdn + 1) % 12;
  return makeCanChi(stemIdx, branchIdx);
}

function julianDayNumber(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524;
}

// Hour Can Chi
// Hour branch: 23-1 → Tý (0), 1-3 → Sửu (1), … 21-23 → Hợi (11)
// Hour stem depends on day stem (五鼠遁時 rule):
//   Day stem 0,5 → hour Tý stem = 0 (Giáp)
//   Day stem 1,6 → hour Tý stem = 2 (Bính)
//   Day stem 2,7 → hour Tý stem = 4 (Mậu)
//   Day stem 3,8 → hour Tý stem = 6 (Canh)
//   Day stem 4,9 → hour Tý stem = 8 (Nhâm)
const HOUR_STEM_START = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];

export function hourCanChi(dayStemIdx, hour) {
  const branchIdx = hourToBranchIndex(hour);
  const stemIdx = (HOUR_STEM_START[dayStemIdx] + branchIdx) % 10;
  return makeCanChi(stemIdx, branchIdx);
}

function hourToBranchIndex(h) {
  if (h >= 23 || h < 1) return 0;
  return Math.floor((h + 1) / 2);
}

function makeCanChi(stemIdx, branchIdx) {
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    stemHan: STEMS_HAN[stemIdx],
    branchHan: BRANCHES_HAN[branchIdx],
    stemElement: STEM_ELEMENTS[stemIdx],
    branchElement: BRANCH_ELEMENTS[branchIdx],
    animal: BRANCH_ANIMALS[branchIdx],
    yinYang: STEM_YIN_YANG[stemIdx],
    stemIdx,
    branchIdx,
    label: `${STEMS[stemIdx]} ${BRANCHES[branchIdx]}`,
    labelHan: `${STEMS_HAN[stemIdx]}${BRANCHES_HAN[branchIdx]}`,
    color: ELEMENT_COLORS[STEM_ELEMENTS[stemIdx]],
    bgColor: ELEMENT_BG[STEM_ELEMENTS[stemIdx]],
  };
}

// Sexagenary cycle index (0–59)
function cycleIndex(stemIdx, branchIdx) {
  // The stem and branch advance together, but stem cycles every 10 and
  // branch every 12, so only combinations where both are same parity exist.
  // Index = (stem * 6 − branch * 5) mod 60  (standard formula)
  return ((stemIdx % 10) * 6 - (branchIdx % 12) * 5 + 360) % 60;
}

// ---------------------------------------------------------------------------
// Nạp Âm for a Can Chi pair
// ---------------------------------------------------------------------------
export function napAm(stemIdx, branchIdx) {
  const idx = cycleIndex(stemIdx, branchIdx);
  return NAP_AM[Math.floor(idx / 2)];
}

// ---------------------------------------------------------------------------
// 12-day officer for a given lunar month and day branch
// ---------------------------------------------------------------------------
export function dayOfficer(lunarMonth, dayBranchIdx) {
  const monthBranch = (lunarMonth + 1) % 12; // month 1 → Dần (2)
  const officerIdx = (dayBranchIdx - monthBranch + 12) % 12;
  return { ...OFFICERS[officerIdx], index: officerIdx };
}

// ---------------------------------------------------------------------------
// Hourly fortune (Yellow/Black road) for a given day branch
// ---------------------------------------------------------------------------
export function hourlyFortune(dayBranchIdx, dayStemIdx) {
  const yellowSet = new Set(YELLOW_ROAD[dayBranchIdx] || []);
  return TIME_PERIODS.map((tp, i) => {
    const hcc = hourCanChi(dayStemIdx, tp.hourStart);
    return {
      ...tp,
      canChi: hcc,
      isAuspicious: yellowSet.has(i),
    };
  });
}

// ---------------------------------------------------------------------------
// Get all "today" data in one call
// ---------------------------------------------------------------------------
export function getTodayData(date = new Date()) {
  const sY = date.getFullYear();
  const sM = date.getMonth() + 1;
  const sD = date.getDate();

  const lunar = solarToLunar(sY, sM, sD);
  const lunarStr = lunarDateString(lunar);

  const year = yearCanChi(lunar.lunarYear);
  const month = monthCanChi(lunar.lunarYear, lunar.lunarMonth);
  const day = dayCanChi(sY, sM, sD);

  const officer = dayOfficer(lunar.lunarMonth, day.branchIdx);
  const dayNapAm = napAm(day.stemIdx, day.branchIdx);
  const hours = hourlyFortune(day.branchIdx, day.stemIdx);

  return {
    gregorian: { year: sY, month: sM, day: sD },
    lunar,
    lunarStr,
    year,
    month,
    day,
    officer,
    napAm: dayNapAm,
    hours,
  };
}
