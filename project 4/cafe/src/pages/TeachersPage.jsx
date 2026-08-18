import PageHeader from '../components/PageHeader'
import Teachers from '../components/Teachers'

export default function TeachersPage() {
  return (
    <>
      <PageHeader
        index="02"
        label="Teachers"
        title="Teachers 先生"
        lede="Native and near-native speakers who teach the language the way it is really used — manners, nuance and all."
      />
      <Teachers />
    </>
  )
}
