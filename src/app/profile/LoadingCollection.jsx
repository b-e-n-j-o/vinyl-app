// app/profile/LoadingCollection.jsx
export default function LoadingCollection() {
    return (
      <div className="min-h-screen bg-[#F4E3B2] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header placeholder */}
          <div className="bg-[#EFC88B] rounded-xl p-6 shadow-sm mb-8 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#421C10] rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-[#421C10] rounded w-1/4" />
                <div className="h-4 bg-[#421C10] rounded w-1/6" />
              </div>
              <div className="w-32 h-10 bg-[#421C10] rounded-lg" />
            </div>
          </div>
  
          {/* Grid placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#EFC88B] rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-[#421C10]" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-[#421C10] rounded w-3/4" />
                  <div className="h-4 bg-[#421C10] rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-[#421C10] rounded w-1/4" />
                    <div className="h-3 bg-[#421C10] rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }