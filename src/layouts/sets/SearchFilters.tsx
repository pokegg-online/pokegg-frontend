import { FormControl, Input, InputAdornment, ToggleButton } from '@mui/material'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import React from 'react'
import searchIcon from '~/assets/images/search.svg'
import { wrapError } from '~/components/ErrorBoundary'
import { apiUrl, fetcher } from '~/util'
import { SetsContextData, SetsLayoutContext } from './context'

export const SearchFilters: React.FC = wrapError(() => {
  const { data, update } = React.useContext(SetsLayoutContext)
  const [alignment, setAlignment] = React.useState('all')

  React.useEffect(() => {
    setAlignment(data.type)
  }, [data.type])

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (!newAlignment) {
      setAlignment('all')
      update((v) => ({ ...v, type: 'all' }))
    } else {
      setAlignment(newAlignment)
      update((v) => ({ ...v, type: newAlignment as SetsContextData['type'] }))
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="single">싱글</ToggleButton>
        <ToggleButton value="double">더블</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
})

export const SearchBar: React.FC = wrapError(() => {
  const [query, setQuery] = React.useState('')
  const { data, update } = React.useContext(SetsLayoutContext)

  React.useEffect(() => {
    const fetchData = async () => {
      if (query === '') return

      const { sets } = await fetcher(
        apiUrl(`/v1/sets?type=${data.type}&query=${query}&offset=0`),
      )

      update((v) => ({ ...v, result: sets, query }))
    }
    fetchData().catch(console.error)
  }, [query])

  return (
    <Box>
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        mt={6}
        mb={4}
      >
        <FormControl variant="outlined" sx={{ width: '70%' }}>
          <Input
            id="input-with-icon-adornment"
            placeholder="검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <img src={searchIcon} />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Box>
  )
})
