import {
  Avatar,
  Badge,
  Button,
  Chip,
  Dialog,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import React from 'react'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import pointIcon from '~/assets/images/coin.png'
import { wrapError } from '~/components/ErrorBoundary'
import { Spinner } from '~/components/Spinner'
import { UserRankTable } from '~/components/UserRank'
import { useMainContext } from '~/context'
import { storageService } from '~/service/firebase'
import { apiUrl, fetcher } from '~/util'

export const MyPage: React.FC = wrapError(() => {
  const cookies = new Cookies()
  const { user, update } = useMainContext()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [profileUrl, setProfileUrl] = React.useState<string | undefined>()
  const [displayName, setDisplayName] = React.useState<string | undefined>()

  const authToken = cookies.get('Authorization')

  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (!user) return
    if (file) {
      const data = await imageCompression.getDataUrlFromFile(file)
      const storageRef = ref(storageService, `profile/${user.id}`)
      const task = await uploadString(storageRef, data, 'data_url')
      const url = await getDownloadURL(task.ref)
      setProfileUrl(url)
      await fetcher(encodeURI('/v1/users/profile?avatar=' + url))
    }
  }

  const handleNicknameChange = async () => {
    if (!user || !displayName) return
    try {
      await fetcher('/v1/users/profile?username=' + displayName)
      window.location.reload()
    } catch {
      Swal.fire({
        icon: 'error',
        title: '닉네임 변경 실패',
        text: '이미 존재하는 닉네임 또는 사용할 수 없는 닉네임입니다.',
      })
    }
  }

  React.useEffect(() => {
    if (!authToken) return navigate('/auth/login')
    if (!user || !user.profile) return
    setProfileUrl(user.profile.avatar)
    setDisplayName(user.profile.displayName)
    setLoading(false)
  }, [user, authToken])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: isMobile ? '10px' : 0,
        marginRight: isMobile ? '10px' : 0,
      }}
    >
      {loading ? (
        <>
          <Box sx={{ mt: 6 }}>
            <Spinner />
          </Box>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6">
              포켓몬 리그에서 트레이너 정보를 불러오는중...
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                cookies.remove('Authorization')
                update((v) => ({ ...v, user: null }))
                window.location.reload()
              }}
            >
              다시 로그인
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label htmlFor="raised-button-file">
            <Avatar
              alt={'user'}
              src={profileUrl}
              sx={{ width: '96px', height: '96px', mt: 6 }}
            />
          </label>
          {user?.role.admin && <Badge color="success" badgeContent={'Admin'} />}
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', mt: 2, display: 'flex' }}
          >
            <img
              src={apiUrl(`/v1/sprites/role/${user?.rank}`)}
              alt="role"
              style={{ width: '32px', height: '32px' }}
              crossOrigin="anonymous"
            />
            {`${user?.profile.displayName}님, 환영합니다`}
          </Typography>
          <Button variant="text" onClick={handleClickOpen}>
            회원등급 설명 보기
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <UserRankTable />
            <Button sx={{ mb: 2 }} onClick={handleClose}>
              닫기
            </Button>
          </Dialog>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Chip
                avatar={<Avatar src={pointIcon} />}
                label={`보유 포인트 ${user?.points}점`}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                id="standard-basic"
                label="닉네임"
                value={displayName}
                variant="standard"
                sx={{ width: '100%' }}
                onChange={(e) => {
                  setDisplayName(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="contained"
                sx={{ width: '100%' }}
                onClick={handleNicknameChange}
              >
                닉네임 변경
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ width: '100%' }}
                onClick={async () => {
                  cookies.remove('Authorization')
                  update((v) => ({ ...v, user: null }))
                }}
              >
                로그아웃
              </Button>
            </Grid>
          </Grid>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleUpload}
          />
        </Box>
      )}
    </Box>
  )
})
