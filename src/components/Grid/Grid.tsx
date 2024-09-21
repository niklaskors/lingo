import { useMemo } from 'react';
import { Guess, Validation } from '../../view/Game';

export interface GridProps {
  dimensions: { rows: number, columns: number }
  guesses: Guess[]
}

const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

export function Grid({ dimensions, guesses }: GridProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[...(Array(dimensions.rows).keys())].map((_, i) => {
        const guess = guesses[i];
        return (<Row isActive={false} size={dimensions.columns} key={i} guess={guess}></Row>)
      })}
    </div>
  )
}

interface RowProps {
  isActive: boolean;
  size: number;
  guess?: Guess
}

function Row({ size, guess }: RowProps) {
  return (<div style={{
    display: 'flex',
    gap: '10px',
    flexDirection: 'row',
  }}>
    {
      [...Array(size).keys()].map((_, i) => {
        if (!guess) {
          return <Cell></Cell>
        }

        const validation = guess.validation ? guess.validation[i] : undefined;

        return <Cell key={i} value={guess.word[i]} validation={validation}></Cell>
      })
    }
  </div>)

}

interface CellProps {
  validation?: Validation;
  value?: string;
}

function Cell({ validation, value }: CellProps) {
  const letter = validation ? validation.letter : value;
  const color = useMemo(() => {
    const status = validation?.status;

    if (!status) {
      return 'transparent'
    }

    if (status === 'correct') {
      return '#538D4E'
    }

    if (status === 'present') {
      return '#B49F3A'
    }

    if (status === 'absent') {
      return '#3A3A3C'
    }
  }, [validation])

  return <div style={{
    border: `2px solid ${validation ? color : 'grey'}`,
    borderRadius: '3px',
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    backgroundColor: color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <p style={{
      textTransform: 'uppercase',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '28px'
    }}>
      {letter}
    </p>
  </div>
}