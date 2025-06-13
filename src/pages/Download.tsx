// pages/Download.tsx
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

function Download() {
  const updatedJD = useSelector((state: RootState) => state.result.updatedJD)

  const downloadTextFile = () => {
    const blob = new Blob([updatedJD], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'Improved_Job_Description.txt'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mt-5">
      <h2>Download Improved JD</h2>
      <pre className="bg-light border p-3 mb-3">{updatedJD}</pre>
      <button className="btn btn-primary" onClick={downloadTextFile}>
        Download as .txt
      </button>
    </div>
  )
}

export default Download
