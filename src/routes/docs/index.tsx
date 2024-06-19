import { Typography, useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import { wrapError } from '~/components/ErrorBoundary'

const name = '미끄메라넷'
const address = 'https://mikmera.net'
const email = 'admin@mikmera.net'

export const PrivacyPolicy: React.FC = wrapError(() => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        justifyContent: 'center',
        marginLeft: isMobile ? '20px' : '50px',
        marginRight: isMobile ? '20px' : '50px',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mt: 10, textAlign: 'center' }}
        fontFamily={'ONE-Mobile-POP'}
      >
        개인정보 처리방침
      </Typography>
      <Typography variant="subtitle1" mt={10}>
        {`<${name}>('${address}')`}은 「개인정보보호법」 및 「정보통신망 이용
        촉진 및 정보보호 등에 관한 법률」 등 관련 법규에 의해 이용자의
        개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수
        있도록 다음과 같은 개인정보 처리방침을 수립하여 공개합니다.
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        1. 개인정보의 처리 목적 및 수집 항목
      </Typography>
      <Typography variant="subtitle1">
        ① {name}은 다음의 목적을 위하여 최소한의 개인정보만을 수집 및 처리하고
        있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
      </Typography>
      <Typography variant="subtitle1">[서비스 이용시]</Typography>
      <Typography variant="subtitle1">
        - IP주소, 쿠키, 방문 일시, 서비스 이용 기록
      </Typography>
      <Typography variant="subtitle1">[회원 가입시]</Typography>
      <Typography variant="subtitle1">
        - 디스코드 사용자 ID, 닉네임, 프로필사진, 이메일주소
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        2. 개인정보 처리 및 보유 기간
      </Typography>
      <Typography variant="subtitle1">
        ① {name}은 정보주체로부터 개인정보를 수집할 때 동의 받은 개인정보
        보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를
        처리·보유합니다.
      </Typography>
      <Typography variant="subtitle1">
        ② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.
      </Typography>
      <Typography variant="subtitle1">[회원가입 및 관리]</Typography>
      <Typography variant="subtitle1">
        - 수집항목: 디스코드 사용자 ID, 닉네임, 프로필사진, 이메일주소
      </Typography>
      <Typography variant="subtitle1">- 보유근거: 정보주체의 동의</Typography>
      <Typography variant="subtitle1">- 보유기간: 회원 탈퇴 시까지</Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        3. 정보주체와 법정대리인의 권리, 의무 및 그 행사방법
      </Typography>
      <Typography variant="subtitle1">
        ① 정보주체는 {name}에 대해 언제든지 다음 각 호의 개인정보 보호 관련
        권리를 행사할 수 있습니다.
      </Typography>
      <Typography variant="subtitle1">
        1. 개인정보 열람요구
        <br />
        2. 오류 등이 있을 경우 정정 요구
        <br />
        3. 삭제요구
        <br />
        4. 처리정지 요구
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        4. 개인정보의 제3자 제공
      </Typography>
      <Typography variant="subtitle1">
        ① {name}은 정보주체의 개인정보를 제3자에게 제공하지 않습니다
      </Typography>
      <Typography variant="subtitle1" mt={3}>
        ② 다만, 다음의 경우에는 예외로 합니다.
        <br />
        1. 정보주체로부터 별도의 동의를 받은 경우
        <br />
        2. 법령에 근거하여 정보주체의 개인정보를 제공하거나 법령의 규정에 의하여
        제공하는 경우
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        5. 개인정보의 파기
      </Typography>
      <Typography variant="subtitle1">
        ① {name}은 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체 없이 해당
        개인정보를 파기합니다.
        <br /> 파기의 절차, 기한 및 방법은 다음과 같습니다.
      </Typography>
      <Typography variant="subtitle1">- 파기절차</Typography>
      <Typography variant="subtitle1">
        1. 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및
        기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때,
        DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로
        이용되지 않습니다.
      </Typography>
      <Typography variant="subtitle1">- 파기기한</Typography>
      <Typography variant="subtitle1">
        1. {name}은 개인정보의 처리목적 달성, 해당 서비스의 폐지, 사업의 종료 등
        그 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를
        파기합니다.
        <br />
        2. {name}은 개인정보 보유기간이 경과된 경우에는 보유 기간의 종료일로부터
        5일 이내에, 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가
        불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.
        <br />* 단, 관련 법령에 따라 개인정보를 보관하여야 하는 경우에는 해당
        기간 동안 보관합니다.
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        6. 개인정보의 안전성 확보 조치
      </Typography>
      <Typography variant="subtitle1">
        {name}은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
        있습니다.
      </Typography>
      <Typography variant="subtitle1">1. 정기적인 자체 감사 실시</Typography>
      <Typography variant="subtitle1">2. 개인정보의 암호화</Typography>
      <Typography variant="subtitle1">
        3. 해킹 등에 대비한 기술적 대책
      </Typography>
      <Typography variant="subtitle1">4. 개인정보에 대한 접근 제한</Typography>
      <Typography variant="subtitle1">5. 비인가자에 대한 출입 통제</Typography>
      <Typography variant="subtitle1">
        6. 접속기록의 보관 및 위변조 방지
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        7. 개인정보 보호책임자
      </Typography>
      <Typography variant="subtitle1">
        {name}은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
        관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이
        개인정보 보호책임자를 지정하고 있습니다.
      </Typography>
      <Typography variant="subtitle1">개인정보 보호책임자</Typography>
      <Typography variant="subtitle1">
        {'- 연락처: '}
        <a href={`mailto:${email}`}>{email}</a>
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        8. 개인정보 처리방침 변경
      </Typography>
      <Typography variant="subtitle1">
        ① 이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
        변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터
        공지사항을 통하여 고지할 것입니다.
      </Typography>
      <Typography variant="subtitle1" mt={3} fontSize={20} fontWeight={700}>
        9. 정보주체의 권익침해에 대한 구제방법
      </Typography>
      <Typography variant="subtitle1">
        ① 정보주체는 개인정보침해에 대한 구제를 받기 위하여 아래의 기관에
        문의하실 수 있습니다.
      </Typography>
      <Typography variant="subtitle1">개인정보침해신고센터</Typography>
      <Typography variant="subtitle1">
        - 소관업무: 개인정보 침해사실 신고, 상담 신청
        <br />
        - 홈페이지: privacy.kisa.or.kr
        <br />
        - 전화: (국번없이) 118
        <br />- 주소: 서울시 송파구 중대로 135 한국인터넷진흥원
      </Typography>
      <Typography variant="subtitle1">개인정보분쟁조정위원회</Typography>
      <Typography variant="subtitle1">
        - 소관업무: 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)
        <br />
        - 홈페이지: www.kopico.go.kr
        <br />
        - 전화: 1833-6972
        <br />- 주소: 서울시 중구 세종대로 209 정부서울청사
      </Typography>
      <Typography variant="subtitle1">
        대검찰청 사이버범죄수사단 : 02-3480-3573 (www.spo.go.kr)
      </Typography>
      <Typography variant="subtitle1">
        경찰청 사이버안전국 : 182 (http://cyberbureau.police.go.kr)
      </Typography>
      <Typography variant="subtitle1" mb={20}>
        ② 정보주체가 개인정보침해에 대한 구제를 요구할 경우에는 개인정보보호법
        제76조에 따라 개인정보분쟁조정위원회, 한국인터넷진흥원
        개인정보침해신고센터 등에 분쟁해결을 신청할 수 있습니다.
      </Typography>
    </Box>
  )
})
