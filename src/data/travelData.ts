export interface SeasonalItem {
  type: 'domestic' | 'overseas';
  title: string;
  region: string;
  addr: string;
  img: string;
  tag: string;
  desc: string;
}

export interface PlaceItem {
  name: string;
  addr: string;
  desc: string;
}

export interface CityData {
  food: PlaceItem[];
  cafe: PlaceItem[];
  heal: PlaceItem[];
}

export const SeasonalData: Record<'spring' | 'summer' | 'autumn' | 'winter', SeasonalItem[]> = {
  spring: [
    {
      type: 'domestic',
      title: '진해 군항제 & 여좌천',
      region: '경남 창원',
      addr: '경남 창원시 진해구 여좌동',
      img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&auto=format&fit=crop',
      tag: '#국내 #벚꽃명소 #로맨스다리',
      desc: '분홍빛 벚꽃 터널과 낭만적인 개천 야경을 만끽할 수 있는 대한민국 대표 봄꽃 성지.',
    },
    {
      type: 'domestic',
      title: '제주 가파도 청보리밭',
      region: '제주 서귀포',
      addr: '제주 서귀포시 대정읍 가파리',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop',
      tag: '#국내 #청보리축제 #감성산책',
      desc: '봄바람에 넘실거리는 초록빛 청보리 물결과 제주 푸른 바다의 감성 조화.',
    },
    {
      type: 'domestic',
      title: '구례 산수유마을',
      region: '전남 구례',
      addr: '전남 구례군 산동면 위안리',
      img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop',
      tag: '#국내 #노란산수유 #봄꽃축제',
      desc: '지리산 자락을 노란 물결로 가득 채우는 포근하고 아름다운 봄맞이 꽃길 드라이브.',
    },
    {
      type: 'overseas',
      title: '일본 교토 철학의 길 & 기요미즈데라',
      region: '일본 교토',
      addr: 'Tetsugaku-no-Michi, Sakyo Ward, Kyoto, Japan',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop',
      tag: '#해외 #교토벚꽃 #고즈넉한감성',
      desc: '벚꽃 잎이 흩날리는 수로길을 따라 거니는 아시아 최고의 봄 낭만 힐링 명소.',
    },
    {
      type: 'overseas',
      title: '네덜란드 큐켄호프 튤립 축제',
      region: '네덜란드 리세',
      addr: 'Stationsweg 166A, 2161 AM Lisse, Netherlands',
      img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop',
      tag: '#해외 #유럽튤립 #인생컬러풀샷',
      desc: '700만 송이의 색색 튤립과 꽃바다가 장관을 이루는 세계 최대의 봄 정원 축제.',
    },
  ],
  summer: [
    {
      type: 'domestic',
      title: '양양 서피비치',
      region: '강원 양양',
      addr: '강원 양양군 현북면 하조대해안길 119',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
      tag: '#국내 #서핑성지 #이국적비치바',
      desc: '트렌디한 서핑 문화와 이국적인 라운지 바를 동시에 즐기는 2030 대표 핫플레이스.',
    },
    {
      type: 'domestic',
      title: '삼척 장호항 & 갈남항',
      region: '강원 삼척',
      addr: '강원 삼척시 근덕면 장호리',
      img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop',
      tag: '#국내 #한국의나폴리 #스노클링',
      desc: '에메랄드빛 투명한 바다에서 투명카누와 스노클링을 즐기는 청정 액티비티 천국.',
    },
    {
      type: 'domestic',
      title: '제주 협재 & 금능해수욕장',
      region: '제주 제주시',
      addr: '제주 제주시 한림읍 협재리 2497-1',
      img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop',
      tag: '#국내 #에메랄드바다 #석양명소',
      desc: '비양도가 한눈에 보이는 맑고 얕은 바다에서 시원한 물놀이와 석양 감상.',
    },
    {
      type: 'overseas',
      title: '인도네시아 발리 울루와투',
      region: '인도네시아 발리',
      addr: 'Uluwatu, Pecatu, South Kuta, Badung, Bali, Indonesia',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop',
      tag: '#해외 #발리절벽비치 #일몰선셋',
      desc: '인도양 깎아지른 절벽 위 인피니티 풀 클럽과 환상적인 노을을 만끽하는 휴양 성지.',
    },
    {
      type: 'overseas',
      title: '스위스 인터라켄 & 융프라우',
      region: '스위스 베른주',
      addr: 'Interlaken, Bernese Oberland, Switzerland',
      img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop',
      tag: '#해외 #알프스대자연 #청량패러글라이딩',
      desc: '청량한 여름 알프스 호수와 만년설 봉우리를 가로지르는 청춘 버킷리스트 여행지.',
    },
  ],
  autumn: [
    {
      type: 'domestic',
      title: '순천만 습지 갈대밭',
      region: '전남 순천',
      addr: '전남 순천시 순천만길 513-25',
      img: '/assets/aistudio/Image_11_856e7f1a.jpeg',
      tag: '#국내 #황금빛갈대 #노을스팟',
      desc: '가을 바람 따라 일렁이는 황금빛 갈대숲 군락과 붉은 낙조가 일품인 힐링 산책로.',
    },
    {
      type: 'domestic',
      title: '경주 첨성대 핑크뮬리',
      region: '경북 경주',
      addr: '경북 경주시 첨성로 140-25',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
      tag: '#국내 #핑크뮬리 #인생샷',
      desc: '천년 신라 역사가 깃든 첨성대 주변을 분홍빛 구름처럼 감싼 가을 최고 인기 포토존.',
    },
    {
      type: 'domestic',
      title: '내장산 국립공원 단풍',
      region: '전북 정읍',
      addr: '전북 정읍시 내장산로 1207',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
      tag: '#국내 #단풍터널 #가을산행',
      desc: '대한민국 대표 오색 아기단풍 터널길을 거닐며 깊어가는 가을 정취를 만끽.',
    },
    {
      type: 'overseas',
      title: '캐나다 퀘벡 올드타운 단풍',
      region: '캐나다 퀘벡',
      addr: 'Old Quebec, Quebec City, QC, Canada',
      img: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop',
      tag: '#해외 #메이플로드 #동화같은골목',
      desc: '동화 같은 유럽풍 성곽 도시를 붉게 물들이는 세계 최고의 메이플 단풍 로드.',
    },
    {
      type: 'overseas',
      title: '일본 홋카이도 조잔케이 단풍계곡',
      region: '일본 홋카이도',
      addr: 'Jozankei Onsen, Minami Ward, Sapporo, Hokkaido, Japan',
      img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop',
      tag: '#해외 #온천단풍 #북해도힐링',
      desc: '붉고 노란 단풍 숲 계곡을 조망하며 노천 온천을 즐기는 가을 북해도 미식 힐링.',
    },
  ],
  winter: [
    {
      type: 'domestic',
      title: '평창 대관령 양떼목장',
      region: '강원 평창',
      addr: '강원 평창군 대관령면 대관령마루길 483-32',
      img: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=600&auto=format&fit=crop',
      tag: '#국내 #설국 #눈꽃여행',
      desc: '끝없이 펼쳐진 하얀 설원 산책로와 아늑한 겨울 풍경을 제대로 즐길 수 있는 대표 목장.',
    },
    {
      type: 'domestic',
      title: '제주 1100고지 습지',
      region: '제주 서귀포',
      addr: '제주 서귀포시 색달동 산1-2',
      img: 'https://images.unsplash.com/photo-1486496572940-27a72ec1e547?w=600&auto=format&fit=crop',
      tag: '#국내 #눈꽃터널 #겨울한라산',
      desc: '드라이브로 편하게 오르는 겨울왕국. 환상적인 눈꽃 나무 터널과 상고대 감상.',
    },
    {
      type: 'domestic',
      title: '청양 알프스마을',
      region: '충남 청양',
      addr: '충남 청양군 정산면 천장호길 223-35',
      img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&auto=format&fit=crop',
      tag: '#국내 #얼음분수 #겨울축제',
      desc: '거대한 얼음 분수와 조각, 눈썰매 등 겨울 레저의 즐거움이 집약된 테마파크.',
    },
    {
      type: 'overseas',
      title: '일본 삿포로 눈축제 & 오도리공원',
      region: '일본 삿포로',
      addr: 'Odori Park, Chuo Ward, Sapporo, Hokkaido, Japan',
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop',
      tag: '#해외 #삿포로눈축제 #설국야경',
      desc: '압도적인 스케일의 거대 눈조각상과 순백의 설경, 따뜻한 미소라멘의 완벽한 조화.',
    },
    {
      type: 'overseas',
      title: '핀란드 로바니에미 산타마을 & 오로라',
      region: '핀란드 라플란드',
      addr: 'Santa Claus Village, 96930 Rovaniemi, Finland',
      img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop',
      tag: '#해외 #오로라체험 #진짜산타마을',
      desc: '하늘을 뒤덮는 영롱한 오로라와 숲속 유리 이글루에서 맞이하는 일생일대의 겨울 추억.',
    },
  ],
};

export const LiveFestivals = [
  {
    title: '순천만 갈대축제 2026',
    date: '10.15 ~ 10.31',
    status: '진행중',
    statusColor: 'bg-rose-500',
    addr: '전남 순천시 순천만길 513-25',
    placeName: '순천만습지',
    img: '/assets/aistudio/Image_11_856e7f1a.jpeg',
    desc: '전남 순천시 순천만습지 일원 황금빛 갈대숲과 힐링 산책길',
  },
  {
    title: '제21회 부산불꽃축제',
    date: '11.07',
    status: 'D-15',
    statusColor: 'bg-lime-600',
    addr: '부산 수영구 광안해변로 219',
    placeName: '광안리해수욕장',
    img: '/assets/aistudio/Image_1_62aaa7dc.jpeg',
    desc: '부산 광안리해수욕장 일대 화려한 멀티미디어 해상 불꽃쇼',
  },
  {
    title: '제주 국제 감귤 박람회',
    date: '11.13 ~ 11.19',
    status: '예정',
    statusColor: 'bg-amber-500',
    addr: '제주 서귀포시 남원읍 중산간동로 2260',
    placeName: '서귀포농업기술센터',
    img: '/assets/aistudio/Image_10_575efc09.jpeg',
    desc: '제주 서귀포농업기술센터 귤빛 테마파크와 감귤 수확 체험 프로그램',
  },
];

export const DomesticPlaceDB: Record<string, CityData> = {
  제주도: {
    food: [
      { name: '우진해장국', addr: '제주 제주시 서사로 11', desc: '고사리 육개장 대표 로컬 맛집' },
      { name: '숙성도 노형본관', addr: '제주 제주시 원노형로 41', desc: '육즙 가득한 720시간 숙성 흑돼지' },
      { name: '연돈', addr: '제주 서귀포시 일주서로 968-10', desc: '바삭한 프리미엄 수제 돈가스' },
      { name: '춘심이네 본점', addr: '제주 서귀포시 안덕면 창천중앙로24번길 16', desc: '통갈치구이와 정갈한 상차림' },
    ],
    cafe: [
      { name: '몽상드애월', addr: '제주 제주시 애월읍 애월북서길 56-1', desc: '탁 트인 애월 오션뷰와 일몰 스팟' },
      { name: '오설록 티 뮤지엄', addr: '제주 서귀포시 안덕면 신화역사로 15', desc: '초록빛 녹차밭과 말차 디저트' },
      { name: '원앤온리', addr: '제주 서귀포시 안덕면 산방로 141', desc: '산방산과 바다를 동시에 품은 힐링뷰' },
    ],
    heal: [
      { name: '사려니숲길', addr: '제주 제주시 조천읍 교래리 산137-1', desc: '피톤치드 가득한 삼나무 숲길 산책' },
      { name: '섭지코지', addr: '제주 서귀포시 성산읍 고성리', desc: '기암괴석과 푸른 해안선 절경' },
      { name: '카멜리아힐', addr: '제주 서귀포시 안덕면 병악로 166', desc: '동백꽃과 감성 산책로 인생 포토존' },
    ],
  },
  부산: {
    food: [
      { name: '해운대 암소갈비집', addr: '부산 해운대구 중동2로10번길 325', desc: '특제 양념과 감자사리의 완벽한 조화' },
      { name: '수변최고돼지국밥', addr: '부산 수영구 광안해변로370번길 9-32', desc: '진하고 깔끔한 육수의 항정국밥' },
      { name: '이재모피자', addr: '부산 중구 광복중앙로 31', desc: '자연산 치즈가 듬뿍 들어간 로컬 성지' },
    ],
    cafe: [
      { name: '웨이브온 커피', addr: '부산 기장군 장안읍 해맞이로 286', desc: '바다 바로 앞 건축미 넘치는 오션뷰 카페' },
      { name: '모모스커피', addr: '부산 금정구 오시게로 20', desc: '월드 바리스타 챔피언의 스페셜티 커피' },
    ],
    heal: [
      { name: '해동용궁사', addr: '부산 기장군 기장읍 용궁길 86', desc: '파도가 치는 바닷가 절벽 위 사찰' },
      { name: '흰여울문화마을', addr: '부산 영도구 영선동4가 1043', desc: '바닷길을 따라 걷는 아기자기한 골목길' },
    ],
  },
  강릉: {
    food: [
      { name: '동화가든', addr: '강원 강릉시 초당순두부길77번길 15', desc: '불맛 가득한 얼큰한 원조 짬순' },
      { name: '엄지네포장마차 본점', addr: '강원 강릉시 경강로2255번길 21', desc: '고소한 꼬막무침과 비빔밥의 원조' },
    ],
    cafe: [
      { name: '테라로사 커피공장', addr: '강원 강릉시 구정면 현천길 7', desc: '붉은 벽돌과 핸드드립 커피의 풍미' },
      { name: '툇마루', addr: '강원 강릉시 난설헌로 232', desc: '고소한 흑임자 크림 라떼 성지' },
    ],
    heal: [
      { name: '경포대 & 경포호수', addr: '강원 강릉시 경포로 365', desc: '호수 둘레길 자전거 산책과 소나무 숲' },
      { name: '정동진 부채길', addr: '강원 강릉시 강동면 헌화로 994', desc: '동해 바다 비경을 따라 걷는 해안 데크' },
    ],
  },
  경주: {
    food: [
      { name: '함양집', addr: '경북 경주시 보국로 107', desc: '시원하고 감칠맛 넘치는 한우 물회' },
      { name: '황남경주식당', addr: '경북 경주시 포석로1068번길 22-1', desc: '고즈넉한 한옥에서 즐기는 고기 한상' },
    ],
    cafe: [
      { name: '황남아우어', addr: '경북 경주시 첨성로 73', desc: '한옥 루프탑에서 즐기는 커피와 디저트' },
      { name: '카페 솔', addr: '경북 경주시 포석로1092번길 13-8', desc: '넓은 정원과 감성적인 포토존' },
    ],
    heal: [
      { name: '동궁과 월지 (안압지)', addr: '경북 경주시 원화로 102', desc: '화려한 야경이 연못에 비치는 신라 야경 명소' },
      { name: '대릉원 돌담길', addr: '경북 경주시 계림로 9', desc: '사계절 운치 있는 고분과 벚나무 산책길' },
    ],
  },
  서울: {
    food: [
      { name: '성수 소문난감자탕', addr: '서울 성동구 연무장길 45', desc: '부드러운 살코기와 진한 육수의 감자탕' },
      { name: '명동교자 본점', addr: '서울 중구 명동10길 29', desc: '깊은 칼국수 육수와 알싸한 마늘김치' },
    ],
    cafe: [
      { name: '성수 어니언', addr: '서울 성동구 아차산로9길 8', desc: '폐공장을 개조한 감성 베이커리 카페' },
      { name: '카멜커피 성수', addr: '서울 성동구 서울숲7길', desc: '부드러운 시그니처 크림 커피' },
    ],
    heal: [
      { name: '서울숲 공원', addr: '서울 성동구 뚝섬로 273', desc: '도심 속 푸른 숲과 사슴 방목장 산책' },
      { name: '북촌한옥마을', addr: '서울 종로구 계동길 37', desc: '전통 한옥의 고즈넉한 정취 탐방' },
    ],
  },
};

export const OverseasPlaceDB: Record<string, CityData> = {
  오사카: {
    food: [
      { name: '이치란 도톤보리 본관', addr: '7-18 Souemoncho, Chuo Ward, Osaka', desc: '진하고 깔끔한 돈코츠 라멘과 비법 소스' },
      { name: '카츠쿠라 난바', addr: '5 Chome-1-60 Namba, Chuo Ward, Osaka', desc: '바삭하고 두툼한 명품 돈카츠 정식' },
    ],
    cafe: [
      { name: '블루보틀 오사카 우메다', addr: '1-1-3 Shibata, Kita Ward, Osaka', desc: '미니멀한 인테리어와 싱글오리진 드립 커피' },
    ],
    heal: [
      { name: '오사카성 공원', addr: '1-1 Osakajo, Chuo Ward, Osaka', desc: '웅장한 천수각과 해자 주변 산책길' },
      { name: '교토 아라시야마 치쿠린', addr: 'Arashiyama, Ukyo Ward, Kyoto', desc: '하늘 높이 솟은 청량한 대나무 숲길' },
    ],
  },
  도쿄: {
    food: [
      { name: '규카츠 모토무라 시부야', addr: '3-18-10 Shibuya, Shibuya City, Tokyo', desc: '개인 화로에 직접 구워 먹는 소고기 카츠' },
      { name: '츠키지 장외시장 스시', addr: '4 Chome-16-2 Tsukiji, Chuo City, Tokyo', desc: '새벽 직송 신선한 참치 카이센동' },
    ],
    cafe: [
      { name: '시부야 스카이 라운지 파라다이스', addr: '2 Chome-24-12 Shibuya, Tokyo', desc: '도쿄 스카이라인을 바라보는 루프탑 바' },
    ],
    heal: [
      { name: '메이지 신궁 & 요요기공원', addr: '1-1 Yoyogikamizonocho, Shibuya, Tokyo', desc: '도심 속 거대한 숲과 힐링 산책길' },
    ],
  },
  다낭: {
    food: [
      { name: '마담란 레스토랑', addr: '4 Bạch Đằng, Thạch Thang, Hải Châu, Đà Nẵng', desc: '정통 베트남 반쎄오와 분짜 전문점' },
      { name: '목해산물 식당', addr: '26 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng', desc: '신선한 크랩과 마늘 버터 새우 요리' },
    ],
    cafe: [
      { name: '콩카페 다낭 1호점', addr: '98-96 Bạch Đằng, Hải Châu 1, Đà Nẵng', desc: '달콤하고 시원한 시그니처 코코넛 스무디 커피' },
    ],
    heal: [
      { name: '호이안 올드타운 투본강', addr: 'Minh An Ward, Hội An, Quang Nam', desc: '알록달록한 전통 등불거리 야경과 소원배' },
    ],
  },
  방콕: {
    food: [
      { name: '팁싸마이 팟타이', addr: '313 315 Maha Chai Rd, Samran Rat, Phra Nakhon, Bangkok', desc: '오렌지주스와 오므라이스 스타일 팟타이' },
      { name: '쏨분씨푸드', addr: '169 / 7-12 Surawong Rd, Suriya Wong, Bang Rak, Bangkok', desc: '부드러운 계란 커리와 게살의 푸팟퐁커리' },
    ],
    cafe: [
      { name: '팩토리 커피 방콕', addr: '49 Phaya Thai Rd, Thanon Phaya Thai, Ratchathewi', desc: '세계 챔피언 바리스타의 크리미 시그니처 라떼' },
    ],
    heal: [
      { name: '왓 아룬(새벽사원)', addr: '158 Thanon Wang Doem, Wat Arun, Bangkok Yai', desc: '차오프라야 강변을 빛내는 화려한 도자기 사원' },
    ],
  },
  파리: {
    food: [
      { name: '부용 줄리앙', addr: '16 Rue du Faubourg Saint-Denis, 75010 Paris', desc: '아르누보 양식 인테리어와 클래식 프렌치 요리' },
    ],
    cafe: [
      { name: '카페 드 플로르', addr: '172 Bd Saint-Germain, 75006 Paris', desc: '유명 작가와 예술가들의 단골 역사적인 카페' },
    ],
    heal: [
      { name: '에펠탑 샹드마르스 공원', addr: '2 All. Adrienne Lecouvreur, 75007 Paris', desc: '잔디밭에 돗자리를 펴고 와인과 바게트를 즐기는 피크닉' },
    ],
  },
};
