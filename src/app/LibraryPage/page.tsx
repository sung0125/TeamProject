import { getAllTopics } from '@/actions/topicActions'
import TopicsList from '@/components/Topiclist'

export default async function AddTopic() {
  const { topics } = await getAllTopics()
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <TopicsList topics={topics} />
    </div>
  )
}
