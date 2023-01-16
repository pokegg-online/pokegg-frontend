import React from 'react'
import './404page.scss'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const ErrorPage: React.FC = () => {
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
        <span>4</span>
        <div
          className="pokeball notfound"
          style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
          }}
        ></div>
        <span>4</span>
      </div>
      {/* make center */}
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
