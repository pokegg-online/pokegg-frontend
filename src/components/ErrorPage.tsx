import { Button, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './404page.scss'

export interface ErrorPageProps {
  code: string
}

export const ErrorPage: React.FC<ErrorPageProps> = (props: {
  code: ErrorPageProps['code']
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const handleClick = () => {
    navigate('/')
  }

  return (
    <div className="figure">
      <div
        className="error-no"
        style={{ fontSize: isMobile ? '120px' : '200px' }}
      >
        {' '}
        <span>{props.code?.[0]}</span>
        <div
          className="pokeball notfound"
          style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
          }}
        ></div>
        <span>{props.code?.[2]}</span>
      </div>
      <div className="error-text" style={{ textAlign: 'center' }}>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p>
          찾으시는 게 어떤 건지는 모르겠지만 아무래도 길을 잘못 드신 것 같아요.
        </p>
        <Button variant="contained" onClick={handleClick}>
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  )
}
