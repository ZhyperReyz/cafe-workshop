import PageHeader from '../components/PageHeader'
import Contact from '../components/Contact'

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Contact"
        title="Contact 連絡先"
        lede="Visit us, write to us, or book a free trial lesson — we answer within one business day."
      />
      <Contact />
    </>
  )
}
