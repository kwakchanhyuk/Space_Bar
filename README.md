# Space_Bar


-충돌 조건
      // 오류 1. 구조물 끝에서 점프하다가 밖으로 나가면 땅으로 꺼짐(flag 조정해야 될듯)
			// 오류 2. 구조물 끝에서 점프하면 낮게 점프됨 (jump_flag를 변경해서 그럼)
			// 오류 3. 내 정신상태
			// 오류 1-2-3 : 2022-05-11 수정완료
			// hero가 바닥과 접촉중인지 구조물에 접촉중인지 flag추가
			// jump_flag과 wall_flag를 이용해 예외처리 
			// Regression Test 결과 새로운 오류 발생 - 2022-05-11 17:58
			// 오류4 구조물 밟고나서 이동키와 점프 계속 누르면서 앞으로가면 공중에 떠있음
			// 오류5 구조물 여러개 설치시 땅으로 내려가짐 (결합도 문제) - 2022-05-11 20:42		
			// 구조물을 배열 객체에 담고 계속 확인하여야함 다시 리펙토링 작업 ㄱㄱ 2022-05-12 13:10
