// 코스 콘텐츠
// - 문장 vi: 블록을 ' / '로 구분 (블록 = 의미 덩어리)
// - 문장 id는 `${답변 id}-${번호}` 로 자동 부여됨 → 문장 순서를 바꾸면 진도 기록이 어긋나니 주의

export const TOPICS = ['자기소개', '직장', '취미', '거주지', '여행', '음식']

export const ANSWERS = [
  // ── 자기소개 ──────────────────────────────
  {
    id: '001', topic: '자기소개',
    q: { vi: 'Hãy giới thiệu về bản thân bạn.', ko: '자신에 대해 소개해 주세요.' },
    sentences: [
      { ko: '안녕하세요, 제 이름은 Sumok입니다.', vi: 'Xin chào, / tôi / tên là / Sumok.' },
      { ko: '저는 정보기술(IT) 분야의 프로젝트 매니저입니다.', vi: 'Tôi là / một / Project Manager / trong lĩnh vực / công nghệ thông tin.' },
      { ko: '현재 하노이에 살고 있고, 업무 때문에 서울로 자주 출장을 갑니다.', vi: 'Hiện tại / tôi đang sống / ở Hà Nội / và thường xuyên / có những chuyến công tác / đến Seoul / vì công việc.' },
      { ko: '베트남어 공부를 정말 좋아하는데, 베트남에 있는 동료들, 친구들과 더 잘 소통하게 해주기 때문입니다.', vi: 'Tôi / rất thích / học tiếng Việt / vì điều này / giúp tôi / giao tiếp tốt hơn / với đồng nghiệp / và những người bạn / ở Việt Nam.' },
    ],
  },
  {
    id: '002', topic: '자기소개',
    q: { vi: 'Bạn bao nhiêu tuổi và gia đình bạn như thế nào?', ko: '몇 살이고 가족은 어떻게 되나요?' },
    sentences: [
      { ko: '저는 서른 살입니다.', vi: 'Tôi / ba mươi / tuổi.' },
      { ko: '제 가족은 아버지, 어머니, 그리고 여동생 한 명입니다.', vi: 'Gia đình tôi / gồm có / bố, / mẹ, / và / một người / em gái.' },
      { ko: '제 직업이 IT 프로젝트 매니저라서 현재 하노이에 살고 있습니다.', vi: 'Hiện tại, / tôi đang sống / tại Hà Nội / vì / công việc của tôi / là / một quản lý dự án IT.' },
      { ko: '가족은 하노이에 있고, 우리는 함께 아주 행복하게 살고 있습니다.', vi: 'Gia đình tôi / ở Hà Nội / và / chúng tôi / sống cùng nhau / rất hạnh phúc.' },
    ],
  },
  {
    id: '003', topic: '자기소개',
    q: { vi: 'Bạn đang học tiếng Việt được bao lâu rồi?', ko: '베트남어를 배운 지 얼마나 됐나요?' },
    sentences: [
      { ko: '베트남어를 배운 지 약 6개월 됐습니다.', vi: 'Tôi / đã học / tiếng Việt / được / khoảng / sáu tháng / rồi.' },
      { ko: '하노이에서 IT 프로젝트 매니저로 일하고 있어서, 매일 동료들과 베트남어로 말해야 합니다.', vi: 'Vì / công việc của tôi / là IT Project Manager / ở Hà Nội, / tôi cần phải / nói tiếng Việt / với đồng nghiệp / hàng ngày.' },
      { ko: '매일 온라인으로 공부하고, 실력을 늘리려고 원어민과 말하기 연습을 하려고 노력합니다.', vi: 'Tôi / học online / mỗi ngày / và cố gắng / tập nói / với người bản ngữ / để cải thiện / kỹ năng của mình.' },
    ],
  },
  {
    id: '004', topic: '자기소개',
    q: { vi: 'Điểm mạnh của bạn là gì?', ko: '당신의 장점은 무엇인가요?' },
    sentences: [
      { ko: '제 장점은 프로젝트를 효율적으로 관리하는 능력과 팀원들과 잘 소통하는 능력입니다.', vi: 'Điểm mạnh / của tôi / là / khả năng / quản lý dự án / hiệu quả / và / giao tiếp tốt / với các thành viên / trong đội.' },
      { ko: '저는 항상 업무를 조율해서 기한 내에 끝내고 목표를 달성할 수 있습니다.', vi: 'Tôi / luôn có thể / điều phối công việc / để / hoàn thành / đúng hạn / và / đạt được / mục tiêu.' },
      { ko: '또한 빠르게 배우는 능력이 있는데, 특히 IT 분야의 새로운 기술을 다룰 때 그렇습니다.', vi: 'Ngoài ra, / tôi có / khả năng / học hỏi nhanh, / đặc biệt là / khi làm việc / với các công nghệ mới / trong lĩnh vực IT.' },
      { ko: '이것은 제 업무에 매우 유용합니다.', vi: 'Điều này / rất / hữu ích / cho công việc / của tôi.' },
    ],
  },
  {
    id: '005', topic: '자기소개',
    q: { vi: 'Bạn có thể mô tả tính cách của mình không?', ko: '자신의 성격을 설명해 줄 수 있나요?' },
    sentences: [
      { ko: '저는 내향적이지만 매우 친근한 사람이고, 특히 동료들과 일할 때 그렇습니다.', vi: 'Tôi là / người / hướng nội / nhưng / rất thân thiện, / đặc biệt là / khi làm việc / với đồng nghiệp.' },
      { ko: '제 일이 IT 프로젝트 관리라서, 세부 사항에 아주 꼼꼼히 신경 쓰고 소통을 잘해야 합니다.', vi: 'Vì / công việc của tôi / là Quản lý Dự án IT, / tôi cần phải / chú ý / rất kỹ / đến chi tiết / và / có khả năng / giao tiếp tốt.' },
      { ko: '업무에 집중하려고 혼자 일하는 것을 좋아하지만, 효율적으로 팀워크하는 법도 압니다.', vi: 'Tôi thích / làm việc độc lập / để / tập trung / vào công việc, / nhưng / tôi cũng biết / cách / làm việc nhóm / hiệu quả.' },
      { ko: '이것은 하노이에서 하는 제 프로젝트 관리 업무에 매우 유용합니다.', vi: 'Điều này / rất hữu ích / cho công việc / quản lý dự án / của tôi / tại Hà Nội.' },
    ],
  },
  {
    id: '006', topic: '자기소개',
    q: { vi: 'Mục tiêu của bạn trong năm nay là gì?', ko: '올해 목표가 무엇인가요?' },
    sentences: [
      { ko: '올해 제 목표는 업무에서 더 잘 소통하도록 베트남어 실력을 높이고, 하노이에서 베트남 동료들과 일하며 프로젝트 관리 능력을 향상시키는 것입니다.', vi: 'Mục tiêu của tôi / trong năm nay / là / nâng cao / trình độ tiếng Việt / để / giao tiếp tốt hơn / trong công việc, / và / cải thiện / kỹ năng quản lý dự án / khi làm việc / với các đồng nghiệp Việt Nam / tại Hà Nội.' },
      { ko: '그리고 베트남의 아름다운 곳들, 예를 들면 나트랑이나 달랏을 더 둘러볼 기회가 있으면 좋겠습니다.', vi: 'Ngoài ra, / tôi muốn / có cơ hội / khám phá thêm / những địa điểm đẹp / ở Việt Nam, / có thể là / Nha Trang / hoặc / Đà Lạt.' },
    ],
  },

  // ── 직장 ─────────────────────────────────
  {
    id: '007', topic: '직장',
    q: { vi: 'Bạn làm nghề gì?', ko: '직업이 무엇인가요?' },
    sentences: [
      { ko: '저는 소프트웨어 개발자입니다.', vi: 'Tôi là / lập trình viên / phần mềm.' },
      { ko: '서울의 한 IT 회사에서 일한 지 3년 됐습니다.', vi: 'Tôi / làm việc / tại một công ty công nghệ / ở Seoul / được / ba năm / rồi.' },
    ],
  },
  {
    id: '008', topic: '직장',
    q: { vi: 'Công việc hàng ngày của bạn là gì?', ko: '매일 하는 업무는 무엇인가요?' },
    sentences: [
      { ko: '매일 코드를 작성하고, 팀 회의에 참석하고, 동료의 코드를 검토합니다.', vi: 'Hàng ngày / tôi / viết code, / tham gia / cuộc họp nhóm / và / xem xét / code của đồng nghiệp.' },
      { ko: '가끔은 고객의 요구사항을 이해하려고 고객과 함께 일합니다.', vi: 'Đôi khi / tôi / làm việc / với khách hàng / để hiểu / yêu cầu của họ.' },
    ],
  },
  {
    id: '009', topic: '직장',
    q: { vi: 'Bạn làm việc với bao nhiêu người?', ko: '몇 명과 함께 일하나요?' },
    sentences: [
      { ko: '저희 팀은 10명입니다.', vi: 'Nhóm tôi / có / mười người.' },
      { ko: '우리는 보통 메신저 앱과 온라인 회의로 소통합니다.', vi: 'Chúng tôi / thường / trao đổi / qua ứng dụng nhắn tin / và / họp trực tuyến.' },
    ],
  },
  {
    id: '010', topic: '직장',
    q: { vi: 'Bạn thích điều gì nhất về công việc của mình?', ko: '직장에서 가장 좋아하는 것은 무엇인가요?' },
    sentences: [
      { ko: '제가 가장 좋아하는 순간은 어려운 문제를 해결했을 때입니다.', vi: 'Tôi thích nhất / là / khi / tôi / giải quyết được / một vấn đề khó.' },
      { ko: '그 성취감은 정말 멋집니다.', vi: 'Cảm giác / thành công / đó / rất / tuyệt vời.' },
    ],
  },
  {
    id: '011', topic: '직장',
    q: { vi: 'Bạn có hay làm thêm giờ không?', ko: '야근을 자주 하나요?' },
    sentences: [
      { ko: '급한 마감이 있을 때는 가끔 야근을 합니다.', vi: 'Thỉnh thoảng / tôi / làm thêm giờ / khi / có / deadline gấp.' },
      { ko: '하지만 저희 회사는 일과 삶의 균형을 중요하게 생각합니다.', vi: 'Nhưng / công ty tôi / coi trọng / cân bằng / công việc / và / cuộc sống.' },
    ],
  },

  // ── 취미 ─────────────────────────────────
  {
    id: '012', topic: '취미',
    q: { vi: 'Sở thích của bạn là gì?', ko: '취미가 무엇인가요?' },
    sentences: [
      { ko: '저는 주요 취미가 두 가지 있는데, 코딩과 독서입니다.', vi: 'Tôi có / hai / sở thích chính / là / lập trình / và / đọc sách.' },
      { ko: '주말에는 건강을 단련하려고 보통 일주일에 두 번 정도 달리기를 합니다.', vi: 'Vào cuối tuần, / tôi thường / chạy bộ / khoảng / hai lần một tuần / để / rèn luyện sức khỏe.' },
      { ko: '그 밖에도 다낭이나 호이안 같은 여행지를 둘러보는 것을 좋아합니다.', vi: 'Ngoài ra, / tôi cũng thích / khám phá / các địa điểm du lịch / như / Đà Nẵng / và / Hội An.' },
    ],
  },
  {
    id: '013', topic: '취미',
    q: { vi: 'Bạn thường đọc loại sách gì?', ko: '어떤 종류의 책을 주로 읽나요?' },
    sentences: [
      { ko: '저는 공상과학 소설과 자기계발서를 즐겨 읽는데, 특히 기술과 프로젝트 관리에 관한 책을 좋아합니다.', vi: 'Tôi thích đọc / tiểu thuyết / khoa học viễn tưởng / và / sách về phát triển bản thân, / đặc biệt là / những cuốn / liên quan đến / công nghệ / và / quản lý dự án.' },
      { ko: '제 일이 IT와 관련 있어서, 커리어 발전에 도움이 될 만한 책을 주로 찾아봅니다.', vi: 'Vì / công việc của tôi / liên quan đến IT, / nên / tôi thường / tìm kiếm / những sách / có thể / giúp ích / cho sự phát triển nghề nghiệp.' },
      { ko: '최근에는 베트남어를 더 잘 연습하려고 베트남어 책도 읽습니다.', vi: 'Gần đây / tôi cũng / đọc sách tiếng Việt / để / luyện tập / tiếng Việt / tốt hơn.' },
    ],
  },
  {
    id: '014', topic: '취미',
    q: { vi: 'Bạn có chơi thể thao không?', ko: '운동을 하나요?' },
    sentences: [
      { ko: '네, 저는 일주일에 두 번 달리기를 합니다.', vi: 'Có, / tôi / chạy bộ / hai lần / một tuần.' },
      { ko: '그게 제가 건강을 유지하는 방법이고, 특히 일이 아주 바쁠 때 그렇습니다.', vi: 'Đó là / cách / tôi / duy trì / sức khỏe, / đặc biệt là / khi / công việc / rất bận rộn.' },
      { ko: '그 외에도 주말에는 쉬려고 산책이나 가벼운 운동을 하는 것을 좋아합니다.', vi: 'Bên cạnh đó, / tôi cũng thích / đi bộ / hoặc / tập thể dục nhẹ / vào cuối tuần / để thư giãn.' },
    ],
  },
  {
    id: '015', topic: '취미',
    q: { vi: 'Bạn thích nghe nhạc gì?', ko: '어떤 음악을 좋아하나요?' },
    sentences: [
      { ko: '저는 팝과 재즈를 좋아하는데, 특히 주말에 달리기하러 갈 때 즐겨 듣습니다.', vi: 'Tôi thích nghe / nhạc pop / và / nhạc jazz, / nhất là / khi / tôi / đi chạy bộ / vào cuối tuần.' },
      { ko: '최근에는 바쁘게 일한 날들 뒤에 언어 공부도 하고 쉬기도 하려고 베트남 음악을 더 많이 듣습니다.', vi: 'Gần đây / tôi cũng / nghe nhạc Việt Nam / nhiều hơn / để vừa / học tiếng / vừa / thư giãn / sau những ngày / làm việc / bận rộn.' },
    ],
  },
  {
    id: '016', topic: '취미',
    q: { vi: 'Bạn có sở thích nào đặc biệt không?', ko: '특별한 취미가 있나요?' },
    sentences: [
      { ko: '저는 주요 취미가 두 가지 있는데, 코딩과 독서입니다.', vi: 'Tôi có / hai / sở thích chính / là / lập trình / và / đọc sách.' },
      { ko: '저는 IT 프로젝트 매니저라서 여가 시간에 코딩하는 것을 좋아합니다.', vi: 'Vì / tôi là / IT Project Manager / nên / tôi thích / code / trong thời gian rảnh.' },
      { ko: '또한 새로운 것을 배우려고 독서를 정말 좋아합니다.', vi: 'Ngoài ra, / tôi cũng / yêu thích / đọc sách / để / học hỏi / những điều mới.' },
      { ko: '그 밖에도 건강을 지키려고 일주일에 두 번 정도 달리기를 합니다.', vi: 'Bên cạnh đó, / tôi còn / chạy bộ / khoảng / hai lần một tuần / để / giữ sức khỏe.' },
    ],
  },

  // ── 거주지 ───────────────────────────────
  {
    id: '017', topic: '거주지',
    q: { vi: 'Bạn sống ở đâu?', ko: '어디에 살고 있나요?' },
    sentences: [
      { ko: '저는 한국 서울에 삽니다.', vi: 'Tôi sống / ở Seoul, / Hàn Quốc.' },
      { ko: '구체적으로는 마포구이고, 시내 중심과 가깝습니다.', vi: 'Cụ thể là / ở quận Mapo, / gần / trung tâm thành phố.' },
    ],
  },
  {
    id: '018', topic: '거주지',
    q: { vi: 'Bạn sống trong nhà hay căn hộ?', ko: '단독주택에 사나요, 아파트에 사나요?' },
    sentences: [
      { ko: '저는 방이 두 개인 작은 아파트에 삽니다.', vi: 'Tôi sống / trong / một căn hộ nhỏ, / có / hai phòng ngủ.' },
      { ko: '아파트가 아주 크진 않지만 매우 편안하고 편리합니다.', vi: 'Căn hộ / không lớn lắm / nhưng / rất thoải mái / và / tiện nghi.' },
    ],
  },
  {
    id: '019', topic: '거주지',
    q: { vi: 'Khu vực bạn sống có những tiện ích gì?', ko: '사는 지역에 어떤 편의시설이 있나요?' },
    sentences: [
      { ko: '집 근처에 슈퍼마켓, 병원, 그리고 식당이 많이 있습니다.', vi: 'Gần nhà tôi / có / siêu thị, / bệnh viện, / và / nhiều nhà hàng.' },
      { ko: '지하철역도 걸어서 5분밖에 안 걸립니다.', vi: 'Ga tàu điện ngầm / cũng / chỉ cách / năm phút / đi bộ.' },
    ],
  },
  {
    id: '020', topic: '거주지',
    q: { vi: 'Bạn có thích nơi bạn đang sống không? Tại sao?', ko: '현재 사는 곳이 마음에 드나요? 이유는?' },
    sentences: [
      { ko: '교통이 편리하고 녹지 공간이 많아서 이곳이 정말 좋습니다.', vi: 'Tôi / rất thích / nơi này / vì / giao thông / thuận tiện / và / có nhiều / không gian xanh.' },
      { ko: '하지만 집세가 조금 비쌉니다.', vi: 'Tuy nhiên, / giá thuê nhà / hơi đắt.' },
    ],
  },
  {
    id: '021', topic: '거주지',
    q: { vi: 'Hàng xóm của bạn như thế nào?', ko: '이웃은 어떤가요?' },
    sentences: [
      { ko: '제 이웃들은 매우 친절합니다.', vi: 'Hàng xóm / của tôi / rất / thân thiện.' },
      { ko: '우리는 가끔 복도에서 인사를 나누고, 필요할 때 서로 돕습니다.', vi: 'Chúng tôi / thỉnh thoảng / chào hỏi nhau / ở hành lang / và / giúp đỡ nhau / khi cần.' },
    ],
  },

  // ── 여행 ─────────────────────────────────
  {
    id: '022', topic: '여행',
    q: { vi: 'Bạn có thích đi du lịch không?', ko: '여행을 좋아하나요?' },
    sentences: [
      { ko: '저는 여행을 정말 좋아합니다.', vi: 'Tôi / rất thích / đi du lịch.' },
      { ko: '매년 새로운 문화를 경험하려고 적어도 한 번은 해외에 가려고 합니다.', vi: 'Mỗi năm / tôi / cố gắng / đi / ít nhất một lần / ra nước ngoài / để / khám phá / văn hóa mới.' },
    ],
  },
  {
    id: '023', topic: '여행',
    q: { vi: 'Bạn đã đến những nước nào rồi?', ko: '어떤 나라들을 가봤나요?' },
    sentences: [
      { ko: '저는 일본, 태국, 대만에 가봤습니다.', vi: 'Tôi / đã đến / Nhật Bản, / Thái Lan / và / Đài Loan.' },
      { ko: '곳마다 문화와 음식이 아주 다르고 흥미롭습니다.', vi: 'Mỗi nơi / có / văn hóa / và / ẩm thực / rất khác nhau / và / thú vị.' },
    ],
  },
  {
    id: '024', topic: '여행',
    q: { vi: 'Bạn thích du lịch một mình hay đi cùng bạn bè?', ko: '혼자 여행하는 게 좋나요, 친구와 함께 가는 게 좋나요?' },
    sentences: [
      { ko: '둘 다 좋아합니다.', vi: 'Tôi / thích / cả hai.' },
      { ko: '혼자 여행하면 더 자유롭고, 친구와 가면 더 즐겁고 좋은 추억이 많이 생깁니다.', vi: 'Du lịch một mình / giúp tôi / tự do hơn, / còn / đi với bạn bè / thì / vui hơn / và / có nhiều / kỷ niệm đẹp.' },
    ],
  },
  {
    id: '025', topic: '여행',
    q: { vi: 'Bạn muốn đến Việt Nam không? Tại sao?', ko: '베트남에 가보고 싶나요? 이유는?' },
    sentences: [
      { ko: '베트남에 정말 가고 싶습니다.', vi: 'Tôi / rất muốn / đến Việt Nam.' },
      { ko: '진짜 베트남 음식을 맛보고, 그곳의 역사 유적을 둘러보고 싶습니다.', vi: 'Tôi muốn / thưởng thức / ẩm thực Việt Nam / thật sự / và / khám phá / các di tích lịch sử / ở đó.' },
    ],
  },
  {
    id: '026', topic: '여행',
    q: { vi: 'Bạn thường chuẩn bị gì khi đi du lịch?', ko: '여행 갈 때 보통 어떤 준비를 하나요?' },
    sentences: [
      { ko: '저는 보통 한 달 전에 계획을 세웁니다.', vi: 'Tôi thường / lên kế hoạch / trước / một tháng.' },
      { ko: '비행기표와 호텔을 예약하고, 관광지에 대해 알아봅니다.', vi: 'Tôi / đặt / vé máy bay, / khách sạn / và / tìm hiểu / về các địa điểm tham quan.' },
    ],
  },

  // ── 음식 ─────────────────────────────────
  {
    id: '027', topic: '음식',
    q: { vi: 'Bạn thích ăn gì nhất?', ko: '가장 좋아하는 음식이 무엇인가요?' },
    sentences: [
      { ko: '제가 가장 좋아하는 건 베트남 쌀국수(phở)입니다.', vi: 'Tôi thích nhất / là / món phở / Việt Nam.' },
      { ko: '향긋하고 맛있는 국물과 부드러운 소고기는 도저히 거부할 수가 없습니다.', vi: 'Nước dùng / thơm ngon / và / thịt bò / mềm / làm tôi / không thể / cưỡng lại được.' },
    ],
  },
  {
    id: '028', topic: '음식',
    q: { vi: 'Bạn có biết nấu ăn không?', ko: '요리를 할 줄 아나요?' },
    sentences: [
      { ko: '볶음밥, 볶음면, 국 같은 간단한 요리는 할 줄 압니다.', vi: 'Tôi / biết nấu / những món / đơn giản / như / cơm rang, / mì xào / và / canh.' },
      { ko: '일주일에 세 번 정도 집에서 요리합니다.', vi: 'Tôi / nấu ăn / ở nhà / khoảng / ba lần / một tuần.' },
    ],
  },
  {
    id: '029', topic: '음식',
    q: { vi: 'Bạn thích ăn cay không?', ko: '매운 음식을 좋아하나요?' },
    sentences: [
      { ko: '적당히 매운 음식을 좋아합니다.', vi: 'Tôi thích / ăn cay / vừa phải.' },
      { ko: '한국 사람은 매운 걸 먹는 데 익숙해서, 저도 꽤 많은 종류의 매운 음식을 먹을 수 있습니다.', vi: 'Người Hàn Quốc / quen / ăn cay / nên / tôi / ăn được / khá nhiều loại / đồ ăn cay.' },
    ],
  },
  {
    id: '030', topic: '음식',
    q: { vi: 'Bạn thường ăn sáng bằng gì?', ko: '아침으로 주로 무엇을 먹나요?' },
    sentences: [
      { ko: '평소에는 빵이나 우유에 시리얼처럼 간단하게 아침을 먹습니다.', vi: 'Thường ngày / tôi / ăn sáng / đơn giản / như / bánh mì / hoặc / ngũ cốc / với sữa.' },
      { ko: '주말에는 더 푸짐하게 먹습니다.', vi: 'Cuối tuần / tôi / ăn / thịnh soạn hơn.' },
    ],
  },
  {
    id: '031', topic: '음식',
    q: { vi: 'Bạn có kiêng ăn gì không?', ko: '못 먹는 음식이 있나요?' },
    sentences: [
      { ko: '가벼운 알레르기가 있어서 해산물을 못 먹습니다.', vi: 'Tôi / không ăn được / hải sản / vì / bị / dị ứng nhẹ.' },
      { ko: '그 외에는 거의 다 먹을 수 있고, 별로 가리지 않습니다.', vi: 'Ngoài ra / tôi / ăn được / hầu hết mọi thứ / và / không kén chọn / lắm.' },
    ],
  },
  {
    id: '032', topic: '음식',
    q: { vi: 'Bạn thích ăn ở nhà hàng hay tự nấu ở nhà?', ko: '식당에서 먹는 것과 집에서 요리하는 것 중 어느 쪽이 좋나요?' },
    sentences: [
      { ko: '상황에 따라 둘 다 좋아합니다.', vi: 'Tôi thích / cả hai / tùy tình huống.' },
      { ko: '바쁜 날엔 식당에 가는 게 좋고, 시간이 있을 때는 집에서 직접 요리합니다.', vi: 'Ngày bận rộn / thì / tôi thích / ra nhà hàng, / còn / lúc có thời gian / thì / tôi / tự nấu ăn / ở nhà.' },
    ],
  },
]
