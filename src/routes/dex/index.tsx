import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import React from 'react'
import { useParams } from 'react-router-dom'
import { wrapError } from '~/components/ErrorBoundary'
import { Spinner } from '~/components/Spinner'
import { useDexContext } from '~/layouts/dex/context'
import { Main } from '~/routes/main'
import { DexContext } from './context'
import { DexHeader } from './Header'
import { DexStats } from './Stats'

export const DexView: React.FC = wrapError(() => {
  const { data } = useDexContext()
  const { id, type } = useParams<'id' | 'type'>()

  const item = React.useMemo(() => {
    if (!data.usages || !data.usages.length) return null

    if (data.type !== type) return false

    const matched = data.usages.find(
      (x) => x.pokemon?.id === parseInt(id as string),
    )

    if (!matched) return false

    return matched
  }, [data.usages, type, data.type, id])

  return (
    <Box sx={{ height: '100%' }}>
      {item === false ? (
        <Main />
      ) : item === null ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Box>
      ) : (
        <DexContext.Provider value={item}>
          <Container
            component={Stack}
            spacing={2}
            direction="column"
            sx={{ mt: 4 }}
          >
            <DexHeader />
            <Box>
              <DexStats />
            </Box>
          </Container>
        </DexContext.Provider>
      )}
    </Box>
  )
})
