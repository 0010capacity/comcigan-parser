/**
 * sample.js
 *
 * @description 샘플 코드
 * @author leegeunhyeok
 */

const Timetable = require("../index");

/**
 * 포괄적인 테스트 케이스 모음
 */
const runTests = async () => {
  console.log("=== 컴시간 파서 테스트 시작 ===\n");

  // 테스트 1: 초기화 테스트
  console.log("테스트 1: 초기화");
  try {
    const timetable = new Timetable();
    await timetable.init({ cache: 1000 * 60 * 5 }); // 5분 캐시
    console.log("✅ 초기화 성공\n");
  } catch (error) {
    console.error("❌ 초기화 실패:", error.message, "\n");
    return;
  }

  const timetable = new Timetable();
  await timetable.init();

  // 테스트 2: 학교 검색 테스트
  console.log("테스트 2: 학교 검색");
  try {
    const searchResults = await timetable.search("유신고");
    console.log("✅ 검색 결과:", searchResults.length, "개 학교");
    console.log("   -", searchResults.map((s) => s.name).join(", "), "\n");
  } catch (error) {
    console.error("❌ 학교 검색 실패:", error.message, "\n");
    return;
  }

  // 테스트 3: 없는 학교 검색 테스트
  console.log("테스트 3: 없는 학교 검색 (예외 처리 테스트)");
  try {
    await timetable.search("존재하지않는학교이름123");
    console.error("❌ 예외가 발생해야 하는데 발생하지 않음\n");
  } catch (error) {
    console.log("✅ 예외 정상 발생:", error.message, "\n");
  }

  // 테스트 4: 학교 설정 및 시간표 조회
  console.log("테스트 4: 시간표 조회");
  try {
    const schoolList = await timetable.search("유신고등학교");
    const school = schoolList[0];
    console.log("   대상 학교:", school.name, `(${school.region})`);

    timetable.setSchool(school.code);
    const timetableData = await timetable.getTimetable();
    console.log("✅ 시간표 조회 성공");
    console.log("   - 1학년 1반 월요일 1교시:", timetableData[1][1][0][0]);
    console.log(
      "   - 3학년 1반 금요일 5교시:",
      timetableData[3][1][4][4],
      "\n",
    );
  } catch (error) {
    console.error("❌ 시간표 조회 실패:", error.message, "\n");
    return;
  }

  // 테스트 5: 교시별 수업시간 조회
  console.log("테스트 5: 교시별 수업시간");
  try {
    const classTime = await timetable.getClassTime();
    console.log("✅ 수업시간 조회 성공");
    console.log("   - 첫 교시:", classTime[0]);
    console.log("   - 마지막 교시:", classTime[classTime.length - 1], "\n");
  } catch (error) {
    console.error("❌ 수업시간 조회 실패:", error.message, "\n");
  }

  // 테스트 6: 다양한 학년/반 조회 테스트
  console.log("테스트 6: 다양한 학년/반 시간표");
  try {
    const timetableData = await timetable.getTimetable();

    console.log("   1학년 시간표 (1반, 2반):");
    console.log("     - 1학년 1반 수요일:", timetableData[1][1][2].slice(0, 3));
    console.log("     - 1학년 2반 목요일:", timetableData[1][2][3].slice(0, 3));

    console.log("   2학년 시간표 (5반, 10반):");
    console.log("     - 2학년 5반 월요일:", timetableData[2][5][0].slice(0, 3));
    console.log(
      "     - 2학년 10반 화요일:",
      timetableData[2][10][1].slice(0, 3),
    );

    console.log("   3학년 시간표 (1반, 5반):");
    console.log("     - 3학년 1반 수요일:", timetableData[3][1][2].slice(0, 3));
    console.log("     - 3학년 5반 목요일:", timetableData[3][5][3].slice(0, 3));

    console.log("✅ 다양한 학년/반 조회 성공\n");
  } catch (error) {
    console.error("❌ 다양한 학년/반 조회 실패:", error.message, "\n");
  }

  // 테스트 7: 전체 요일 시간표 출력
  console.log("테스트 7: 특정 반의 전체 요일 시간표");
  try {
    const timetableData = await timetable.getTimetable();
    const classNum = 1;
    const grade = 1;

    console.log(`   ${grade}학년 ${classNum}반 전체 시간표:`);
    const weekdays = ["월", "화", "수", "목", "금"];

    weekdays.forEach((day, idx) => {
      const daySchedule = timetableData[grade][classNum][idx];
      const subjects = daySchedule.map((period) => period.subject).join(", ");
      console.log(`     ${day}요일: ${subjects}`);
    });

    console.log("✅ 전체 요일 시간표 출력 성공\n");
  } catch (error) {
    console.error("❌ 전체 요일 시간표 출력 실패:", error.message, "\n");
  }

  // 테스트 8: 캐시 기능 테스트
  console.log("테스트 8: 캐시 기능");
  try {
    const cachedTimetable = new Timetable();
    await cachedTimetable.init({ cache: 10000 }); // 10초 캐시

    const schoolList = await cachedTimetable.search("유신고등학교");
    cachedTimetable.setSchool(schoolList[0].code);

    // 첫 번째 조회
    const start1 = Date.now();
    await cachedTimetable.getTimetable();
    const time1 = Date.now() - start1;

    // 두 번째 조회 (캐시 사용)
    const start2 = Date.now();
    await cachedTimetable.getTimetable();
    const time2 = Date.now() - start2;

    console.log(`   첫 번째 조회: ${time1}ms`);
    console.log(`   두 번째 조회 (캐시): ${time2}ms`);
    console.log(`   캐시 속도 향상: ${time1 > time2 ? "✅" : "⚠️"}\n`);
  } catch (error) {
    console.error("❌ 캐시 기능 테스트 실패:", error.message, "\n");
  }

  // 테스트 9: 선생님 정보 조회
  console.log("테스트 9: 선생님 정보");
  try {
    const timetableData = await timetable.getTimetable();
    const sample = timetableData[1][1][0][0];
    console.log("   샘플 수업 정보:");
    console.log(`     - 과목: ${sample.subject}`);
    console.log(`     - 선생님: ${sample.teacher || "없음"}`);
    console.log(
      `     - 시간: ${sample.weekdayString}요일 ${sample.classTime}교시`,
    );
    console.log("✅ 선생님 정보 조회 성공\n");
  } catch (error) {
    console.error("❌ 선생님 정보 조회 실패:", error.message, "\n");
  }

  // 테스트 10: 빈 시간표 처리
  console.log("테스트 10: 빈 수업 처리");
  try {
    const timetableData = await timetable.getTimetable();
    let emptyPeriods = 0;

    // 첫 번째 학년, 첫 번째 반에서 빈 수업 수 카운트
    for (let day = 0; day < 5; day++) {
      for (let period = 0; period < 8; period++) {
        if (!timetableData[1][1][day][period].subject) {
          emptyPeriods++;
        }
      }
    }

    console.log(`   1학년 1반 빈 수업 수: ${emptyPeriods}개`);
    console.log("✅ 빈 수업 처리 성공\n");
  } catch (error) {
    console.error("❌ 빈 수업 처리 실패:", error.message, "\n");
  }

  console.log("=== 모든 테스트 완료 ===");
};

runTests().catch((error) => {
  console.error("치명적 오류:", error);
});
