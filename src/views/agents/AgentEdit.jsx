import { useParams, Navigate } from 'react-router-dom';
import { FAKE_AGENTS } from './data/agents';
import AgentCreate from './AgentCreate';

// ==============================|| AGENTS — MODIFIER ||============================== //

export default function AgentEdit() {
  const { id } = useParams();
  const agent  = FAKE_AGENTS.find((a) => a.id === id);

  if (!agent) return <Navigate to="/agents" replace />;

  return <AgentCreate agentData={agent} />;
}
