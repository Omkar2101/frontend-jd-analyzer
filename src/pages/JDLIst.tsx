import React, { useEffect, useState } from 'react'
import axios from 'axios'


interface JDItem {
  id: string
  title: string
  originalText: string
  improvedText: string
  createdAt?: string
}

const JDList: React.FC = () => {
  const [jdList, setJdList] = useState<JDItem[]>([])

  const email = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    axios.get(`http://localhost:5268/api/jobs/user/${email}`) // Update URL to your actual backend route
      .then((res) => setJdList(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <>
    
      <div className="container mt-4">
        <h2 className="mb-4">All Job Descriptions</h2>

        <div className="row">
          {jdList.map((jd) => (
            <div className="col-md-6 mb-4" key={jd.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{jd.title || 'Untitled JD'}</h5>
                  <p className="card-text"><strong>Original:</strong> {jd.originalText.slice(0, 150)}...</p>
                  <p className="card-text"><strong>Improved:</strong> {jd.improvedText.slice(0, 150)}...</p>
                </div>
                {jd.createdAt && (
                  <div className="card-footer text-muted">
                    Uploaded on {new Date(jd.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default JDList
