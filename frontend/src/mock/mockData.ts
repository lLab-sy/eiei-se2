// Mock data สำหรับหน้า my-offering
const mockPosts = [
  {
    id: "post1",
    postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
    postDescription:
      "โปรเจคหนังสั้นที่เล่าเรื่องราวเกี่ยวกับชายหนุ่มที่สูญเสียความทรงจำและพยายามค้นหาตัวตนของตัวเอง ต้องการทีมงานที่มีประสบการณ์และสามารถทำงานภายใต้งบประมาณจำกัด",
    postImages: [
      "https://example.com/images/film-project1.jpg",
      "https://example.com/images/film-project2.jpg",
    ],
    postMediaType: "short-film",
    postProjectRoles: [
      "ผู้กำกับ",
      "ช่างภาพ",
      "นักแสดงนำชาย",
      "นักแสดงนำหญิง",
      "ทีมตัดต่อ",
    ],
    postStatus: "created",
    startDate: "2025-04-10T00:00:00.000Z",
    endDate: "2025-05-20T00:00:00.000Z",
    userID: "producer1",
  },
  {
    id: "post2",
    postName: "โฆษณาผลิตภัณฑ์สุขภาพ",
    postDescription:
      "ต้องการผลิตวิดีโอโฆษณาความยาว 30 วินาทีสำหรับผลิตภัณฑ์อาหารเสริมเพื่อสุขภาพ กลุ่มเป้าหมายคือผู้ใหญ่วัยทำงาน 25-45 ปี ใช้โทนสีสดใส เน้นความสดชื่นและมีพลัง",
    postImages: [
      "https://example.com/images/ad-project1.jpg",
      "https://example.com/images/ad-project2.jpg",
    ],
    postMediaType: "advertisement",
    postProjectRoles: [
      "ผู้กำกับโฆษณา",
      "ช่างภาพ",
      "นักแสดงประกอบ",
      "นักออกแบบกราฟิก",
    ],
    postStatus: "created",
    startDate: "2025-04-15T00:00:00.000Z",
    endDate: "2025-04-30T00:00:00.000Z",
    userID: "producer1",
  },
  {
    id: "post3",
    postName: "มิวสิควิดีโอเพลง 'ฤดูที่แตกต่าง'",
    postDescription:
      "ต้องการทีมงานผลิตมิวสิควิดีโอสำหรับศิลปินเพลงอินดี้ เน้นโทนเศร้า สไตล์ภาพซินีมาติก ถ่ายทำในพื้นที่ธรรมชาติและเมือง เปรียบเทียบระหว่างความแตกต่างของสิ่งแวดล้อมและอารมณ์",
    postImages: [
      "https://example.com/images/mv-project1.jpg",
      "https://example.com/images/mv-project2.jpg",
    ],
    postMediaType: "music-video",
    postProjectRoles: ["Director", "ช่างภาพ", "นักแสดงนำ", "โปรดิวเซอร์"],
    postStatus: "created",
    startDate: "2025-05-01T00:00:00.000Z",
    endDate: "2025-06-15T00:00:00.000Z",
    userID: "producer1",
  },
];

// Mock data สำหรับ Offer History ในหน้า post detail
const mockOfferHistory = [
  {
    roleName: "Director",
    price: 15000,
    offerBy: 1, // 1 = Producer, 2 = Production Professional
    createdAt: "2025-03-15T10:30:00.000Z",
    detail:
      "ต้องการผู้กำกับที่มีประสบการณ์ทำงานหนังสั้นอย่างน้อย 2 ปี สามารถทำงานในพื้นที่กรุงเทพได้ตลอดช่วงการถ่ายทำ",
  },
  {
    roleName: "Director",
    price: 20000,
    offerBy: 2,
    createdAt: "2025-03-16T14:20:00.000Z",
    detail:
      "ผมมีประสบการณ์ทำหนังสั้นมา 3 ปี เคยได้รับรางวัลจากเทศกาลหนังสั้น อยากขอเสนอค่าตัวที่ 20,000 บาทเนื่องจากโปรเจคต้องใช้เวลาเตรียมงานและถ่ายทำค่อนข้างนาน",
  },
  {
    roleName: "Director",
    price: 18000,
    offerBy: 1,
    createdAt: "2025-03-17T09:15:00.000Z",
    detail:
      "ขอเสนอที่ 18,000 บาท เนื่องจากงบประมาณของโปรเจคมีจำกัด แต่เราสามารถอำนวยความสะดวกในด้านอื่นๆ เช่น การเดินทางและอาหารระหว่างถ่ายทำ",
  },
  {
    roleName: "ช่างภาพ",
    price: 12000,
    offerBy: 1,
    createdAt: "2025-03-15T11:45:00.000Z",
    detail:
      "ต้องการช่างภาพที่มีอุปกรณ์ส่วนตัวพร้อมถ่ายทำ สไตล์การถ่ายภาพแบบ cinematic มืดๆ เน้นการใช้แสงธรรมชาติ",
  },
  {
    roleName: "นักแสดงนำชาย",
    price: 8000,
    offerBy: 1,
    createdAt: "2025-03-15T12:30:00.000Z",
    detail:
      "ต้องการนักแสดงชายอายุระหว่าง 25-35 ปี สามารถแสดงอารมณ์หลากหลาย โดยเฉพาะความสับสนและความเศร้า ถ่ายทำประมาณ 7 วัน",
  },
];

// Mock data สำหรับ post detail (post ที่เลือก)
const mockPostDetail = {
  id: "post1",
  postName: "หนังสั้นเรื่อง 'ความทรงจำที่หายไป'",
  postDescription:
    "โปรเจคหนังสั้นที่เล่าเรื่องราวเกี่ยวกับชายหนุ่มที่สูญเสียความทรงจำและพยายามค้นหาตัวตนของตัวเอง ต้องการทีมงานที่มีประสบการณ์และสามารถทำงานภายใต้งบประมาณจำกัด\n\nเนื้อหาของหนังสั้นนี้จะสำรวจประเด็นเกี่ยวกับอัตลักษณ์และความทรงจำที่หล่อหลอมตัวตนของเรา ผ่านมุมมองของตัวละครหลักที่ต้องเริ่มต้นชีวิตใหม่โดยไม่มีความทรงจำเดิม\n\nระยะเวลาในการถ่ายทำประมาณ 7-10 วัน ในพื้นที่กรุงเทพฯ และปริมณฑล โดยเน้นการถ่ายทำในสถานที่จริง เช่น บ้าน อพาร์ทเมนท์ และพื้นที่สาธารณะต่างๆ\n\nความยาวของหนังสั้นประมาณ 15-20 นาที เหมาะสำหรับส่งประกวดในเทศกาลหนังสั้นทั้งในและต่างประเทศ",
  postImages: [
    "https://example.com/images/film-project1.jpg",
    "https://example.com/images/film-project2.jpg",
    "https://example.com/images/film-project3.jpg",
  ],
  postMediaType: "short-film",
  postProjectRoles: [
    "Director",
    "ช่างภาพ",
    "นักแสดงนำชาย",
    "นักแสดงนำหญิง",
    "ทีมตัดต่อ",
  ],
  postStatus: "created",
  startDate: "2025-04-10T00:00:00.000Z",
  endDate: "2025-05-20T00:00:00.000Z",
  userID: "producer1",
};

export { mockPosts, mockOfferHistory, mockPostDetail };
