import { Typography, useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import { wrapError } from '~/components/ErrorBoundary'

export const Main: React.FC = wrapError(() => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        textAlign: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        marginLeft: '20',
        marginRight: '20',
      }}
    >
      <Typography
        variant="h2"
        fontFamily={'moyamoya'}
        fontSize={isMobile ? '3rem' : '5rem'}
      >
        미끄메라넷
      </Typography>
      <Typography variant="h5" fontSize={isMobile ? '1rem' : '1.5rem'}>
        당신의 흐믈흐믈 포켓몬스터 실전배틀 도우미
      </Typography>
    </Box>
  )
})
