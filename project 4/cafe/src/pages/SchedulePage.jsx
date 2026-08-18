import PageHeader from '../components/PageHeader'
import Schedule from '../components/Schedule'

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Schedule"
        title="Schedule 時間割"
        lede="Evening classes, weekend intensives or one-on-one — pick a rhythm that fits your life."
      />
      <Schedule />
    </>
  )
}
