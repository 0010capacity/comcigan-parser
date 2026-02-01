const Timetable = require('./index');

const testRegionSearch = async () => {
  console.log('=== 경기 지역 고등학교 검색 테스트 ===\n');

  try {
    const timetable = new Timetable();
    await timetable.init();

    // 방법 1: "경기"로 검색 (지역명 포함 학교들)
    console.log('1. "경기"로 검색:');
    console.log('-'.repeat(50));
    const schoolsByRegion = await timetable.search('경기');
    console.log(`검색된 학교 수: ${schoolsByRegion.length}개\n`);

    // 고등학교만 필터링
    const highSchools = schoolsByRegion.filter(s => s.name.includes('고등학교'));
    console.log(`그중 고등학교: ${highSchools.length}개\n`);

    // 상위 10개만 출력
    console.log('상위 10개 학교:');
    highSchools.slice(0, 10).forEach((school, idx) => {
      console.log(`  ${idx + 1}. ${school.region} ${school.name} (코드: ${school.code})`);
    });

    console.log(`\n... (총 ${highSchools.length}개 고등학교)\n`);

    // 방법 2: 특정 도시로 검색 (예: 광명, 부천, 안산 등)
    console.log('2. 경기 지역 주요 도시별 검색:');
    console.log('-'.repeat(50));

    const cities = ['광명', '부천', '안산', '수원', '성남', '고양', '용인'];

    for (const city of cities) {
      try {
        const citySchools = await timetable.search(city);
        const cityHighSchools = citySchools.filter(s => s.name.includes('고등학교'));
        console.log(`${city}: ${cityHighSchools.length}개 고등학교`);

        // 첫 번째 학교 예시
        if (cityHighSchools.length > 0) {
          console.log(`  예시: ${cityHighSchools[0].name}`);
        }
      } catch (error) {
        console.log(`${city}: 검색 결과 없음`);
      }
    }

    // 방법 3: 경기 전체 고등학교 목록 생성
    console.log('\n3. 경기 지역 모든 고등학교 목록:');
    console.log('-'.repeat(50));

    const allGyeonggiHighSchools = schoolsByRegion.filter(s => s.name.includes('고등학교'));

    // JSON 파일로 저장
    const fs = require('fs');
    const outputFile = 'gyeonggi_high_schools.json';

    fs.writeFileSync(
      outputFile,
      JSON.stringify(allGyeonggiHighSchools, null, 2),
      'utf8'
    );

    console.log(`총 ${allGyeonggiHighSchools.length}개의 경기 지역 고등학교를 찾았습니다.`);
    console.log(`목록이 ${outputFile} 파일로 저장되었습니다.\n`);

    // 지역별 분석
    console.log('4. 지역별 분석:');
    console.log('-'.repeat(50));

    const regionCounts = {};
    allGyeonggiHighSchools.forEach(school => {
      const region = school.region || '기타';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([region, count]) => {
        console.log(`  ${region}: ${count}개`);
      });

    console.log('\n=== 테스트 완료 ===');

  } catch (error) {
    console.error('오류 발생:', error.message);
    console.error(error);
  }
};

testRegionSearch();
