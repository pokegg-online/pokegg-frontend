import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import React from 'react'
import { wrapError } from '~/components/ErrorBoundary'
import { Spinner } from '~/components/Spinner'
import { useSetsContext } from '~/layouts/sets/context'
import { SetCard } from '~/routes/sets/Setcard'
import { apiUrl, fetcher } from '~/util'

const styles = {
  grid: {
    flexGrow: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 0,
  },
  box: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
}
export const SetsList: React.FC = wrapError(() => {
  const { data, update } = useSetsContext()

  const SearchFilter = data.result?.filter((item) => {
    if (!data.type || data.type === 'all') return true
    else return item.type?.[0] === data.type
  })

  React.useEffect(() => {
    if (data.sets?.length === data.count) return
    fetcher(
      apiUrl(`/v1/sets?offset=${data.sets?.length ?? 0 + 1}&type=${data.type}`),
    ).then((res) => {
      update((v) => ({
        ...v,
        sets: res.sets,
        count: res.count,
      }))
    })
  }, [data.type])

  return (
    <Grid container spacing={3} sx={styles.grid}>
      {data.sets?.length === 0 ? (
        <Box sx={styles.box}>
          <Spinner />
        </Box>
      ) : data.query && data.result?.length !== 0 ? (
        SearchFilter?.map((item, index) => (
          <Grid
            xs={6}
            md={2}
            mdOffset={0}
            sx={{ minWidth: '350px', maxWidth: '400px' }}
            key={index}
          >
            <SetCard item={item} />
          </Grid>
        ))
      ) : (
        data.sets?.map((item, index) => (
          <Grid
            xs={6}
            md={2}
            mdOffset={0}
            sx={{ minWidth: '350px', maxWidth: '400px' }}
            key={index}
          >
            <SetCard item={item} />
          </Grid>
        ))
      )}
    </Grid>
  )
})
