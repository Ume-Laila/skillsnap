import { useParams } from 'react-router-dom'

function RoadmapPage() {
  const { id } = useParams()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">RoadmapPage</h1>
      <p className="mt-3 text-gray-400">Roadmap ID: {id}</p>
    </main>
  )
}

export default RoadmapPage
