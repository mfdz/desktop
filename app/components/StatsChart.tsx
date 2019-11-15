import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import * as React from 'react'

const primaryStatColor = '#0061A6'

interface StatsChartProps {
  height?: number
  data: Record<string, any>
}

const StatsChart: React.FunctionComponent<StatsChartProps> = (props: StatsChartProps) => {
  const { data, height = 250 } = props
  switch (data.type) {
    case 'string':
      return <StringStat data={data} height={height} />
    case 'numeric':
      return <NumericStat data={data} height={height} />
    case 'boolean':
      return <BooleanStat data={data} height={height} />
    default:
      return (
        <div>
          {data.count && <StatValues stats={[
            ['count', data.count.toLocaleString()]
          ]} />}
        </div>
      )
  }
}

export default StatsChart

interface StatValuesProps {
  stats: Array<[string, any]>
}

const StatValues: React.FunctionComponent<StatValuesProps> = ({ stats }) => {
  return (
    <div className='stats-values'>
      {stats.map((stat, i) => {
        return (
          <div key={i} className="stats-value" style={{ marginLeft: 15 }}>
            <h4>{stat[1]}</h4>
            <label className="label">{stat[0]}</label>
          </div>
        )
      })}
    </div>
  )
}

const NumericStat: React.FunctionComponent<StatsChartProps> = (props: StatsChartProps) => {
  const { data, height } = props
  let histogram

  if (data.histogram && data.histogram.frequencies) {
    histogram = data.histogram.frequencies.map((count, i: number) => {
      const label = `${data.histogram.bins[i]} - ${data.histogram.bins[i + 1]}`
      return {
        id: i,
        label,
        value: count
      }
    })
  }

  return (
    <div>
      {histogram && <div style={{ height: height }}>
        <div style={{ paddingLeft: 35 }}>
          <b>histogram</b>
        </div>
        <ResponsiveBar
          data={histogram}
          margin={{ top: 20, right: 10, bottom: 50, left: 60 }}
          padding={0}
          colors={() => primaryStatColor}
          tooltip={({ value, color, data }) => (
            <strong style={{ color }}>
              {data.label}: {value}
            </strong>
          )}
          theme={{
            tooltip: {
              container: {
                background: '#B3CFE4'
              }
            }
          }}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisLeft={{
            tickPadding: 5,
            tickRotation: 0
          }}
          axisBottom={null}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>}
      <StatValues stats={[
        ['count', data.count.toLocaleString()],
        ['min', data.min.toLocaleString()],
        ['max', data.max.toLocaleString()],
        ['mean (avg)', data.mean.toLocaleString()],
        ['median', data.median.toLocaleString()]
      ]} />
    </div>
  )
}

const StringStat: React.FunctionComponent<StatsChartProps> = (props: StatsChartProps) => {
  const { data, height } = props
  let frequencies

  if (data.frequencies) {
    frequencies = Object.keys(data.frequencies).reduce((acc, key) => {
      let label = key
      if (label.length > 20) {
        label = label.slice(0, 18) + '...'
      } else if (label === '') {
        label = '""'
      }
      acc.push({
        id: key,
        label,
        value: data.frequencies[key]
      })
      return acc
    }, [])
  }

  return (
    <div>
      {frequencies && <div style={{ height: height }}>
        <div style={{ paddingLeft: 35 }}>
          <b>frequencies</b>
        </div>
        <ResponsiveBar
          data={frequencies}
          margin={{ top: 20, right: 10, bottom: 50, left: 40 }}
          padding={0}
          colors={() => primaryStatColor}
          tooltip={({ value, color, data }) => (
            <strong style={{ color }}>
              {data.label}: {value}
            </strong>
          )}
          theme={{
            tooltip: {
              container: {
                background: '#B3CFE4'
              }
            }
          }}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
          axisLeft={{
            tickPadding: 5,
            tickRotation: 0
          }}
          axisBottom={null}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>}
      <StatValues stats={[
        ['count', data.count.toLocaleString()],
        ['min length', data.minLength.toLocaleString()],
        ['max length', data.maxLength.toLocaleString()]
      ]} />
    </div>
  )
}

const BooleanStat: React.FunctionComponent<StatsChartProps> = (props: StatsChartProps) => {
  const { data, height } = props
  let frequencies = [
    {
      id: 'false',
      label: 'false',
      value: data.falseCount,
      color: '#EE325C'
    },
    {
      id: 'true',
      label: 'true',
      value: data.trueCount,
      color: primaryStatColor
    }]

  const other = data.count - data.trueCount - data.falseCount
  if (other !== 0) {
    frequencies.push({
      id: 'other',
      label: 'other',
      value: other,
      color: '#F4A935'
    })
  }

  return (
    <div>
      {frequencies && <div style={{ height: height }}>
        <div style={{ paddingLeft: 35 }}>
          <b>frequencies</b>
        </div>
        <ResponsivePie
          data={frequencies}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          colors={(d) => d.color }
          cornerRadius={3}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={0}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: 'color' }}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>}
      <StatValues stats={[
        ['count', data.count.toLocaleString()],
        ['true', data.trueCount.toLocaleString()],
        ['false', data.falseCount.toLocaleString()]
      ]} />
    </div>
  )
}
