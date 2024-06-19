import Box from '@mui/material/Box'
import React, { Suspense } from 'react'
import { Spinner } from '~/components/Spinner'

export function wrapSuspense<T>(Component: React.ComponentType<T>) {
  return ((props: T) => {
    return (
      <Suspense
        fallback={
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Spinner />
          </Box>
        }
      >
        {}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(props as any)} />
      </Suspense>
    )
  }) as React.FC<T>
}
