import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Link, useNavigate } from 'react-router-dom'
import DiscordIcon from '~/assets/images/discord.svg'
import { wrapError } from '~/components/ErrorBoundary'

const DiscordUrl = `https://discord.com/api/oauth2/authorize?client_id=${
  import.meta.env.VITE_DISCORD_CLIENT_ID
}&redirect_uri=${
  import.meta.env.VITE_DISCORD_REDIRECT_URI
}&response_type=code&scope=identify%20email%20guilds`

const styles = {
  container: { width: '35vh', alignItems: 'center', mt: '3' },
  title: { width: '100%', textAlign: 'center', mt: 3 },
  button: { width: '100%', mt: 3, bgcolor: '#5865F2', color: '#fff' },
  icon: { width: '20px', marginRight: '10px' },
}

export const Login: React.FC = wrapError(() => {
  const navigate = useNavigate()
  const [cookies] = useCookies(['Authorization'])

  React.useEffect(() => {
    if (cookies.Authorization) {
      navigate('/auth/mypage')
    }
  }, [cookies])

  return (
    <Box sx={styles.container}>
      <Typography variant="h5" sx={styles.title}>
        로그인
      </Typography>
      <Button
        size="large"
        variant="contained"
        sx={styles.button}
        onClick={() => (window.location.href = DiscordUrl)}
      >
        <img src={DiscordIcon} alt="discord" style={styles.icon} />
        디스코드로 로그인
      </Button>
      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        로그인을 이용하실경우 <br />
        <Link to="/privacy"> 개인정보 처리방침에</Link> 동의하시는것으로
        간주됩니다.
      </Typography>
    </Box>
  )
})
