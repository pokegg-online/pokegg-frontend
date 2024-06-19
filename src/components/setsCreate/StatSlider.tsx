/* eslint-disable no-unused-vars */
import { Grid, Input, Slider } from '@mui/material'
import React from 'react'
import { wrapError } from '../ErrorBoundary'

interface StatSliderProps {
  name: string
  index: number
  effort: number
  iv: number
  onSliderChange: (index: number, newValue: number) => void
  onEvBlur: (index: number, value: number) => void
  onEVInputChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void
  onIVBlur: (index: number) => void
  onIVChange: (index: number, value: number) => void
  correction: number | undefined
}

export const StatSlider: React.FC<StatSliderProps> = wrapError(
  ({
    name,
    index,
    effort,
    iv,
    onSliderChange,
    onEvBlur,
    onEVInputChange,
    onIVBlur,
    onIVChange,
    correction,
  }) => {
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
      onSliderChange(index, newValue as number)
    }

    const handleEVInputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      onEVInputChange(index, event)
    }

    const nameColor =
      correction === 1.1 ? 'blue' : correction === 0.9 ? 'red' : 'black'

    return (
      <React.Fragment>
        <Grid item xs={1}>
          <a style={{ color: nameColor }}>{name}</a>
        </Grid>
        <Grid item xs={7} sx={{ paddingLeft: '15px' }}>
          <Slider
            value={effort}
            onChange={handleSliderChange}
            onBlur={() => onEvBlur(index, effort)}
            step={4}
            marks
            min={0}
            max={252}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item xs={3} sx={{ marginLeft: '20px' }}>
          <Input
            size="small"
            value={effort}
            onChange={handleEVInputChange}
            inputProps={{
              step: 4,
              min: 0,
              max: 252,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          <Input
            sx={{ marginLeft: '10px' }}
            size="small"
            value={iv}
            onBlur={() => onIVBlur(index)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onIVChange(index, Number(event.target.value))
            }}
            inputProps={{
              step: 1,
              min: 0,
              max: 31,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </React.Fragment>
    )
  },
)
