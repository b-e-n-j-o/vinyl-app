// src/components/vinyl/VinylInfo.jsx
'use client'

export default function VinylInfo({ labels, formats }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Labels</h3>
          {labels?.map((label, index) => (
            <div key={index} className="text-gray-600">
              {label.name} {label.catno && `(${label.catno})`}
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Format</h3>
          <div className="text-gray-600">
            {formats?.[0]?.descriptions?.join(', ')}
            {formats?.[0]?.text && `, ${formats[0].text}`}
          </div>
        </div>
      </div>
    </div>
  )
}